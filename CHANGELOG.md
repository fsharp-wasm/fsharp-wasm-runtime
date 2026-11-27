# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- `demos/charts` has four tabs more, the science charts of fsharp-wasm-graphics (`ChartDemo.wasm` is 194 KB without its names now, measured 2026-11-27, with the data graph engine and the layout in it): a scatter coloured by value (400 000 points: a density map, markers and a colour bar when zoomed in), a **live histogram** of a column of a document that grows by 4 000 samples a second (the counts, the bars and the chart are calcs of the data graph; 200 000 samples are appended and counted in 8 ms), a field of 480 x 360 values with its contour lines and a colour bar, and the **data graph of a document as a diagram** (16 nodes, 42 links, laid out in 3 ms; panned and zoomed like a chart). `tests/e2e/charts.mjs` drives all eight tabs in Chromium.
- `Browser.Files.download fileName mimeType text` (`runtime/files.js`, also `@fsharp-wasm/runtime/files`): a text handed to the person as a file. The newsletter designer had a click handler for it in its page (`data-download`); a module calls this now. `tests/e2e/files.mjs` takes the download in Chromium: the name, the text as UTF-8, an empty mime type, an empty text.

### Fixed
- `gfx.js` told the module the wheel in the browser's raw pixels (about 100 to a notch, positive for down); the widgets take notches with positive Y up, as the desktop hosts give them, and move 36 px a notch, so a notch down moved a `ScrollView` or a grid by thousands of pixels and the wrong way. The host converts pixels, lines and pages to notches. Found by measuring the scrolling of the accounting grid.

