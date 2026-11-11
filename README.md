# fsharp-wasm-runtime

**F# in the browser, compiled to WebAssembly GC.** No JavaScript application code — a ~100-line host glue, an Elmish
runtime written in F#, and demos that run on a real compiler ([`fsharp-wasm`](https://github.com/aiqs4/fsharp-wasm)).

> Live showcase: `site/index.html` (GitHub Pages). Three apps — counter, todo list, Game of Life on a canvas — run as
> three separate WasmGC modules, and a live benchmark pits the same algorithms in F#→wasm against plain JavaScript on
> your machine.

```fsharp
type Msg = Increment | Decrement | Reset

let update msg model =
    match msg with
    | Increment -> model + 1
    | Decrement -> model - 1
    | Reset     -> 0

let view model =
    article [] [
        h1 [] [ text "Hello from F# on WasmGC" ]
        p  [] [ text ("Count: " + string model) ]
        button [ onClick Increment ] [ text "+" ]
    ]

let main () = run (simple 0 update view Reset)
```

## How it works

| piece | what | where |
|---|---|---|
| compiler | F# → WasmGC, .NET-exact semantics, differential-tested against .NET | [`fsharp-wasm`](https://github.com/aiqs4/fsharp-wasm) |
| `Browser.*` | `Core`, `Html`, `Elmish`, `Timing`, `Canvas` — F# source, compiled by the same compiler | `src/Browser/` |
| host | `mount(wasmUrl, element)`: instantiate, morph the DOM, delegate events, timers, canvas | `runtime/browser.js` |

WasmGC strings are opaque to JavaScript, so text crosses the boundary as UTF-16 code units through two integer imports
(`putc`, `commit`) and comes back through the exported `inboxPut`; no linear memory, no bridge generator. The view is a pure
function: the runtime serialises it to HTML with numbered event handlers (`data-ev`), the host morphs the live DOM to match
it, and a DOM event returns as `dispatch(id)` → message → `update` → `view`.

## Build and test

```bash
# needs: .NET 10 SDK, the patched F# compiler of fsharp-wasm, wasm-tools, node 22+, Playwright (Chromium)
export FSHARP_WASM=../fsharp-wasm            # checkout of aiqs4/fsharp-wasm
export FSHARP_COMPILER=<path to the patched fsc.dll>   # see fsharp-wasm/.github/actions/patched-fsc
./build.sh                                   # compiles demos/* → site/wasm/*.wasm, copies the glue to site/
node tests/e2e.mjs                           # real Chromium: renders, clicks, types, timers, canvas, benchmark
python3 -m http.server -d site 8080          # serve the showcase
```

`site/` is the complete static site (committed with the compiled `.wasm`, so GitHub Pages needs no compiler).

## Status

Implemented: Elmish loop, HTML DSL, events (click / input / pointer), timers, canvas, DOM morphing, e2e tests.
Specified, not implemented yet (see `docs/internal/`): fetch/WebSocket, storage/IndexedDB, workers + pub/sub, Web
Components, WebGPU, CSS DSL. They arrive as further `Browser.*` modules and host import groups, driven by what the compiler
supports (`Dictionary`, async, …) — see the roadmap in the compiler repository.
