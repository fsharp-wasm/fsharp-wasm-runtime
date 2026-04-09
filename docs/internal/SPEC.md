# FSharpWasmRuntime — Developer & User SPEC

> **Audience:** Contributors, early adopters, tooling authors.  
> **Status:** Experimental / pre-alpha.  The WasmGC backend (`fsharp-wasm` compiler) is in active development.

---

## 1. What is this library?

`FSharpWasmRuntime` is the **standard browser runtime for F# compiled to WebAssembly GC (WasmGC)**.  
It provides:

| Layer            | Namespace           | What it does |
|------------------|---------------------|--------------|
| Browser APIs     | `Browser.*`         | Typed F# wrappers around DOM, Canvas, Fetch, Storage, IndexedDB, WebGPU, Web Workers, PubSub, Clipboard, Cookies, Location, Pointer, Timing, CSS |
| HTML DSL         | `Browser.Html`      | CE-based virtual-DOM builder — Feliz style |
| Elmish MVU       | `Browser.Elmish`    | Init / Update / View loop |
| JS glue          | `runtime/*.js`      | Thin JavaScript shim modules imported by the WASM binary |

Everything is written in F#; the JS is minimal glue (< 10 LOC per module on average).

---

## 2. How to use?

### 2a. F# side — NuGet package

```xml
<!-- MyApp.fsproj -->
<ItemGroup>
  <PackageReference Include="FSharpWasmRuntime" Version="0.1.0-*" />
</ItemGroup>
```

Then in F#:
```fsharp
open Browser.Dom
open Browser.Html
open Browser.Elmish

// Full MVU app
let view model dispatch =
    div {
        h1 (sprintf "Count: %d" model)
        button { onClick (fun () -> dispatch +1); "+" }
        button { onClick (fun () -> dispatch -1); "−" }
    }

[<Export("start")>]
let start () =
    Browser.Elmish.Core.run "app" {
        Init   = fun () -> 0, Cmd.none
        Update = fun msg model -> model + msg, Cmd.none
        View   = view
    }
```

**Compile with fsharp-wasm:**
```bash
fable MyApp.fsproj --lang wasmgc -o dist/
# → dist/MyApp.wasm
```

### 2b. JS side — two options

#### Option A: CDN / static hosting (zero build tooling)

Copy the `runtime/` folder alongside your `.wasm` bundle and use `boot.js`:

```html
<script type="module">
  import { boot } from "./runtime/boot.js";
  boot({ wasm: new URL("MyApp.wasm", import.meta.url), entry: "start" });
</script>
```

#### Option B: npm package (recommended for projects with a bundler)

```bash
npm install @fsharp-wasm/runtime
```

```js
import { boot } from "@fsharp-wasm/runtime";
boot({ wasm: new URL("./MyApp.wasm", import.meta.url), entry: "start" });
```

The npm package ships the same `runtime/*.js` files and re-exports them from a unified entry point.

---

## 3. JS runtime module map

Every `runtime/*.js` file is a **Wasm import module**.  
The host (browser) loads these before instantiating the `.wasm` binary.

| Import module  | JS file             | Provides |
|----------------|---------------------|----------|
| `dom`          | `runtime/dom.js`    | `createElement`, `appendChild`, `setAttribute`, `addEventListener`, `clearElement`, … |
| `events`       | `runtime/events.js` | `addDocumentListener`, `preventDefault`, … |
| `canvas`       | `runtime/canvas.js` | `getContext2d`, `fillRect`, `drawImage`, … |
| `net`          | `runtime/net.js`    | `fetchText`, `fetchJson`, `fetchBytes`, … |
| `storage`      | `runtime/storage.js`| `localStorageGet`, `localStorageSet`, … |
| `indexeddb`    | `runtime/indexeddb.js` | `openDb`, `put`, `get`, `getAll`, `delete`, … |
| `workers`      | `runtime/workers.js`| `spawnWorker`, `postToWorker`, `onWorkerMessage`, … |
| `pubsub`       | `runtime/pubsub.js` | `subscribe`, `publish`, `unsubscribe` |
| `timing`       | `runtime/timing.js` | `requestAnimationFrame`, `setTimeout`, `performance_now` |
| `gpu`          | `runtime/gpu.js`    | `requestAdapter`, `createBuffer`, `createPipeline`, … |
| `components`   | `runtime/components.js` | `defineCustomElement`, `getAttr`, `setShadowHtml` |
| `clipboard`    | `runtime/clipboard.js`  | `readText`, `writeText` |
| `cookies`      | `runtime/cookies.js`    | `getCookie`, `setCookie`, `deleteCookie` |
| `location`     | `runtime/location.js`   | `getHref`, `pushState`, `onHashChange` |
| `pointer`      | `runtime/pointer.js`    | `getPointerPos`, `lockPointer` |
| `core`         | `runtime/core.js`       | `log`, `error`, `panic`, `memAlloc` |

