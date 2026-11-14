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
