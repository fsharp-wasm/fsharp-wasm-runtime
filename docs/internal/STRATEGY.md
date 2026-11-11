# fsharp-wasm-runtime — Internal Strategy

> Working document. Not for public docs. Captures architectural decisions,
> open questions, and the reasoning behind them.
> Last updated: April 2026

---

## What this repo is (and isn't)

**fsharp-wasm** (the compiler repo) = the tool. It takes F# and produces `.wasm`.
**fsharp-wasm-runtime** (this repo) = what you build with the tool. It is a set of
production-quality F# libraries that bind to browser APIs, plus a thin JS glue layer.

The two repos are independent. A user could use the compiler for non-browser Wasm targets
(Node.js, Wasmtime, WasmEdge) without ever touching this repo.

---

## The fundamental constraint

**WASM cannot access the DOM directly.** This is a WASM spec property that all browser
vendors have agreed on. It will not change before the WASM Interface Types / WIT for Web
proposal lands — which is at minimum 2–3 years away.

Architecture is therefore always:

```
F# source
    ↓  fsharp-wasm compiler
.wasm binary
    ↓  browser WebAssembly.instantiate()
JS glue layer          ← unavoidable, keep it thin
    ↓
DOM / Web APIs
```

The JS glue layer is not a failure. Our job is to make it invisible to F# authors.
Every function in `runtime/*.js` corresponds 1:1 to a `[<Import>]` binding in `src/Browser/*.fs`.

---

## End-user workflow (complete journey)

This is what we are optimising for. Every tooling decision should serve this.

### Step 1 — Install prerequisites

```bash
# Install the fsharp-wasm compiler once
bash <(curl -sfL https://raw.githubusercontent.com/fsharp-wasm/fsharp-wasm-runtime/main/prerequisites.sh)
```

### Step 2 — Create project

```bash
dotnet new console -lang F# -n MyApp
cd MyApp
```

Add to `MyApp.fsproj`:
```xml
<PackageReference Include="FSharp.Wasm.Browser" Version="0.1.*" />
```

### Step 3 — Write F#

```fsharp
open Browser.Dom
open Browser.Html.Elements

[<EntryPoint>]
let main () =
    let app = getElementById "app"
    setInnerHtml app "<h1>Hello from F# WasmGC</h1>"
    0
```

### Step 4 — Compile

```bash
fable MyApp.fsproj --lang wasmgc -o dist/
```

Output: `dist/MyApp.wasm`

### Step 5 — Wire up the web app

Two paths depending on their build tooling:

**A) Vite (recommended):**
```bash
npm install @fsharp-wasm/vite-plugin
```
```js
// vite.config.js
import { fsharpWasm } from '@fsharp-wasm/vite-plugin'
export default { plugins: [fsharpWasm()] }
```
The plugin handles: loading the correct runtime JS modules, WASM instantiation,
calling the F# entry point, tree-shaking unused glue.

**B) Vanilla (no bundler):**
```html
<script type="module">
  import { init } from 'https://cdn.jsdelivr.net/npm/@fsharp-wasm/runtime/core.js'
  await init('./dist/MyApp.wasm')
</script>
```

---

## Package publishing strategy

### NuGet — `FSharp.Wasm.Browser`

Contains:
- `src/Browser/*.fs` — type stubs with `[<Import>]` attributes (compile-time only)
- `src/Html/*.fs` — HTML computation expression DSL
- `src/Elmish/Core.fs` — MVU engine
- The `Interop.fs` stub (see below)
- **Does NOT contain compiled .wasm** — the F# source compiles into the user's own .wasm

This means the NuGet package is extremely lightweight — just F# source files.
No runtime binary, no native dependency, nothing platform-specific.

Publish on: nuget.org, triggered by `v*` GitHub tag on this repo.

### npm — `@fsharp-wasm/runtime`

Contains:
- `runtime/*.js` — the JS glue ES modules

These are the actual implementations of all the browser API calls.
Tree-shaking works because they are ES modules with named exports — bundlers
(Rollup/Vite/esbuild) drop anything not imported.

The F# `[<Import("funcName","dom")>]` bindings reference the module names that
match what the user configures in their Wasm instantiation (e.g. `{ dom: runtimeDom }`).

Publish on: npmjs.com, triggered by same `v*` tag.

### npm — `@fsharp-wasm/vite-plugin` (future, high value)

A Vite plugin that:
1. Detects `.wasm` imports in source
2. Compiles them from F# on demand (optional, needs `fable` on PATH)
3. Auto-imports exactly the `runtime/*.js` modules that the .wasm imports
4. Wires up `WebAssembly.instantiate()` with the right import object
5. Provides HMR (hot module reload) during development via Fable watch

This is the "batteries included" experience. When this exists, step 4+5 above collapses to:

```js
import MyApp from './MyApp.fsproj?wasm'
await MyApp.run()
```

**Status:** Not yet. Build the npm package first. The Vite plugin is the premium DX on top.

---

## Fable.Core / Interop.fs strategy

**Do not add a NuGet dependency on `Fable.Core`.**

Reason: Fable.Core is the standard Fable package targeting JS. Adding it would pull in
JS-specific symbols (`JS.Undefined`, `Emit`, `importAll`, etc.) that don't apply to WasmGC.
It also couples us to the standard Fable release cycle.

