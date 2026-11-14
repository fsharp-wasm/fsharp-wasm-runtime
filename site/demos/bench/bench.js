// The page-side API of the benchmark: runs `harness.js` in a worker (in the page's thread where there are no workers) and
// hands back the rows as they finish.  Used by this demo's page and by the landing page.
export { suite } from './kernels.js';

/**
 * Run the suite against the module at `wasmUrl`.
 * Options: profile ('quick' | 'standard'), only (kernel ids), onStart({ env, wasm }), onRow(row), signal (AbortSignal).
 * Resolves with the report (see harness.js `makeReport`); with the rows so far when `signal` aborts.
 */
export async function runBenchmark(wasmUrl, { profile = 'quick', only, onStart, onRow, signal } = {}) {
  const url = new URL(wasmUrl, globalThis.document?.baseURI ?? import.meta.url).href;
  if (typeof Worker === 'undefined') {
    const h = await import('./harness.js');
    const wasm = await h.loadWasm(url), env = h.environment();
    onStart?.({ env, wasm: { bytes: wasm.bytes, compileMs: wasm.compileMs, instantiateMs: wasm.instantiateMs } });
    const rows = await h.runSuite({ wasm: wasm.exports, profile, only, onRow, signal });
    return h.makeReport({ profile, env, wasm, rows });
  }
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
    const finish = (f, v) => { signal?.removeEventListener('abort', stop); worker.terminate(); f(v); };
    const stop = () => worker.postMessage({ type: 'abort' });
    signal?.addEventListener('abort', stop);
    worker.onmessage = ({ data }) => {
      if (data.type === 'start') onStart?.(data);
      else if (data.type === 'row') onRow?.(data.row);
      else if (data.type === 'done') finish(resolve, data.report);
      else if (data.type === 'error') finish(reject, new Error(data.message));
    };
    worker.onerror = (e) => finish(reject, new Error(e.message || 'the benchmark worker failed'));
    worker.postMessage({ type: 'run', wasmUrl: url, profile, only });
  });
}

/** The first version of this API, still what the landing page calls: the quick profile, rows with `jsMs` and `wasmMs`. */
export const runBench = (wasmUrl, onRow) =>
  runBenchmark(wasmUrl, { profile: 'quick', onRow: (r) => onRow({ ...r, jsMs: r.js.median, wasmMs: r.wasm.median }) });
