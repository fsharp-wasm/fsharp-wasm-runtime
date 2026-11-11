import { save, get } from "./core.js";

// IndexedDB is asynchronous, a WasmGC module cannot block on it: every operation takes the callback that continues
// the program (the F# side turns it into a message).

const store = (dbId, mode) => get(dbId).transaction("store", mode).objectStore("store");
const request = (req, ok) => { req.onsuccess = () => ok(req.result); req.onerror = () => console.error(req.error); };

export const openDb = (name, version, cb) => {
    const req = indexedDB.open(name, version || 1);
    req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains("store")) req.result.createObjectStore("store");
    };
    request(req, (db) => cb(save(db)));
};

export const put        = (dbId, key, value, cb) => request(store(dbId, "readwrite").put(value, key), () => cb());
export const getItem    = (dbId, key, cb)        => request(store(dbId, "readonly").get(key), (v) => cb(v ?? ""));
export const deleteItem = (dbId, key, cb)        => request(store(dbId, "readwrite").delete(key), () => cb());
export const getAllKeys = (dbId, cb)             => request(store(dbId, "readonly").getAllKeys(), (keys) => cb(keys.map(String)));
