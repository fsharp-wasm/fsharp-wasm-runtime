import { save, get, drop } from "./core.js";
import { adoptHandlers } from "./events.js";

// node → handle, so the handles of a view that was merged into the page can be released (see morphChildren)
const handles = new WeakMap();
const create  = (node) => { handles.set(node, save(node)); return handles.get(node); };

export const createElement    = (tag)        => create(document.createElement(tag));
export const createTextNode   = (text)       => create(document.createTextNode(text));
export const setTextContent   = (id, text)   => { const el = get(id); if (el) el.textContent = text; };
export const setInnerHtml     = (id, html)   => { const el = get(id); if (el) el.innerHTML = html; };
export const appendChild      = (parentId, childId) => { const p = get(parentId), c = get(childId); if (p && c) p.appendChild(c); };
export const removeChild      = (parentId, childId) => { const p = get(parentId), c = get(childId); if (p && c) p.removeChild(c); };
export const removeElement    = (id)         => { const el = get(id); if (el) el.remove(); drop(id); };
// an empty name is "no attribute" (`disabled false` yields one), not an error
export const setAttribute     = (id, key, value) => { const el = get(id); if (el && key) el.setAttribute(key, value); };
export const removeAttribute  = (id, key)    => { const el = get(id); if (el) el.removeAttribute(key); };
export const setClassName     = (id, cls)    => { const el = get(id); if (el) el.className = cls; };
export const setStyle         = (id, prop, value) => { const el = get(id); if (el) el.style[prop] = value; };
export const clearInnerHtml   = (id)         => { const el = get(id); if (el) el.innerHTML = ""; };
export const querySelector    = (id, sel)    => { const el = get(id); if (!el) return 0; const found = el.querySelector(sel); return found ? save(found) : 0; };
export const getById          = (id)         => { const el = document.getElementById(id); return el ? save(el) : 0; };
export const getValue         = (id)         => { const el = get(id); return el ? (el.value || "") : ""; };
export const setValue         = (id, v)      => { const el = get(id); if (el) el.value = v; };
export const focus            = (id)         => { const el = get(id); if (el) el.focus(); };
export const scrollIntoView   = (id)         => { const el = get(id); if (el) el.scrollIntoView({ behavior: "smooth" }); };

// ─── Reconciliation ──────────────────────────────────────────────────────────

const isCheck = (el) => el.nodeName === "INPUT" && (el.type === "checkbox" || el.type === "radio");
const keyOf   = (n) => (n.nodeType === 1 ? n.getAttribute("data-key") : null);
const sameKind = (a, b) => a.nodeType === b.nodeType && a.nodeName === b.nodeName;

const releaseHandles = (node) => {
    const id = handles.get(node);
    if (id !== undefined) { drop(id); handles.delete(node); }
    node.childNodes.forEach(releaseHandles);
};

const syncAttributes = (live, next) => {
    for (const { name } of [...live.attributes]) if (!next.hasAttribute(name)) live.removeAttribute(name);
    for (const { name, value } of next.attributes) if (live.getAttribute(name) !== value) live.setAttribute(name, value);
};

/** The live state of a form control is a property, not the attribute: what the user typed is not overwritten, only a
 *  value the view states (`value' …`) is applied, and only when it differs (so the caret stays where it is). */
const syncControl = (live, next) => {
    if (isCheck(next)) { if (live.checked !== next.checked) live.checked = next.checked; return; }
    if ("value" in next && next.hasAttribute("value") && live.value !== next.value) live.value = next.value;
};

const morph = (live, next) => {
    if (live.nodeType !== 1) { if (live.data !== next.data) live.data = next.data; return; }
    syncAttributes(live, next);
    adoptHandlers(live, next);
    morphChildren(live, next);
    syncControl(live, next);    // after the children: a <select>'s value depends on its options
};

/**
 * Make the children of `live` equal to those of `next`, reusing the elements that are already there.
 * Children are matched by `data-key` when they have one, else by position and tag; a child that matches is updated in
 * place (so a focused input keeps focus, caret and selection), any other new child is adopted from `next`, and live
 * children nothing matched are removed.
 */
const morphChildren = (live, next) => {
    const keyed = new Map();
    for (const c of live.childNodes) { const k = keyOf(c); if (k !== null) keyed.set(k, c); }
    const kept = new Set();
    let prev = null;    // the child placed last: the next one belongs right after it
    // Re-inserting a node that is already in place would still detach it — and a detached input loses focus — so a
    // child is only moved when it is not where it belongs.
    const place = (node) => {
        const at = prev ? prev.nextSibling : live.firstChild;
        if (at !== node) live.insertBefore(node, at);
        prev = node;
        kept.add(node);
    };
    let cur = live.firstChild;    // the first live child that no earlier new child has taken (keyed ones only match by key)
    for (const n of [...next.childNodes]) {
        while (cur && (kept.has(cur) || keyOf(cur) !== null)) cur = cur.nextSibling;
        const k = keyOf(n);
        const match = k !== null ? (keyed.get(k) ?? null) : (cur && sameKind(cur, n) ? cur : null);
        if (match) {
            if (match === cur) cur = cur.nextSibling;
            place(match);
            morph(match, n);
        } else {
            place(n);
        }
    }
    for (const c of [...live.childNodes]) if (!kept.has(c)) live.removeChild(c);
};

/** Merge the view built under `scratchId` into the children of `parentId`, then release the handles of that view. */
export const morphChildrenOf = (parentId, scratchId) => {
    const live = get(parentId), next = get(scratchId);
    if (!live || !next) return;
    releaseHandles(next);
    morphChildren(live, next);
};
