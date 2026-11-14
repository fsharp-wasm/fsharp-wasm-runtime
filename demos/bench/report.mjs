// Turns recorded reports (run.mjs --out, or the page's JSON export) into the tables of docs/benchmarks.md.
//   node demos/bench/report.mjs docs/benchmarks/*.json
// Reports of the same runtime (and major version) form one column: the median of their ratios, the range in brackets.
import { readFileSync } from 'node:fs';
import process from 'node:process';

const reports = process.argv.slice(2).map((f) => JSON.parse(readFileSync(f, 'utf8')));
if (!reports.length) { console.error('usage: node demos/bench/report.mjs report.json …'); process.exit(2); }

const name = (r) => {
  const e = r.env, v = (e.version ?? e.userAgent?.match(/(?:Headless)?Chrome\/(\d+)/)?.[1] ?? '').split('.')[0];
  return `${e.runtime === 'browser' ? 'Chromium' : e.runtime[0].toUpperCase() + e.runtime.slice(1)} ${v}`;
};
const groups = new Map();
for (const r of reports) (groups.get(name(r)) ?? groups.set(name(r), []).get(name(r))).push(r);

const med = (xs) => { const s = [...xs].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const fx = (x) => (x >= 10 ? x.toFixed(0) : x.toFixed(2));
const shaky = (r) => [r.js, r.wasm].some((s) => (s.p75 - s.p25) / s.median > 0.25);   // an interquartile range above a quarter of the median
const cell0 = (xs) => (xs.length === 1 ? fx(xs[0]) : `${fx(med(xs))} (${fx(Math.min(...xs))}–${fx(Math.max(...xs))})`);
const cell = (xs, flag = false) => cell0(xs) + (flag ? ' ⚠' : '');
const ms = (x) => (x >= 100 ? x.toFixed(0) : x >= 10 ? x.toFixed(1) : x.toFixed(2));

const ids = reports[0].rows.map((r) => r.id);
const label = (id) => { const r = reports[0].rows.find((x) => x.id === id); return r.label + (r.fused ? ' †' : ''); };
const cols = [...groups.entries()];

console.log(`| kernel | ${cols.map(([n, g]) => `${n}${g.length > 1 ? ` (${g.length} runs)` : ''}`).join(' | ')} |`);
console.log(`|---|${cols.map(() => '---:').join('|')}|`);
for (const id of ids) console.log(`| ${label(id)} | ${cols.map(([, g]) => cell(g.map((r) => r.rows.find((x) => x.id === id).ratio), g.some((r) => shaky(r.rows.find((x) => x.id === id))))).join(' | ')} |`);
console.log(`| **geometric mean** | ${cols.map(([, g]) => cell(g.map((r) => r.summary.geomean))).join(' | ')} |`);
console.log(`| **geometric mean without †** | ${cols.map(([, g]) => cell(g.map((r) => r.summary.geomeanVm))).join(' | ')} |`);

console.log('\n⚠ — the interquartile range of one side is more than a quarter of its median in at least one report: the ratio is not stable.');
console.log('\nMedian times of the first report of each runtime (JS / F# → WasmGC, ms; in brackets the interquartile range; first call; samples per side):\n');
console.log(`| kernel | n | ${cols.map(([n]) => n).join(' | ')} |`);
console.log(`|---|---:|${cols.map(() => '---|').join('')}`);
for (const id of ids) {
  const k = reports[0].rows.find((x) => x.id === id);
  console.log(`| ${label(id)} | ${k.size.toLocaleString('en-US')} | ${cols.map(([, g]) => {
    const r = g[0].rows.find((x) => x.id === id);
    return `${ms(r.js.median)} / ${ms(r.wasm.median)} (${ms(r.js.p25)}–${ms(r.js.p75)} / ${ms(r.wasm.p25)}–${ms(r.wasm.p75)}); ${ms(r.js.cold)} / ${ms(r.wasm.cold)}; ${r.js.n}`;
  }).join(' | ')} |`);
}
console.log('\nEnvironments:\n');
for (const [n, g] of cols) { const e = g[0].env; console.log(`- **${n}** — ${e.runtime === 'browser' ? e.userAgent : `${e.runtime} ${e.version}${e.v8 ? `, V8 ${e.v8}` : ''}`}; ${e.cpu ?? ''}${e.cores ? ` ×${e.cores}` : ''}; module ${g[0].wasm.bytes} bytes${g[0].wasm.sha256 ? `, sha256 ${g[0].wasm.sha256}…` : ''}; ${g.map((r) => r.date.slice(0, 16).replace('T', ' ')).join(', ')} UTC`); }
