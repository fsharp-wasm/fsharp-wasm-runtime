/**
 * gfx.js — a single-canvas 2D drawing surface for fsharp-wasm-graphics.
 *
 * The F# side (FSharp.Graphics.Browser) walks a resolved Scene and calls these functions; nothing here keeps a scene.
 * Every argument is a number except `text`, `measure` (a string) and the result of `pendingKey` (a string); colours are
 * 0..255 channels, alpha 0..255.
 *
 * `mount(instance, canvasId)` is the other direction: it forwards pointer, wheel, key and size events to the exports of
 * the module (`onResize`, `onPointer`, `onWheel`, `onKey`, `frame`) and runs the frame loop.
 */

const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const BLEND = [
    "source-over", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn",
    "hard-light", "soft-light", "difference", "exclusion",
];
const CAPS  = ["butt", "round", "square"];
const JOINS = ["miter", "round", "bevel"];
// the order of FSharp.Graphics.Core.CursorKind
const CURSORS = [
    "default", "pointer", "text", "move", "ns-resize", "ew-resize", "nwse-resize", "nesw-resize",
    "crosshair", "not-allowed", "grab", "grabbing",
];

let cv = null;
let cx = null;
let grad = null;
let key = "";
let ratio = 1;
// a shadow is drawn by filling the shape this far off the canvas and offsetting its shadow back (canvas shadows ignore the transform)
const OFF = 20000;

const css  = (r, g, b, a) => `rgba(${r},${g},${b},${a / 255})`;
const font = (size, weight) => `${weight} ${size}px ${FONT}`;

export const init = (id) => {
    cv = document.getElementById(id);
    cx = cv.getContext("2d");
};

/** Start a frame: size the backing store for the device pixel ratio, reset the state, clear. */
export const begin = (w, h, r) => {
    ratio = r;
    const bw = Math.max(1, Math.round(w * ratio));
    const bh = Math.max(1, Math.round(h * ratio));
    if (cv.width !== bw || cv.height !== bh) { cv.width = bw; cv.height = bh; }
    cx.setTransform(ratio, 0, 0, ratio, 0, 0);
    cx.globalAlpha = 1;
    cx.globalCompositeOperation = "source-over";
    cx.filter = "none";
    cx.shadowColor = "transparent";
    cx.clearRect(0, 0, w, h);
};

export const save      = () => cx.save();
export const restore   = () => cx.restore();
export const transform = (a, b, c, d, e, f) => cx.transform(a, b, c, d, e, f);
/** Inside a save(): what a layer asks of every draw in it — alpha (multiplied), blend mode, blur (a sigma in px). */
export const layer = (a, m, blurPx) => {
    cx.globalAlpha *= a;
    cx.globalCompositeOperation = BLEND[m] ?? "source-over";
    if (blurPx > 0) cx.filter = `blur(${blurPx * ratio}px)`;
};
// A colour matrix is collected value by value (20 of them: rows R, G, B, A with the offset last, offsets in 0..1 — the
// convention of SVG's feColorMatrix) and then applies to everything the current layer draws.  The canvas filter refers to an
// SVG filter by url(#id): one hidden <filter> per distinct matrix, created on first use, computed in sRGB like the other hosts.
const SVG_NS = "http://www.w3.org/2000/svg";
const matrixFilters = new Map();
let matrix = [];
export const matrixBegin = () => { matrix = []; };
export const matrixValue = (v) => { matrix.push(v); };
export const matrixUse = () => {
    const values = matrix.join(" ");
    let id = matrixFilters.get(values);
    if (!id) {
        id = `gfx-matrix-${matrixFilters.size}`;
        const svg = document.createElementNS(SVG_NS, "svg");
        svg.setAttribute("width", "0");
        svg.setAttribute("height", "0");
        svg.setAttribute("aria-hidden", "true");
        svg.style.position = "absolute";
        svg.innerHTML = `<filter id="${id}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${values}"/></filter>`;
        document.body.appendChild(svg);
        matrixFilters.set(values, id);
    }
    cx.filter = `${cx.filter === "none" ? "" : cx.filter + " "}url(#${id})`;
};
export const clip      = (x, y, w, h) => { cx.beginPath(); cx.rect(x, y, w, h); cx.clip(); };
export const clipPath  = () => cx.clip();

export const pathBegin = () => cx.beginPath();
export const roundRect = (x, y, w, h, tl, tr, br, bl) => cx.roundRect(x, y, w, h, [tl, tr, br, bl]);
export const ellipse   = (x, y, rx, ry) => { cx.moveTo(x + rx, y); cx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); };
export const moveTo    = (x, y) => cx.moveTo(x, y);
export const lineTo    = (x, y) => cx.lineTo(x, y);
export const closePath = () => cx.closePath();

