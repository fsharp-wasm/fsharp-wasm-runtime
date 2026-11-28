import { save as store, get } from "./core.js";   // `save` is the canvas's own save() below

export const getContext2D  = (canvasId)              => { const c = get(canvasId); return c ? store(c.getContext("2d")) : 0; };
export const fillRect      = (ctxId, x, y, w, h)    => { const ctx = get(ctxId); if (ctx) ctx.fillRect(x, y, w, h); };
export const strokeRect    = (ctxId, x, y, w, h)    => { const ctx = get(ctxId); if (ctx) ctx.strokeRect(x, y, w, h); };
export const clearRect     = (ctxId, x, y, w, h)    => { const ctx = get(ctxId); if (ctx) ctx.clearRect(x, y, w, h); };
export const setFillStyle  = (ctxId, style)          => { const ctx = get(ctxId); if (ctx) ctx.fillStyle = style; };
export const setStrokeStyle = (ctxId, style)         => { const ctx = get(ctxId); if (ctx) ctx.strokeStyle = style; };
export const setLineWidth  = (ctxId, width)          => { const ctx = get(ctxId); if (ctx) ctx.lineWidth = width; };
export const beginPath     = (ctxId)                 => { const ctx = get(ctxId); if (ctx) ctx.beginPath(); };
export const closePath     = (ctxId)                 => { const ctx = get(ctxId); if (ctx) ctx.closePath(); };
export const moveTo        = (ctxId, x, y)           => { const ctx = get(ctxId); if (ctx) ctx.moveTo(x, y); };
export const lineTo        = (ctxId, x, y)           => { const ctx = get(ctxId); if (ctx) ctx.lineTo(x, y); };
export const arc           = (ctxId, x, y, r, s, e)  => { const ctx = get(ctxId); if (ctx) ctx.arc(x, y, r, s, e); };
export const fill          = (ctxId)                 => { const ctx = get(ctxId); if (ctx) ctx.fill(); };
export const stroke        = (ctxId)                 => { const ctx = get(ctxId); if (ctx) ctx.stroke(); };
export const fillText      = (ctxId, text, x, y)     => { const ctx = get(ctxId); if (ctx) ctx.fillText(text, x, y); };
export const setFont       = (ctxId, font)           => { const ctx = get(ctxId); if (ctx) ctx.font = font; };

// ── state and transforms ─────────────────────────────────────────────────────
export const save           = (ctxId)                      => { const ctx = get(ctxId); if (ctx) ctx.save(); };
export const restore        = (ctxId)                      => { const ctx = get(ctxId); if (ctx) ctx.restore(); };
export const translate      = (ctxId, x, y)                => { const ctx = get(ctxId); if (ctx) ctx.translate(x, y); };
export const rotate         = (ctxId, angle)               => { const ctx = get(ctxId); if (ctx) ctx.rotate(angle); };
export const scale          = (ctxId, x, y)                => { const ctx = get(ctxId); if (ctx) ctx.scale(x, y); };
export const setTransform   = (ctxId, a, b, c, d, e, f)   => { const ctx = get(ctxId); if (ctx) ctx.setTransform(a, b, c, d, e, f); };
export const resetTransform = (ctxId)                      => { const ctx = get(ctxId); if (ctx) ctx.resetTransform(); };

// ── paths ────────────────────────────────────────────────────────────────────
export const rect              = (ctxId, x, y, w, h)               => { const ctx = get(ctxId); if (ctx) ctx.rect(x, y, w, h); };
export const roundRect         = (ctxId, x, y, w, h, r)            => { const ctx = get(ctxId); if (ctx) ctx.roundRect(x, y, w, h, r); };
export const ellipse           = (ctxId, x, y, rx, ry, rot, s, e)  => { const ctx = get(ctxId); if (ctx) ctx.ellipse(x, y, rx, ry, rot, s, e); };
export const arcTo             = (ctxId, x1, y1, x2, y2, r)        => { const ctx = get(ctxId); if (ctx) ctx.arcTo(x1, y1, x2, y2, r); };
export const quadraticCurveTo  = (ctxId, cx, cy, x, y)             => { const ctx = get(ctxId); if (ctx) ctx.quadraticCurveTo(cx, cy, x, y); };
export const bezierCurveTo     = (ctxId, c1x, c1y, c2x, c2y, x, y) => { const ctx = get(ctxId); if (ctx) ctx.bezierCurveTo(c1x, c1y, c2x, c2y, x, y); };
/** `evenOdd` is 1 for the even-odd rule, 0 for non-zero. */
export const fillRule          = (ctxId, evenOdd)                  => { const ctx = get(ctxId); if (ctx) ctx.fill(evenOdd ? "evenodd" : "nonzero"); };
export const clip              = (ctxId, evenOdd)                  => { const ctx = get(ctxId); if (ctx) ctx.clip(evenOdd ? "evenodd" : "nonzero"); };