**Instead:** Copy `fable-library-wasmgc/Interop.fs` from the compiler repo into this repo
as `src/Browser/Interop.fs`. It is 20 lines. It defines only what we need:
- `ImportAttribute` — recognized by fsharp-wasm as a Wasm import declaration
- `nativeOnly` — body placeholder (never compiled, replaced by import)

The compiler recognizes `ImportAttribute` by its fully-qualified name `Fable.Core.ImportAttribute`,
so it works identically to the NuGet version.

This file must be the **first** `<Compile>` entry in `FSharpWasmRuntime.fsproj`.

---

## Tree-shaking strategy

### F# side (compiler)
The fsharp-wasm compiler already does:
- Dead code elimination (P1 optimization pass)
- Only functions reachable from exports end up in the binary
- BCL replacements are inline — unused BCL functions don't appear in output

Nothing to do here. It works.

### JS side (bundler)
`runtime/*.js` are ES modules with named exports. Any ES module bundler (Vite, Rollup,
esbuild, Webpack 5) will tree-shake them.

The runtime modules use only standard browser APIs (no npm deps, no Lodash, no jQuery).
Total unminified size of all runtime JS: currently ~400 LOC. A user using only Dom + Elmish
will pull in maybe 60 lines of actual glue.

**Important:** Do NOT bundle the runtime JS into a single file in this repo. Keep them
as separate ES modules. Let the user's bundler do the tree-shaking.

---

## Bundling / Vite / pre-bundling — our stance

**We do not pre-bundle the JS glue in this repo.**

Reasoning:
- ES modules + user's bundler = correct tree-shaking
- Pre-bundling forces our opinions on the user's toolchain
- Minification is their bundler's job

What we DO provide:
- The npm package with clean ES modules
- The Vite plugin (eventually) for the integrated experience
- A reference `vite.config.js` in the demo showing how to wire things up

---

## Wasm instantiation — our responsibility

The user needs to call `WebAssembly.instantiate(bytes, importObject)`.
The `importObject` must match the `[<Import>]` module names used in the F# source.

In this repo every `[<Import>]` uses module names like `"dom"`, `"canvas"`, `"net"` etc.
that correspond to files in `runtime/`.

The user's minimal bootstrap is:

```js
import * as dom from '@fsharp-wasm/runtime/dom.js'
import * as events from '@fsharp-wasm/runtime/events.js'

const bytes = await fetch('./MyApp.wasm').then(r => r.arrayBuffer())
const { instance } = await WebAssembly.instantiate(bytes, {
    dom,
    events,
    // ... only the modules your app actually imports
})
instance.exports.main()
```

The Vite plugin will automate this by reading the Wasm import section and generating
the import object automatically. Until the plugin exists, document this clearly.

---

## What we do NOT do

| Temptation | Why not |
|---|---|
| React / Feliz bindings | React targets JS, not WasmGC. Different runtime model. |
| Virtual DOM in F# | Needs seq/IEnumerable. Not in compiler yet (Sprint 24+). |
| DaisyUI / Tailwind F# bindings | CSS classes don't need F# bindings. Just use the class name strings. |
| Importing standard `Fable.Elmish` | Targets JS. Write our own 150-line version. |
| `Fable.Core` NuGet dep | JS-centric. Write our own Interop.fs instead. |
| Pre-bundling / minifying JS here | User's bundler's job. We ship ES modules. |
| Async / tasks in F# | JSPI (JavaScript Promise Integration) not stable yet. |
| SSR | Needs Node + server. Separate concern. |

---

## Build pipeline for this repo

### CI (every push)
1. `bash prerequisites.sh` — install fsharp-wasm fable binary
2. `npm install`
3. `npm run build` — compile F# → .wasm + copy JS glue → dist/
4. `npm test` — run unit tests (compiled F# test runner)
5. `npx playwright install && npm run test:e2e` — integration tests against dist/

### Release (on `v*` tag)
1. Run CI steps
2. `dotnet pack` → publish `FSharp.Wasm.Browser.nupkg` to nuget.org
3. `npm publish` → publish `@fsharp-wasm/runtime` to npmjs.com
4. Create GitHub Release with .nupkg and .tgz attached

---

## Open questions / future decisions

1. **Module name convention:** Should `[<Import("getElement","dom")>]` use short names
   like `"dom"` or fully qualified like `"@fsharp-wasm/runtime/dom"`? Short names are
   simpler for demos; qualified names work out-of-the-box with ESM without a bundler.
   Current choice: short names, configured at instantiation time. Revisit for Vite plugin.

2. **NuGet package name:** `FSharp.Wasm.Browser` vs `Browser.FSharp.Wasm` vs
   `FSharpWasm.Browser`. Align with the ecosystem convention once we have one.

3. **Semantic versioning:** Lock 0.1.x to compiler Sprint 19–23. Bump to 0.2.x when
   interface dispatch lands (vtables / generic Map+Set support). Hit 1.0 when the Vite
   plugin is stable and the full workflow is documented.

4. **fable-library-wasmgc in this repo or the compiler?** Currently the BCL lives in
   the compiler repo. Long-term the standard library (List, Array, Map, Set implementations
   in F#) might be its own NuGet package referenced by both repos. Not urgent yet.

5. **CDN hosting:** Once the npm package is published, jsDelivr and unpkg expose it
   automatically. This enables the vanilla (no-bundler) workflow without any extra work.
