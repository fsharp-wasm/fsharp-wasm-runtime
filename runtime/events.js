import { get } from "./core.js";

// A handler lives in a slot of its element (`el.__h[kind]`); the DOM listener behind a slot is installed once and calls
// whatever the slot holds.  A render builds a fresh element for every node of the view, then dom.js merges it into the
// element that is already on the page — `adoptHandlers` moves the new slots over, so the page keeps its elements (and
// with them focus, caret and scroll position) while the handlers always belong to the latest view.
const slot = (el, event, kind, deliver) => {
    const slots = (el.__h ??= {});
    if (!(kind in slots)) el.addEventListener(event, (e) => slots[kind]?.(e));
    slots[kind] = deliver;
};

const DOM_EVENT = (kind) => kind.split(":")[0];

/** Give `live` the handlers of `next`; a handler `next` does not have is cleared. */
export const adoptHandlers = (live, next) => {
    const from = next.__h ?? {};
    for (const kind of Object.keys(live.__h ?? {})) if (!(kind in from)) live.__h[kind] = undefined;
    for (const [kind, deliver] of Object.entries(from)) slot(live, DOM_EVENT(kind), kind, deliver);
};

export const on = (id, event, cb) => {
    const el = get(id);
    if (!el) return;
    slot(el, event, event, (e) => {
        if (event === "submit") e.preventDefault();
        cb(id);
    });
};

export const off = (id, event) => {
    const el = get(id);
    if (el?.__h) el.__h[event] = undefined;
};

export const onInput  = (id, cb) => { const el = get(id); if (el) slot(el, "input",  "input:value",  (e) => cb(e.target.value)); };
export const onChange = (id, cb) => { const el = get(id); if (el) slot(el, "change", "change:value", (e) => cb(e.target.value)); };
