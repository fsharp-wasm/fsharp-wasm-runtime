import { save, get } from "./core.js";

export const openDb = (name, version) => {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(name, version || 1);
        req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains("store")) {
                db.createObjectStore("store");
            }
        };
        req.onsuccess = () => resolve(save(req.result));
        req.onerror = () => reject(req.error);
    });
};

export const put = (dbId, key, value) => {
    return new Promise((resolve, reject) => {
        const db = get(dbId);
        if (!db) { reject(new Error("Invalid DB handle")); return; }
        const tx = db.transaction("store", "readwrite");
        const store = tx.objectStore("store");
        const req = store.put(value, key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
};

export const getItem = (dbId, key) => {
    return new Promise((resolve, reject) => {
        const db = get(dbId);
        if (!db) { reject(new Error("Invalid DB handle")); return; }
        const tx = db.transaction("store", "readonly");
        const store = tx.objectStore("store");
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
};

export const deleteItem = (dbId, key) => {
    return new Promise((resolve, reject) => {
        const db = get(dbId);
        if (!db) { reject(new Error("Invalid DB handle")); return; }
        const tx = db.transaction("store", "readwrite");
        const store = tx.objectStore("store");
        const req = store.delete(key);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
};

export const getAllKeys = (dbId) => {
    return new Promise((resolve, reject) => {
        const db = get(dbId);
        if (!db) { reject(new Error("Invalid DB handle")); return; }
        const tx = db.transaction("store", "readonly");
        const store = tx.objectStore("store");
        const req = store.getAllKeys();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
};
