// Runs the suite off the page's thread, so rendering and input neither disturb the timings nor wait for them.
//   in:  { type: 'run', wasmUrl, profile, only? } | { type: 'abort' }
//   out: { type: 'start', env, wasm } · { type: 'row', row } · { type: 'done', report } · { type: 'error', message }
import { environment, loadWasm, makeReport, runSuite } from './harness.js';

let abort = new AbortController();

self.onmessage = async ({ data }) => {
  if (data.type === 'abort') return abort.abort();
  if (data.type !== 'run') return;
  abort = new AbortController();
  try {
    const wasm = await loadWasm(data.wasmUrl);
    const env = environment();
    const { exports: _, ...module } = wasm;
    self.postMessage({ type: 'start', env, wasm: module });
    const rows = await runSuite({ wasm: wasm.exports, profile: data.profile, only: data.only, signal: abort.signal, onRow: (row) => self.postMessage({ type: 'row', row }) });
    self.postMessage({ type: 'done', report: makeReport({ profile: data.profile, env, wasm, rows }) });
  } catch (e) {
    self.postMessage({ type: 'error', message: String(e?.message ?? e) });
  }
};
