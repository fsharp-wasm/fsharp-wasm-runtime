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
| tables from reports | `node demos/bench/report.mjs docs/benchmarks/*.json` (speed), `node demos/bench/report-size.mjs` (size, network) |
| public page | `site/benchmarks/` — speed, size, network from the reports, and a live download measurement ([live](https://fsharp-wasm.github.io/fsharp-wasm-runtime/benchmarks/)) |
| CI | `tests/e2e/bench.mjs` (the page in Chromium: every kernel agrees, chart and table complete) and the Node CLI with the quick profile |

Options of `run.mjs`: `--profile quick|standard`, `--only fib,crc32`, `--wasm <path>` (default `dist/demos/bench/Bench.wasm`, then
`site/demos/bench/Bench.wasm`), `--out <file.json>`. The exit status is 1 if a result differs between the two sides.

## Results

Recorded on 14 November 2026 on **one machine**: a 4-vCPU virtual machine (Intel Xeon @ 2.10 GHz) in a cloud container, the standard profile,
the same module on every runtime (17 706 bytes, SHA-256 `9c294196595e6395…`, built by fsharp-wasm `73f34dd`). The container was otherwise idle apart from a few short git and API
calls while the runs were recorded. Node ran three times in a row, to show the run-to-run spread. The reports are in
[`docs/benchmarks/`](benchmarks/); `node demos/bench/report.mjs docs/benchmarks/*.json` prints the tables below from them.

### Ratio, JavaScript median ÷ F# → WasmGC median (above 1: the F# module is faster)

| kernel | Node 24 (3 runs) | Deno 2 | Bun 1 | Chromium 153 |
|---|---:|---:|---:|---:|
| Mandelbrot | 1.00 (0.98–1.00) | 0.91 | 1.01 | 0.90 |
| N-body | 1.67 (1.66–1.71) | 1.18 | 1.01 | 1.79 |
| Spectral norm | 2.38 (2.34–2.44) | 6.69 ⚠ | 1.13 ⚠ | 2.54 ⚠ |
| Matrix product | 1.57 (1.53–1.71) | 1.39 | 1.03 | 1.53 |
| Sieve | 1.06 (1.04–1.08) ⚠ | 1.10 | 1.06 | 1.19 |
| Fannkuch-redux | 1.29 (1.27–1.32) | 1.22 | 0.93 | 1.40 |
| CRC-32 | 0.90 (0.89–0.91) | 0.98 | 1.02 | 0.88 |
| Collatz | 5.05 (4.17–5.48) ⚠ | 4.42 | 1.80 | 5.64 ⚠ |
| Fibonacci | 2.29 (2.25–2.34) | 3.40 ⚠ | 1.22 | 3.13 |
| Binary trees | 0.84 (0.77–0.85) | 0.86 | 0.56 | 1.20 |
| Word count | 0.82 (0.81–0.94) | 0.94 | 0.88 | 1.01 |
| Quicksort | 1.25 (1.23–1.40) | 1.24 | 1.05 | 1.25 |
| List pipeline † | 78 (73–83) | 72 | 12 | 57 |
| **geometric mean** | 1.97 (1.93–1.97) | 2.09 | 1.24 | 2.08 |
| **geometric mean without †** | 1.45 (1.42–1.45) | 1.55 | 1.03 | 1.58 |

⚠ — the interquartile range of one side is more than a quarter of its median in at least one report: the ratio is not stable.

### Times

Median times of the first report of each runtime (JS / F# → WasmGC, ms; in brackets the interquartile range; first call; samples per side):

| kernel | n | Node 24 | Deno 2 | Bun 1 | Chromium 153 |
|---|---:|---|---|---|---|
| Mandelbrot | 700 | 63.8 / 63.7 (62.5–65.3 / 62.9–65.5); 71.3 / 117; 12 | 50.9 / 56.1 (50.3–52.7 / 56.0–58.9); 67.3 / 108; 14 | 65.5 / 65.1 (64.8–66.5 / 63.5–65.5); 79.2 / 77.6; 12 | 50.4 / 56.3 (50.2–51.4 / 56.1–57.4); 56.2 / 91.9; 14 |
| N-body | 1,000,000 | 100 / 60.4 (97.0–101 / 50.8–61.3); 109 / 176; 10 | 59.0 / 50.2 (58.1–60.8 / 48.7–51.6); 66.1 / 150; 14 | 56.8 / 56.4 (56.0–57.5 / 55.6–57.3); 70.8 / 66.7; 14 | 108 / 60.3 (105–115 / 59.2–60.8); 187 / 200; 9 |
| Spectral norm | 700 | 56.3 / 24.1 (55.6–58.0 / 23.8–28.9); 45.8 / 32.1; 19 | 172 / 25.8 (65.3–185 / 25.5–26.2); 38.6 / 27.9; 10 | 33.1 / 29.2 (32.4–40.8 / 24.5–30.3); 37.4 / 28.7; 23 | 71.1 / 28.0 (61.9–82.9 / 24.4–32.7); 45.4 / 33.8; 15 |
| Matrix product | 400 | 108 / 63.2 (97.2–118 / 62.4–65.6); 93.1 / 185; 9 | 90.6 / 65.3 (88.1–95.0 / 64.4–66.0); 103 / 201; 9 | 56.4 / 54.5 (55.1–57.7 / 53.3–56.5); 74.2 / 55.6; 14 | 106 / 69.0 (99.7–109 / 66.5–70.8); 82.0 / 152; 9 |
| Sieve | 5,000,000 | 46.2 / 43.4 (42.1–47.5 / 42.4–45.7); 51.8 / 67.6; 17 | 46.3 / 42.0 (46.0–47.0 / 41.7–42.4); 48.5 / 64.8; 17 | 45.6 / 42.9 (40.2–46.6 / 42.0–43.5); 47.5 / 47.9; 18 | 48.1 / 40.5 (43.9–52.0 / 38.0–42.5); 52.5 / 67.6; 17 |
| Fannkuch-redux | 9 | 21.3 / 16.1 (20.3–22.2 / 15.7–17.2); 26.3 / 43.0; 31 | 18.1 / 14.8 (17.9–18.8 / 14.6–15.3); 19.8 / 32.6; 31 | 17.8 / 19.0 (17.3–19.0 / 17.9–20.4); 26.0 / 21.6; 31 | 24.4 / 17.4 (24.0–24.7 / 17.3–17.8); 26.4 / 40.2; 31 |
| CRC-32 | 16,000,000 | 33.0 / 37.2 (32.4–34.0 / 35.8–37.3); 37.1 / 77.5; 17 | 36.2 / 37.1 (33.0–38.8 / 36.0–43.5); 35.1 / 80.3; 19 | 39.1 / 38.2 (36.0–40.1 / 35.9–40.2); 39.4 / 36.3; 20 | 38.7 / 43.8 (33.6–39.9 / 37.4–44.8); 40.5 / 86.4; 19 |
| Collatz | 300,000 | 353 / 69.8 (340–416 / 68.7–85.9); 323 / 272; 7 | 385 / 87.1 (378–447 / 85.5–88.0); 323 / 288; 7 | 473 / 262 (433–484 / 246–266); 356 / 266; 7 | 391 / 69.3 (346–403 / 67.5–85.4); 300 / 309; 7 |
| Fibonacci | 35 | 67.2 / 28.7 (65.8–76.3 / 28.1–33.7); 85.1 / 38.8; 15 | 72.5 / 21.3 (61.8–87.6 / 20.7–28.6); 86.8 / 26.8; 15 | 47.4 / 38.7 (44.4–51.9 / 36.6–39.5); 40.0 / 31.9; 17 | 65.8 / 21.0 (62.3–76.6 / 20.7–23.8); 108 / 26.3; 17 |
| Binary trees | 15 | 93.4 / 121 (91.3–101 / 114–130); 89.6 / 101; 7 | 107 / 125 (105–122 / 110–130); 142 / 113; 7 | 122 / 219 (118–124 / 200–234); 131 / 224; 7 | 86.8 / 72.4 (77.0–88.9 / 71.7–76.6); 72.0 / 75.5; 10 |
| Word count | 1,200,000 | 59.3 / 63.4 (48.0–61.1 / 56.4–64.2); 60.2 / 99.4; 13 | 60.3 / 63.9 (58.9–61.9 / 63.1–65.8); 66.7 / 107; 12 | 113 / 128 (110–119 / 127–129); 131 / 118; 7 | 44.6 / 44.0 (43.5–52.6 / 40.7–46.8); 59.0 / 90.1; 17 |
| Quicksort | 1,500,000 | 139 / 113 (138–152 / 113–116); 145 / 130; 7 | 174 / 140 (171–176 / 139–141); 172 / 143; 7 | 138 / 131 (124–143 / 122–141); 160 / 151; 7 | 160 / 128 (146–170 / 115–137); 144 / 117; 7 |
| List pipeline † | 3,000,000 | 218 / 2.80 (211–235 / 2.75–2.95); 214 / 8.49; 7 | 210 / 2.90 (207–214 / 2.81–2.92); 240 / 8.10; 7 | 44.6 / 3.58 (39.5–48.1 / 3.38–3.65); 86.1 / 4.66; 31 | 166 / 2.90 (154–194 / 2.90–3.60); 140 / 7.00; 9 |

### Environments

- **Node 24** — node 24.22.3, V8 13.6.233.17-node.63; Intel(R) Xeon(R) Processor @ 2.10GHz ×4; module 17706 bytes, sha256 9c294196595e6395…; 2026-11-14 14:36, 2026-11-14 14:37, 2026-11-14 14:37 UTC
- **Deno 2** — deno 2.9.6, V8 15.0.245.2-rusty; Intel(R) Xeon(R) Processor @ 2.10GHz ×4; module 17706 bytes, sha256 9c294196595e6395…; 2026-11-14 14:37 UTC
- **Bun 1** — bun 1.4.4; Intel(R) Xeon(R) Processor @ 2.10GHz ×4; module 17706 bytes, sha256 9c294196595e6395…; 2026-11-14 14:38 UTC
- **Chromium 153** — Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/153.0.8010.12 Safari/537.36;  ×4; module 17706 bytes, sha256 9c294196595e6395…; 2026-11-14 14:40 UTC

### Reading the results

- **Spread.** Node's three runs agree within a few percent on most kernels; the exceptions are Collatz (4.2–5.5), quicksort (1.23–1.40), word count (0.81–0.94),
  matrix product (1.53–1.71) and binary trees (0.77–0.85). Treat differences below 10–15 % — between runs or between runtimes — as noise.
- **V8 (Node 24, Deno 2, Chromium 153).** The F# module is faster in 9–11 of 13 kernels; the geometric mean without the † row is 1.45, 1.55 and 1.58. It is a few
  large wins — Collatz 4.4–5.6× (native 64-bit integers against doubles, presumably), Fibonacci 2.3–3.4× and N-body 1.2–1.8× (Fibonacci loses much of it without V8's
  inlining, see below), spectral norm (below) — next to modest gains (matrix product 1.4–1.6×, fannkuch 1.2–1.4×, quicksort ≈ 1.25×, sieve 1.06–1.19×), near-ties
  (Mandelbrot 0.90–1.00, CRC-32 0.88–0.98) and losses (binary trees 0.84–0.86 on Node and Deno, 1.20 on Chromium; word count 0.82–0.94 on Node and Deno, 1.01 on Chromium).
  "Faster by about 1.5×" is a statement about this suite, not about programs.
- **Bun (JavaScriptCore).** Geometric mean 1.03 without †. Loops are at parity (0.93–1.13), calls 1.22×, 64-bit integers 1.80×, and the allocation
  kernel loses clearly (binary trees 0.56: 219 ms against 122 ms). Not investigated further.
- **Spectral norm on V8 is an engine effect, not a Wasm effect.** The JavaScript kernel runs at 34–49 ms for its first calls and slows to 65 ms (Node 24)
  or 170–200 ms (Deno 2, V8 15) once the optimising tier takes over — also in isolation, without the harness; JavaScriptCore stays at 40 ms. That is why Deno shows
  6.7× (earlier recordings: 6.1–6.5×) and Node 2.3–2.4×; without this kernel the geometric means without † of Node, Deno, Bun and Chromium are 1.39, 1.36, 1.02 and 1.52.
  Writing the division as `>> 1` makes it *slower* on V8 (161 ms) and faster on JavaScriptCore (30 ms); the form in `kernels.js` is the textbook form of
  the formula, so that is what is measured.
- **The sieve was a loss and is none now.** Until fsharp-wasm `73f34dd` a `bool[]` was a 32-bit-element array (finding 1 below): 0.65–0.76 against JavaScript, exactly what
  JavaScript's own `Int32Array` gives. With packed 8-bit elements it is 1.06 (Node), 1.10 (Deno), 1.06 (Bun) and 1.19 (Chromium).
- **First call.** On V8 the module's first call is about 1.7–1.8× its steady state (presumably Liftoff, then tier-up to TurboFan; median over the kernels: Node 1.68–1.81,
  Deno 1.80, Chromium 1.82; Bun 1.02); JavaScript's first call is close to — sometimes below — its steady state. For a kernel that is called once with
  ≲ 100 ms of work the JavaScript's first call is faster than the module's in 8–9 of 12 kernels on Node, 7 on Deno, 9 on Chromium and 2 on Bun (without †). The advantage of the module is a
  steady-state advantage. (A program that calls the same code many times, or runs for seconds, is in the steady state.)
- **† (list pipeline): 12–78×.** An optimisation of the compiler against three allocated arrays; it says nothing about the VM.

### How much of this is V8's inliner

V8 inlines small Wasm functions when it optimises (TurboFan). The compiler leaves calls to ordinary small functions as they are (the WAT of `$fibRec` shows it), and V8's baseline tier (Liftoff) inlines nothing.
The same Node 24 run with `node --no-wasm-inlining` (report: `docs/benchmarks/node-24-no-wasm-inlining.json`):

| kernel | F# module, ms (default) | F# module, ms (`--no-wasm-inlining`) | ratio vs JS (default → no inlining) |
|---|---:|---:|---:|
| Mandelbrot | 63.7 | 54.8 | 1.00 → 1.04 |
| N-body | 60.4 | 61.9 | 1.66 → 1.83 |
| Spectral norm | 24.1 | 49.3 | 2.34 → 1.24 |
| Matrix product | 63.2 | 60.9 | 1.71 → 1.64 |
| Sieve | 43.4 | 35.9 | 1.06 → 1.05 |
| Fannkuch-redux | 16.1 | 18.4 | 1.32 → 1.30 |
| CRC-32 | 37.2 | 44.2 | 0.89 → 0.93 |
| Collatz | 69.8 | 85.7 | 5.05 → 4.76 |
| Fibonacci | 28.7 | 64.0 | 2.34 → 1.23 |
| Binary trees | 121 | 137 | 0.77 → 0.72 |
| Word count | 63.4 | 84.7 | 0.94 → 0.69 |
| Quicksort | 113 | 144 | 1.23 → 1.20 |
| List pipeline † | 2.8 | 2.6 | 77.78 → 78.00 |
| **geometric mean without †** | | | **1.45 → 1.27** |

Fibonacci, spectral norm and the word count depend on it (N-body moved in one recording and not in the next: noise), the loops that call nothing (Mandelbrot, matrix product, fannkuch, CRC-32, Collatz, quicksort)
do not. About 0.2 of the geometric mean on V8 is therefore V8's inlining of the helpers the module calls, not the code the compiler emits — and V8's
decision is not stable: the identical `fibRec` (the bytes of the function are the same) ran in 60 ms when the module was the 7 KB of `Bench.fs` alone and in
36 ms in the 17 KB module of this benchmark (measured with the build of the module before packed bytes); with `--no-wasm-inlining` both took 60 ms. Read the Fibonacci row accordingly: 2.3× with inlining, 1.2× without.

## Size

What each compiled module weighs, as the server holds it, and compressed with gzip (level 9; what GitHub Pages sends) and brotli (quality 11):

| module | raw | gzip | brotli | brotli / raw |
|---|---:|---:|---:|---:|
| widget-editor/WidgetEditor.wasm | 149 KB | 55 KB | 45 KB | 30 % |
| graphics-gallery/SceneGallery.wasm | 137 KB | 54 KB | 44 KB | 32 % |
| full-dashboard/Dashboard.wasm | 46 KB | 15 KB | 12 KB | 27 % |
| indexeddb-crud/IndexedDbCrud.wasm | 31 KB | 12 KB | 9.8 KB | 31 % |
| todo/Todo.wasm | 28 KB | 11 KB | 9.1 KB | 33 % |
| worker-actor/WorkerActor.wasm | 26 KB | 10 KB | 8.6 KB | 34 % |
| realtime-pubsub/RealtimePubSub.wasm | 24 KB | 9.7 KB | 8.3 KB | 34 % |
| counter/Counter.wasm | 22 KB | 8.8 KB | 7.5 KB | 33 % |
| webgpu-basic/WebGpuBasic.wasm | 22 KB | 8.9 KB | 7.7 KB | 34 % |
| bench/Bench.wasm | 17 KB | 7.3 KB | 6.4 KB | 37 % |
| web-component/MyCounter.wasm | 13 KB | 5.2 KB | 4.6 KB | 35 % |
| canvas-mandelbrot/Mandelbrot.wasm | 12 KB | 4.8 KB | 4.2 KB | 34 % |

What a page loads at start — every same-origin request, no cache (the benchmark page also runs one kernel, so that its worker loads the module; the stylesheet from a CDN,
one request per page, is not counted):

| page | requests | raw | gzip | brotli |
|---|---:|---:|---:|---:|
| (landing page) | 34 | 403 KB | 135 KB | 112 KB |
| bench | 8 | 56 KB | 23 KB | 19 KB |
| canvas-mandelbrot | 3 | 19 KB | 7.2 KB | 6.1 KB |
| counter | 22 | 62 KB | 24 KB | 20 KB |
| full-dashboard | 22 | 86 KB | 31 KB | 25 KB |
| graphics-gallery | 21 | 178 KB | 70 KB | 58 KB |
| indexeddb-crud | 22 | 71 KB | 27 KB | 23 KB |
| realtime-pubsub | 22 | 64 KB | 25 KB | 21 KB |
| todo | 22 | 68 KB | 26 KB | 22 KB |
| web-component | 21 | 52 KB | 20 KB | 17 KB |
| webgpu-basic | 21 | 61 KB | 24 KB | 20 KB |
| widget-editor | 21 | 189 KB | 71 KB | 58 KB |
| worker-actor | 23 | 66 KB | 26 KB | 22 KB |

Reading it:

- Brotli is 27–37 % of the raw size, gzip 31–40 %. The two graphics modules (widget editor, scene gallery) are 44–45 KB brotli; every other module is 12 KB or less.
- For the small demos the JavaScript glue is as heavy as the module: the counter page is 62 KB raw, of which the module is 22 KB (the rest is the runtime's scripts and the page).
- The same thirteen kernels: `Bench.wasm` is 17.3 KB raw / 7.3 KB gzip / 6.4 KB brotli (it also carries the runtime library's start-up code), their JavaScript source
  `kernels.js` 11.3 KB raw / 4.1 KB gzip / 3.5 KB brotli, unminified. Not a like-for-like comparison — compiled code against source — but it is the order of magnitude.

## Network

The time to download a module and to compile it (`WebAssembly.compile`), by network profile and by what the server sends. Chromium emulates the network (DevTools: a
round trip of latency added to every request, the bandwidth capped); there is **no connection setup, no TLS, no server think time**. It is the shape of the cost,
not the line of a reader — the public page (`/benchmarks/`) has a button that measures the real line. Median of 3 runs, an unmeasured warm-up before; Chromium cache off.

Download + compile, gzip (median of 3 runs):

| module | on the wire | Localhost | Wi-Fi (30 Mbps, 20 ms) | 4G (9 Mbps, 85 ms) | Slow 4G (1.6 Mbps, 150 ms) | 3G (0.78 Mbps, 300 ms) |
|---|---:|---:|---:|---:|---:|---:|
| widget-editor/WidgetEditor.wasm | 55 KB | 6 ms | 44 ms | 143 ms | 438 ms | 890 ms |
| graphics-gallery/SceneGallery.wasm | 54 KB | 7 ms | 43 ms | 142 ms | 433 ms | 874 ms |
| full-dashboard/Dashboard.wasm | 15 KB | 5 ms | 31 ms | 107 ms | 238 ms | 475 ms |
| indexeddb-crud/IndexedDbCrud.wasm | 12 KB | 4 ms | 30 ms | 104 ms | 217 ms | 444 ms |
| todo/Todo.wasm | 11 KB | 4 ms | 29 ms | 104 ms | 209 ms | 428 ms |
| worker-actor/WorkerActor.wasm | 10 KB | 4 ms | 29 ms | 101 ms | 208 ms | 398 ms |
| realtime-pubsub/RealtimePubSub.wasm | 9.7 KB | 4 ms | 28 ms | 101 ms | 208 ms | 398 ms |
| counter/Counter.wasm | 8.8 KB | 5 ms | 28 ms | 101 ms | 201 ms | 412 ms |
| webgpu-basic/WebGpuBasic.wasm | 8.9 KB | 4 ms | 28 ms | 103 ms | 207 ms | 413 ms |
| bench/Bench.wasm | 7.3 KB | 5 ms | 28 ms | 99 ms | 201 ms | 398 ms |
| web-component/MyCounter.wasm | 5.2 KB | 5 ms | 26 ms | 97 ms | 178 ms | 369 ms |
| canvas-mandelbrot/Mandelbrot.wasm | 4.8 KB | 4 ms | 27 ms | 96 ms | 185 ms | 367 ms |

Download + compile, brotli (median of 3 runs):

| module | on the wire | Localhost | Wi-Fi (30 Mbps, 20 ms) | 4G (9 Mbps, 85 ms) | Slow 4G (1.6 Mbps, 150 ms) | 3G (0.78 Mbps, 300 ms) |
|---|---:|---:|---:|---:|---:|---:|
| widget-editor/WidgetEditor.wasm | 45 KB | 7 ms | 41 ms | 138 ms | 393 ms | 797 ms |
| graphics-gallery/SceneGallery.wasm | 44 KB | 7 ms | 41 ms | 140 ms | 387 ms | 782 ms |
| full-dashboard/Dashboard.wasm | 12 KB | 5 ms | 31 ms | 104 ms | 223 ms | 444 ms |
| indexeddb-crud/IndexedDbCrud.wasm | 9.8 KB | 5 ms | 28 ms | 102 ms | 207 ms | 412 ms |
| todo/Todo.wasm | 9.1 KB | 4 ms | 28 ms | 100 ms | 208 ms | 413 ms |
| worker-actor/WorkerActor.wasm | 8.6 KB | 7 ms | 28 ms | 100 ms | 194 ms | 397 ms |
| realtime-pubsub/RealtimePubSub.wasm | 8.3 KB | 5 ms | 29 ms | 100 ms | 197 ms | 398 ms |
| counter/Counter.wasm | 7.5 KB | 5 ms | 29 ms | 100 ms | 200 ms | 398 ms |
| webgpu-basic/WebGpuBasic.wasm | 7.7 KB | 4 ms | 28 ms | 101 ms | 201 ms | 399 ms |
| bench/Bench.wasm | 6.4 KB | 4 ms | 28 ms | 98 ms | 193 ms | 383 ms |
| web-component/MyCounter.wasm | 4.6 KB | 4 ms | 27 ms | 97 ms | 179 ms | 366 ms |
| canvas-mandelbrot/Mandelbrot.wasm | 4.2 KB | 5 ms | 27 ms | 96 ms | 172 ms | 338 ms |

The largest module (widget-editor/WidgetEditor.wasm) by encoding:

| encoding | on the wire | Localhost | Wi-Fi | 4G | Slow 4G | 3G |
|---|---:|---:|---:|---:|---:|---:|
| none | 149 KB | 5 ms | 69 ms | 231 ms | 925 ms | 1.89 s |
| gzip | 55 KB | 6 ms | 44 ms | 143 ms | 438 ms | 890 ms |
| brotli | 45 KB | 7 ms | 41 ms | 138 ms | 393 ms | 797 ms |

Environment: Chromium 153.0.8010.12, linux x64, Intel(R) Xeon(R) Processor @ 2.10GHz × 4; recorded 2026-11-14.

### The real host

GitHub Pages, asked from the VM that made the other measurements with `curl` (median of three requests after one warm-up; connect, TLS and the server's answer included), `https://fsharp-wasm.github.io/fsharp-wasm-runtime`:

| module | raw | sent as gzip | request, none / gzip / brotli asked |
|---|---:|---:|---|
| widget-editor/WidgetEditor.wasm | 149 KB | 55 KB | 125 / 119 / 122 ms |
| graphics-gallery/SceneGallery.wasm | 137 KB | 54 KB | 134 / 114 / 129 ms |
| full-dashboard/Dashboard.wasm | 46 KB | 15 KB | 118 / 108 / 120 ms |
| indexeddb-crud/IndexedDbCrud.wasm | 31 KB | 12 KB | 126 / 105 / 108 ms |
| todo/Todo.wasm | 28 KB | 11 KB | 105 / 121 / 105 ms |
| worker-actor/WorkerActor.wasm | 26 KB | 9.9 KB | 106 / 105 / 108 ms |
| realtime-pubsub/RealtimePubSub.wasm | 24 KB | 9.6 KB | 126 / 113 / 109 ms |
| counter/Counter.wasm | 22 KB | 8.7 KB | 120 / 109 / 112 ms |
| webgpu-basic/WebGpuBasic.wasm | 22 KB | 8.8 KB | 106 / 103 / 105 ms |
| bench/Bench.wasm | 17 KB | 7.2 KB | 200 / 123 / 120 ms |
| web-component/MyCounter.wasm | 13 KB | 5.2 KB | 105 / 101 / 111 ms |
| canvas-mandelbrot/Mandelbrot.wasm | 12 KB | 4.8 KB | 114 / 122 / 114 ms |

- **GitHub Pages sends gzip and no brotli**: asked for `br` it answers with the file as it is (the third figure in the last column is a request for an uncompressed module). The brotli rows above are what a
  host with brotli (Cloudflare Pages, Netlify, Vercel, a CDN in front) would give; for the widget editor that is 10 KB less on the wire.
- The gzip sizes the host sends are within 1 % of the level-9 sizes in the tables above (56 553 B against 56 673 B for the widget editor).
- From this VM every request takes 100–130 ms whatever the size, up to 153 KB: this link is fast, the time is the round trip. It says nothing about a reader's line (that is what the live
  button of the public page measures) — but it confirms that on a fast link nothing is gained by shrinking these modules further.

Reading it:

- **Latency, not size, dominates the small modules.** `Bench.wasm` (7.3 KB on the wire) takes 0.40 s on 3G, of which 0.30 s is the round trip; the 4.8 KB module takes 0.35 s.
  Below about 10 KB, making a module smaller buys almost nothing on a slow line; fewer requests would.
- **The large modules are bandwidth-bound**: the widget editor needs 1.89 s on 3G uncompressed, 0.89 s with gzip and 0.80 s with brotli, 0.44 / 0.40 s on Slow 4G.
  Compression is worth more than any code-size work on the module itself; serving brotli (a CDN in front of the site) saves another 10 %.
- **Compile time is not the cost**: `WebAssembly.compile` of the largest module takes 1–2 ms in this Chromium (the baseline tier compiles lazily; optimising happens while the
  code runs — see the first-call figures above).

Reproduce: `E2E_ROOT=site node tests/e2e/network.mjs` (writes `docs/benchmarks/size.json` and `network.json`), `node demos/bench/report-size.mjs` (these tables),
`node build/benchmarks.mjs` (copies the reports next to the public page `site/benchmarks/index.html`).

## What is not measured

- **The JS ↔ Wasm boundary and the host.** Every kernel is one call with an integer in and a number out. Real programs cross the
  boundary for the DOM, strings and callbacks; that cost is not in these numbers.
- **Startup of a large application**: the size, download and compile time of every module are recorded (above); the time to a first interaction of a whole page is not.
- **A real connection**: the network figures are emulated (no TLS, no connection setup); GitHub Pages' own compression and CDN were not measured.
- **Memory**: no peak heap, no GC pauses (the binary-trees row shows throughput only).
- **Other engines' Wasm GC maturity**: Chromium and Node (V8) and Bun (JavaScriptCore) are covered; Firefox (SpiderMonkey) and Safari
  are not, apart from running the page by hand.
- **Library collections**: no `Dictionary` / `ResizeArray` kernel, because the compiled module would need the collection library of
  fsharp-wasm-core, which this repository does not carry; the word-count kernel therefore writes its hash table out on both sides.
- **SIMD, threads, SharedArrayBuffer**.

## Findings for the compiler

Measured here, handed to [fsharp-wasm](https://github.com/fsharp-wasm/fsharp-wasm):

1. **`bool[]` and `byte[]` were `(array (mut i32))` — four bytes per element — and are packed now.** The sieve was memory-bound: JavaScript with an
   `Int32Array` needed the same 70 ms as the module, with a `Uint8Array` 46 ms (Node 24, n = 5 000 000). Fixed in fsharp-wasm `73f34dd`: `(array (mut i8))`, read with
   `array.get_u`, also for `ResizeArray<byte>`; the sieve takes 43–46 ms (68–70 before, two runs each, interleaved), the other kernels do not move
   ([`docs/benchmarks/packed-bytes-ab.json`](benchmarks/packed-bytes-ab.json)); the modules grow by 48–72 bytes. `WASMGC_PACKED_BYTES=0` brings the old layout back; `sbyte[]` stays 32-bit.
2. **`List.sortBy` was an insertion sort** (O(n²)): 20 000, 40 000 and 80 000 elements took 155, 433 and 1979 ms, and a string key did not compile. Fixed on the migration branch of
   fsharp-wasm, `130b2ca` (a stable merge sort, ordered by Fable's comparer: the same sizes take 10, 10 and 16 ms). `Array.sort`, `sortWith`,
   `sortInPlace`, `List.sort` and `List.sortWith` were already merge sorts — this document said otherwise until the numbers were measured. The
   quicksort kernel is written out on both sides because the point is the same algorithm in both languages, not the library's sort.
3. **The list pipeline is fused into one loop** — a real optimisation, and the reason for the † row.
4. **64-bit integers are native** (`i64`); JavaScript has doubles (or `BigInt`, which is far slower), which is most of the Collatz result.
5. **Small functions stay calls in the generated module — and inlining them does not pay.** V8's inliner decides the speed of calls into small helpers
   (`evalA`, the string helpers): the geometric mean on Node falls from 1.40 to 1.22 with `--no-wasm-inlining`. An inlining pass was written
   (fsharp-wasm `84a093c`, opt-in with `WASMGC_INLINE=1`) and measured, two runs each ([`docs/benchmarks/inliner-ab.json`](benchmarks/inliner-ab.json)):

   | | without the pass | with it |
   |---|---:|---:|
   | Node 24, V8's inliner on — geometric mean against JavaScript | 1.38 / 1.41 | 1.41 / 1.40 |
   | Node 24, `--no-wasm-inlining` | 1.25 / 1.24 | 1.28 / 1.28 (spectral norm 47 → 29 ms; V8's own inlining: 24 ms) |
   | Bun 1 (JavaScriptCore) | 1.00 / 0.99 | 1.00 / 1.01 |
   | first call of the module (median over the kernels, V8) | | 0.96 of without |
   | benchmark module | 17 685 bytes | 17 797 bytes |
   | scene gallery / widget editor | 140 071 / 153 025 bytes | 163 085 (+16 %) / 160 251 (+4.7 %) bytes |

   It pays only where the engine does not inline, and costs code everywhere, so it stays off by default; the first call is not faster either (the cost of the baseline
   tier is compiling the bodies, not the calls).
6. **The F# optimizer does not help.** `--optimize+` (typed-tree inlining, constant folding) on the kernels alone: module 75 bytes larger, the per-kernel times
   within noise (0.84–1.12; geometric mean against JavaScript 1.30 and 1.31 without, 1.27 and 1.29 with it, two runs each), and the runtime library's
   `[<Emit>]` members (`CeBuilder`) no longer compile. It stays off.
