import { save, get } from "./core.js";

export const getContext2D  = (canvasId)              => { const c = get(canvasId); return c ? save(c.getContext("2d")) : 0; };
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
