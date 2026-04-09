#!/usr/bin/env node

/**
 * fsharp-wasm-runtime build script
 *
 * Compiles every demo project to its own WebAssembly module:
 *
 *   dist/
 *     runtime/          ← JS glue (copied from runtime/)
 *     demos/
 *       canvas-mandelbrot/  Mandelbrot.wasm + Mandelbrot.wat
 *       counter/            Counter.wasm + Counter.wat
 *       todo/               Todo.wasm + Todo.wat
 *       …
 *     index.html                  demo gallery
 *     demos/<name>/index.html    per-demo pages
 *
 * Each demo is a separate .fsproj that references the shared runtime via
 * <ProjectReference> — exactly how a real user would consume this library.
 *
 * Usage:
 *   node build/build.js [--demo <name>]
 *
 * Requires the fsharp-wasm compiler (fable v5+) on PATH.
 * Run `bash prerequisites.sh` to install it.
 */

import { execSync } from "child_process";
import { cpSync, mkdirSync, existsSync, rmSync, readdirSync, copyFileSync } from "fs";
import { resolve, join } from "path";

const ROOT    = resolve(import.meta.dirname, "..");
const DIST    = resolve(ROOT, "dist");
const RUNTIME = resolve(ROOT, "runtime");
const DEMOS   = resolve(ROOT, "demos");

// ── Compiler resolution ──────────────────────────────────────────────────────

const HOME = process.env.HOME || process.env.USERPROFILE || "";

/**
 * Resolve the fsharp-wasm compiler (our patched Fable with WasmGC backend).
 *
 * Resolution order:
 *  1. FSHARP_WASM_FABLE env var — path to a prebuilt fable binary
 *  2. FSHARP_WASM_DIR env var   — path to fsharp-wasm source tree (dev mode)
 *     → uses: dotnet run --project $FSHARP_WASM_DIR/vendor/Fable/src/Fable.Cli
 *  3. fable on PATH (must be version 5+)
 *  4. ~/.local/bin/fable
 *
 * For local development: set FSHARP_WASM_DIR to the fsharp-wasm repo root.
 * For CI: set FSHARP_WASM_FABLE to the path of the built executable.
 */

