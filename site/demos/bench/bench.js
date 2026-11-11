// The benchmark harness: the same four kernels as `Bench.fs`, written in JavaScript, timed against the F# module.
// Used by this demo's page and by the landing page.

export const js = {
  mandelbrot(n) {
    let inside = 0;
    for (let py = 0; py < n; py++) for (let px = 0; px < n; px++) {
      const cr = 3.5 * px / n - 2.5, ci = 2.0 * py / n - 1.0;
      let zr = 0, zi = 0, i = 0;
      while (i < 200 && zr * zr + zi * zi <= 4.0) { const t = zr * zr - zi * zi + cr; zi = 2.0 * zr * zi + ci; zr = t; i++; }
      if (i === 200) inside++;
    }
    return inside;
  },
  primes(n) {
    const composite = new Uint8Array(n + 1);
    let count = 0;
    for (let i = 2; i <= n; i++) if (!composite[i]) { count++; for (let j = i * 2; j <= n; j += i) composite[j] = 1; }
    return count;
  },
  collatz(n) {
    let best = 0;
    for (let s = 1; s <= n; s++) { let x = s, steps = 0; while (x !== 1) { x = x % 2 === 0 ? x / 2 : 3 * x + 1; steps++; } if (steps > best) best = steps; }
    return best;
  },
  pipeline(n) {
    return Array.from({ length: n }, (_, i) => i + 1).map((v) => v * 3).filter((v) => v % 2 === 0).reduce((a, v) => (a + v % 1000) | 0, 0);
  },
};

export const work = [
  ['Mandelbrot 700×700', 'mandelbrot', 700],
  ['Primes ≤ 5,000,000', 'primes', 5_000_000],
  ['Collatz < 300,000', 'collatz', 300_000],
  ['List pipeline, 1,000,000', 'pipeline', 1_000_000],
];

/** Best of five runs after a warm-up, in milliseconds, with the result (to check both sides agree). */
const best = (f, n) => {
  f(n);
  let t = Infinity, r;
  for (let i = 0; i < 5; i++) { const t0 = performance.now(); r = f(n); t = Math.min(t, performance.now() - t0); }
  return [t, r];
};

/** Run every kernel on both sides; `onRow` gets { label, jsMs, wasmMs, ratio, same, result } as each finishes. */
export async function runBench(wasmUrl, onRow) {
  // a program without `printfn` imports nothing; the stub is for one that does
  const { instance } = await WebAssembly.instantiate(await (await fetch(wasmUrl)).arrayBuffer(), { env: { consolePrint() {} } });
  for (const [label, name, n] of work) {
    await new Promise((r) => setTimeout(r, 30));              // let the page paint between kernels
    const [jsMs, rj] = best(js[name], n);
    const [wasmMs, rw] = best(instance.exports[name], n);
    onRow({ label, jsMs, wasmMs, ratio: jsMs / wasmMs, same: rj === rw, result: rw });
  }
}
