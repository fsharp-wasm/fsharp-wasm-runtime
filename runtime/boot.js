/**
 * boot.js — shared WASM loader for all fsharp-wasm-runtime demos.
 *
 * Usage (from a demo's index.html):
 *
 *   import { boot } from "../../runtime/boot.js";
 *   boot({ wasm: new URL("Counter.wasm", import.meta.url), entry: "start" });
 *
 * This module:
 *   1. Builds the full import object from all runtime JS glue modules.
 *   2. Instantiates the WASM module via WebAssembly.instantiateStreaming.
 *   3. Calls the named export (e.g. "start", "register") to kick off the demo.
 *   4. Updates #status (if present) with load state.
 */

import * as coreModule      from "./core.js";
import * as domModule       from "./dom.js";
import * as eventsModule    from "./events.js";
import * as canvasModule    from "./canvas.js";
import * as netModule       from "./net.js";
import * as storageModule   from "./storage.js";
import * as cookiesModule   from "./cookies.js";
import * as pubsubModule    from "./pubsub.js";
import * as workersModule   from "./workers.js";
import * as timingModule    from "./timing.js";
import * as indexeddbModule from "./indexeddb.js";
import * as gpuModule       from "./gpu.js";
import * as clipboardModule from "./clipboard.js";
import * as locationModule  from "./location.js";
import * as pointerModule   from "./pointer.js";
import * as componentsModule from "./components.js";

/**
 * Build the WebAssembly import object.
 *
 * The fsharp-wasm compiler generates imports keyed as:
 *   { "runtime/<module>.js": { "<functionName>": <fn>, … }, … }
 * plus two modules of its own:
 *   "wasm:js-string" — the JS String Builtins (provided by the engine, see `builtins` below), through which every
 *                      F# string crosses the boundary as a native JS string;
 *   "fsharp:host"    — the marshalling helpers of the compiler's extern ABI: a function-typed argument arrives as
 *                      `callback(id)` (a JS function that re-enters the module through its `__cb` export), and
 *                      numbers are boxed into `externref` for those calls.
 *
 * Each JS glue module is mapped to its canonical import path.
 */
function buildImports(getInstance) {
    // when the JS function standing for a closure is garbage collected, the module frees the closure's table slot
    const released = new FinalizationRegistry((id) => getInstance().exports.__cbFree(id));
    return {
        "runtime/core.js":       coreModule,
        "runtime/dom.js":        domModule,
        "runtime/events.js":     eventsModule,
        "runtime/canvas.js":     canvasModule,
        "runtime/net.js":        netModule,
        "runtime/storage.js":    storageModule,
        "runtime/cookies.js":    cookiesModule,
        "runtime/pubsub.js":     pubsubModule,
        "runtime/workers.js":    workersModule,
        "runtime/timing.js":     timingModule,
        "runtime/indexeddb.js":  indexeddbModule,
        "runtime/gpu.js":        gpuModule,
        "runtime/clipboard.js":  clipboardModule,
        "runtime/location.js":   locationModule,
        "runtime/pointer.js":    pointerModule,
        "runtime/components.js": componentsModule,
        // `printfn`: the module passes an opaque string and exports `__str_len` / `__str_at` to read it
        "env": {
            consolePrint: (s) => {
                const { __str_len: len, __str_at: at } = getInstance().exports;
                let text = "";
                for (let i = 0, n = len(s); i < n; i++) text += String.fromCharCode(at(s, i));
                console.log(text);
            },
        },
        "fsharp:host": {
            callback: (id) => {
                const f = (...args) => getInstance().exports.__cb(id, ...args);
                released.register(f, id);
                return f;
            },
            i2x: (n) => n,
            f2x: (n) => n,
            x2i: (x) => Number(x) | 0,
            x2f: (x) => Number(x),
            arrLen: (a) => a.length,
            arrGet: (a, i) => a[i],
        },
    };
}

/** Engine-provided string functions: `wasm:js-string` is imported by name from the module, no glue object needed. */
const COMPILE_OPTIONS = { builtins: ["js-string"] };

/**
 * Load and start a demo WASM module.
 *
 * @param {object} options
 * @param {URL}    options.wasm   - URL to the .wasm file (use `new URL("X.wasm", import.meta.url)`)
 * @param {string} options.entry  - name of the exported F# function to call after load
 */
export async function boot({ wasm, entry }) {
    const statusEl = document.getElementById("status");
    function setStatus(html) { if (statusEl) statusEl.innerHTML = html; }

    setStatus("Loading F# → WasmGC module…");

    try {
        let instance;
        const imports  = buildImports(() => instance);
        const response = await fetch(wasm);

        if (!response.ok) {
            throw new Error(
                `WASM not found at ${wasm.pathname} — run: npm run build`
            );
        }

        ({ instance } = await WebAssembly.instantiateStreaming(response, imports, COMPILE_OPTIONS));

        const entryFn = instance.exports[entry];
        if (typeof entryFn !== "function") {
            throw new Error(
                `Export "${entry}" not found in ${wasm.pathname}. ` +
                `Available: ${Object.keys(instance.exports).join(", ")}`
            );
        }

        setStatus(`<strong>✓ Loaded.</strong>`);
        entryFn();

    } catch (err) {
        // an engine without WasmGC or without the JS String Builtins fails to compile the module
        const unsupported = err instanceof WebAssembly.CompileError || err instanceof WebAssembly.LinkError;
        setStatus(`<strong>✗ Error:</strong> ${err.message}` +
            (unsupported ? "<br><small>This module needs WebAssembly GC and the JS String Builtins: Chrome / Edge 130+ or Firefox 134+.</small>" : ""));
        console.error("[fsharp-wasm-runtime] boot failed:", err);
    }
}
