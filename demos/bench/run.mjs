// The benchmark on a server-side runtime — the same harness the page runs, driven from a terminal.  Node 22+, Deno 2, Bun:
//   node  demos/bench/run.mjs [--profile quick|standard] [--only fib,crc32] [--wasm path/to/Bench.wasm] [--out file.json]
//   deno  run -A demos/bench/run.mjs …          bun  demos/bench/run.mjs …
// Prints a table; --out also writes the report (schema: harness.js `makeReport`) as JSON.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
import process from 'node:process';
import { environment, loadWasm, makeReport, profiles, runSuite, suite } from './harness.js';

const here = dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).join(' ').split(/\s*--/).filter(Boolean).map((a) => { const [k, ...v] = a.trim().split(/\s+/); return [k, v.join(' ') || true]; }));
const profile = args.profile ?? 'quick', only = typeof args.only === 'string' ? args.only.split(',') : undefined;
if (!profiles[profile]) { console.error(`unknown profile "${profile}" (${Object.keys(profiles).join(', ')})`); process.exit(2); }
for (const id of only ?? []) if (!suite.some((k) => k.id === id)) { console.error(`unknown kernel "${id}" (${suite.map((k) => k.id).join(', ')})`); process.exit(2); }

// the module: --wasm, else where the build puts it, else the committed site
const candidates = [args.wasm, resolve(here, '../../dist/demos/bench/Bench.wasm'), resolve(here, '../../site/demos/bench/Bench.wasm')].filter((p) => typeof p === 'string');
let bytes, wasmPath;
for (const p of candidates) { try { bytes = await readFile(p); wasmPath = p; break; } catch { /* next */ } }
if (!bytes) { console.error(`Bench.wasm not found (looked in: ${candidates.join(', ')}) — build it with: node build/build.js --demo bench`); process.exit(2); }

const wasm = await loadWasm(bytes);
const cpus = os.cpus();
const env = { ...environment(), cpu: cpus[0]?.model, cores: cpus.length, memoryGB: Math.round(os.totalmem() / 2 ** 30) };
console.log(`${env.runtime} ${env.version ?? ''} · ${env.os} ${env.arch} · ${env.cpu ?? '?'} ×${env.cores} · profile ${profile}`);
console.log(`module ${wasmPath.replace(/^.*\/(dist|site)\//, '$1/')}: ${(wasm.bytes / 1024).toFixed(1)} KB, compiled in ${wasm.compileMs.toFixed(1)} ms, instantiated in ${wasm.instantiateMs.toFixed(1)} ms\n`);

const pad = (s, n) => String(s).padStart(n), ms = (x) => (x >= 100 ? x.toFixed(0) : x >= 10 ? x.toFixed(1) : x.toFixed(2));
console.log(`${'kernel'.padEnd(15)}${pad('JS ms', 9)}${pad('wasm ms', 10)}${pad('ratio', 9)}  ${pad('JS first', 9)}${pad('wasm first', 11)}  check`);
const rows = await runSuite({ wasm: wasm.exports, profile, only, onRow: (r) =>
  console.log(`${(r.label + (r.fused ? ' †' : '')).padEnd(15)}${pad(ms(r.js.median), 9)}${pad(ms(r.wasm.median), 10)}${pad(r.same ? r.ratio.toFixed(2) + '×' : '—', 9)}  ${pad(ms(r.js.cold), 9)}${pad(ms(r.wasm.cold), 11)}  ${r.same ? '✓' : '✗ results differ'}`) });

const report = makeReport({ profile, env, wasm, rows });
const s = report.summary;
console.log(`\n${s.agree}/${s.kernels} kernels agree; F# → WasmGC faster in ${s.wasmFaster}; geometric mean ${s.geomean?.toFixed(2)}×, ${s.geomeanVm?.toFixed(2)}× without † rows`);
if (typeof args.out === 'string') {
  await mkdir(dirname(resolve(args.out)), { recursive: true });
  await writeFile(args.out, JSON.stringify(report, null, 2) + '\n');
  console.log(`wrote ${args.out}`);
}
process.exit(s.agree === s.kernels ? 0 : 1);
