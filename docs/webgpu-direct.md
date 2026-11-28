# WebGPU from F#

`Browser.Gpu` is WebGPU for an F# program compiled to WebAssembly GC: a device, WGSL shaders, buffers, render and compute
pipelines, bind groups, passes and readback. The demo is [`demos/webgpu-direct`](../demos/webgpu-direct/WebGpuDirect.fs); the
API list is in [BrowserApi.md](BrowserApi.md#browsergpu).

(The scene graph's own canvas renderer, `gfx-gpu.js`, is a different thing, described in [webgpu.md](webgpu.md): a host
written for one purpose, the SDF scene. This module is for programs that want to talk to the GPU themselves.)

## The shape of it

- **A module cannot wait for a promise.** Everything asynchronous ends in a callback: `requestDevice onReady onFail`,
  `readFloats`, `readToMemory`, `shaderErrors`, `validate`. In an Elmish program the callback dispatches a message.
- **Made once, released once.** A device, shader, buffer, pipeline and bind group is a handle in the runtime's store; free
  buffers with `destroyBuffer`, the rest with `releaseShader` and friends when a program goes on for long.
- **One frame, no handles.** `submit` makes an encoder and gives it to the queue when its function returns; `renderPass` and
  `computePass` begin and end a pass around theirs. The view of the canvas is taken inside `renderPass`. A frame loop that
  writes a uniform, submits and asks for the next frame leaks nothing.
- **Structured arguments are text.** Vertex layouts, bind group entries and lists of numbers cross as text, like everywhere
  in this runtime. That is fine for a uniform or a small mesh. For large data, use the linear memory (below).

## Draw

```fsharp
open Browser.Gpu

let layout =
    { Stride = 20; PerInstance = false
      Attributes = [ { Location = 0; Format = Float32x2; Offset = 0 }     // x, y
                     { Location = 1; Format = Float32x3; Offset = 8 } ] }  // r, g, b

requestDevice
    (fun device ->
        let format = getPreferredFormat ()
        let context = configureContext (Element.ofId "scene") device format
        let pipeline = createRenderPipeline device { renderDesc (createShader device wgsl) format with Layouts = [ layout ] }
        let vertices = createBuffer device 60 (Usage.vertex ||| Usage.copyDst)
        writeFloats device vertices 0 [ 0.0; 0.7; 1.0; 0.0; 0.0;  -0.7; -0.6; 0.0; 1.0; 0.0;  0.7; -0.6; 0.0; 0.0; 1.0 ]
        submit device (fun enc ->
            renderPass enc context (0.0, 0.0, 0.0, 1.0) (fun pass ->
                Render.setPipeline pass pipeline
                Render.setVertexBuffer pass 0 vertices
                Render.draw pass 3 1)))
    (fun why -> printfn "%s" why)
```

`renderDesc shader format` is a pipeline over the entry points `vs` and `fs`, triangles, no vertex buffers and no blending;
change what differs with `{ … with Topology = LineList; Blend = true }`.

## Uniforms and bind groups

A uniform or storage buffer is given to a shader through a bind group of the pipeline (`layout: "auto"`):

```fsharp
let spin = createBuffer device 16 (Usage.uniform ||| Usage.copyDst)
let group = createRenderBindGroup device pipeline 0 [ bindBuffer 0 spin ]    // @group(0) @binding(0)
// every frame
writeFloats device spin 0 [ angle; 0.75 ]
… Render.setBindGroup pass 0 group
```

WGSL's rules for the layout of a uniform apply (a struct of two `f32` is 8 bytes, but a buffer is made 16 so that a `vec4`
fits later).

## Compute and readback

