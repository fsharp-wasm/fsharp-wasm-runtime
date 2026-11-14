#!/usr/bin/env node
/**
 * Publish the recorded benchmark reports (docs/benchmarks/*.json) next to the public page site/benchmarks/index.html,
 * and write the manifest the page reads.
 *
 *   node build/benchmarks.mjs
 *
 * Speed reports are the ones with `rows` (run.mjs --out, the page's JSON download); size.json and network.json come from
 * tests/e2e/network.mjs.  A report of a different configuration (the name says so: node-24-no-wasm-inlining.json) is copied, and linked
 * from docs/benchmarks.md, but not mixed into the table of its runtime.
 */
import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const FROM = join(ROOT, "docs", "benchmarks"), TO = join(ROOT, "site", "benchmarks");
mkdirSync(TO, { recursive: true });

const manifest = { speed: [], size: null, network: null, liveHost: null };
for (const f of readdirSync(FROM).filter((f) => f.endsWith(".json")).sort()) {
    copyFileSync(join(FROM, f), join(TO, f));
    const r = JSON.parse(readFileSync(join(FROM, f), "utf8"));
    if (r.schema === "size-1") manifest.size = f;
    else if (r.schema === "network-1") manifest.network = f;
    else if (r.schema === "live-host-1") manifest.liveHost = f;
    else if (Array.isArray(r.rows) && !f.includes("no-wasm-inlining")) manifest.speed.push(f);
}
// the order of the columns: Node, Deno, Bun, then the browser
const rank = (f) => ["node", "deno", "bun", "chromium"].findIndex((p) => f.startsWith(p));
manifest.speed.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));
writeFileSync(join(TO, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`✔ site/benchmarks: ${manifest.speed.length} speed reports, size ${manifest.size ?? "—"}, network ${manifest.network ?? "—"}, live host ${manifest.liveHost ?? "—"}`);
