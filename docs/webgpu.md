# WebGPU for the canvas

Dated 2026-11-24. What was run that day is said as measured; what was not measured is said as not measured.

## Where it stood

Before this: `runtime/gpu.js` could ask for an adapter and a device and configure a canvas, and `demos/webgpu-basic` checked that `navigator.gpu` exists. Nothing drew with it.

## What it is now

`runtime/gfx-gpu.js` is the drawing surface of fsharp-wasm-graphics on WebGPU, **in place of** `runtime/gfx.js` and with the same imports, so no compiled module changes:

```js
import { boot } from "./runtime/boot.js";
import * as gpu from "./runtime/gfx-gpu.js";

if (await gpu.ready("canvas")) {                      // false without a GPU: use gfx.js then
  const instance = await boot({ wasm, entry: "start", imports: { "runtime/gfx.js": gpu } });
  gpu.mount(instance, "canvas");
}
```

`demos/accounting-grid` does this for `?renderer=webgpu`, says which renderer it is using, and falls back to Canvas 2D, saying so, when there is no WebGPU.

### How it draws

What the module draws is recorded as **instances of a few primitives** and drawn at the end of the frame, in the order it was drawn, by one pipeline. The idea is the one of GPUI (Zed) and of egui: a quad per primitive, and the shape is a signed distance evaluated per pixel, not a tessellated path.

| primitive | what |
|---|---|
| rect, ellipse | filled or stroked; per-corner radii; the edge is anti-aliased by the pixel size, so it is right under any scale; solid, linear or radial paint (up to 8 stops) |
| shadow | a rectangle or an ellipse blurred by an error function; CSS blur radius / 2 is the sigma, as in the canvas |
| text | a run is rasterised once by the browser into an atlas (at the quarter of a pixel its position has), then drawn as a textured quad tinted by the colour |
| triangle | what a simple polygon fill is cut into (ear clipping); not anti-aliased |

- **Clips** are a rectangle in each instance, and the fragment shader drops what is outside. A scissor rectangle per clip made one draw call per clipped cell in the accounting grid (211 a frame); with the clip in the instance a frame is **one draw call** (measured, same pictures).
- **State** is an affine matrix per instance (so a line, which the sink draws as a rotated rounded rectangle, is a primitive like the others), an alpha per instance (a layer's alpha, multiplied as the canvas does).
- **The picture stays between frames** in a texture, so that a partial redraw (`region`, which the editors use to redraw what changed) draws only that; a blit puts it on the canvas.

### What it does not do, and how it says so

Counted, never skipped silently: `gpuStats().unsupported` has the count by reason. A page that must be exact asserts that it is empty (the two tests below do).

- a polygon stroke (icons drawn as paths), a compound path, an even-odd fill, a shadow of a polygon
- a clip that is not a rectangle, or a rectangle that a rotation has turned
- a layer with a blend mode, a blur or a colour matrix
- a gradient of more than 8 stops
- text is the browser's own (`measureText`, `fillText` into the atlas), not GlyphAura's shaping

## Measured, 2026-11-24

Headless Chromium 153, **no GPU**: the adapter is SwiftShader's, a software Vulkan. That shows that the pictures agree. It says nothing about how fast a GPU is, and nothing about what the browser needs to rasterise the 2D canvas.

- `tests/e2e/gpu.mjs`: one drawing script, a band per feature (fills, strokes, ellipses, gradients, shadows, clips and transforms, text, layer alpha and a polygon), both hosts, pixel ratio 1 and 2. The mean difference per band is 0.04 to 0.53 of 255, at most 0.37 % of the pixels differ by more than 40 of 255. Nothing was skipped, no validation errors.
- `tests/e2e/gpu-grid.mjs`: the **accounting grid**, a module that was written without WebGPU in mind, drawn by both hosts after the same real mouse events (first frame, scrolled sideways three times, a cell selected). Mean difference 0.75 to 1.42 of 255; 0.74 to 0.78 % of the pixels differ by more than 40, which are the edges of glyphs. Nothing skipped, no validation errors.
- The main thread's time per scrolled frame of that grid (the module's frame, plus the submit in the GPU host), 160 frames: **Canvas 2D median 1.8 ms (p95 3.6), WebGPU median 0.9 ms (p95 5.6)**. The 95th percentile is worse on WebGPU: the recording allocates (a record per path and per paint), and a frame that puts new text into the atlas uploads it. Not measured: GPU time, the browser's raster time, battery, a real GPU at all.

Two things found on the way, both in this Chromium with SwiftShader: after a canvas has been presented, `GPUQueue.onSubmittedWorkDone`, `mapAsync` and `drawImage` of the canvas fail with "A valid external Instance reference no longer exists" (a page of a dozen lines does it too). The host does not wait on the queue; `ready(id, { present: false })` draws into the texture only and `readPixels()` gives the picture back, which is how the tests read it.

## Next, in the order of what it would buy

1. **Real hardware numbers.** The one thing this machine cannot give; the test and the page are there to run on a GPU.
2. **Paths**: polygon strokes (the icons) by expanding the stroke on the CPU into triangles with the anti-aliasing in the fragment shader, and clip paths with a stencil.
3. **Layers**: a layer with a blend mode, a blur or a colour matrix draws into a texture of its own and is composed; that is what a filter is on a GPU.
4. **Text from GlyphAura**: the signed-distance atlas and the shaping GlyphAura already has, so that text is resolution independent and the same on every host.
5. **Recording without allocation**, and **an OffscreenCanvas in a Worker**: the module records in one thread, the GPU host draws in another.
6. **Compute**: the prefix sums of `FSharp.Wasm.Frame` (the cube of the accounting grid) are a scan, which is what a compute shader is for; that is where data science meets this.
