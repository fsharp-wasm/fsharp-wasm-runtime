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
 *
 * Each JS glue module is mapped to its canonical import path.
 */
function buildImports() {
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
    };
}

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
        const imports  = buildImports();
        const response = await fetch(wasm);

        if (!response.ok) {
            throw new Error(
                `WASM not found at ${wasm.pathname} — run: npm run build`
            );
        }

        const { instance } = await WebAssembly.instantiateStreaming(response, imports);

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
        setStatus(`<strong>✗ Error:</strong> ${err.message}`);
        console.error("[fsharp-wasm-runtime] boot failed:", err);
    }
}
