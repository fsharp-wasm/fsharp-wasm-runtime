# fsharp-wasm-runtime

The official browser runtime for F# compiled to WebAssembly GC (.NET 10 / F# 10).

Write **100% F#** browser applications with clean `Browser.*` APIs.
No JavaScript application code. Thin, modular JS glue only.

```fsharp
open Browser.Dom
open Browser.Html.Elements
open Browser.Html.Attrs
open Browser.Elmish.Core

let view model dispatch =
    html {
        article [class_ "card"] [
            h1 [] [text "Hello from pure F# + WasmGC"]
            button [onClick_ (fun () -> dispatch Increment)] [text "+"]
        ]
    }
```

## Features

- **Full `Browser.*` BCL-style API** — DOM, Canvas, Web Components, Fetch, WebSocket, Storage, IndexedDB, Workers, PubSub, Timing, WebGPU, CSS
- **Elegant F# 10 computation expressions** + active patterns for HTML/CSS/Elmish
- **Native Web Components** defined entirely in F#
- **PicoCSS integration** — classless by default, semantic HTML styled automatically
- **Minimal Elmish MVU** — ~150 lines, pure F#, no dependencies
- **Production-ready build & release pipeline**
- **Comprehensive tests** (unit + Playwright integration)

## Architecture

```
F# source code
    ↓ (compiled by fsharp-wasm compiler)
.wasm binary (WasmGC)
    ↓ (instantiated by browser)
JS glue layer (< 400 LOC)
    ↓
DOM / Browser APIs
```

WASM cannot directly access the DOM — this is a fundamental constraint of the WASM standard.
The JS glue layer is the correct architecture. This runtime makes it **thin, typed, and invisible** to the F# author.

## Quick Start

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 22+](https://nodejs.org/)
- **fsharp-wasm compiler** — our patched Fable CLI with WasmGC backend

> **Important:** this is _not_ the standard `fable` dotnet global tool from NuGet.
> The upstream Fable 4.x only targets JavaScript. You need the compiler from this org.

#### Install fsharp-wasm compiler

**Linux / macOS — one-liner:**

```bash
bash prerequisites.sh
```

Then follow the printed instruction to add `~/.local/bin` to your `PATH` (if not already there).

**Windows:**

Download `fsharp-wasm-win-x64.zip` from the [releases page](https://github.com/fsharp-wasm/fsharp-wasm/releases), extract it, and add the folder to your `PATH`.

Verify the install:

```bash
fable --version   # should print 5.x.x
```

### Setup

```bash
git clone https://github.com/fsharp-wasm/fsharp-wasm-runtime.git
cd fsharp-wasm-runtime
npm install
```

### Build

```bash
npm run build
```

### Run demos

```bash
npm run serve
# Open http://localhost:8080
```

### Test

```bash
npm test           # Unit tests
npm run test:e2e   # Playwright integration tests
```

## Project Structure

```
fsharp-wasm-runtime/
├── runtime/          # JS glue (< 400 LOC, ES modules)
├── src/
│   ├── Browser/      # Full Browser.* API (14 modules)
│   ├── Html/         # HTML DSL (Elements, Attrs, CE Builder)
│   └── Elmish/       # Minimal MVU engine
├── demos/            # 9 demo applications
├── tests/            # Unit + Integration tests
├── build/            # Build & release scripts
├── docs/             # Documentation
└── index.html        # Live demo page (PicoCSS)
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
| Canvas Mandelbrot | Pure F# computation → Canvas |
| Web Component | Native `<fs-counter>` custom element |
| Realtime Pub/Sub | In-process messaging demo |
| IndexedDB CRUD | Persistent key-value storage |
| Worker Actor | Web Worker message passing |
| WebGPU Basic | GPU availability check + canvas |
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
