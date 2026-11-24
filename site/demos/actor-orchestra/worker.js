// A process of the orchestra: it runs the same compiled module as the page (ActorOrchestra.wasm) and calls its kernel `piHits`.
// The module imports the browser glue for the DOM; a worker has no DOM, so those imports are stubs (the kernel never calls them).
const mod = await WebAssembly.compileStreaming(fetch(new URL("ActorOrchestra.wasm", import.meta.url)), { builtins: ["js-string"] });
const stub = {};
for (const { module, name, kind } of WebAssembly.Module.imports(mod)) {
  if (module === "wasm:js-string" || kind !== "function") continue;
  (stub[module] ??= {})[name] = () => 0;
}
const { exports } = await WebAssembly.instantiate(mod, stub);

// messages that come before the module is up wait on `exports` above: the top-level await orders them
self.onmessage = (e) => {
  const m = e.data;
  if (m.crash) {
    // fail by itself: say so, then end, as a crashing process would
    self.postMessage({ exit: "crash" });
    self.close();
  } else {
    self.postMessage({ job: m.job, value: exports.piHits(m.a, m.b) });
  }
};
self.postMessage({ ready: true });
