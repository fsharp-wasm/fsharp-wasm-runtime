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

function tryFable(bin) {
    try {
        const ver = execSync(`"${bin}" --version`, { cwd: ROOT, timeout: 10000 })
            .toString().replace(/\x1b\[[0-9;]*m/g, "").trim();
        const major = parseInt(ver.split(".")[0], 10);
        if (!isNaN(major) && major >= 5) return { bin, ver };
    } catch { /* not available */ }
    return null;
}

function resolveFable() {
    const candidates = [
        process.env.FSHARP_WASM_FABLE,
        "fable",
        `${HOME}/.local/bin/fable`,
    ].filter(Boolean);

    for (const c of candidates) {
        const r = tryFable(c);
        if (r) { console.log(`  fable ${r.ver}  [${c}]`); return r.bin; }
    }

    console.error("\n✗ fsharp-wasm compiler not found.");
    console.error("  Run:  bash prerequisites.sh");
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

function compileDemos(fable, demos) {
    const failed = [];
    for (const demo of demos) {
        const outDir = join(DIST, "demos", demo.name);
        mkdirSync(outDir, { recursive: true });
        console.log(`\n▸ F# → WasmGC  [${demo.name}]`);
        try {
            execSync(
                `"${fable}" "${join(ROOT, demo.fsproj)}" --lang wasmgc -o "${outDir}"`,
                { cwd: ROOT, stdio: "inherit" }
            );
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

const fable = resolveFable();

if (!selectedName) clean();
copyGlue();
compileDemos(fable, demos);
copyDemoPages(demos);
if (!selectedName) copyGallery();

console.log("\n✔ Build complete → dist/");
