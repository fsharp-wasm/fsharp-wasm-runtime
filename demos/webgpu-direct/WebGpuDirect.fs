module Demos.WebGpuDirect

// WebGPU from F#, with no JavaScript of the page's own: a spinning triangle on a canvas (a vertex buffer, a uniform that changes every
// frame, a WGSL render pipeline), the same triangle drawn into a texture and read back as pixels, and two compute jobs (squares of a
// few numbers through text; squares of a thousand through the module's linear memory). The page and the test read the status lines.
//
// The canvas is presented only when the button is pressed. A software adapter (headless Chromium on SwiftShader) loses its device when
// a canvas is presented again and again, and with it every other device of the page (measured 2026-11-28 with plain WebGPU, no code of
// ours, in seven combinations of flags and headless modes); the texture and the compute jobs run at the start, so they never depend
// on that, and the test presses the button last.

open Browser.Dom
open Browser.Events
open Browser.Gpu
open Browser.Timing
open Browser.WasmMemory

let triangleShader = """
struct Spin { angle: f32, aspect: f32 }
@group(0) @binding(0) var<uniform> spin: Spin;

struct Vertex { @location(0) position: vec2f, @location(1) color: vec3f }
struct Varying { @builtin(position) position: vec4f, @location(0) color: vec3f }

@vertex fn vs(v: Vertex) -> Varying {
    let c = cos(spin.angle);
    let s = sin(spin.angle);
    var out: Varying;
    // the turn happens in screen space: x is shrunk by the aspect (height / width) so that the triangle keeps its shape
    out.position = vec4f((v.position.x * c - v.position.y * s) * spin.aspect, v.position.x * s + v.position.y * c, 0.0, 1.0);
    out.color = v.color;
    return out;
}

@fragment fn fs(v: Varying) -> @location(0) vec4f { return vec4f(v.color, 1.0); }
"""

let squareShader = """
@group(0) @binding(0) var<storage, read_write> values: array<f32>;

@compute @workgroup_size(64) fn square(@builtin(global_invocation_id) id: vec3u) {
    if (id.x < arrayLength(&values)) { values[id.x] = values[id.x] * values[id.x]; }
}
"""

/// x, y, r, g, b: red at the top, green bottom left, blue bottom right.
let triangle = [ 0.0; 0.7; 1.0; 0.0; 0.0
                 -0.7; -0.6; 0.0; 1.0; 0.0
                 0.7; -0.6; 0.0; 0.0; 1.0 ]

let layout =
    { Stride = 20
      PerInstance = false
      Attributes = [ { Location = 0; Format = Float32x2; Offset = 0 }
                     { Location = 1; Format = Float32x3; Offset = 8 } ] }

let clear = (0.05, 0.07, 0.15, 1.0)

let say (id: string) (text: string) = setText (Element.ofId id) text

/// What the triangle needs on one device, for targets of one format.
type Triangle = { Pipeline: RenderPipeline; Vertices: GpuBuffer; Spin: GpuBuffer; Group: BindGroup }

let makeTriangle (device: Device) (format: string) : Triangle =
    let shader = createShader device triangleShader
    let pipeline = createRenderPipeline device { renderDesc shader format with Layouts = [ layout ] }
    let vertices = createBuffer device 60 (Usage.vertex ||| Usage.copyDst)
    writeFloats device vertices 0 triangle
    let spin = createBuffer device 16 (Usage.uniform ||| Usage.copyDst)
    { Pipeline = pipeline
      Vertices = vertices
      Spin = spin
      Group = createRenderBindGroup device pipeline 0 [ bindBuffer 0 spin ] }

/// The angle goes to the uniform; the shader turns the triangle in screen space (4:3, so the aspect is 0.75).
let setAngle (device: Device) (t: Triangle) (angle: float) = writeFloats device t.Spin 0 [ angle; 0.75 ]

let drawTriangle (t: Triangle) (pass: RenderPass) =
    Render.setPipeline pass t.Pipeline
    Render.setBindGroup pass 0 t.Group
    Render.setVertexBuffer pass 0 t.Vertices
    Render.draw pass 3 1

