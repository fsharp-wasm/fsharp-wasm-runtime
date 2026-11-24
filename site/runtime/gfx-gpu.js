/**
 * gfx-gpu.js — the drawing surface of fsharp-wasm-graphics on WebGPU, in place of gfx.js.
 *
 * Same imports as gfx.js, so a compiled module does not change: a page replaces the host (`boot({ …, imports: { "runtime/gfx.js": gpuHost } })`), after `await ready(canvasId)`
 * said that there is a GPU.  What the module draws is recorded as instances of a few primitives and drawn at the end of the frame, in the order it was drawn, in as few calls as
 * the primitive allows:
 *
 *   rect, ellipse   filled or stroked, a signed distance evaluated per pixel (per-corner radii, anti-aliased by the pixel size), solid, linear or radial paint (up to 8 stops)
 *   shadow          a rectangle or an ellipse blurred by an error function (CSS blur radius / 2 is the sigma, as in the canvas)
 *   text            a run of glyphs rasterised once by the browser into an atlas, then a textured quad tinted by the colour
 *   triangle        what a convex or simple polygon fill is cut into (not anti-aliased)
 *
 * A rectangle clip is carried by each primitive (the fragment shader drops what is outside), so that the draw calls of a frame are one per kind of pipeline and not one per clip: the
 * accounting grid clips every cell, and drew 211 calls a frame with scissor rectangles.  The frame is drawn into a texture that stays between frames, so that a partial redraw (`region`) draws only what changed, and a blit
 * puts it on the canvas.
 *
 * What it cannot do is counted, not skipped silently: a polygon stroke, a clip that is not a rectangle (or that a rotation has turned), an even-odd fill, a layer with a blend
 * mode, a blur or a colour matrix, a compound path.  `gpuStats()` has the counts by reason; a page that must be exact (a test) asserts that they are zero.
 */
import { attach, FONT, mount as mountCanvas } from "./gfx.js";
export { cursor, announce, pendingKey, now, measure } from "./gfx.js";

const F = 40;                                   // floats per instance (see the shader)
const K = { rect: 0, ellipse: 1, rectStroke: 2, ellipseStroke: 3, rectShadow: 4, ellipseShadow: 5, sprite: 6, triangle: 7, clear: 8 };
const ATLAS = 2048;

