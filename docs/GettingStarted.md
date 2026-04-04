# Getting Started

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download) (LTS)
- [Node.js 20+](https://nodejs.org/)
- [fsharp-wasm compiler](https://github.com/fsharp-wasm/fsharp-wasm/releases/tag/v0.1-experimental)

## Installation

```bash
# Clone the repository
git clone https://github.com/fsharp-wasm/fsharp-wasm-runtime.git
cd fsharp-wasm-runtime

# Install Node.js dependencies
npm install
```

## Building

The build process has two parts:

### 1. Copy JS glue modules

```bash
npm run build:glue
```

This copies the thin JS runtime modules from `runtime/` to `dist/`.

### 2. Compile F# to WasmGC

```bash
npm run build:wasm
```

This requires the [fsharp-wasm compiler](https://github.com/fsharp-wasm/fsharp-wasm/releases/tag/v0.1-experimental). Download the patched compiler and ensure `dotnet fable` is available with WasmGC support.

### Full build

```bash
npm run build
```

## Running Demos

```bash
npm run serve
# Open http://localhost:8080
```

## Project Structure

```
runtime/     → JS glue modules (core, dom, events, canvas, etc.)
src/Browser/ → F# Browser.* API modules
src/Html/    → HTML DSL (Elements, Attrs, CE Builder)
src/Elmish/  → Minimal MVU engine
demos/       → Demo applications
tests/       → Unit + Integration tests
```

## Your First App

```fsharp
module MyApp

open Browser.Elmish.Core
open Browser.Html.Elements
open Browser.Html.Attrs

type Model = { Name: string }
type Msg = NameChanged of string

let init () = { Name = "World" }, Cmd.none

let update msg model =
    match msg with
    | NameChanged s -> { model with Name = s }, Cmd.none

let view model dispatch =
    div [] [
        h1 [] [text (sprintf "Hello, %s!" model.Name)]
        input [
            type_ "text"
            value_ model.Name
            onInput_ (fun s -> dispatch (NameChanged s))
        ]
    ]

let start () =
    run "app" { Init = init; Update = update; View = view }
```
