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

// ─── Dragging: a press that is followed by the pointer, whatever the view re-renders in between ──────────────────────────────────────────────────
// The press captures the pointer (so the moves and the release come to the same element even outside it) and focuses it (so a key — Escape — comes to it);
// the element is kept across renders (adoptHandlers), so the capture survives the render each move causes.  Coordinates are the viewport's.
export const onPointerDown = (id, cb) => {
    const el = get(id);
    if (el) slot(el, "pointerdown", "pointerdown:press", (e) => {
        if (e.button !== 0) return;
        const live = e.currentTarget;                              // the element on the page: `el` is the one the render built, which the merge discards
        live.setPointerCapture?.(e.pointerId);
        live.focus?.({ preventScroll: true });
        e.preventDefault();
        cb(e.clientX, e.clientY);
    });
};
export const onPointerMove   = (id, cb) => { const el = get(id); if (el) slot(el, "pointermove",   "pointermove:move",     (e) => cb(e.clientX, e.clientY)); };
export const onPointerUp     = (id, cb) => { const el = get(id); if (el) slot(el, "pointerup",     "pointerup:release",    (e) => cb(e.clientX, e.clientY)); };
export const onPointerCancel = (id, cb) => { const el = get(id); if (el) slot(el, "pointercancel", "pointercancel:cancel", () => cb()); };
export const onKeyDown       = (id, cb) => { const el = get(id); if (el) slot(el, "keydown",       "keydown:key",          (e) => cb(e.key)); };

/**
 * The click that ends a drag is not a click.  A captured pointer ends where it started, so the browser clicks the element that was pressed even after the pointer
 * went elsewhere.  The page calls this when it knows the sequence was a drag, in its release handler or while the pointer is still down (Escape in the middle of a drag
 * ends it, and the release comes later): the next click is swallowed.  It ends with that click, or when something else begins (a new press, a key), so a click that
 * never comes cannot take a later one.
 */
let endSwallow = null;
export const swallowClick = () => {
    endSwallow?.();
    const events = ["click", "pointerdown", "keydown"];
    const on = (e) => { if (e.type === "click") { e.stopImmediatePropagation(); e.preventDefault(); } endSwallow(); };
    endSwallow = () => { for (const t of events) window.removeEventListener(t, on, true); endSwallow = null; };
    for (const t of events) window.addEventListener(t, on, true);
};

/**
 * What an iframe of the page says (`parent.postMessage`), as JSON text.  A preview runs in a sandboxed frame (`sandbox="allow-scripts"`): it cannot touch the page,
 * and this is how the two talk.  The frame is looked up by `selector` at each message, because a render may have replaced it, and a message of any other window
 * is not the frame's and is ignored.
 */
export const onFrameMessage = (selector, cb) => addEventListener("message", (e) => {
    const f = document.querySelector(selector);
    if (f && e.source === f.contentWindow) cb(JSON.stringify(e.data ?? null));
});

/** Say something (JSON text) to the iframe; nothing happens when there is none.  A sandboxed frame has no origin to name, so the target is "*". */
export const postToFrame = (selector, json) => { document.querySelector(selector)?.contentWindow?.postMessage(JSON.parse(json), "*"); };

/** The places a drag can drop: every element with a `data-slot` (its number), as (id, x, y, width, height, nests) in viewport coordinates, in document order. */
export const measureSlots = (cb) => {
    for (const el of document.querySelectorAll("[data-slot]")) {
        const r = el.getBoundingClientRect();
        cb(Number(el.dataset.slot), r.x, r.y, r.width, r.height, "nests" in el.dataset ? 1 : 0);
    }
};