const SHADER = /* wgsl */ `
struct U { view: vec4<f32> }                    // css width, css height, ratio
@group(0) @binding(0) var<uniform> u: U;
@group(0) @binding(1) var<storage, read> inst: array<f32>;
@group(0) @binding(2) var<storage, read> stops: array<f32>;
@group(0) @binding(3) var atlas: texture_2d<f32>;
@group(0) @binding(4) var samp: sampler;

// 0..5 matrix a b c d e f | 6..9 rect | 10..13 radii tl tr br bl | 14 kind | 15 margin | 16..19 colour | 20 paint | 21 first stop | 22 stops | 23 alpha
// 24..27 gradient | 28..31 uv | 32 stroke width or sigma | 36..39 clip rectangle in device pixels (x0 y0 x1 y1)
fn I(i: u32, k: u32) -> f32 { return inst[i * ${F}u + k]; }

struct VOut { @builtin(position) pos: vec4<f32>, @location(0) p: vec2<f32>, @location(1) @interpolate(flat) i: u32 }

@vertex fn vs(@builtin(vertex_index) vi: u32, @builtin(instance_index) ii: u32) -> VOut {
  let kind = u32(I(ii, 14u));
  var cs = array<vec2<f32>, 6>(vec2(0.0, 0.0), vec2(1.0, 0.0), vec2(0.0, 1.0), vec2(0.0, 1.0), vec2(1.0, 0.0), vec2(1.0, 1.0));
  var lp: vec2<f32>;
  if (kind == 7u) {
    let k = min(vi, 2u);                        // the three vertices; the second triangle of the quad collapses
    lp = vec2(I(ii, 6u + k * 2u), I(ii, 7u + k * 2u));
  } else {
    let pad = I(ii, 15u) + 2.0;
    let r = vec4(I(ii, 6u), I(ii, 7u), I(ii, 8u), I(ii, 9u));
    let q = cs[vi];
    lp = vec2(r.x - pad + q.x * (r.z + 2.0 * pad), r.y - pad + q.y * (r.w + 2.0 * pad));
  }
  let w = vec2(I(ii, 0u) * lp.x + I(ii, 2u) * lp.y + I(ii, 4u), I(ii, 1u) * lp.x + I(ii, 3u) * lp.y + I(ii, 5u));
  var o: VOut;
  o.pos = vec4(w.x / u.view.x * 2.0 - 1.0, 1.0 - w.y / u.view.y * 2.0, 0.0, 1.0);
  o.p = lp;
  o.i = ii;
  return o;
}

fn erfc_(x: f32) -> f32 {                       // Abramowitz and Stegun 7.1.26, error under 1.5e-7
  let ax = abs(x);
  let t = 1.0 / (1.0 + 0.3275911 * ax);
  let y = 1.0 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * exp(-ax * ax);
  return 1.0 - sign(x) * y;
}
fn sdBox(p: vec2<f32>, h: vec2<f32>, rad: vec4<f32>) -> f32 {
  let right = p.x > 0.0;
  let bottom = p.y > 0.0;
  let rr = select(select(rad.x, rad.w, bottom), select(rad.y, rad.z, bottom), right);
  let q = abs(p) - h + rr;
  return min(max(q.x, q.y), 0.0) + length(max(q, vec2(0.0))) - rr;
}
fn sdEll(p: vec2<f32>, h: vec2<f32>) -> f32 {   // Inigo Quilez' approximation: exact on the axes, close elsewhere
  let k0 = length(p / h);
  let k1 = length(p / (h * h));
  return select(k0 * (k0 - 1.0) / k1, -min(h.x, h.y), k1 < 1e-6);
}
fn paintAt(i: u32, p: vec2<f32>) -> vec4<f32> {
  let t = u32(I(i, 20u));
  if (t == 0u) { return vec4(I(i, 16u), I(i, 17u), I(i, 18u), I(i, 19u)); }
  var s: f32;
  if (t == 1u) {
    let a = vec2(I(i, 24u), I(i, 25u));
    let d = vec2(I(i, 26u), I(i, 27u)) - a;
    s = dot(p - a, d) / max(dot(d, d), 1e-9);
  } else {
    s = length(p - vec2(I(i, 24u), I(i, 25u))) / max(I(i, 26u), 1e-6);
  }
  s = clamp(s, 0.0, 1.0);
  let n = u32(I(i, 22u));
  let o = u32(I(i, 21u));
  var col = vec4(stops[o * 5u + 1u], stops[o * 5u + 2u], stops[o * 5u + 3u], stops[o * 5u + 4u]);
  var prev = stops[o * 5u];
  if (s <= prev) { return col; }
  for (var k = 1u; k < n; k = k + 1u) {
    let b = (o + k) * 5u;
    let off = stops[b];
    let c2 = vec4(stops[b + 1u], stops[b + 2u], stops[b + 3u], stops[b + 4u]);
    if (s <= off) { return mix(col, c2, (s - prev) / max(off - prev, 1e-6)); }
    col = c2;
    prev = off;
  }
  return col;
}

@fragment fn fs(v: VOut) -> @location(0) vec4<f32> {
  let px = max(length(dpdx(v.p)), length(dpdy(v.p)));      // local units per device pixel: the width of the anti-aliasing edge
  let i = v.i;
  let kind = u32(I(i, 14u));
  let r = vec4(I(i, 6u), I(i, 7u), I(i, 8u), I(i, 9u));
  let h = r.zw * 0.5;
  let p = v.p - (r.xy + h);
  let rad = vec4(I(i, 10u), I(i, 11u), I(i, 12u), I(i, 13u));
  let param = I(i, 32u);
  var cov = 1.0;
  if (kind == 0u) { cov = clamp(0.5 - sdBox(p, h, rad) / px, 0.0, 1.0); }
  else if (kind == 1u) { cov = clamp(0.5 - sdEll(p, h) / px, 0.0, 1.0); }
  else if (kind == 2u) { cov = clamp(0.5 - (abs(sdBox(p, h, rad)) - param * 0.5) / px, 0.0, 1.0); }
  else if (kind == 3u) { cov = clamp(0.5 - (abs(sdEll(p, h)) - param * 0.5) / px, 0.0, 1.0); }
  else if (kind == 4u) { cov = 0.5 * erfc_(sdBox(p, h, rad) / (max(param, px * 0.5) * 1.41421356)); }
  else if (kind == 5u) { cov = 0.5 * erfc_(sdEll(p, h) / (max(param, px * 0.5) * 1.41421356)); }
  else if (kind == 6u) {
    let uv = mix(vec2(I(i, 28u), I(i, 29u)), vec2(I(i, 30u), I(i, 31u)), (v.p - r.xy) / r.zw);
    cov = textureSampleLevel(atlas, samp, uv, 0.0).a;
  }
  let q = v.pos.xy;                                          // the clip is part of the primitive: a draw call does not end at a clip
  if (q.x < I(i, 36u) || q.y < I(i, 37u) || q.x >= I(i, 38u) || q.y >= I(i, 39u)) { discard; }
  let col = paintAt(i, v.p);
  let a = col.a * cov * I(i, 23u);
  return vec4(col.rgb * a, a);
}
@fragment fn fsClear(v: VOut) -> @location(0) vec4<f32> {
  let q = v.pos.xy;
  if (q.x < I(v.i, 36u) || q.y < I(v.i, 37u) || q.x >= I(v.i, 38u) || q.y >= I(v.i, 39u)) { discard; }
  return vec4(0.0);
}
`;

