# Benchmarks — F# compiled to WasmGC against JavaScript

Thirteen kernels, each written twice — in F# (`demos/bench/Bench.fs`, compiled to WasmGC by fsharp-wasm) and in plain JavaScript
(`demos/bench/kernels.js`) — with the same algorithm and the same order of operations. They run in a browser (a worker), in Node, in
Deno and in Bun, from the same harness (`demos/bench/harness.js`).

The question is narrow: *how does the code this compiler generates compare with what V8's (and JavaScriptCore's) JIT makes of
idiomatic JavaScript, on compute-bound code?* It says nothing about DOM calls, about crossing the JS/Wasm boundary, or about startup of a
large application — see [what is not measured](#what-is-not-measured).

## The kernels

| kernel | stresses | size (standard / quick) |
|---|---|---|
| Mandelbrot | double arithmetic in a branchy inner loop | 700² / 300² points |
| N-body | double arithmetic on small arrays, `sqrt` | 1 000 000 / 200 000 steps |
| Spectral norm | nested loops, int→double, division | n = 700 / 250 |
| Matrix product | dense array reads and writes | 400³ / 150³ |
| Sieve | byte-array writes with a stride | 5 000 000 / 1 000 000 |
| Fannkuch-redux | int array shuffling in tight loops | n = 9 / 8 |
| CRC-32 | 32-bit integer operations, table lookups | 16 000 000 / 3 000 000 bytes |
| Collatz | 64-bit integers (`int64` in F#, doubles in JavaScript) | starts < 300 000 / 60 000 |
| Fibonacci | function calls, recursion | fib 35 / 30 |
| Binary trees | allocation and garbage collection | depth 15 / 12 |
| Word count | string building, hashing, comparison (a hash table written out on both sides) | 1 200 000 / 250 000 words |
| Quicksort | int array partitioning, recursion (written out on both sides) | 1 500 000 / 300 000 ints |
| List pipeline † | `map` / `filter` / `fold` over a collection | 3 000 000 / 1 200 000 elements |

† The F# compiler fuses the three steps into one loop that allocates no list (readable in the module: `wasm-tools print Bench.wasm`,
function `$pipeline`); JavaScript allocates three arrays. That row measures a compiler optimisation, not the VM, and is therefore left out of
the second geometric mean.

Every kernel returns a checksum. Before any time counts, both sides must return the *same* value — for the floating-point kernels bit for
bit (same operations in the same order, IEEE doubles on both sides) — in the cold call and in every sample.

The JavaScript is written the way a JavaScript programmer would write it: typed arrays where the F# has arrays of numbers, object
nodes for the tree, module-level functions. One earlier draft had the spectral-norm helpers as closures inside the kernel; V8 ran that
2.6 times slower than the same code with module-level functions (180 ms against 68 ms), so the baseline was a straw man and was
rewritten. If you find another place where the JavaScript side is slower than it needs to be, that is a bug in this benchmark — please
open an issue.

## Method

- **Cold call**: the first call of each side, timed alone. It includes JIT compilation, tier-up and lazy Wasm compilation and is shown
  as "first call", not mixed into the figures.
- **Warm-up**: one more call of each side, discarded.
- **Samples**: taken in alternation — JavaScript first, WasmGC first, JavaScript first, … — so slow drift (thermal throttling, a
  neighbour's load) hits both sides alike. Sampling continues until the profile's time budget is spent: at least 3 (quick) or 7
  (standard) samples per side, at most 9 or 31.
- **Figure**: the median; spread: the interquartile range (P25–P75). The ratio is `median(JS) ÷ median(F#)`; above 1 the F# module is
  faster. The report also carries the widest ratio the quartiles allow.
- **Summary**: the geometric mean of the ratios (the right mean for ratios), with and without the † row.
- **Environment**: runtime and version, V8 version, OS, CPU model and cores (server runtimes) or the user agent and logical cores
  (browser); the module's size, SHA-256 prefix, compile and instantiate time.
- **Timers**: browsers round `performance.now()` (0.1 ms in Chromium, coarser in Firefox with fingerprinting protection); the kernels are
  sized so a run takes milliseconds, not microseconds.

## Running it

| where | how |
|---|---|
| browser | `demos/bench/index.html` (live on the site): profile, kernel selection, chart, table, JSON download |
| Node 22+ | `node demos/bench/run.mjs --profile standard --out docs/benchmarks/node.json` |
| Deno 2 | `deno run -A demos/bench/run.mjs --profile standard` |
| Bun | `bun demos/bench/run.mjs --profile standard` |
| tables from reports | `node demos/bench/report.mjs docs/benchmarks/*.json` |
| CI | `tests/e2e/bench.mjs` (the page in Chromium: every kernel agrees, chart and table complete) and the Node CLI with the quick profile |

Options of `run.mjs`: `--profile quick|standard`, `--only fib,crc32`, `--wasm <path>` (default `dist/demos/bench/Bench.wasm`, then
`site/demos/bench/Bench.wasm`), `--out <file.json>`. The exit status is 1 if a result differs between the two sides.

## Results

Recorded on 14 November 2026 on **one machine**: a 4-vCPU virtual machine (Intel Xeon @ 2.10 GHz) in a cloud container, the standard profile,
the same module on every runtime (17 685 bytes, SHA-256 `e5a29d313a253e12…`). The container was otherwise idle apart from a few short git and API
calls while the runs were recorded. Node ran three times in a row, to show the run-to-run spread. The reports are in
[`docs/benchmarks/`](benchmarks/); `node demos/bench/report.mjs docs/benchmarks/*.json` prints the tables below from them.

### Ratio, JavaScript median ÷ F# → WasmGC median (above 1: the F# module is faster)

| kernel | Node 24 (3 runs) | Deno 2 | Bun 1 | Chromium 153 |
|---|---:|---:|---:|---:|
| Mandelbrot | 0.99 (0.99–1.01) | 0.90 | 1.01 | 0.89 |
| N-body | 1.69 (1.66–1.69) | 1.20 | 1.01 | 1.84 |
| Spectral norm | 2.40 (2.39–2.43) | 6.52 ⚠ | 1.33 | 2.48 |
| Matrix product | 1.55 (1.50–1.55) ⚠ | 1.49 | 1.02 | 1.51 |
| Sieve | 0.65 (0.62–0.66) | 0.76 | 0.71 | 0.74 |
| Fannkuch-redux | 1.30 (1.29–1.30) | 1.23 | 0.95 | 1.36 |
| CRC-32 | 0.90 (0.90–0.90) | 0.89 | 0.99 | 0.89 |
| Collatz | 4.98 (4.96–4.99) | 5.06 | 1.88 | 4.94 |
| Fibonacci | 2.31 (2.30–2.32) | 2.97 | 1.23 | 2.99 |
| Binary trees | 0.87 (0.82–0.91) | 1.01 | 0.53 | 1.14 |
| Word count | 0.85 (0.75–0.88) | 0.85 | 0.86 | 1.04 |
| Quicksort | 1.23 (1.11–1.28) | 1.25 | 1.03 | 1.12 |
| List pipeline † | 78 (75–79) | 82 | 16 | 60 |
| **geometric mean** | 1.87 (1.87–1.90) | 2.05 | 1.24 | 1.96 |
| **geometric mean without †** | 1.37 (1.37–1.40) | 1.51 | 1.00 | 1.48 |

⚠ — the interquartile range of one side is more than a quarter of its median in at least one report: the ratio is not stable.

### Times

Median times of the first report of each runtime (JS / F# → WasmGC, ms; in brackets the interquartile range; first call; samples per side):

| kernel | n | Node 24 | Deno 2 | Bun 1 | Chromium 153 |
|---|---:|---|---|---|---|
| Mandelbrot | 700 | 64.0 / 63.1 (57.5–64.2 / 57.6–65.2); 72.3 / 116; 13 | 64.7 / 71.9 (64.4–65.1 / 71.5–72.2); 72.3 / 130; 11 | 67.4 / 66.6 (62.8–67.9 / 64.0–67.7); 69.9 / 71.7; 12 | 64.2 / 71.9 (63.9–64.6 / 71.6–72.4); 66.8 / 118; 11 |
| N-body | 1,000,000 | 104 / 62.9 (103–105 / 61.5–64.1); 113 / 180; 9 | 74.9 / 62.6 (74.2–75.5 / 62.4–62.7); 72.5 / 191; 11 | 59.4 / 58.9 (58.9–59.9 / 58.4–59.1); 99.6 / 75.4; 13 | 109 / 59.4 (107–115 / 54.3–59.9); 195 / 178; 9 |
| Spectral norm | 700 | 74.6 / 31.1 (69.8–76.7 / 30.6–31.1); 50.1 / 36.1; 15 | 204 / 31.2 (42.9–210 / 31.1–31.9); 46.5 / 34.4; 9 | 41.2 / 31.1 (40.8–44.0 / 30.1–32.8); 44.0 / 33.1; 19 | 79.7 / 32.1 (76.0–82.0 / 31.4–33.4); 48.2 / 38.5; 14 |
| Matrix product | 400 | 101 / 65.4 (99.3–133 / 64.6–69.2); 117 / 197; 9 | 104 / 69.7 (98.2–112 / 66.3–72.0); 114 / 286; 9 | 56.0 / 55.0 (54.1–57.2 / 53.9–56.2); 59.2 / 56.4; 13 | 102 / 67.8 (98.7–103 / 67.1–70.0); 112 / 221; 9 |
| Sieve | 5,000,000 | 47.5 / 71.6 (44.2–48.7 / 70.4–75.1); 51.5 / 98.7; 13 | 48.0 / 63.4 (47.4–48.4 / 62.4–66.3); 48.5 / 99.1; 14 | 45.9 / 64.7 (43.8–46.4 / 60.6–71.4); 47.2 / 86.3; 14 | 47.9 / 64.5 (47.4–48.5 / 61.6–67.3); 46.0 / 98.7; 14 |
| Fannkuch-redux | 9 | 25.1 / 19.5 (24.8–25.7 / 19.3–19.9); 30.0 / 44.8; 31 | 23.0 / 18.7 (22.9–23.2 / 18.6–18.8); 25.2 / 41.2; 31 | 18.7 / 19.6 (17.1–19.1 / 17.8–20.5); 25.5 / 21.6; 31 | 21.3 / 15.7 (21.0–25.9 / 15.1–18.5); 29.8 / 43.0; 31 |
| CRC-32 | 16,000,000 | 41.1 / 45.6 (41.1–41.2 / 45.5–45.7); 51.2 / 100; 13 | 40.5 / 45.4 (40.2–40.8 / 45.2–45.7); 41.7 / 96.1; 16 | 40.7 / 41.0 (40.3–41.8 / 40.9–41.7); 35.9 / 34.1; 19 | 40.3 / 45.4 (40.1–40.7 / 45.1–45.7); 33.1 / 75.1; 18 |
| Collatz | 300,000 | 442 / 88.7 (428–456 / 85.9–93.3); 335 / 366; 7 | 442 / 87.5 (421–445 / 84.8–88.0); 297 / 299; 7 | 503 / 267 (485–511 / 266–269); 405 / 281; 7 | 428 / 86.5 (423–442 / 82.2–92.3); 310 / 301; 7 |
| Fibonacci | 35 | 72.5 / 31.3 (70.6–74.3 / 31.0–33.1); 80.5 / 35.8; 14 | 79.3 / 26.7 (78.4–80.9 / 26.0–27.1); 75.9 / 25.2; 15 | 48.1 / 39.2 (47.6–48.8 / 38.7–41.8); 50.1 / 40.8; 17 | 81.9 / 27.4 (81.1–84.5 / 27.0–28.8); 77.8 / 24.2; 14 |
| Binary trees | 15 | 115 / 127 (112–122 / 124–150); 95.0 / 141; 7 | 133 / 132 (125–137 / 123–136); 159 / 116; 7 | 123 / 233 (115–130 / 224–237); 160 / 208; 7 | 93.6 / 82.0 (89.7–104 / 80.8–83.3); 104 / 100; 9 |
| Word count | 1,200,000 | 60.6 / 68.9 (60.1–64.9 / 66.1–75.5); 68.4 / 102; 11 | 55.0 / 64.4 (52.2–55.9 / 62.5–66.9); 88.6 / 113; 13 | 185 / 216 (182–191 / 215–228); 201 / 249; 7 | 55.1 / 53.0 (51.8–57.0 / 52.2–53.4); 66.7 / 90.6; 14 |
| Quicksort | 1,500,000 | 180 / 146 (178–182 / 146–148); 192 / 155; 7 | 177 / 142 (168–179 / 141–144); 181 / 151; 7 | 145 / 141 (142–148 / 139–147); 159 / 149; 7 | 160 / 143 (153–175 / 139–146); 192 / 153; 7 |
| List pipeline † | 3,000,000 | 216 / 2.89 (215–229 / 2.88–3.00); 213 / 8.63; 7 | 226 / 2.75 (209–242 / 2.57–2.89); 230 / 8.62; 7 | 59.8 / 3.79 (53.4–65.2 / 3.73–4.14); 93.9 / 4.68; 24 | 173 / 2.90 (168–191 / 2.90–2.90); 169 / 9.10; 9 |

### Environments

- **Node 24** — node 24.22.3, V8 13.6.233.17-node.63; Intel(R) Xeon(R) Processor @ 2.10GHz ×4; module 17685 bytes, sha256 e5a29d313a253e12…; 2026-11-14 07:55, 2026-11-14 07:56, 2026-11-14 07:56 UTC
- **Deno 2** — deno 2.9.6, V8 15.0.245.2-rusty; Intel(R) Xeon(R) Processor @ 2.10GHz ×4; module 17685 bytes, sha256 e5a29d313a253e12…; 2026-11-14 07:57 UTC
- **Bun 1** — bun 1.4.4; Intel(R) Xeon(R) Processor @ 2.10GHz ×4; module 17685 bytes, sha256 e5a29d313a253e12…; 2026-11-14 07:57 UTC
- **Chromium 153** — Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/153.0.8010.12 Safari/537.36;  ×4; module 17685 bytes, sha256 e5a29d313a253e12…; 2026-11-14 07:58 UTC

### Reading the results

- **Spread.** Node's three runs agree within a few percent on every kernel except the allocation- and string-heavy ones (binary trees
  0.82–0.91, word count 0.75–0.88, quicksort 1.11–1.28). Treat differences below 10–15 % — between runs or between runtimes — as noise.
- **V8 (Node 24, Deno 2, Chromium 153).** The F# module is faster in 8–9 of 13 kernels; the geometric mean without the † row is 1.37, 1.51 and
  1.48. It is a few large wins — Collatz ≈ 5× (native 64-bit integers against doubles, presumably), Fibonacci 2.3–3×, N-body 1.2–1.8×, spectral norm
  (below) — next to modest gains (matrix product ≈ 1.5×, fannkuch 1.2–1.4×, quicksort 1.1–1.25×), near-ties (Mandelbrot 0.89–0.99, CRC-32 0.89–0.90,
  binary trees 0.87–1.14) and losses (sieve 0.65–0.76; word count 0.85 on Node and Deno, 1.04 on Chromium). "Faster by about 1.4×" is a statement
  about this suite, not about programs.
- **Bun (JavaScriptCore).** Geometric mean 1.00 without †. Loops are at parity (0.95–1.33; the sieve 0.71), calls 1.23×, 64-bit integers 1.9×, and the allocation
  kernel loses clearly (binary trees 0.53: 233 ms against 123 ms). Not investigated further.
- **Spectral norm on V8 is an engine effect, not a Wasm effect.** The JavaScript kernel runs at 34–49 ms for its first calls and slows to 65 ms (Node 24)
  or 200 ms (Deno 2, V8 15) once the optimising tier takes over — also in isolation, without the harness; JavaScriptCore stays at 40 ms. That is why Deno shows
  6.5× (four more runs: 6.1–6.4×) and Node 2.4×; without this kernel the geometric means without † of Node, Deno, Bun and Chromium are 1.33, 1.32, 0.97 and 1.41.
  Writing the division as `>> 1` makes it *slower* on V8 (161 ms) and faster on JavaScriptCore (30 ms); the form in `kernels.js` is the textbook form of
  the formula, so that is what is measured.
- **The sieve loses because of the array representation**, not the loop: `bool[]` is a 32-bit-element array (finding 1 below); with an `Int32Array`
  JavaScript is exactly as slow.
- **First call.** On V8 the module's first call is about 1.7–1.8× its steady state (presumably Liftoff, then tier-up to TurboFan; median over the kernels: Node 1.84,
  Deno 1.81, Chromium 1.66; Bun 1.06); JavaScript's first call is close to — sometimes below — its steady state. For a kernel that is called once with
  ≲ 100 ms of work the JavaScript's first call is faster than the module's in 9 of 12 kernels on Node, 8 on Deno, 6 on Chromium and 4 on Bun (without †). The advantage of the module is a
  steady-state advantage. (A program that calls the same code many times, or runs for seconds, is in the steady state.)
- **† (list pipeline): 16–82×.** An optimisation of the compiler against three allocated arrays; it says nothing about the VM.

## What is not measured

- **The JS ↔ Wasm boundary and the host.** Every kernel is one call with an integer in and a number out. Real programs cross the
  boundary for the DOM, strings and callbacks; that cost is not in these numbers.
- **Startup of a large application**: only the size, compile and instantiate time of this 17 KB module are recorded.
- **Memory**: no peak heap, no GC pauses (the binary-trees row shows throughput only).
- **Other engines' Wasm GC maturity**: Chromium and Node (V8) and Bun (JavaScriptCore) are covered; Firefox (SpiderMonkey) and Safari
  are not, apart from running the page by hand.
- **Library collections**: no `Dictionary` / `ResizeArray` kernel, because the compiled module would need the collection library of
  fsharp-wasm-core, which this repository does not carry; the word-count kernel therefore writes its hash table out on both sides.
- **SIMD, threads, SharedArrayBuffer**.

## Findings for the compiler

Measured here, handed to [fsharp-wasm](https://github.com/fsharp-wasm/fsharp-wasm):

1. **`bool[]` is `(array (mut i32))` — four bytes per element** (`byte[]` is the same). The sieve is memory-bound: JavaScript with an
   `Int32Array` needs the same 70 ms as the module, with a `Uint8Array` 46 ms (Node 24, n = 5 000 000). A packed `i8` array
   (`array.get_u` / `array.set`) would remove the gap.
2. **`List.sortBy` was an insertion sort** (O(n²)): 20 000, 40 000 and 80 000 elements took 155, 433 and 1979 ms, and a string key did not compile. Fixed in
   fsharp-wasm `7c628ff` (a stable merge sort, ordered by Fable's comparer: the same sizes take 10, 10 and 16 ms). `Array.sort`, `sortWith`,
   `sortInPlace`, `List.sort` and `List.sortWith` were already merge sorts — this document said otherwise until the numbers were measured. The
   quicksort kernel is written out on both sides because the point is the same algorithm in both languages, not the library's sort.
3. **The list pipeline is fused into one loop** — a real optimisation, and the reason for the † row.
4. **64-bit integers are native** (`i64`); JavaScript has doubles (or `BigInt`, which is far slower), which is most of the Collatz result.