function tryFable(bin) {
    try {
        const ver = execSync(`"${bin}" --version`, { cwd: ROOT, timeout: 10000 })
            .toString().replace(/\x1b\[[0-9;]*m/g, "").trim();
        const major = parseInt(ver.split(".")[0], 10);
        if (!isNaN(major) && major >= 5) return { mode: "binary", bin, ver };
    } catch { /* not available */ }
    return null;
}

function resolveFable() {
    // 1. FSHARP_WASM_DIR — dev mode: use source tree via dotnet run
    const wasmDir = process.env.FSHARP_WASM_DIR;
    if (wasmDir) {
        const cliProj = join(wasmDir, "vendor", "Fable", "src", "Fable.Cli");
        if (existsSync(join(cliProj, "Fable.Cli.fsproj"))) {
            console.log(`  fsharp-wasm source (dotnet run)  [${cliProj}]`);
            return { mode: "dotnet", cliProj };
        }
        // Also accept the fsharp-wasm-cli tool project
        const cliTool = join(wasmDir, "tools", "fsharp-wasm-cli");
        if (existsSync(join(cliTool, "FSharpWasmCli.fsproj"))) {
            console.log(`  fsharp-wasm CLI tool (dotnet run)  [${cliTool}]`);
            return { mode: "dotnet", cliProj: cliTool };
        }
        console.error(`  ⚠  FSHARP_WASM_DIR set to "${wasmDir}" but no Fable.Cli project found.`);
    }

    // 2. FSHARP_WASM_FABLE / PATH / ~/.local/bin/fable
    const candidates = [
        process.env.FSHARP_WASM_FABLE,
        "fable",
        `${HOME}/.local/bin/fable`,
    ].filter(Boolean);

    for (const c of candidates) {
        const r = tryFable(c);
        if (r) { console.log(`  fable ${r.ver}  [${r.bin}]`); return r; }
    }

    console.error("\n✗ fsharp-wasm compiler not found.");
    console.error("  For local dev, set:  export FSHARP_WASM_DIR=/path/to/fsharp-wasm");
    console.error("  For releases, run:   bash prerequisites.sh");
    process.exit(1);
}

// ── Demo registry ────────────────────────────────────────────────────────────
//
// Each entry describes one demo:
//   fsproj   — path to the .fsproj (relative to ROOT)
//   outDir   — where the .wasm lands in dist/
//   title    — display name for the gallery
//   desc     — one-sentence description

const ALL_DEMOS = [
    {
        name:   "canvas-mandelbrot",
        fsproj: "demos/canvas-mandelbrot/Mandelbrot.fsproj",
        title:  "Mandelbrot — Canvas",
        desc:   "Pure F# escape-time algorithm compiled to WasmGC, rendering to a 2D canvas.",
    },
    {
        name:   "counter",
        fsproj: "demos/counter/Counter.fsproj",
        title:  "Counter — Elmish MVU",
        desc:   "Classic increment / decrement counter using the Browser.Elmish.Core MVU loop.",
    },
    {
        name:   "todo",
        fsproj: "demos/todo/Todo.fsproj",
        title:  "Todo List — Elmish MVU",
        desc:   "Add, complete and remove todos. Full Elmish model-update-view cycle in F#.",
    },
    {
        name:   "realtime-pubsub",
        fsproj: "demos/realtime-pubsub/RealtimePubSub.fsproj",
        title:  "Realtime PubSub",
        desc:   "Publish/subscribe message bus over a BroadcastChannel, all wired from F#.",
    },
    {
        name:   "indexeddb-crud",
        fsproj: "demos/indexeddb-crud/IndexedDbCrud.fsproj",
        title:  "IndexedDB CRUD",
        desc:   "Create, read, update and delete records in the browser's IndexedDB from F#.",
    },
    {
        name:   "worker-actor",
        fsproj: "demos/worker-actor/WorkerActor.fsproj",
        title:  "Worker Actor",
        desc:   "F# actor pattern running inside a Web Worker, communicating via message passing.",
    },
    {
        name:   "web-component",
        fsproj: "demos/web-component/WebComponent.fsproj",
        title:  "Web Component",
        desc:   "A custom element <fs-counter> defined entirely in F# via Browser.Components.",
    },
    {
        name:   "webgpu-basic",
        fsproj: "demos/webgpu-basic/WebGpuBasic.fsproj",
        title:  "WebGPU Basic",
        desc:   "GPU compute pipeline bootstrapped from F# using the Browser.Gpu bindings.",
    },
    {
        name:   "full-dashboard",
        fsproj: "demos/full-dashboard/Dashboard.fsproj",
        title:  "Full Dashboard",
        desc:   "All demos combined in one tabbed dashboard to stress-test the complete runtime.",
    },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function run(cmd, label) {
    console.log(`\n▸ ${label || cmd}`);
    try {
        execSync(cmd, { cwd: ROOT, stdio: "inherit" });
    } catch {
        console.error(`\n✗ Failed: ${cmd}`);
        process.exit(1);
    }
}

function clean() {
    if (existsSync(DIST)) rmSync(DIST, { recursive: true });
    mkdirSync(DIST, { recursive: true });
}

// ── Build steps ──────────────────────────────────────────────────────────────

function copyGlue() {
    console.log("\n▸ Copying JS runtime glue...");
    // runtime/ → dist/runtime/
    cpSync(RUNTIME, join(DIST, "runtime"), { recursive: true });
}

function compileDemos(compiler, demos) {
    const failed = [];
    for (const demo of demos) {
        const outDir = join(DIST, "demos", demo.name);
        mkdirSync(outDir, { recursive: true });
        console.log(`\n▸ F# → WasmGC  [${demo.name}]`);
        const fsproj = join(ROOT, demo.fsproj);
        const cmd = compiler.mode === "dotnet"
            ? `dotnet run --project "${compiler.cliProj}" -- "${fsproj}" --lang wasmgc -o "${outDir}" --noCache`
            : `"${compiler.bin}" "${fsproj}" --lang wasmgc -o "${outDir}"`;
        try {
            execSync(cmd, { cwd: ROOT, stdio: "inherit" });
        } catch {
            console.error(`  ✗ ${demo.name} failed (compiler limitation — see above)`);
            failed.push(demo.name);
        }
    }
    if (failed.length > 0) {
        console.log(`\n⚠  ${failed.length} demo(s) need compiler fixes: ${failed.join(", ")}`);
    }
}

function copyDemoPages(demos) {
    console.log("\n▸ Copying demo HTML pages...");
    for (const demo of demos) {
        const srcPage = join(DEMOS, demo.name, "index.html");
        const dstDir  = join(DIST, "demos", demo.name);
        mkdirSync(dstDir, { recursive: true });
        if (existsSync(srcPage)) {
            copyFileSync(srcPage, join(dstDir, "index.html"));
        }
    }
}

function copyGallery() {
    console.log("\n▸ Copying gallery page...");
    const src = resolve(ROOT, "index.html");
    if (existsSync(src)) cpSync(src, join(DIST, "index.html"));
}

// ── CLI arg parsing ──────────────────────────────────────────────────────────

const args  = process.argv.slice(2);
const dFlag = args.indexOf("--demo");
const selectedName = dFlag !== -1 ? args[dFlag + 1] : null;

const demos = selectedName
    ? ALL_DEMOS.filter(d => d.name === selectedName)
    : ALL_DEMOS;

if (selectedName && demos.length === 0) {
    console.error(`✗ Unknown demo: ${selectedName}`);
    console.error(`  Available: ${ALL_DEMOS.map(d => d.name).join(", ")}`);
    process.exit(1);
}

// ── Main ─────────────────────────────────────────────────────────────────────

console.log("═══════════════════════════════════════════════════");
console.log("  fsharp-wasm-runtime — Build");
if (selectedName) console.log(`  (demo filter: ${selectedName})`);
console.log("═══════════════════════════════════════════════════");

const compiler = resolveFable();

if (!selectedName) clean();
copyGlue();
compileDemos(compiler, demos);
copyDemoPages(demos);
if (!selectedName) copyGallery();

console.log("\n✔ Build complete → dist/");
