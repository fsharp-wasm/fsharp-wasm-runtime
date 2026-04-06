#!/usr/bin/env node

/**
 * fsharp-wasm-runtime build script
 *
 * Usage:
 *   node build/build.js
 *
 * Requires the fsharp-wasm compiler (fable) on PATH.
 * See README.md → Prerequisites for install instructions.
 */

import { execSync } from "child_process";
import { cpSync, mkdirSync, existsSync, rmSync } from "fs";
import { resolve } from "path";

const ROOT    = resolve(import.meta.dirname, "..");
const DIST    = resolve(ROOT, "dist");
const SRC     = resolve(ROOT, "src");
const RUNTIME = resolve(ROOT, "runtime");

function run(cmd, label) {
    console.log(`\n▸ ${label || cmd}`);
    try {
        execSync(cmd, { cwd: ROOT, stdio: "inherit" });
    } catch {
        console.error(`\n✗ Failed: ${cmd}`);
        process.exit(1);
    }
}

// Candidate locations, in priority order:
//   1. FSHARP_WASM_FABLE env var (explicit override)
//   2. fable on PATH that is v5+ (the fsharp-wasm fork)
//   3. ~/.local/bin/fable (default install dir from prerequisites.sh)
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

    for (const candidate of candidates) {
        const result = tryFable(candidate);
        if (result) {
            console.log(`  fable ${result.ver}  [${candidate}]`);
            return result.bin;
        }
    }

    console.error("\n✗ fsharp-wasm compiler not found.");
    console.error("  Run:  bash prerequisites.sh");
    console.error("  See README.md → Prerequisites for details.");
    process.exit(1);
}

function clean() {
    if (existsSync(DIST)) rmSync(DIST, { recursive: true });
    mkdirSync(DIST, { recursive: true });
}

function copyGlue() {
    console.log("\n▸ Copying JS glue modules...");
    cpSync(RUNTIME, DIST, { recursive: true });
}

function compileFs() {
    const fableBin = resolveFable();
    run(
        `"${fableBin}" "${SRC}/FSharpWasmRuntime.fsproj" --lang wasmgc -o "${DIST}/wasm/"`,
        "Compiling F# → WasmGC"
    );
}

function copyAssets() {
    console.log("\n▸ Copying assets...");
    for (const file of ["index.html"]) {
        const src = resolve(ROOT, file);
        if (existsSync(src)) cpSync(src, resolve(DIST, file));
    }
}

console.log("═══════════════════════════════════════");
console.log("  fsharp-wasm-runtime — Build");
console.log("═══════════════════════════════════════");

clean();
copyGlue();
compileFs();
copyAssets();

console.log("\n✔ Build complete → dist/");
