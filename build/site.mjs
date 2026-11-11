#!/usr/bin/env node
/**
 * Publish the built demos into site/ — the folder GitHub Pages serves.
 *
 *   node build/build.js && node build/site.mjs
 *
 * site/ holds the landing page (index.html, hand-written) and the *prebuilt* demos, so deploying it needs no
 * compiler: the .wasm files are committed.  Only what a browser needs is copied — each demo's page, its .wasm and its
 * scripts, plus the shared runtime glue — never the compiler's side products (.wat, WIT, embedded components).
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const DIST = join(ROOT, "dist");
const SITE = join(ROOT, "site");

if (!existsSync(join(DIST, "demos"))) {
    console.error("✗ dist/ is empty — run: node build/build.js");
    process.exit(1);
}

const deployable = (file) =>
    file === "index.html" || file.endsWith(".js") || (file.endsWith(".wasm") && !/-(embedded|component)\.wasm$/.test(file));

rmSync(join(SITE, "demos"), { recursive: true, force: true });
rmSync(join(SITE, "runtime"), { recursive: true, force: true });
cpSync(join(DIST, "runtime"), join(SITE, "runtime"), { recursive: true });

let wasm = 0;
for (const demo of readdirSync(join(DIST, "demos"))) {
    const from = join(DIST, "demos", demo), to = join(SITE, "demos", demo);
    mkdirSync(to, { recursive: true });
    for (const file of readdirSync(from).filter(deployable)) {
        cpSync(join(from, file), join(to, file));
        if (file.endsWith(".wasm")) wasm++;
    }
}
console.log(`✔ site/ updated: ${wasm} wasm modules + runtime glue`);
