# @fsharp-wasm/runtime

The JavaScript glue of [fsharp-wasm](https://fsharp-wasm.github.io): the small modules that a WebAssembly GC module compiled from F# imports to talk to the browser. `boot` loads and starts a module;
`dom`, `canvas`, `gfx` (a Canvas 2D host for the scene graph) and `gfx-gpu` (a WebGPU host) draw; `net`, `storage`, `indexeddb`, `workers`, `pubsub`, `pointer`, `events`, `clipboard`
and the rest are the platform APIs a program asks for.

```html
<script type="module">
  import { boot } from "https://cdn.jsdelivr.net/npm/@fsharp-wasm/runtime/runtime/boot.js";
  const instance = await boot({ wasm: new URL("App.wasm", import.meta.url), entry: "start" });
</script>
```

The F# side (typed `Browser.*` bindings, the Elmish-style loop) is in [fsharp-wasm-runtime](https://github.com/fsharp-wasm/fsharp-wasm-runtime). Try the compiler first: [Get Started](https://fsharp-wasm.github.io/docs/getting-started/).
