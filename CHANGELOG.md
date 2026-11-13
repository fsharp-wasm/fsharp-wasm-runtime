# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Fixed
- Elmish views no longer rebuild the page on every message: the view is built off-document and merged into the live DOM
  (`morphChildrenOf` in `runtime/dom.js`), so a text field keeps focus, caret and selection while typing; children match
  by `data-key` (`key'`) or by position and tag. Event handlers live in per-element slots (`runtime/events.js`) that a
  render updates, and the handles of a merged view are released (they leaked on every render).
- Demo layout: shared `runtime/ui.css` — input and button of a row share height and centre line, action rows are spaced and
  centred, the dashboard's tab bar is no longer spread over the page (its `class'` was dropped by an explicit `yield`).

### Added
- GUI Builder demo (`demos/graphics-editor`): the F# project of fsharp-wasm-graphics (a visual editor on the `FSharp.Graphics`
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
