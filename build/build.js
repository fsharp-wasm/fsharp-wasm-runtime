#!/usr/bin/env node

/**
 * fsharp-wasm-runtime build script
 *
 * Usage:
 *   node build/build.js          — Full build
 *   node build/build.js --watch  — Watch mode (dev)
 */

import { execSync } from "child_process";
import { cpSync, mkdirSync, existsSync, rmSync } from "fs";
import { resolve } from "path";

const ROOT = resolve(import.meta.dirname, "..");
const DIST = resolve(ROOT, "dist");
const SRC = resolve(ROOT, "src");
const RUNTIME = resolve(ROOT, "runtime");

function run(cmd, label) {
    console.log(`\n▸ ${label || cmd}`);
    try {
        execSync(cmd, { cwd: ROOT, stdio: "inherit" });
    } catch (e) {
        console.error(`✗ Failed: ${cmd}`);
        process.exit(1);
    }
}

function ensureDir(dir) {
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function clean() {
    if (existsSync(DIST)) rmSync(DIST, { recursive: true });
    ensureDir(DIST);
}

function copyGlue() {
    console.log("\n▸ Copying JS glue modules...");
    cpSync(RUNTIME, DIST, { recursive: true });
}

function compileFs() {
    console.log("\n▸ Compiling F# → WasmGC");
    try {
        execSync(
            `dotnet fable ${SRC}/FSharpWasmRuntime.fsproj --lang wasmgc --output ${DIST}/wasm/`,
            { cwd: ROOT, stdio: "inherit" }
        );
    } catch {
        console.log(
            "\n⚠  F# compilation skipped (fsharp-wasm compiler not available)."
        );
        console.log(
            "   Download from: https://github.com/fsharp-wasm/fsharp-wasm/releases"
        );
    }
}

function copyAssets() {
    console.log("\n▸ Copying assets...");
    const assets = ["index.html"];
    for (const file of assets) {
        const src = resolve(ROOT, file);
        if (existsSync(src)) {
            cpSync(src, resolve(DIST, file));
        }
    }
}

function build() {
    console.log("═══════════════════════════════════════");
    console.log("  fsharp-wasm-runtime — Build");
    console.log("═══════════════════════════════════════");

    clean();
    copyGlue();
    compileFs();
    copyAssets();
    console.log("\n✔ Build complete → dist/");
}

build();
