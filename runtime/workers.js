import { save, get } from "./core.js";

export const createWorker = (url) => save(new Worker(url));

export const postMessage = (id, msg) => {
    const w = get(id);
    if (w) w.postMessage(msg);
};

export const onMessage = (id, cb) => {
    const w = get(id);
    if (w) w.onmessage = (e) => cb(e.data);
};

export const onError = (id, cb) => {
    const w = get(id);
    if (w) w.onerror = (e) => cb(e.message);
};

export const terminateWorker = (id) => {
    const w = get(id);
    if (w) w.terminate();
};
