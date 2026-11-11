# fsharp-wasm-runtime

The official browser runtime for F# compiled to WebAssembly GC (.NET 10 / F# 10).

Write **100% F#** browser applications with clean `Browser.*` APIs.
No JavaScript application code. Thin, modular JS glue only.

```fsharp
open Browser.Elmish.Core
open Browser.Html

let view model dispatch =
    article {
        class' "counter-demo"
        h2 "Counter"
        el "p" { class' "count-display"; string model.Count }
        div {
            button { onClick (fun () -> dispatch Decrement); "−" }
            button { onClick (fun () -> dispatch Increment); "+" }
        }
    }

let start () = run "counter-root" { Init = init; Update = update; View = view }
```

**Live:** every demo runs in the browser, compiled from F# by [fsharp-wasm](https://github.com/aiqs4/fsharp-wasm) —
see the [showcase site](#showcase-site). ♥ [Sponsor the project](https://github.com/sponsors/aiqs4).

## Features

- **`Browser.*` API** — DOM, events, canvas, Web Components, fetch/WebSocket, storage, IndexedDB, workers, pub/sub, timers, WebGPU, CSS
- **HTML builder** — `div { class' "card"; h1 "Title"; button { onClick …; "+" } }`, plus active patterns for CSS
- **Elmish loop** — model–update–view with commands, ~60 lines of F#
- **Native Web Components** defined entirely in F#
- **No JavaScript application code** — ~600 lines of glue in total, one small file per browser API
- **Tested in a real browser** — each of the ten demos is driven by Playwright/Chromium (`npm run test:e2e`)

## Architecture

```
F# source
    ↓  fsharp-wasm (F# → WasmGC)
.wasm module            ← a JS import is an F# function marked `nativeOnly`
    ↓  instantiate with { builtins: ["js-string"] }
runtime/*.js            ← glue: DOM, canvas, storage, workers, …
    ↓
DOM / Browser APIs
```

WebAssembly cannot reach the DOM, so a thin JS layer is unavoidable; this runtime makes it **small, typed and invisible**
to the F# author. The compiler marshals what is not a plain number:

| F# at the JS boundary | in JavaScript |
|---|---|
| `string` argument / result | a native JS string (the engine's [string builtins](https://github.com/WebAssembly/js-string-builtins)); a JS `null` arrives as `""` |
| `string array` result | a JS array, read element-wise |
| `int` / `float` / `bool` / `Handle` | a number |
| function argument, e.g. `cb: string -> unit` | a JS function; calling it re-enters the module through the `__cb` export |
| callback parameters | `int`, `bool`, `float`, `string`, `string array`; up to four |

Everything asynchronous (IndexedDB, workers, timers, pub/sub) therefore takes a callback — in an Elmish program the
callback dispatches a message. A module cannot block on a JS promise.

> **Browser support:** WebAssembly GC and the JS String Builtins — Chrome / Edge 130+, Firefox 134+. (To my knowledge
> Safari has not shipped the string builtins yet.)

## Quick Start

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 22+](https://nodejs.org/)
- **fsharp-wasm compiler** — our patched Fable CLI with WasmGC backend

> **Important:** this is _not_ the standard `fable` dotnet global tool from NuGet.
> The upstream Fable 4.x only targets JavaScript. You need the compiler from this org.

#### The compiler

Clone [fsharp-wasm](https://github.com/aiqs4/fsharp-wasm), build it (see its README) and point the runtime at it:

```bash
export FSHARP_WASM_DIR=/path/to/fsharp-wasm      # builds and runs tools/FSharp.Wasm.Cli
# or, with a prebuilt CLI:
export FSHARP_WASM_CLI=/path/to/FSharp.Wasm.Cli.dll
export FSHARP_WASM_LIBRARY=/path/to/fsharp-wasm/fable-library-wasmgc
```

### Setup

```bash
git clone https://github.com/aiqs4/fsharp-wasm-runtime.git
cd fsharp-wasm-runtime
npm install
```

### Build

```bash
npm run build                      # every demo → dist/
node build/build.js --demo todo    # one demo
```

### Run demos

```bash
npx serve dist -l 8080             # open http://localhost:8080
```

### Test

```bash
npm run test:e2e                   # drives every demo and the landing page in Chromium (Playwright)
node tests/e2e/demos.mjs counter   # one demo
```

### Showcase site

`site/` is what GitHub Pages serves: a landing page plus the **prebuilt** demos, so deploying needs no compiler.
After changing F# or glue code, refresh it:

```bash
npm run site                       # build all demos, copy them (wasm + pages + glue) into site/
```

## Project Structure

```
fsharp-wasm-runtime/
├── runtime/          # JS glue, one ES module per browser API (+ boot.js: imports, instantiate)
├── src/
│   ├── Browser/      # Browser.* API (one F# module per area)
│   ├── Html/         # HTML builder (Elements, Attrs, CE builder)
│   └── Elmish/       # Model–update–view loop
├── demos/            # 10 demo applications (F# project + page each)
├── tests/
│   ├── e2e/          # Chromium end-to-end tests (demos + landing page)
│   ├── Integration/  # Playwright spec (npx playwright test)
│   └── Unit/
├── build/            # build.js (demos → dist/), site.mjs (dist/ → site/)
├── site/             # the deployable showcase: landing page + prebuilt demos
├── docs/
└── index.html        # demo gallery
```

## Browser.* Modules

| Module | Description |
|--------|-------------|
| `Browser.Core` | Handle type, constants |
| `Browser.Dom` | Element creation, manipulation, queries |
| `Browser.Events` | Event listeners (click, input, etc.) |
| `Browser.Canvas` | Canvas 2D drawing API |
| `Browser.Components` | Native Web Components |
| `Browser.Net` | Fetch API + WebSocket |
| `Browser.PubSub` | Local event bus (pub/sub messaging) |
| `Browser.Storage` | localStorage / sessionStorage |
| `Browser.IndexedDb` | IndexedDB wrapper |
| `Browser.Workers` | Web Workers |
| `Browser.Timing` | setTimeout, setInterval, rAF |
| `Browser.Gpu` | WebGPU (basic) |
| `Browser.Css` | CSS DSL with active patterns |
| `Browser.Quotations` | Meta-programming with quotations |

## Demos

| Demo | Description |
|------|-------------|
| Counter | Classic Elmish MVU counter |
| Todo | Todo list with input, toggle, remove |
| Canvas Mandelbrot | Pure F# computation → Canvas, next to a JavaScript twin — same picture |
| Web Component | Native `<fs-counter>` custom element |
| Realtime Pub/Sub | A message bus wired from F# |
| IndexedDB CRUD | Persistent key-value storage |
| Worker Actor | Web Worker message passing |
| WebGPU Basic | GPU availability check + canvas |
| Benchmark | Four kernels, F# vs JavaScript, timed in your browser |
| Full Dashboard | All features combined |

## Documentation

- [Getting Started](docs/GettingStarted.md)
- [Browser API Reference](docs/BrowserApi.md)
- [DSL Guide](docs/Dsl.md)
- [Advanced Topics](docs/Advanced.md)
- [Contributing](docs/Contributing.md)
- [Roadmap](docs/Roadmap.md)

## License

MIT
