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
 * Requires the fsharp-wasm compiler (see resolveFable below for how it is found).
 * Run `bash prerequisites.sh` to check your setup.
 */

import { execSync } from "child_process";
import { cpSync, mkdirSync, existsSync, rmSync, readdirSync, copyFileSync } from "fs";
import { resolve, join, dirname } from "path";

const ROOT    = resolve(import.meta.dirname, "..");
const DIST    = resolve(ROOT, "dist");
const RUNTIME = resolve(ROOT, "runtime");
const DEMOS   = resolve(ROOT, "demos");

// ── Compiler resolution ──────────────────────────────────────────────────────

const HOME = process.env.HOME || process.env.USERPROFILE || "";

/**
 * Resolve the fsharp-wasm compiler: `tools/FSharp.Wasm.Cli` of the fsharp-wasm repository.
 *
 * Resolution order (first hit wins):
 *  1. FSHARP_WASM_CLI   — a built FSharp.Wasm.Cli (fsharp-wasm.dll): fastest, no rebuild per demo
 *  2. FSHARP_WASM_DIR   — a fsharp-wasm checkout (`dotnet run` on its CLI project)
 *  3. a checkout found next to this repository: this repo is usually a submodule of fsharp-wasm (`..`),
 *     or sits beside it (`../fsharp-wasm`)
 *  4. FSHARP_WASM_FABLE — an explicit `fable`-style binary
 *
 * There is deliberately NO fallback to a `fable` on PATH: that is whatever Fable happens to be installed — upstream
 * Fable and old builds of this backend report the same version — and its WasmGc output is not this compiler's.
 *
 * The CLI needs the patched F# compiler (vendor/fsharp of fsharp-wasm) as FSHARP_COMPILER; it is set here when the
 * checkout has it built.
 */

const CLI_PROJECT = ["tools", "FSharp.Wasm.Cli", "FSharp.Wasm.Cli.fsproj"];

function findCheckout() {
    const fromEnv = process.env.FSHARP_WASM_DIR;
    const candidates = [
        fromEnv,
        resolve(ROOT, ".."),
        resolve(ROOT, "..", ".."),
        resolve(ROOT, "..", "fsharp-wasm"),
    ].filter(Boolean);
    return candidates.find((dir) => existsSync(join(dir, ...CLI_PROJECT)));
}

function resolveFable() {
    const cliDll = process.env.FSHARP_WASM_CLI;
    if (cliDll) {
        if (!existsSync(cliDll)) { console.error(`✗ FSHARP_WASM_CLI does not exist: ${cliDll}`); process.exit(1); }
        console.log(`  fsharp-wasm CLI (prebuilt)  [${cliDll}]`);
        return { mode: "dll", cliDll };
    }

    const checkout = findCheckout();
    if (checkout) {
        const cliProj = join(checkout, "tools", "FSharp.Wasm.Cli");
        const fsc = join(checkout, "vendor", "fsharp", "artifacts", "bin", "fsc", "Release", "net10.0", "fsc.dll");
        if (!process.env.FSHARP_COMPILER && existsSync(fsc)) process.env.FSHARP_COMPILER = fsc;
        console.log(`  fsharp-wasm CLI (dotnet run)  [${cliProj}]`);
        if (!process.env.FSHARP_COMPILER)
            console.warn("  ⚠  FSHARP_COMPILER is not set: the CLI needs the patched F# compiler (vendor/fsharp/artifacts/bin/fsc/Release/net10.0/fsc.dll)");
        return { mode: "dotnet", cliProj };
    }

    const explicit = process.env.FSHARP_WASM_FABLE;
    if (explicit) {
        const r = tryFable(explicit);
        if (r) { console.log(`  fable ${r.ver}  [${r.bin}]`); return r; }
    }

    console.error("\n✗ the fsharp-wasm compiler was not found.");
    console.error("  Point this build at a checkout of https://github.com/aiqs4/fsharp-wasm:");
    console.error("    export FSHARP_WASM_DIR=/path/to/fsharp-wasm            # runs tools/FSharp.Wasm.Cli");
    console.error("    export FSHARP_WASM_CLI=/path/to/FSharp.Wasm.Cli.dll    # or a built CLI");
    console.error("  (a `fable` on PATH is NOT used: it is not necessarily this compiler)");
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
        name:   "bench",
        fsproj: "demos/bench/Bench.fsproj",
        title:  "Benchmark — F# vs JavaScript",
        desc:   "Four compute kernels, once as F# compiled to WasmGC and once as JavaScript, timed in your browser.",
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
        const cmd =
            compiler.mode === "dll"    ? `dotnet "${compiler.cliDll}" "${dirname(fsproj)}" --outDir "${outDir}" --noCache`
          : compiler.mode === "dotnet" ? `dotnet run -c Release --project "${compiler.cliProj}" -- "${dirname(fsproj)}" --outDir "${outDir}" --noCache`
          :                              `"${compiler.bin}" "${fsproj}" --lang wasmgc -o "${outDir}"`;
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
        // scripts that belong to the demo (a Web Worker's source) are served next to its page
        for (const f of readdirSync(join(DEMOS, demo.name)).filter((f) => f.endsWith(".js"))) {
            copyFileSync(join(DEMOS, demo.name, f), join(dstDir, f));
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