`boot.js` assembles all of these into the single `importObject` that `WebAssembly.instantiateStreaming` requires.

---

## 4. Build pipeline

### `build/build.js` — the master build script

```
node build/build.js                 # compile all demos
node build/build.js --demo counter  # compile one demo (fast iteration)
```

Output layout:
```
dist/
  index.html                         ← gallery page
  demos/
    counter/
      index.html
      Counter.wasm
    canvas-mandelbrot/
      index.html
      Mandelbrot.wasm
    …
  runtime/                           ← copied from runtime/
    boot.js
    dom.js
    …
```

### `build/release.sh` — tag + publish

```bash
bash build/release.sh 0.1.0-alpha.1
```

Steps:
1. `node build/build.js` (full compile)
2. `dotnet pack src/FSharpWasmRuntime.fsproj -o nupkg/`
3. `npm pack tools/npm-package/ -o dist/`
4. `git tag v0.1.0-alpha.1 && git push --tags`
5. `dotnet nuget push nupkg/*.nupkg` (if `NUGET_API_KEY` set)
6. `npm publish dist/*.tgz` (if `NPM_TOKEN` set)

---

## 5. Bundler integration

### 5a. Vite plugin — `tools/vite-plugin/`

F# source compiled to a Vite plugin via **Fable (JS target)**:

```
tools/vite-plugin/
  src/
    VitePlugin.fs    ← F# plugin implementation
  VitePlugin.fsproj
  package.json
```

Install in a project:
```bash
npm install -D @fsharp-wasm/vite-plugin
```

`vite.config.ts`:
```ts
import fsWasm from "@fsharp-wasm/vite-plugin";

export default {
  plugins: [
    fsWasm({
      // Optional: path to your .fsproj (defaults to auto-detect)
      fsproj: "src/MyApp.fsproj",
      // Optional: override fable binary
      fable:  "/usr/local/bin/fable",
    })
  ]
}
```

What the plugin does:
1. **On `serve`**: watches `.fs` files → re-runs `fable` → hot-reloads the `.wasm` module
2. **On `build`**: runs `fable` → inlines the `.wasm` as a base64 data URL (or emits as asset)
3. **Always**: sets `Content-Type: application/wasm` for `.wasm` files (required by Chrome)
4. **Always**: copies `runtime/*.js` to `dist/runtime/` automatically

### 5b. Webpack plugin — `tools/webpack-plugin/`

Same idea, different plugin shape:

```ts
// webpack.config.js
const FsWasm = require("@fsharp-wasm/webpack-plugin");

module.exports = {
  plugins: [new FsWasm({ fsproj: "src/MyApp.fsproj" })]
};
```

---

## 6. NuGet package

The `.fsproj` sets standard NuGet metadata:

```xml
<PropertyGroup>
  <PackageId>FSharpWasmRuntime</PackageId>
  <Version>0.1.0-experimental</Version>
  <Authors>FSharpWasmRuntime contributors</Authors>
  <Description>F# browser runtime for WebAssembly GC — typed DOM, Canvas, Fetch, Elmish MVU, HTML DSL and more.</Description>
  <PackageTags>fsharp;wasm;wasmgc;browser;elmish</PackageTags>
  <RepositoryUrl>https://github.com/your-org/fsharp-wasm-runtime</RepositoryUrl>
  <PackageLicenseExpression>MIT</PackageLicenseExpression>
</PropertyGroup>
```

Build and push:
```bash
dotnet pack src/FSharpWasmRuntime.fsproj -o nupkg/
dotnet nuget push nupkg/FSharpWasmRuntime.0.1.0-experimental.nupkg \
  --api-key $NUGET_API_KEY \
  --source https://api.nuget.org/v3/index.json
```