### Added
- `demos/charts`: **Charts**, the chart components of fsharp-wasm-graphics (`ChartDemo.wasm`, 90 KB without its names): a line of ten million samples with spikes one sample wide, a stream of two series at 100 000 samples a second, a density map of five million points and two hundred thousand candles, drawn by the scene graph onto one canvas; zoom about the pointer, drag, a crosshair that reads the data, keys. The page shows what a frame costs and has the benchmark of the pyramid against reading every sample (one frame of a line of ten million samples: 123 to 150 µs, against 12.5 to 14.3 ms, measured 2026-11-26 in headless Chromium without a GPU). `tests/e2e/charts.mjs` drives it (zoom keeps the point under the pointer, a drag moves the data by the distance of the pointer, the spike is on the screen at the widest zoom, a stream grows and is followed, the pyramid and a pass over every sample agree exactly). The sixteenth demo.
- `demos/wasmos`: **WasmOS**, a small desktop that is Windows, macOS, Android or a Linux desktop from one F# program (`WasmOs.wasm`): windows that are dragged, resized, minimised, maximised and closed, a launcher, a menu, and five apps (Notes, Todo, Primes, Task Manager, Settings). The model is pure (`WasmOs.Core`, also run and tested under .NET) and names its effects as data; the module states the DOM and the class of the screen, and the CSS of the page is what makes each system look as it does. The F# project is in [fsharp-wasm-embedded](https://github.com/fsharp-wasm/fsharp-wasm-embedded) (build with `FSHARP_WASM_EMBEDDED_DIR`, or a checkout next to this repository); `tests/e2e/wasmos.mjs` drives it in Chromium (46 checks). The fifteenth demo.
- `Browser.Timing.localMinutes ()` (minutes since midnight in the browser's time zone, for a clock face) and `highNow ()` (`performance.now()`, for timing a computation: `now ()` has whole milliseconds).
- `Browser.Actors` (`runtime/actors.js`): processes as module Web Workers that run the same compiled module as the page. `spawn url onReady onReply onExit` starts one (each callback gets `performance.now()` last), `send` puts a job in its mailbox, `crash` makes it fail by itself (it says that it is exiting and closes), `kill` ends it from outside and nothing more is heard of it. The supervision is not here: it is `FSharp.Wasm.Actors` of fsharp-wasm-core, a pure state machine that the program drives with these effects.
- `demos/actor-orchestra`: an orchestra of four supervised workers for a Monte Carlo estimate of π in 48 chunks, for data scientists: the orchestrator is a pure `FSharp.Wasm.Actors.Pool` (one-for-one, 5 restarts in 10 s, a prefetch of 2 jobs per mailbox, at-least-once with idempotent completion), the GUI is the Elmish loop, the kernel `piHits` is exported by the module the page and every worker run. A worker can be killed or crashed while a run is under way; `tests/e2e/orchestra.mjs` does both and checks that the total of hits equals that of the same chunks computed in order (each counted exactly once), then runs again. The fourteenth demo.
- `runtime/gfx-gpu.js`: the drawing surface of fsharp-wasm-graphics on WebGPU, in place of `gfx.js` and with the same imports (rects and ellipses as signed distances, shadows, a glyph atlas for text, clips in the instance so a frame is one draw call, a texture that stays between frames for partial redraws); what it cannot draw is counted in `gpuStats().unsupported`. `ready(id, { present: false })` and `readPixels()` draw without presenting. `boot` takes `imports` to replace a glue module. `gfx.js` exports `attach` and `FONT`. `?renderer=webgpu` on the accounting demo. `tests/e2e/gpu.mjs` (every feature against Canvas 2D, pixel ratio 1 and 2) and `tests/e2e/gpu-grid.mjs` (the accounting grid on both hosts) run on SwiftShader; docs/webgpu.md says what was measured and what was not.
- `demos/accounting-grid`: the accounting grid of fsharp-wasm-accounting, a million journal lines as a pivot table that folds to its totals, turns and opens the lines behind a cell as a tab (`AccountingGrid.wasm`, 213 KB; build with `FSHARP_WASM_ACCOUNTING_DIR`, or a checkout next to this repository). The thirteenth demo.
- `gfx.js`: `now()`, a clock with fractions of a millisecond (`performance.now()`), for a module that measures what a message or a build costs.
- `Browser.Net.request method url body headers cb` (`runtime/net.js`): one HTTP request of any method, with headers and a body; the answer is the callback's `status` and `body` as text, and a status of 0 when no answer arrived at all (the network failed, CORS refused), so a failure is a value to match on. `get` and `post` are the short forms. `tests/e2e/net.mjs` drives it in Chromium without a compiled module (method, headers, body, an error status, no answer, JSON).
- `gfx.js`: a canvas module gets the editing shortcuts as keys of the toolkit: Ctrl/Cmd+Z arrives as `Undo`, Ctrl/Cmd+Y and Ctrl/Cmd+Shift+Z as `Redo` (the browser's default is prevented for these only; every other chord with Ctrl, Cmd or Alt stays the browser's).
- A sandboxed iframe and the page talk through `Browser.Events.onFrameMessage selector cb` (what the frame says, as JSON text, from that frame only, looked up at each message) and `postToFrame selector json`; `tests/e2e/frames.mjs` drives it in Chromium without a compiled module.
- SVG in the `Browser.Html` DSL: `createElement` makes `svg`, `g`, `path`, `circle`, `ellipse`, `line`, `polyline`, `polygon`, `rect` (and a few more) in the SVG namespace, so `el "svg" { … }` draws; the reconciler keeps such an element through a render and updates its attributes (`viewBox` keeps its case), and a class is set as the attribute (an SVG element's `className` is not a string). `tests/e2e/dom.mjs` drives it in Chromium without a compiled module.
- Dragging (`runtime/events.js`, `Browser.Events`, the `Browser.Html` DSL): `onPointerDown` captures the pointer on the element the page has and focuses it, so the moves, the
  release and a key (Escape) come to it wherever the pointer goes; `onPointerMove`, `onPointerUp`, `onPointerCancel`, `onKeyDown` (with the key), `measureSlots`
  (where the `data-slot` elements are now) and `swallowClick` (the browser clicks the pressed element after a drag, also after Escape has ended it: the page swallows that one click).
  `tests/e2e/events.mjs` drives it in Chromium without a compiled module.

### Changed
- `src/FSharpWasmRuntime.fsproj` takes the `Fable.Core` stubs of `FSharp.Wasm.Core` when `FSHARP_WASM_CORE_DIR` points at a checkout of fsharp-wasm-core, and keeps its own copy of `Interop.fs` otherwise. A program that uses the runtime and another library of the platform (the canvas client of the Ghost Todo: widgets, the protocol and `Browser.Net`) had two modules named `Fable.Core` and did not compile; the core's copy has everything of this one and the `Export` attribute.
- **`Browser.Net.fetchText`, `fetchJson` and `postJson` take a callback** (`fetchText url (fun text -> …)`). They returned a promise where the F# type promised a value (a module cannot wait for a promise), so no program could have used them, and `postJson` encoded its body a second time. `fetchJson` gives the callback a handle to the parsed value, the nil handle when the body is not JSON.
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