```fsharp
let pipeline = createComputePipeline device shader "square"
let values = createBuffer device 32 (Usage.storage ||| Usage.copyDst ||| Usage.copySrc)
writeFloats device values 0 [ 1.0; 2.0; 3.0; 4.0; 5.0; 6.0; 7.0; 8.0 ]
let group = createComputeBindGroup device pipeline 0 [ bindBuffer 0 values ]
submit device (fun enc ->
    computePass enc (fun pass ->
        Compute.setPipeline pass pipeline
        Compute.setBindGroup pass 0 group
        Compute.dispatch pass 1 1 1))
readFloats device values 8 (fun squares -> … )      // [1; 4; 9; …], once the GPU is done
```

`readFloats` copies the buffer (it needs `Usage.copySrc`) into a staging buffer, waits for the GPU, hands the numbers to the
callback and destroys the staging buffer. The list is empty when reading failed.

## Large data through the linear memory

`Browser.WasmMemory` gives the module a linear memory (`storeF32`, `loadF32`, …, lowered to the instructions of WebAssembly).
`writeFromMemory` and `readToMemory` move bytes between that memory and a buffer with no text in between:

```fsharp
for i in 0 .. n - 1 do storeF32 (i * 4) (float32 i)
writeFromMemory device values 0 0 (n * 4)
… // compute
readToMemory device values (n * 4) (n * 4) (fun ok -> … loadF32 (n * 4 + i * 4) …)
```

The module needs to have used `Browser.WasmMemory` somewhere (that is what gives it a memory); a module without one gets an
error that says so.

## Mistakes in the shader and in the calls

- `shaderErrors shader (fun errors -> …)` gives the compiler's messages as `error line:col message` lines, `""` when clean.
- A validation error that nobody asked for goes to the browser's console (`[gpu] …`). `validate device (fun () -> …) (fun
  error -> …)` runs a body and gives the first validation error it caused to a callback instead.

## Textures: drawing without a canvas, and the pixels back

A texture can be a render target. Nothing is presented, so it works where no canvas does (a server, a test, an image made in a
worker), and `readPixels` gives the picture back as numbers:

```fsharp
let texture = createTexture device 128 96 "rgba8unorm" (TextureUsage.renderAttachment ||| TextureUsage.copySrc)
submit device (fun enc -> renderPassToTexture enc texture (0.05, 0.07, 0.15, 1.0) (fun pass -> … ))
readPixels device texture 0 0 128 96 (fun pixels -> … )    // r, g, b, a, r, g, b, a, … row by row from the top
```

Use "rgba8unorm" when the order of the channels matters (the canvas format is often "bgra8unorm"). The pipeline's `Format`
is the format of its target. `readPixels` packs the rows (the GPU wants a multiple of 256 bytes per row) and takes 8-bit,
four-channel formats.

## A lost device

`onLost device (fun why -> …)` is told when the device is lost (a driver reset, a GPU process that died, `destroy`). A lost
device does nothing any more and says nothing, so a program that draws every frame should stop. Without the callback the
browser's console gets a warning.

**Measured 2026-11-28, headless Chromium 153 on SwiftShader (no GPU) in this container:** presenting a configured canvas
again and again loses the device after one to three frames, and `mapAsync` on any buffer fails afterwards with "A valid
external Instance reference no longer exists" (the other devices of the page go too). This is plain WebGPU, no code of this
repository: seven combinations of flags and modes (the flags of `tests/e2e/lib.mjs`, without the Vulkan feature, with
software GL, in-process GPU, no frame limit, the new headless mode, and headed under Xvfb) gave the same. `webgpu.md` has
the same observation from 2026-11-24. On a real GPU it was not measured here. That is why the demo draws on its canvas only
when the button is pressed, and why the e2e test judges the texture and the compute jobs first and presses the button last.

## Not there yet

Samplers and textures as shader inputs, depth buffers, multisampling, storage textures, timestamp queries and render bundles. A
bind group takes buffers only. A buffer's contents come back as float32 (`readFloats`) or as bytes in memory
(`readToMemory`); the pixels of a texture come back as a list (`readPixels`), not into the linear memory. The e2e test runs
against SwiftShader (a software adapter): it checks what is drawn and computed, not the speed of a GPU.