---

## 7. npm package — `@fsharp-wasm/runtime`

The npm package contains only the `runtime/*.js` glue files and `boot.js`.  It has no build step — it is plain ES-module JavaScript.

```
tools/npm-package/
  package.json          ← { "name": "@fsharp-wasm/runtime", "type": "module", … }
  index.js              ← re-exports boot + all runtime modules
  runtime/              ← symlink or copy of ../../runtime/
```

---

## 8. CI/CD pipeline (GitHub Actions)

### `.github/workflows/ci.yml`

```yaml
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v3
        with: { dotnet-version: "10.x" }
      - uses: actions/setup-node@v4
        with: { node-version: "22" }
      - run: npm ci
      - run: node build/build.js
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test
```

### `.github/workflows/release.yml`

```yaml
on:
  push:
    tags: ["v*"]
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v3
        with: { dotnet-version: "10.x" }
      - uses: actions/setup-node@v4
        with: { node-version: "22" }
      - run: bash build/release.sh ${GITHUB_REF_NAME#v}
        env:
          NUGET_API_KEY: ${{ secrets.NUGET_API_KEY }}
          NPM_TOKEN:     ${{ secrets.NPM_TOKEN }}
```

---

## 9. Testing strategy

| Layer         | Tool        | Location                        | What's tested |
|---------------|-------------|---------------------------------|---------------|
| F# unit tests | `dotnet test`| `tests/Unit/*.fs`               | Elmish reducers, Html DSL output, CSS helpers, PubSub |
| Integration   | Playwright  | `tests/Integration/*.spec.ts`   | Each demo page loads, WASM boots, UI elements exist |
| Smoke test    | Playwright  | `tests/Integration/demos.spec.ts`| Gallery page renders all 9 cards |

Run all tests locally:
```bash
node build/build.js            # compile demos first
npx serve dist -p 4000 &       # serve (or use webServer in playwright.config.ts)
npx playwright test
dotnet test tests/
```

---

## 10. Directory structure reference

```
fsharp-wasm-runtime/
├── src/
│   ├── FSharpWasmRuntime.fsproj   ← single library project (NuGet package)
│   └── Browser/
│       ├── Core.fs                ← Interop primitives, JSValue
│       ├── Dom.fs
│       ├── Canvas.fs
│       ├── Net.fs
│       ├── Storage.fs
│       ├── IndexedDb.fs
│       ├── Workers.fs
│       ├── PubSub.fs
│       ├── Timing.fs
│       ├── Gpu.fs
│       ├── Components.fs
│       ├── Clipboard.fs
│       ├── Cookies.fs
│       ├── Location.fs
│       ├── Pointer.fs
│       ├── Events.fs
│       └── Css.fs
│   └── Html/
│       ├── Elements.fs            ← Node / Attr discriminated unions
│       ├── Attrs.fs               ← typed attr helpers
│       ├── Events.fs              ← typed event helpers
│       └── CeBuilder.fs           ← ElementBuilder + standalone functions (public API)
│   └── Elmish/
│       └── Core.fs                ← Program<'M,'M>, run, Cmd
├── runtime/
│   ├── boot.js                    ← shared WASM loader
│   ├── core.js
│   ├── dom.js
│   ├── canvas.js
│   └── …                          ← one file per import module
├── demos/
│   └── <name>/
│       ├── <Name>.fs              ← demo source
│       ├── <Name>.fsproj          ← references FSharpWasmRuntime
│       └── index.html             ← demo page
├── tools/
│   ├── vite-plugin/               ← @fsharp-wasm/vite-plugin
│   └── webpack-plugin/            ← @fsharp-wasm/webpack-plugin
│   └── npm-package/               ← @fsharp-wasm/runtime
├── tests/
│   ├── Unit/                      ← dotnet test (xUnit)
│   └── Integration/               ← Playwright
├── build/
│   ├── build.js                   ← Node build script
│   └── release.sh                 ← tag + publish script
└── docs/
    ├── GettingStarted.md
    ├── BrowserApi.md
    ├── Dsl.md
    └── internal/
        └── SPEC.md                ← this file
```
