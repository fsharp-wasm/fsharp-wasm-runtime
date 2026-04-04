/**
 * runtime/pointer.js — Pointer event bindings (mouse, touch, stylus).
 *
 * Provides a superset of mouse events: works with a mouse, touch screen,
 * and stylus without needing separate touch/mouse handlers.
 */

import { get } from "./core.js";

const listeners = new Map();

/**
 * Attach a pointer event handler to an element.
 * @param {number} id       - Handle of the element
 * @param {string} event    - One of: pointerdown, pointermove, pointerup,
 *                            pointercancel, pointerenter, pointerleave,
 *                            pointerover, pointerout
 * @param {function} cb     - (x: number, y: number, pointerId: number) => void
 */
export const onPointer = (id, event, cb) => {
    const el = get(id);
    if (!el) return;
    const handler = (e) => {
        e.preventDefault();
        cb(e.clientX, e.clientY, e.pointerId);
    };
    el.addEventListener(event, handler);
    if (!listeners.has(id)) listeners.set(id, new Map());
    listeners.get(id).set(event, handler);
};

/** Remove a previously attached pointer handler. */
export const offPointer = (id, event) => {
    const el = get(id);
    if (!el || !listeners.has(id)) return;
    const handler = listeners.get(id).get(event);
    if (handler) {
        el.removeEventListener(event, handler);
        listeners.get(id).delete(event);
    }
};

/**
 * Set pointer capture on an element so it receives all pointer events
 * for the given pointer ID, even if the pointer moves outside it.
 */
export const setPointerCapture = (id, pointerId) => {
    const el = get(id);
    if (el) el.setPointerCapture(pointerId);
};

export const releasePointerCapture = (id, pointerId) => {
    const el = get(id);
    if (el) el.releasePointerCapture(pointerId);
};