// ── stroke and fill style ────────────────────────────────────────────────────
export const setGlobalAlpha = (ctxId, a)         => { const ctx = get(ctxId); if (ctx) ctx.globalAlpha = a; };
export const setLineCap     = (ctxId, cap)       => { const ctx = get(ctxId); if (ctx) ctx.lineCap = cap; };
export const setLineJoin    = (ctxId, join)      => { const ctx = get(ctxId); if (ctx) ctx.lineJoin = join; };
export const setMiterLimit  = (ctxId, n)         => { const ctx = get(ctxId); if (ctx) ctx.miterLimit = n; };
/** `pattern` is the dash lengths as text, "5,3"; "" is a solid line. */
export const setLineDash    = (ctxId, pattern)   => { const ctx = get(ctxId); if (ctx) ctx.setLineDash(pattern === "" ? [] : pattern.split(",").map(Number)); };
export const setShadow      = (ctxId, color, blur, dx, dy) => {
    const ctx = get(ctxId);
    if (ctx) { ctx.shadowColor = color; ctx.shadowBlur = blur; ctx.shadowOffsetX = dx; ctx.shadowOffsetY = dy; }
};
export const setCompositeOperation = (ctxId, op) => { const ctx = get(ctxId); if (ctx) ctx.globalCompositeOperation = op; };

// ── gradients: a handle, filled with colour stops, then used as a style ─────
export const createLinearGradient = (ctxId, x0, y0, x1, y1)         => { const ctx = get(ctxId); return ctx ? store(ctx.createLinearGradient(x0, y0, x1, y1)) : 0; };
export const createRadialGradient = (ctxId, x0, y0, r0, x1, y1, r1) => { const ctx = get(ctxId); return ctx ? store(ctx.createRadialGradient(x0, y0, r0, x1, y1, r1)) : 0; };
export const addColorStop         = (gradId, offset, color)         => { const g = get(gradId); if (g) g.addColorStop(offset, color); };
export const setFillGradient      = (ctxId, gradId)                 => { const ctx = get(ctxId), g = get(gradId); if (ctx && g) ctx.fillStyle = g; };
export const setStrokeGradient    = (ctxId, gradId)                 => { const ctx = get(ctxId), g = get(gradId); if (ctx && g) ctx.strokeStyle = g; };

// ── text ─────────────────────────────────────────────────────────────────────
export const strokeText      = (ctxId, text, x, y) => { const ctx = get(ctxId); if (ctx) ctx.strokeText(text, x, y); };
export const setTextAlign    = (ctxId, align)      => { const ctx = get(ctxId); if (ctx) ctx.textAlign = align; };
export const setTextBaseline = (ctxId, baseline)   => { const ctx = get(ctxId); if (ctx) ctx.textBaseline = baseline; };
/** The width of `text` in the current font, in CSS pixels. */
export const measureText     = (ctxId, text)       => { const ctx = get(ctxId); return ctx ? ctx.measureText(text).width : 0; };

// ── pictures ─────────────────────────────────────────────────────────────────
/** Draws another canvas (by its element handle) at (dx, dy), scaled to (dw, dh). */
export const drawCanvas = (ctxId, srcCanvasId, dx, dy, dw, dh) => {
    const ctx = get(ctxId), src = get(srcCanvasId);
    if (ctx && src) ctx.drawImage(src, dx, dy, dw, dh);
};

