// core.js — Shared handle store for all runtime modules
const store = new Map();
let nextId = 2; // 0 = nil, 1 = document.body

export const save = (obj) => { const id = nextId++; store.set(id, obj); return id; };
export const get  = (id)  => store.get(id);
export const drop = (id)  => store.delete(id);

// The module's own linear memory (the `wasm:memory` imports of Browser.WasmMemory), for glue that moves bulk data
// (a vertex buffer, a pixel block) without text in between. `boot` sets the instance once it exists; the buffer is
// asked for at each use because growing the memory replaces it.
let instance;
export const setInstance  = (i) => { instance = i; };
export const memoryBuffer = ()  => {
    const memory = instance && instance.exports.memory;
    if (!memory) throw new Error("this module has no linear memory: use Browser.WasmMemory (a `wasm:memory` import) to give it one");
    return memory.buffer;
};

// Pre-register well-known handles
store.set(0, null);
store.set(1, document.body);