export const solid      = (r, g, b, a) => { cx.fillStyle = css(r, g, b, a); };
export const gradLinear = (x0, y0, x1, y1) => { grad = cx.createLinearGradient(x0, y0, x1, y1); };
export const gradRadial = (x, y, r) => { grad = cx.createRadialGradient(x, y, 0, x, y, Math.max(r, 0.0001)); };
export const gradStop   = (o, r, g, b, a) => { grad.addColorStop(Math.min(1, Math.max(0, o)), css(r, g, b, a)); };
export const gradUse    = () => { cx.fillStyle = grad; };

/** Begin a shadow-only draw: what is filled next is moved off the canvas, its blurred shadow lands in place. */
export const shadowBegin = (ox, oy, blurPx, r, g, b, a) => {
    cx.save();
    cx.shadowColor = css(r, g, b, a);
    cx.shadowBlur = blurPx * ratio;
    cx.shadowOffsetX = ox * ratio + OFF;
    cx.shadowOffsetY = oy * ratio;
    cx.translate(-OFF / ratio, 0);
};
export const shadowEnd = () => cx.restore();

export const fill        = () => cx.fill();
export const fillEvenOdd = () => cx.fill("evenodd");
export const strokeStyle = (r, g, b, a, width, cap, join, miter) => {
    cx.strokeStyle = css(r, g, b, a); cx.lineWidth = width; cx.lineCap = CAPS[cap] ?? "butt"; cx.lineJoin = JOINS[join] ?? "miter";
    cx.miterLimit = miter > 0 ? miter : 4;
};
export const stroke = () => cx.stroke();

/** One run of text with its baseline origin at (x, y). */
export const text = (s, x, y, size, weight, r, g, b, a) => {
    cx.font = font(size, weight); cx.fillStyle = css(r, g, b, a); cx.textBaseline = "alphabetic"; cx.fillText(s, x, y);
};
/** Advance width of a string; the F# text engine builds layouts from the advance of each character. */
export const measure = (s, size, weight) => { cx.font = font(size, weight); return cx.measureText(s).width; };

export const cursor     = (k) => { cv.style.cursor = CURSORS[k] ?? "default"; };
/**
 * Tell the page something that is not drawing: a `gfx` event on the canvas, `detail = { kind, a, b }`.  A module can send
 * strings out but not receive them, so this is how it names its parts (the scenes of a gallery, the selected one).
 * Listen before the module starts: `canvas.addEventListener("gfx", (e) => …)`.
 */
export const announce = (kind, a, b) => cv.dispatchEvent(new CustomEvent("gfx", { detail: { kind, a, b } }));
/** The key of the key event being delivered (F# cannot receive a string through an export, so it asks for it). */
export const pendingKey = () => key;

/** Wire a canvas to the exports of a graphics module and start the frame loop. Returns a function that stops it. */
export function mount(instance, canvasId) {
    const ex = instance.exports;
    const canvas = document.getElementById(canvasId);
    canvas.tabIndex = 0;
    const pos = (e) => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };

    const resize = () => {
        const r = canvas.getBoundingClientRect();
        ex.onResize(r.width, r.height, window.devicePixelRatio || 1);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // kind: 0 down, 1 up, 2 move, 3 leave
    canvas.addEventListener("pointerdown", (e) => {
        canvas.focus(); canvas.setPointerCapture(e.pointerId);
        const [x, y] = pos(e); ex.onPointer(0, x, y, e.button);
    });
    canvas.addEventListener("pointerup", (e) => { const [x, y] = pos(e); ex.onPointer(1, x, y, e.button); });
    canvas.addEventListener("pointermove", (e) => { const [x, y] = pos(e); ex.onPointer(2, x, y, e.button); });
    canvas.addEventListener("pointerleave", (e) => { const [x, y] = pos(e); ex.onPointer(3, x, y, e.button); });
    canvas.addEventListener("wheel", (e) => { e.preventDefault(); ex.onWheel(e.deltaX, e.deltaY); }, { passive: false });

    // kind: 0 down, 1 up; browser shortcuts (Ctrl/Cmd/Alt chords) are left alone
    const onKey = (kind) => (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        key = e.key;
        ex.onKey(kind);
        e.preventDefault();
    };
    canvas.addEventListener("keydown", onKey(0));
    canvas.addEventListener("keyup", onKey(1));

    // the loop runs only while the canvas is on screen (a page may embed several of them, or scroll one out of view)
    let raf = 0;
    const loop = (t) => { ex.frame(t); raf = requestAnimationFrame(loop); };
    const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !raf) raf = requestAnimationFrame(loop);
        else if (!e.isIntersecting) { cancelAnimationFrame(raf); raf = 0; }
    });
    io.observe(canvas);
    return () => { cancelAnimationFrame(raf); raf = 0; io.disconnect(); ro.disconnect(); };
}
