// Measurement for the benchmark suite (kernels.js ↔ Bench.wasm).  Runs unchanged in a browser, a worker, Node, Deno and Bun.
//
// Per kernel and side: one cold call (what a first call costs: JIT, tier-up, lazy compilation), one discarded warm-up, then
// samples taken in alternation (JS first, WasmGC first, …) so slow drift — thermal, a neighbour's load — hits both sides alike,
// until the sampled time reaches the profile's budget (at least `minSamples`, at most `maxSamples`).  A figure is the median;
// the spread is the interquartile range.  Before any time is believed, the result of both sides must be equal — in every sample.
import { kernels as jsKernels, suite } from './kernels.js';

export { suite };

export const profiles = {
  quick:    { name: 'quick',    scale: 'quick', minSamples: 3, maxSamples: 9,  budgetMs: 150 },
  standard: { name: 'standard', scale: 'size',  minSamples: 7, maxSamples: 31, budgetMs: 1500 },
};

const now = () => performance.now();
const call = (f, n) => { const t0 = now(); const r = f(n); return [now() - t0, r]; };
const yieldNow = () => new Promise((resolve) => setTimeout(resolve, 0));

/** Quantile of a sorted array, linearly interpolated. */
export function quantile(sorted, q) {
  const pos = (sorted.length - 1) * q, lo = Math.floor(pos), hi = Math.ceil(pos);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

export function stats(samples, cold) {
  const s = [...samples].sort((a, b) => a - b);
  return { cold, n: s.length, min: s[0], p25: quantile(s, 0.25), median: quantile(s, 0.5), p75: quantile(s, 0.75), max: s[s.length - 1] };
}

/** Measure one suite entry.  `js` and `wasm` are the two functions of one kernel. */
export function measure(kernel, profile, js, wasm) {
  const n = kernel[profile.scale];
  const [jsCold, rj] = call(js, n);
  const [wasmCold, rw] = call(wasm, n);
  let same = rj === rw;
  call(js, n); call(wasm, n);                                       // warm-up, discarded
  const jsT = [], wasmT = [];
  let spent = 0;
  for (let i = 0; i < profile.maxSamples && (i < profile.minSamples || spent < profile.budgetMs); i++) {
    for (const side of i % 2 === 0 ? ['js', 'wasm'] : ['wasm', 'js']) {
      const [t, r] = side === 'js' ? call(js, n) : call(wasm, n);
      (side === 'js' ? jsT : wasmT).push(t);
      same &&= r === rj;
      spent += t;
    }
  }
  const j = stats(jsT, jsCold), w = stats(wasmT, wasmCold);
  return {
    id: kernel.id, label: kernel.label, group: kernel.group, what: kernel.what, note: kernel.note, fused: !!kernel.fused,
    size: n, same, result: rw, js: j, wasm: w,
    ratio: j.median / w.median,                                     // > 1: the F# module is faster
    ratioRange: [j.p25 / w.p75, j.p75 / w.p25],                     // the widest ratio the quartiles allow
  };
}

const geomean = (xs) => Math.exp(xs.reduce((a, x) => a + Math.log(x), 0) / xs.length);

export function summarize(rows) {
  const ok = rows.filter((r) => r.same);
  const vm = ok.filter((r) => !r.fused);
  return {
    kernels: rows.length, agree: ok.length,
    wasmFaster: ok.filter((r) => r.ratio > 1).length,
    geomean: ok.length ? geomean(ok.map((r) => r.ratio)) : null,
    geomeanVm: vm.length ? geomean(vm.map((r) => r.ratio)) : null,   // without the rows a compiler optimisation decides
  };
}

/** Run the suite (or the kernels named in `only`); `onRow` gets each finished row; `signal` stops between kernels. */
export async function runSuite({ wasm, js = jsKernels, profile = 'quick', only, onRow, signal }) {
  const p = typeof profile === 'string' ? profiles[profile] : profile;
  if (!p) throw new Error(`unknown profile "${profile}" (${Object.keys(profiles).join(', ')})`);
  const rows = [];
  for (const kernel of suite) {
    if (only && !only.includes(kernel.id)) continue;
    await yieldNow();                                               // paint, post messages, notice an abort
    if (signal?.aborted) break;
    const row = measure(kernel, p, js[kernel.id], wasm[kernel.id]);
    rows.push(row);
    onRow?.(row);
  }
  return rows;
}

/** Fetch (a URL) or take (bytes) the module; compile and instantiate it, timed separately. */
export async function loadWasm(source) {
  let bytes = source;
  if (typeof source === 'string' || source instanceof URL) {
    const res = await fetch(source);
    if (!res.ok) throw new Error(`${source}: HTTP ${res.status}`);
    bytes = await res.arrayBuffer();
  }
  bytes = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  // which build was measured (where the platform offers digests: secure contexts and every server runtime)
  const sha256 = await globalThis.crypto?.subtle?.digest('SHA-256', bytes)
    .then((d) => [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 16)).catch(() => undefined);
  let t = now();
  const module = await WebAssembly.compile(bytes);
  const compileMs = now() - t;
  t = now();
  // a program without `printfn` imports nothing; the stub is for one that does
  const instance = await WebAssembly.instantiate(module, { env: { consolePrint() {} } });
  return { exports: instance.exports, bytes: bytes.byteLength, sha256, compileMs, instantiateMs: now() - t };
}

export function environment() {
  const g = globalThis;
  if (g.Deno) return { runtime: 'deno', version: g.Deno.version.deno, v8: g.Deno.version.v8, os: g.Deno.build.os, arch: g.Deno.build.arch };
  if (g.Bun) return { runtime: 'bun', version: g.Bun.version, os: g.process?.platform, arch: g.process?.arch };
  if (g.process?.versions?.node) return { runtime: 'node', version: g.process.versions.node, v8: g.process.versions.v8, os: g.process.platform, arch: g.process.arch };
  if (g.navigator) return { runtime: 'browser', userAgent: g.navigator.userAgent, cores: g.navigator.hardwareConcurrency, memoryGB: g.navigator.deviceMemory, crossOriginIsolated: !!g.crossOriginIsolated };
  return { runtime: 'unknown' };
}

export function makeReport({ profile, env, wasm, rows }) {
  const { exports: _, ...module } = wasm;
  return { schema: 1, date: new Date().toISOString(), profile: typeof profile === 'string' ? profile : profile.name, env, wasm: module, summary: summarize(rows), rows };
}