const BLIT = /* wgsl */ `
@group(0) @binding(0) var scene: texture_2d<f32>;
@vertex fn vsBlit(@builtin(vertex_index) vi: u32) -> @builtin(position) vec4<f32> {
  var p = array<vec2<f32>, 3>(vec2(-1.0, -1.0), vec2(3.0, -1.0), vec2(-1.0, 3.0));
  return vec4(p[vi], 0.0, 1.0);
}
@fragment fn fsBlit(@builtin(position) pos: vec4<f32>) -> @location(0) vec4<f32> { return textureLoad(scene, vec2<i32>(pos.xy), 0); }
`;

// ── device ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
let device, ctx, format, canvas, presenting = true;
let quadPipe, clearPipe, blitPipe, layout, groupLayout, sampler, uniform;
let instBuf, stopBuf, instCap = 0, stopCap = 0;
let scene, sceneView, sceneW = 0, sceneH = 0;
let atlas, atlasView;
let bind = null, blitBind = null;
const errors = [];

/**
 * True when there is a GPU: the canvas is configured and the pipelines are built; false (and nothing changed) when there is none. Call it before the module starts.
 * `present: false` draws into the scene texture only and leaves the canvas alone: `readPixels()` gives the picture back (a test, a benchmark, a server).
 */
export async function ready(id, { present = true } = {}) {
    presenting = present;
    // a second call (another canvas, another device) starts from nothing: nothing of the first device may be used with the second
    instBuf = stopBuf = scene = sceneView = bind = blitBind = null; instCap = stopCap = sceneW = sceneH = 0; runs.clear(); atlasX = atlasY = atlasRow = 0; n = ns = 0; batches = [];
    if (!navigator.gpu) return false;
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) return false;
    device = await adapter.requestDevice();
    device.addEventListener("uncapturederror", (e) => errors.push(e.error.message));
    canvas = document.getElementById(id);
    ctx = present ? canvas.getContext("webgpu") : null;
    if (present && !ctx) return false;
    format = present ? navigator.gpu.getPreferredCanvasFormat() : "rgba8unorm";
    if (present) ctx.configure({ device, format, alphaMode: "premultiplied" });

    const module = device.createShaderModule({ code: SHADER });
    const bgl = groupLayout = device.createBindGroupLayout({ entries: [
        { binding: 0, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: "uniform" } },
        { binding: 1, visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT, buffer: { type: "read-only-storage" } },
        { binding: 2, visibility: GPUShaderStage.FRAGMENT, buffer: { type: "read-only-storage" } },
        { binding: 3, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: "float" } },
        { binding: 4, visibility: GPUShaderStage.FRAGMENT, sampler: { type: "filtering" } },
    ] });
    layout = device.createPipelineLayout({ bindGroupLayouts: [bgl] });
    const premultiplied = { color: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" }, alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" } };
    quadPipe = device.createRenderPipeline({ layout, vertex: { module, entryPoint: "vs" }, fragment: { module, entryPoint: "fs", targets: [{ format, blend: premultiplied }] }, primitive: { topology: "triangle-list" } });
    clearPipe = device.createRenderPipeline({ layout, vertex: { module, entryPoint: "vs" }, fragment: { module, entryPoint: "fsClear", targets: [{ format }] }, primitive: { topology: "triangle-list" } });
    const blit = device.createShaderModule({ code: BLIT });
    blitPipe = device.createRenderPipeline({ layout: "auto", vertex: { module: blit, entryPoint: "vsBlit" }, fragment: { module: blit, entryPoint: "fsBlit", targets: [{ format }] } });
    sampler = device.createSampler({ magFilter: "linear", minFilter: "linear" });
    uniform = device.createBuffer({ size: 16, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    atlas = device.createTexture({ size: [ATLAS, ATLAS], format: "rgba8unorm", usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT });
    atlasView = atlas.createView();
    growBuffers(1024, 256);
    return true;
}

/** The module's own call: the canvas is configured by `ready`, this takes it for the parts that are not drawing. */
export const init = (id) => { if (!device) throw new Error("gfx-gpu: await ready(canvasId) before the module starts"); attach(id); };

function growBuffers(instances, stops) {
    if (instances > instCap) {
        instCap = Math.max(instances, instCap * 2);
        instBuf?.destroy();
        instBuf = device.createBuffer({ size: instCap * F * 4, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST });
        bind = null;
    }
    if (stops > stopCap) {
        stopCap = Math.max(stops, stopCap * 2);
        stopBuf?.destroy();
        stopBuf = device.createBuffer({ size: stopCap * 5 * 4, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST });
        bind = null;
    }
}

// ── the recording ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
let data = new Float32Array(1024 * F), n = 0;
let sdata = new Float32Array(256 * 5), ns = 0;
let batches = [];                               // { clear, sc: [x0, y0, x1, y1] in device px, start, count }
let ratio = 1, cssW = 1, cssH = 1;
let full = false, dirty = false;                // this frame began with a full clear / has something to draw
let st = fresh();
let stack = [];
let path = null;
let paint = { type: 0, r: 0, g: 0, b: 0, a: 255, g0: null, stops: null };
let pendingGrad = null;
let stroking = { r: 0, g: 0, b: 0, a: 255, w: 1 };

const unsupported = {};
const totals = { frames: 0, instances: 0, drawCalls: 0, atlasRuns: 0 };
const no = (why) => { unsupported[why] = (unsupported[why] ?? 0) + 1; };
export const gpuStats = () => ({ ...totals, unsupported: { ...unsupported }, errors: errors.slice(), atlasFill: atlasY + atlasRow });
export const gpuStatsReset = () => { for (const k in unsupported) delete unsupported[k]; errors.length = 0; totals.frames = totals.instances = totals.drawCalls = 0; };

function fresh() { return { m: [1, 0, 0, 1, 0, 0], alpha: 1, sc: null, shadow: null }; }
// the clip array is never changed in place (`intersect` makes a new one), so a copy of the state can share it
const copyState = (s) => ({ m: s.m.slice(), alpha: s.alpha, sc: s.sc, shadow: s.shadow });
const axisAligned = (m) => Math.abs(m[1]) < 1e-9 && Math.abs(m[2]) < 1e-9;
const scale = (m) => Math.sqrt(Math.abs(m[0] * m[3] - m[1] * m[2]));

// a draw call ends only where the pipeline changes (a clear of a region, then the primitives): the clip of each primitive is in its instance
function batch(clear) {
    const last = batches[batches.length - 1];
    if (last && last.clear === clear) { last.count++; return; }
    batches.push({ clear, start: n - 1, count: 1 });
}
function emit(kind, rect, radii, margin, param) {
    if ((n + 1) * F > data.length) { const g = new Float32Array(data.length * 2); g.set(data); data = g; }
    const o = n * F, m = st.m;
    data.fill(0, o, o + F);
    data[o] = m[0]; data[o + 1] = m[1]; data[o + 2] = m[2]; data[o + 3] = m[3]; data[o + 4] = m[4]; data[o + 5] = m[5];
    data[o + 6] = rect[0]; data[o + 7] = rect[1]; data[o + 8] = rect[2]; data[o + 9] = rect[3];
    if (radii) { data[o + 10] = radii[0]; data[o + 11] = radii[1]; data[o + 12] = radii[2]; data[o + 13] = radii[3]; }
    data[o + 14] = kind; data[o + 15] = margin; data[o + 23] = st.alpha; data[o + 32] = param;
    const c = st.sc;
    data[o + 36] = c ? c[0] : 0; data[o + 37] = c ? c[1] : 0; data[o + 38] = c ? c[2] : sceneW; data[o + 39] = c ? c[3] : sceneH;
    n++; dirty = true;
    batch(kind === K.clear);
    return o;
}
function setPaint(o) {
    if (paint.type === 0) { data[o + 16] = paint.r / 255; data[o + 17] = paint.g / 255; data[o + 18] = paint.b / 255; data[o + 19] = paint.a / 255; return; }
    const g = paint.g0, s = paint.stops;
    const count = Math.min(s.length, 8);
    if (s.length > 8) no("gradient with more than 8 stops");
    if ((ns + count) * 5 > sdata.length) { const t = new Float32Array(sdata.length * 2); t.set(sdata); sdata = t; }
    for (let k = 0; k < count; k++) { const j = (ns + k) * 5; sdata[j] = s[k][0]; sdata[j + 1] = s[k][1] / 255; sdata[j + 2] = s[k][2] / 255; sdata[j + 3] = s[k][3] / 255; sdata[j + 4] = s[k][4] / 255; }
    data[o + 20] = paint.type; data[o + 21] = ns; data[o + 22] = count; ns += count;
    data[o + 24] = g[0]; data[o + 25] = g[1]; data[o + 26] = g[2]; data[o + 27] = g[3];
}

// the canvas calls the module makes, in the order gfx.js has them
/** Start a frame: size the targets for the device pixel ratio, forget what was recorded, and clear the whole canvas when the frame is drawn. */
export const begin = (w, h, r) => {
    ratio = r; cssW = w; cssH = h;
    const bw = Math.max(1, Math.round(w * r)), bh = Math.max(1, Math.round(h * r));
    if (canvas.width !== bw || canvas.height !== bh) { canvas.width = bw; canvas.height = bh; }
    if (bw !== sceneW || bh !== sceneH) {
        scene?.destroy();
        scene = device.createTexture({ size: [bw, bh], format, usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC });
        sceneView = scene.createView(); sceneW = bw; sceneH = bh; blitBind = null;
    }
    n = 0; ns = 0; batches = []; stack = []; st = fresh(); path = null;
    full = true; dirty = true;
    if (atlasY + atlasRow > ATLAS * 0.75) resetAtlas();                          // a whole frame's runs fit in what is left; start over before this one is recorded
};
export const region = (x, y, w, h) => {
    const x0 = Math.max(0, Math.floor(x * ratio)), y0 = Math.max(0, Math.floor(y * ratio));
    const x1 = Math.min(sceneW, Math.ceil((x + w) * ratio)), y1 = Math.min(sceneH, Math.ceil((y + h) * ratio));
    stack.push(st); st = copyState(st); st.m = [1, 0, 0, 1, 0, 0];
    st.sc = intersect(st.sc, [x0, y0, x1, y1]);
    emit(K.clear, [0, 0, cssW, cssH], null, 0, 0);
};
export const regionEnd = () => { st = stack.pop() ?? fresh(); };
export const fullFrames = () => (new URLSearchParams(location.search).has("fullframes") ? 1 : 0);

export const save = () => { stack.push(st); st = copyState(st); };
export const restore = () => { st = stack.pop() ?? fresh(); };
export const transform = (a, b, c, d, e, f) => {
    const m = st.m;
    st.m = [m[0] * a + m[2] * b, m[1] * a + m[3] * b, m[0] * c + m[2] * d, m[1] * c + m[3] * d, m[0] * e + m[2] * f + m[4], m[1] * e + m[3] * f + m[5]];
};
const BLEND_NORMAL = 0;
export const layer = (a, m, blurPx) => {
    st.alpha *= a;
    if (m !== BLEND_NORMAL) no("layer blend mode");
    if (blurPx > 0) no("layer blur");
};
export const matrixBegin = () => {};
export const matrixValue = () => {};
export const matrixUse = () => no("colour matrix");

function intersect(a, b) {
    if (!a) return b;
    return [Math.max(a[0], b[0]), Math.max(a[1], b[1]), Math.min(a[2], b[2]), Math.min(a[3], b[3])];
}
const deviceRect = (x, y, w, h) => {
    const m = st.m, x0 = (m[0] * x + m[4]) * ratio, x1 = (m[0] * (x + w) + m[4]) * ratio, y0 = (m[3] * y + m[5]) * ratio, y1 = (m[3] * (y + h) + m[5]) * ratio;
    return [Math.round(Math.min(x0, x1)), Math.round(Math.min(y0, y1)), Math.round(Math.max(x0, x1)), Math.round(Math.max(y0, y1))];
};
export const clip = (x, y, w, h) => {
    if (!axisAligned(st.m)) return no("clip under a rotation");
    st.sc = intersect(st.sc, deviceRect(x, y, w, h));
};
export const clipPath = () => {
    // a clip to a rectangle without rounding is a rectangle clip, whatever way it was built
    if (path?.rect && !path.multi && path.rect[4] === 0 && path.rect[5] === 0 && path.rect[6] === 0 && path.rect[7] === 0 && axisAligned(st.m)) clip(path.rect[0], path.rect[1], path.rect[2], path.rect[3]);
    else no("clip to a path");
};

export const pathBegin = () => { path = null; };
const shape = (p) => { if (path) path.multi = true; else path = p; };
export const roundRect = (x, y, w, h, tl, tr, br, bl) => {
    // radii are scaled down together when two of them do not fit a side (the canvas does the same)
    const wf = (w > 0 ? Math.min(1, w / Math.max(tl + tr, bl + br, 1e-9)) : 0), hf = (h > 0 ? Math.min(1, h / Math.max(tl + bl, tr + br, 1e-9)) : 0), f = Math.min(wf, hf);
    shape({ rect: [x, y, w, h, tl * f, tr * f, br * f, bl * f] });
};
export const ellipse = (x, y, rx, ry) => shape({ ellipse: [x, y, rx, ry] });
export const moveTo = (x, y) => { if (!path) path = { poly: [], multi: false }; if (!path.poly) { path.multi = true; return; } path.poly.push([[x, y]]); };
export const lineTo = (x, y) => { if (path?.poly) { const s = path.poly[path.poly.length - 1]; if (s) s.push([x, y]); } };
export const closePath = () => {};

export const solid = (r, g, b, a) => { paint = { type: 0, r, g, b, a }; };
export const gradLinear = (x0, y0, x1, y1) => { pendingGrad = { type: 1, g0: [x0, y0, x1, y1], stops: [] }; };
export const gradRadial = (x, y, r) => { pendingGrad = { type: 2, g0: [x, y, Math.max(r, 1e-4), 0], stops: [] }; };
export const gradStop = (o, r, g, b, a) => { pendingGrad?.stops.push([Math.min(1, Math.max(0, o)), r, g, b, a]); };
export const gradUse = () => { if (pendingGrad?.stops.length) paint = pendingGrad; };

export const shadowBegin = (ox, oy, blurPx, r, g, b, a) => {
    save();
    st.shadow = { ox, oy, sigma: blurPx / 2, r, g, b, a };
};
export const shadowEnd = () => restore();

const triangles = (pts) => {                    // ear clipping of a simple polygon
    const out = [], idx = pts.map((_, i) => i);
    const area = pts.reduce((s, p, i) => { const q = pts[(i + 1) % pts.length]; return s + (p[0] * q[1] - q[0] * p[1]); }, 0);
    const sign = area >= 0 ? 1 : -1;
    const cross = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    const inside = (p, a, b, c) => cross(a, b, p) * sign >= 0 && cross(b, c, p) * sign >= 0 && cross(c, a, p) * sign >= 0;
    let guard = pts.length * pts.length;
    while (idx.length > 3 && guard-- > 0) {
        let cut = false;
        for (let k = 0; k < idx.length; k++) {
            const a = pts[idx[(k + idx.length - 1) % idx.length]], b = pts[idx[k]], c = pts[idx[(k + 1) % idx.length]];
            if (cross(a, b, c) * sign <= 0) continue;
            if (idx.some((j) => pts[j] !== a && pts[j] !== b && pts[j] !== c && inside(pts[j], a, b, c))) continue;
            out.push([a, b, c]); idx.splice(k, 1); cut = true; break;
        }
        if (!cut) break;
    }
    if (idx.length === 3) out.push(idx.map((j) => pts[j]));
    return out;
};

export const fill = () => {
    if (!path) return;
    if (path.multi) return no("compound path");
    const sh = st.shadow;
    if (sh) {
        // the shape is not drawn, its shadow is: moved by the offset, blurred by sigma (in the units of the shape)
        const saved = st.m, s = scale(st.m);
        st.m = [saved[0], saved[1], saved[2], saved[3], saved[4] + sh.ox, saved[5] + sh.oy];
        const margin = 3 * sh.sigma / Math.max(s, 1e-6);
        const color = paint; paint = { type: 0, r: sh.r, g: sh.g, b: sh.b, a: sh.a };
        const sigma = sh.sigma / Math.max(s, 1e-6);
        if (path.rect) { const r = path.rect; setPaint(emit(K.rectShadow, r, r.slice(4), margin, sigma)); }
        else if (path.ellipse) { const [cx, cy, rx, ry] = path.ellipse; setPaint(emit(K.ellipseShadow, [cx - rx, cy - ry, 2 * rx, 2 * ry], null, margin, sigma)); }
        else no("shadow of a polygon");
        paint = color; st.m = saved;
        return;
    }
    if (path.rect) { const r = path.rect; if (r[2] > 0 && r[3] > 0) setPaint(emit(K.rect, r, r.slice(4), 0, 0)); }
    else if (path.ellipse) { const [cx, cy, rx, ry] = path.ellipse; setPaint(emit(K.ellipse, [cx - rx, cy - ry, 2 * rx, 2 * ry], null, 0, 0)); }
    else if (path.poly) {
        for (const sub of path.poly) {
            if (sub.length < 3) continue;
            for (const t of triangles(sub)) {
                const o = emit(K.triangle, [t[0][0], t[0][1], t[1][0], t[1][1]], null, 0, 0);
                data[o + 10] = t[2][0]; data[o + 11] = t[2][1];
                setPaint(o);
            }
        }
    }
};
export const fillEvenOdd = () => no("even-odd fill");
export const strokeStyle = (r, g, b, a, width) => { stroking = { r, g, b, a, w: width }; };
export const stroke = () => {
    if (!path) return;
    if (path.multi) return no("compound path");
    const s = stroking, saved = paint;
    paint = { type: 0, r: s.r, g: s.g, b: s.b, a: s.a };
    if (path.rect) { const r = path.rect; setPaint(emit(K.rectStroke, r, r.slice(4), s.w / 2, s.w)); }
    else if (path.ellipse) { const [cx, cy, rx, ry] = path.ellipse; setPaint(emit(K.ellipseStroke, [cx - rx, cy - ry, 2 * rx, 2 * ry], null, s.w / 2, s.w)); }
    else no("polygon stroke");
    paint = saved;
};

// ── text: a run is rasterised by the browser once, into the atlas ──────────────────────────────────────────────────────────────────────────────────────
const runs = new Map();
let atlasX = 0, atlasY = 0, atlasRow = 0, scratch = null, scratchCtx = null;
function resetAtlas() { runs.clear(); atlasX = atlasY = atlasRow = 0; }
/** A run rasterised with its origin `fx` of a device pixel (0, 0.25, 0.5 or 0.75) right of the pixel grid, as the browser puts text at a fractional position. */
function glyphRun(s, size, weight, fx) {
    const key = `${weight}|${size}|${ratio}|${fx}|${s}`;
    let e = runs.get(key);
    if (e !== undefined) return e;
    scratch ??= new OffscreenCanvas(256, 64);
    scratchCtx ??= scratch.getContext("2d", { willReadFrequently: false });
    const font = `${weight} ${size * ratio}px ${FONT}`;
    scratchCtx.font = font;
    const m = scratchCtx.measureText(s);
    const padL = Math.max(0, Math.ceil(m.actualBoundingBoxLeft)) + 1;
    const w = padL + Math.ceil(m.actualBoundingBoxRight + fx) + 2;
    const asc = Math.ceil(m.actualBoundingBoxAscent) + 1, h = asc + Math.ceil(m.actualBoundingBoxDescent) + 1;
    if (w <= 2 || h <= 2 || w > ATLAS || h > ATLAS) { runs.set(key, null); return null; }
    if (atlasX + w > ATLAS) { atlasY += atlasRow; atlasX = 0; atlasRow = 0; }
    if (atlasY + h > ATLAS) { no("text atlas full"); return null; }
    if (scratch.width < w || scratch.height < h) { scratch.width = Math.max(scratch.width, w); scratch.height = Math.max(scratch.height, h); }
    scratchCtx.clearRect(0, 0, scratch.width, scratch.height);
    scratchCtx.font = font; scratchCtx.fillStyle = "#fff"; scratchCtx.textBaseline = "alphabetic";
    scratchCtx.fillText(s, padL + fx, asc);
    device.queue.copyExternalImageToTexture({ source: scratch, origin: [0, 0] }, { texture: atlas, origin: [atlasX, atlasY] }, [w, h]);
    e = { u0: atlasX / ATLAS, v0: atlasY / ATLAS, u1: (atlasX + w) / ATLAS, v1: (atlasY + h) / ATLAS, w, h, padL, asc };
    atlasX += w + 1; atlasRow = Math.max(atlasRow, h + 1);
    runs.set(key, e); totals.atlasRuns++;
    return e;
}
/** One run of text with its baseline origin at (x, y). */
export const text = (s, x, y, size, weight, r, g, b, a) => {
    if (s.length === 0) return;
    const m = st.m;
    // with only a translation and the pixel ratio, the run goes on the device pixel grid: the whole pixels are where the quad is, the quarter pixel is in what was rasterised
    // (the baseline is on a whole pixel, as the browser has it)
    const simple = m[0] === 1 && m[3] === 1 && axisAligned(m);
    let fx = 0, qx = x, qy = y;
    if (simple) {
        const dx = (x + m[4]) * ratio;
        let ix = Math.floor(dx);
        fx = Math.round((dx - ix) * 4) / 4;
        if (fx === 1) { fx = 0; ix++; }
        qx = ix / ratio - m[4]; qy = Math.round((y + m[5]) * ratio) / ratio - m[5];
    }
    const e = glyphRun(s, size, weight, fx);
    if (!e) return;
    const saved = paint;
    paint = { type: 0, r, g, b, a };
    const o = emit(K.sprite, [qx - e.padL / ratio, qy - e.asc / ratio, e.w / ratio, e.h / ratio], null, 0, 0);
    data[o + 28] = e.u0; data[o + 29] = e.v0; data[o + 30] = e.u1; data[o + 31] = e.v1;
    setPaint(o);
    paint = saved;
};

// ── the frame ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
/** Draw what was recorded since the last call, and put it on the canvas.  `mount` calls it after every frame of the module; a page that drives the exports itself calls it too. */
export function flush() {
    if (!dirty || !device) return;
    dirty = false;
    growBuffers(n, ns);
    device.queue.writeBuffer(instBuf, 0, data, 0, n * F);
    if (ns > 0) device.queue.writeBuffer(stopBuf, 0, sdata, 0, ns * 5);
    device.queue.writeBuffer(uniform, 0, new Float32Array([cssW, cssH, ratio, 0]));
    if (!bind) bind = device.createBindGroup({ layout: groupLayout, entries: [
        { binding: 0, resource: { buffer: uniform } }, { binding: 1, resource: { buffer: instBuf } }, { binding: 2, resource: { buffer: stopBuf } },
        { binding: 3, resource: atlasView }, { binding: 4, resource: sampler } ] });
    if (presenting && !blitBind) blitBind = device.createBindGroup({ layout: blitPipe.getBindGroupLayout(0), entries: [{ binding: 0, resource: sceneView }] });

    const enc = device.createCommandEncoder();
    const pass = enc.beginRenderPass({ colorAttachments: [{ view: sceneView, loadOp: full ? "clear" : "load", storeOp: "store", clearValue: { r: 0, g: 0, b: 0, a: 0 } }] });
    pass.setBindGroup(0, bind);
    let calls = 0;
    pass.setScissorRect(0, 0, sceneW, sceneH);
    for (const b of batches) {
        pass.setPipeline(b.clear ? clearPipe : quadPipe);
        pass.draw(6, b.count, 0, b.start);
        calls++;
    }
    pass.end();
    if (presenting) {
        const out = enc.beginRenderPass({ colorAttachments: [{ view: ctx.getCurrentTexture().createView(), loadOp: "clear", storeOp: "store", clearValue: { r: 0, g: 0, b: 0, a: 0 } }] });
        out.setPipeline(blitPipe); out.setBindGroup(0, blitBind); out.draw(3); out.end();
    }
    device.queue.submit([enc.finish()]);
    totals.frames++; totals.instances += n; totals.drawCalls += calls + 1;
    full = false; n = 0; ns = 0; batches = [];
}

/** The picture as it is now: `{ width, height, data }`, 8-bit RGBA with premultiplied alpha, top row first.  The host has to be `ready(id, { present: false })`. */
export async function readPixels() {
    if (presenting) throw new Error("gfx-gpu: readPixels needs ready(id, { present: false })");
    const row = Math.ceil(sceneW * 4 / 256) * 256;
    const buf = device.createBuffer({ size: row * sceneH, usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ });
    const enc = device.createCommandEncoder();
    enc.copyTextureToBuffer({ texture: scene }, { buffer: buf, bytesPerRow: row }, [sceneW, sceneH]);
    device.queue.submit([enc.finish()]);
    await buf.mapAsync(GPUMapMode.READ);
    const mapped = new Uint8Array(buf.getMappedRange());
    const data = new Uint8Array(sceneW * sceneH * 4);
    for (let y = 0; y < sceneH; y++) data.set(mapped.subarray(y * row, y * row + sceneW * 4), y * sceneW * 4);
    buf.unmap(); buf.destroy();
    return { width: sceneW, height: sceneH, data };
}

/**
 * Resolves two animation frames after the frames submitted so far have been drawn (a test reads the canvas after this).  It does not ask the queue
 * (`onSubmittedWorkDone`): in headless Chromium 153 with SwiftShader that call fails with "A valid external Instance reference no longer exists" as soon as a canvas has been
 * presented, with this host and with a page of a dozen lines alike (2026-11-24); nothing else here waits on the queue.
 */
export const settled = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));

/** Wire the canvas to the exports of a graphics module and start the frame loop; the frames are drawn by this host. */
export const mount = (instance, id) =>
    mountCanvas({ exports: { ...instance.exports, frame: (t) => { instance.exports.frame(t); flush(); } } }, id);
