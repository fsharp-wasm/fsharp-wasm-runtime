import { get } from "./core.js";

const listeners = new Map();

export const on = (id, event, cb) => {
    const el = get(id);
    if (!el) return;
    const handler = (e) => {
        if (event === "submit") e.preventDefault();
        cb(id);
    };
    el.addEventListener(event, handler);
    if (!listeners.has(id)) listeners.set(id, new Map());
    listeners.get(id).set(event, handler);
};

export const off = (id, event) => {
    const el = get(id);
    if (!el || !listeners.has(id)) return;
    const handler = listeners.get(id).get(event);
    if (handler) {
        el.removeEventListener(event, handler);
        listeners.get(id).delete(event);
    }
};

export const onInput = (id, cb) => {
    const el = get(id);
    if (!el) return;
    el.addEventListener("input", (e) => cb(e.target.value));
};

export const onChange = (id, cb) => {
    const el = get(id);
    if (!el) return;
    el.addEventListener("change", (e) => cb(e.target.value));
};
