// core.js — Shared handle store for all runtime modules
const store = new Map();
let nextId = 2; // 0 = nil, 1 = document.body

export const save = (obj) => { const id = nextId++; store.set(id, obj); return id; };
export const get  = (id)  => store.get(id);
export const drop = (id)  => store.delete(id);

// Pre-register well-known handles
store.set(0, null);
store.set(1, document.body);
