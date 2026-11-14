# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed
- The GUI builder demo is the **Widget Editor** of [fsharp-wasm-ide](https://github.com/fsharp-wasm/fsharp-wasm-ide) now
  (`demos/widget-editor`, `WidgetEditor.wasm`; build with `FSHARP_WASM_IDE_DIR`, or a checkout next to this repository); the old
  address `demos/graphics-editor/` forwards to it. `build.js` takes `coreDir` per external demo (where its checkout keeps
  FSharp.Wasm.Core). The scene gallery module is rebuilt on `FSharp.Graphics.Canvas` of fsharp-wasm-graphics. `serve()` of
  `tests/e2e/lib.mjs` takes an optional port.

### Fixed
- Elmish views no longer rebuild the page on every message: the view is built off-document and merged into the live DOM
  (`morphChildrenOf` in `runtime/dom.js`), so a text field keeps focus, caret and selection while typing; children match
  by `data-key` (`key'`) or by position and tag. Event handlers live in per-element slots (`runtime/events.js`) that a
  render updates, and the handles of a merged view are released (they leaked on every render).
- Demo layout: shared `runtime/ui.css` — input and button of a row share height and centre line, action rows are spaced and
  centred, the dashboard's tab bar is no longer spread over the page (its `class'` was dropped by an explicit `yield`).

### Added
- Public benchmarks page (`site/benchmarks/`, [live](https://fsharp-wasm.github.io/fsharp-wasm-runtime/benchmarks/)): the recorded speed reports of Node, Deno, Bun and
  Chromium (table, chart), the size of every module (raw, gzip, brotli) and of every page's first load, the time to download and compile every module under four
  emulated networks (Wi-Fi, 4G, Slow 4G, 3G) and three encodings, the real GitHub Pages host measured with curl (it sends gzip, no brotli), and a button that
  measures the reader's own connection. `tests/e2e/network.mjs` records size.json and network.json (the server of `tests/e2e/lib.mjs` can answer gzip or brotli,
  `E2E_ENCODING`), `demos/bench/report-size.mjs` prints the tables of `docs/benchmarks.md`, `build/benchmarks.mjs` publishes the reports and the manifest
  (`npm run site` runs it). The site test checks the page.
- Benchmarks, rebuilt (`demos/bench`, [`docs/benchmarks.md`](docs/benchmarks.md)): thirteen kernels (Mandelbrot, N-body, spectral norm, matrix
  product, sieve, fannkuch-redux, CRC-32, Collatz, Fibonacci, binary trees, word count, quicksort, list pipeline) in F# and in JavaScript
  with equal results (bit for bit, also for the doubles) before any time counts. The harness (`harness.js`, shared by the page, a worker, Node, Deno
  and Bun) takes a cold call, a warm-up, then samples in alternation until a time budget is spent, and reports median and interquartile range,
  environment, and the module's size, digest, compile and instantiate time. The page (`index.html`, `render.js`) runs it in a worker and draws a
  ranked log-scale bar chart (tooltips, keyboard focus, light and dark, phone width), the table and a JSON download; `run.mjs` is the same from a
  terminal (`--profile quick|standard`, `--only`, `--out`); `report.mjs` turns recorded reports into the tables of the docs.
  `tests/e2e/bench.mjs` drives the page in Chromium. Measured results for Node 24, Deno 2, Bun 1 and Chromium 153 are in `docs/benchmarks/`.
- Scene Gallery demo (`demos/graphics-gallery`): the thirteen scenes of `FSharp.Graphics.Scenes` (shapes, strokes, gradients,
  shadows, transforms, layout, clipping, layers, text, animation, interaction, a dashboard, a stress test) compiled to WasmGC
  from fsharp-wasm-graphics (`demo/FSharp.Graphics.Browser.Gallery`) and drawn onto one canvas. The module announces its
  scenes to the page (`announce` in `runtime/gfx.js` raises a `gfx` event on the canvas), which builds the tabs from them;
  ← → Home End and `#<scene>` links select a scene. It is embedded live on the landing page.
- `runtime/gfx.js`: colour matrices (`matrixBegin` / `matrixValue` / `matrixUse`, an SVG `feColorMatrix` per distinct matrix,
  computed in sRGB) for the grayscale / sepia / invert layers; the frame loop of `mount` pauses while the canvas is off screen.
  Known limit: layer alpha, blur and matrix apply to each drawn shape, not to the composed group (overlapping children of a
  group show through each other).
- GUI Builder demo (now `demos/widget-editor`): the F# project of fsharp-wasm-graphics (a visual editor on the `FSharp.Graphics`
  widget library) compiled to WasmGC and drawn onto one canvas through `runtime/gfx.js`, which also forwards pointer, wheel,
  key and size events to the module. The build compiles it when a checkout of fsharp-wasm-graphics is next to this
  repository (`FSHARP_WASM_GRAPHICS_DIR`), else the committed `site/` module is kept.
- Complete `Browser.*` module set (Core, Dom, Events, Canvas, Components, Net, PubSub, Storage, IndexedDb, Workers, Timing, Gpu, Css, Quotations)
- HTML DSL with computation expressions (F# 10)
- CSS DSL with active patterns
- Minimal Elmish MVU engine
- 9 demo applications (Counter, Todo, Mandelbrot, Web Component, Pub/Sub, IndexedDB, Worker, WebGPU, Dashboard)
- Unit tests (HTML, Elmish, CSS, PubSub)
- Playwright integration tests
- CI/CD pipelines (GitHub Actions)
- Build & release scripts
- Full documentation set
- PicoCSS-styled demo page
- Native Web Components support