/// The triangle, turning on the canvas, one frame after the other.
let spinTriangle (device: Device) =
    let format = getPreferredFormat ()
    let context = configureContext (Element.ofId "scene") device format
    let t = makeTriangle device format
    let frames = ref 0
    let lost = ref false
    onLost device (fun why ->
        lost.Value <- true
        say "canvas-status" ("the device of the canvas was lost, " + why))
    let rec frame () =
        if not lost.Value then
            setAngle device t (float frames.Value * 0.02)
            submit device (fun enc -> renderPass enc context clear (drawTriangle t))
            frames.Value <- frames.Value + 1
            say "frames" ("frames: " + string frames.Value)
            requestAnimationFrame frame |> ignore
    say "canvas-status" "drawing on the canvas"
    frame ()

/// The triangle at angle 0 into a texture and back as numbers: the pixel at a corner (the clear colour), in the middle and near the top.
let triangleToTexture (device: Device) =
    let width = 128
    let height = 96
    let texture = createTexture device width height "rgba8unorm" (TextureUsage.renderAttachment ||| TextureUsage.copySrc)
    let t = makeTriangle device "rgba8unorm"
    setAngle device t 0.0
    submit device (fun enc -> renderPassToTexture enc texture clear (drawTriangle t))
    readPixels device texture 0 0 width height (fun pixels ->
        let px = List.toArray pixels
        let at (x: int) (y: int) =
            let i = (y * width + x) * 4
            string px.[i] + "," + string px.[i + 1] + "," + string px.[i + 2] + "," + string px.[i + 3]
        if px.Length <> width * height * 4 then say "offscreen" "offscreen pixels: the read failed"
        else say "offscreen" ("offscreen pixels: corner=" + at 2 2 + " middle=" + at 64 48 + " top=" + at 64 20))

/// The squares of 1..8, computed on the GPU: the numbers go in as text and come out as text.
let squaresThroughText (device: Device) =
    let shader = createShader device squareShader
    let pipeline = createComputePipeline device shader "square"
    let values = createBuffer device 32 (Usage.storage ||| Usage.copyDst ||| Usage.copySrc)
    writeFloats device values 0 [ 1.0; 2.0; 3.0; 4.0; 5.0; 6.0; 7.0; 8.0 ]
    let group = createComputeBindGroup device pipeline 0 [ bindBuffer 0 values ]
    submit device (fun enc ->
        computePass enc (fun pass ->
            Compute.setPipeline pass pipeline
            Compute.setBindGroup pass 0 group
            Compute.dispatch pass 1 1 1))
    readFloats device values 8 (fun squares ->
        say "squares" ("squares: " + (squares |> List.map (fun x -> string (int x)) |> String.concat ",")))

/// The squares of 0..1023: written into the module's linear memory, copied to the GPU from there, squared, copied back into
/// the memory, and summed here. 1024 floats are 4096 bytes: no text anywhere.
let squaresThroughMemory (device: Device) =
    let n = 1024
    let bytes = n * 4
    let source = 0
    let result = bytes
    for i in 0 .. n - 1 do
        storeF32 (source + i * 4) (float32 i)
    let shader = createShader device squareShader
    let pipeline = createComputePipeline device shader "square"
    let values = createBuffer device bytes (Usage.storage ||| Usage.copyDst ||| Usage.copySrc)
    writeFromMemory device values 0 source bytes
    let group = createComputeBindGroup device pipeline 0 [ bindBuffer 0 values ]
    submit device (fun enc ->
        computePass enc (fun pass ->
            Compute.setPipeline pass pipeline
            Compute.setBindGroup pass 0 group
            Compute.dispatch pass ((n + 63) / 64) 1 1))
    readToMemory device values bytes result (fun ok ->
        if not ok then say "memory-sum" "sum of squares: the read failed"
        else
            let mutable sum = 0.0
            for i in 0 .. n - 1 do
                sum <- sum + float (loadF32 (result + i * 4))
            say "memory-sum" ("sum of squares: " + string (int64 sum)))

let start () =
    if not (isAvailable ()) then
        say "gpu" "WebGPU is not available in this browser."
    else
        requestDevice
            (fun device ->
                say "gpu" "WebGPU device ready."
                triangleToTexture device
                squaresThroughText device
                squaresThroughMemory device
                onClick (Element.ofId "animate") (fun () -> spinTriangle device))
            (say "gpu")
