/// Browser.Gpu — WebGPU directly from F#: a device, WGSL shaders, buffers, render and compute pipelines, bind groups, passes, readback.
///
/// A module cannot wait for a promise, so what is asynchronous ends in a callback (`requestDevice`, `readFloats`, `readToMemory`).
/// What is made once (a device, a shader, a buffer, a pipeline, a bind group) is a handle in the runtime's store; what lives for one
/// frame (an encoder, a pass) is made and released by `submit`, `renderPass` and `computePass`, so a frame loop leaks nothing.
///
///     requestDevice (fun device -> … ) (fun why -> …)
///     submit device (fun enc ->
///         renderPass enc context (0.0, 0.0, 0.0, 1.0) (fun pass ->
///             Render.setPipeline pass pipeline
///             Render.draw pass 3 1))
///
/// Numbers go to a buffer as text (`writeFloats`, fine for uniforms and small meshes) or from the module's own linear memory
/// (`writeFromMemory`, with `Browser.WasmMemory.storeF32`: the path for large data, no text in between).
module Browser.Gpu

open Fable.Core
open Browser.Core

[<Import("isGpuAvailable",     "runtime/gpu.js")>]
let private jsIsGpuAvailable () : bool = nativeOnly
[<Import("getPreferredFormat", "runtime/gpu.js")>]
let private jsGetPreferredFormat () : string = nativeOnly
[<Import("requestAdapter",     "runtime/gpu.js")>]
let private jsRequestAdapter (cb: Handle -> unit) : unit = nativeOnly
[<Import("requestDevice",      "runtime/gpu.js")>]
let private jsRequestDevice (adapter: Handle) (cb: Handle -> unit) : unit = nativeOnly
[<Import("onLost",             "runtime/gpu.js")>]
let private jsOnLost (device: Handle) (cb: string -> unit) : unit = nativeOnly
[<Import("configureContext",   "runtime/gpu.js")>]
let private jsConfigureContext (canvas: Handle) (device: Handle) (fmt: string) : Handle = nativeOnly
[<Import("release",            "runtime/gpu.js")>]
let private jsRelease (id: Handle) : unit = nativeOnly

[<Import("createShaderModule", "runtime/gpu.js")>]
let private jsCreateShaderModule (device: Handle) (code: string) : Handle = nativeOnly
[<Import("shaderErrors",       "runtime/gpu.js")>]
let private jsShaderErrors (shader: Handle) (cb: string -> unit) : unit = nativeOnly

[<Import("createBuffer",       "runtime/gpu.js")>]
let private jsCreateBuffer (device: Handle) (size: int) (usage: int) : Handle = nativeOnly
[<Import("destroyBuffer",      "runtime/gpu.js")>]
let private jsDestroyBuffer (buffer: Handle) : unit = nativeOnly
[<Import("writeFloats",        "runtime/gpu.js")>]
let private jsWriteFloats (device: Handle) (buffer: Handle) (byteOffset: int) (values: string) : unit = nativeOnly
[<Import("writeUints",         "runtime/gpu.js")>]
let private jsWriteUints (device: Handle) (buffer: Handle) (byteOffset: int) (values: string) : unit = nativeOnly
[<Import("writeFromMemory",    "runtime/gpu.js")>]
let private jsWriteFromMemory (device: Handle) (buffer: Handle) (byteOffset: int) (memOffset: int) (byteLength: int) : unit = nativeOnly
[<Import("readFloats",         "runtime/gpu.js")>]
let private jsReadFloats (device: Handle) (buffer: Handle) (byteSize: int) (cb: string -> unit) : unit = nativeOnly
[<Import("readToMemory",       "runtime/gpu.js")>]
let private jsReadToMemory (device: Handle) (buffer: Handle) (byteSize: int) (memOffset: int) (cb: int -> unit) : unit = nativeOnly

[<Import("createTexture",      "runtime/gpu.js")>]
let private jsCreateTexture (device: Handle) (width: int) (height: int) (fmt: string) (usage: int) : Handle = nativeOnly
[<Import("destroyTexture",     "runtime/gpu.js")>]
let private jsDestroyTexture (texture: Handle) : unit = nativeOnly
[<Import("readPixels",         "runtime/gpu.js")>]
let private jsReadPixels (device: Handle) (texture: Handle) (x: int) (y: int) (width: int) (height: int) (cb: string -> unit) : unit = nativeOnly

[<Import("createRenderPipeline",  "runtime/gpu.js")>]
let private jsCreateRenderPipeline (device: Handle) (shader: Handle) (vertexEntry: string) (fragmentEntry: string) (fmt: string) (topology: string) (layouts: string) (blend: bool) : Handle = nativeOnly
[<Import("createComputePipeline", "runtime/gpu.js")>]
let private jsCreateComputePipeline (device: Handle) (shader: Handle) (entry: string) : Handle = nativeOnly
[<Import("createBindGroup",       "runtime/gpu.js")>]
let private jsCreateBindGroup (device: Handle) (pipeline: Handle) (group: int) (entries: string) : Handle = nativeOnly

[<Import("createEncoder",      "runtime/gpu.js")>]
let private jsCreateEncoder (device: Handle) : Handle = nativeOnly
[<Import("submit",             "runtime/gpu.js")>]
let private jsSubmit (device: Handle) (encoder: Handle) : unit = nativeOnly
[<Import("copyBuffer",         "runtime/gpu.js")>]
let private jsCopyBuffer (encoder: Handle) (src: Handle) (srcOffset: int) (dst: Handle) (dstOffset: int) (size: int) : unit = nativeOnly
[<Import("beginRenderPass",    "runtime/gpu.js")>]
let private jsBeginRenderPass (encoder: Handle) (context: Handle) (r: float) (g: float) (b: float) (a: float) : Handle = nativeOnly
[<Import("beginTexturePass",   "runtime/gpu.js")>]
let private jsBeginTexturePass (encoder: Handle) (texture: Handle) (r: float) (g: float) (b: float) (a: float) : Handle = nativeOnly
[<Import("beginComputePass",   "runtime/gpu.js")>]
let private jsBeginComputePass (encoder: Handle) : Handle = nativeOnly
[<Import("passSetPipeline",    "runtime/gpu.js")>]
let private jsPassSetPipeline (pass: Handle) (pipeline: Handle) : unit = nativeOnly
[<Import("passSetBindGroup",   "runtime/gpu.js")>]
let private jsPassSetBindGroup (pass: Handle) (index: int) (group: Handle) : unit = nativeOnly
[<Import("passEnd",            "runtime/gpu.js")>]
let private jsPassEnd (pass: Handle) : unit = nativeOnly
[<Import("renderSetVertexBuffer", "runtime/gpu.js")>]
let private jsRenderSetVertexBuffer (pass: Handle) (slot: int) (buffer: Handle) : unit = nativeOnly
[<Import("renderSetIndexBuffer",  "runtime/gpu.js")>]
let private jsRenderSetIndexBuffer (pass: Handle) (buffer: Handle) (fmt: string) : unit = nativeOnly
[<Import("renderDraw",         "runtime/gpu.js")>]
let private jsRenderDraw (pass: Handle) (vertices: int) (instances: int) : unit = nativeOnly
[<Import("renderDrawIndexed",  "runtime/gpu.js")>]
let private jsRenderDrawIndexed (pass: Handle) (indices: int) (instances: int) : unit = nativeOnly
[<Import("renderSetViewport",  "runtime/gpu.js")>]
let private jsRenderSetViewport (pass: Handle) (x: float) (y: float) (w: float) (h: float) : unit = nativeOnly
[<Import("renderSetScissor",   "runtime/gpu.js")>]
let private jsRenderSetScissor (pass: Handle) (x: int) (y: int) (w: int) (h: int) : unit = nativeOnly
[<Import("computeDispatch",    "runtime/gpu.js")>]
let private jsComputeDispatch (pass: Handle) (x: int) (y: int) (z: int) : unit = nativeOnly

[<Import("pushErrorScope",     "runtime/gpu.js")>]
let private jsPushErrorScope (device: Handle) : unit = nativeOnly
[<Import("popErrorScope",      "runtime/gpu.js")>]
let private jsPopErrorScope (device: Handle) (cb: string -> unit) : unit = nativeOnly

// ── the objects ──────────────────────────────────────────────────────────────

type Device = private Dev of Handle
type GpuContext = private GpuCtx of Handle
type GpuTexture = private Tex of Handle
type Shader = private Shader of Handle
type GpuBuffer = private Buf of Handle
type RenderPipeline = private RPipe of Handle
type ComputePipeline = private CPipe of Handle
type BindGroup = private Group of Handle
type Encoder = private Enc of Handle
type RenderPass = private RPass of Handle
type ComputePass = private CPass of Handle

/// `GPUBufferUsage`, combined with `|||`: `Usage.vertex ||| Usage.copyDst`.
module Usage =
    let mapRead = 1
    let mapWrite = 2
    let copySrc = 4
    let copyDst = 8
    let index = 16
    let vertex = 32
    let uniform = 64
    let storage = 128

/// `GPUTextureUsage`, combined with `|||`.
module TextureUsage =
    let copySrc = 1
    let copyDst = 2
    let textureBinding = 4
    let storageBinding = 8
    let renderAttachment = 16

// ── device and canvas ────────────────────────────────────────────────────────

let isAvailable () = jsIsGpuAvailable ()

/// The texture format of the canvas that suits the device ("bgra8unorm" or "rgba8unorm"); "" without WebGPU.
let getPreferredFormat () = jsGetPreferredFormat ()

/// The adapter and then the device: `onReady` gets the device, `onFail` says why there is none.
let requestDevice (onReady: Device -> unit) (onFail: string -> unit) : unit =
    jsRequestAdapter (fun adapter ->
        if adapter = nil then onFail "WebGPU: no adapter (the browser has no WebGPU, or no suitable GPU)"
        else
            jsRequestDevice adapter (fun device ->
                if device = nil then onFail "WebGPU: the adapter gave no device"
                else onReady (Dev device)))

/// `cb` gets "reason: message" when the device is lost (a driver reset, a GPU process that died, `destroy`). A lost device does nothing
/// any more and says nothing; without this callback the browser's console gets a warning.
let onLost (Dev device) (cb: string -> unit) : unit = jsOnLost device cb

/// Makes `canvas` a target for passes of this device; `format` is `getPreferredFormat ()` unless the pipeline says otherwise.
let configureContext (canvas: Browser.Dom.Element) (Dev device) (format: string) : GpuContext =
    GpuCtx (jsConfigureContext canvas.Handle device format)

// ── shaders ──────────────────────────────────────────────────────────────────

/// A WGSL module. Mistakes in it are reported by `shaderErrors` (and by the console).
let createShader (Dev device) (code: string) : Shader = Shader (jsCreateShaderModule device code)

/// The shader compiler's errors as "error line:column message" lines; "" when the shader is clean.
let shaderErrors (Shader shader) (cb: string -> unit) : unit = jsShaderErrors shader cb

// ── buffers ──────────────────────────────────────────────────────────────────

/// `size` is in bytes and a multiple of 4.
let createBuffer (Dev device) (size: int) (usage: int) : GpuBuffer = Buf (jsCreateBuffer device size usage)
let destroyBuffer (Buf buffer) : unit = jsDestroyBuffer buffer

let private floatsText (values: float list) = values |> List.map string |> String.concat ","
let private intsText (values: int list) = values |> List.map string |> String.concat ","

/// float32 values, written at `byteOffset`; the buffer needs `Usage.copyDst`.
let writeFloats (Dev device) (Buf buffer) (byteOffset: int) (values: float list) : unit =
    jsWriteFloats device buffer byteOffset (floatsText values)

/// uint32 values (indices, counters), written at `byteOffset`.
let writeUints (Dev device) (Buf buffer) (byteOffset: int) (values: int list) : unit =
    jsWriteUints device buffer byteOffset (intsText values)

/// `byteLength` bytes of the module's own linear memory from `memOffset` (see Browser.WasmMemory), written at `byteOffset`; no text in between.
let writeFromMemory (Dev device) (Buf buffer) (byteOffset: int) (memOffset: int) (byteLength: int) : unit =
    jsWriteFromMemory device buffer byteOffset memOffset byteLength

/// `count` float32 values of the buffer (it needs `Usage.copySrc`), once the GPU has made them; the empty list when reading failed.
let readFloats (Dev device) (Buf buffer) (count: int) (cb: float list -> unit) : unit =
    jsReadFloats device buffer (count * 4) (fun text ->
        cb (if text = "" then [] else text.Split(',') |> Array.map float |> Array.toList))

/// `byteSize` bytes of the buffer into the module's linear memory at `memOffset`; `cb` gets whether that worked.
let readToMemory (Dev device) (Buf buffer) (byteSize: int) (memOffset: int) (cb: bool -> unit) : unit =
    jsReadToMemory device buffer byteSize memOffset (fun ok -> cb (ok = 1))

// ── textures ─────────────────────────────────────────────────────────────────

/// A 2D texture of `width` x `height`. Use "rgba8unorm" to read the pixels back in the order r, g, b, a (the canvas format is often "bgra8unorm").
let createTexture (Dev device) (width: int) (height: int) (format: string) (usage: int) : GpuTexture =
    Tex (jsCreateTexture device width height format usage)
let destroyTexture (Tex texture) : unit = jsDestroyTexture texture

/// A rectangle of the texture (8 bits per channel; it needs `TextureUsage.copySrc`) as the numbers r, g, b, a, r, g, b, a, … row by row from
/// the top, in the order of the texture's channels; the empty list when reading failed.
let readPixels (Dev device) (Tex texture) (x: int) (y: int) (width: int) (height: int) (cb: int list -> unit) : unit =
    jsReadPixels device texture x y width height (fun text ->
        cb (if text = "" then [] else text.Split(',') |> Array.map int |> Array.toList))

// ── pipelines ────────────────────────────────────────────────────────────────

type VertexFormat =
    | Float32 | Float32x2 | Float32x3 | Float32x4
    | Uint32 | Sint32 | Unorm8x4

type Topology = TriangleList | TriangleStrip | LineList | LineStrip | PointList

/// `Location` is the `@location` of the vertex shader's input.
type VertexAttribute = { Location: int; Format: VertexFormat; Offset: int }

/// One vertex buffer: the bytes between two vertices (or two instances) and what is in them.
type VertexLayout = { Stride: int; PerInstance: bool; Attributes: VertexAttribute list }

let private formatName format =
    match format with
    | Float32 -> "float32"
    | Float32x2 -> "float32x2"
    | Float32x3 -> "float32x3"
    | Float32x4 -> "float32x4"
    | Uint32 -> "uint32"
    | Sint32 -> "sint32"
    | Unorm8x4 -> "unorm8x4"

let private topologyName topology =
    match topology with
    | TriangleList -> "triangle-list"
    | TriangleStrip -> "triangle-strip"
    | LineList -> "line-list"
    | LineStrip -> "line-strip"
    | PointList -> "point-list"

let private layoutsText (layouts: VertexLayout list) =
    let attribute a = string a.Location + ":" + formatName a.Format + ":" + string a.Offset
    let layout l =
        string l.Stride + ":" + (if l.PerInstance then "instance" else "vertex") + "|" + (l.Attributes |> List.map attribute |> String.concat ",")
    layouts |> List.map layout |> String.concat ";"

type RenderPipelineDesc =
    { Shader: Shader
      VertexEntry: string
      FragmentEntry: string
      /// The format of the target: `getPreferredFormat ()` for the canvas.
      Format: string
      Topology: Topology
      Layouts: VertexLayout list
      /// Alpha blending (source over) instead of overwriting.
      Blend: bool }

/// A pipeline over the entry points `vs` and `fs` of the shader: triangles, no vertex buffers, no blending; change what differs with `{ … with … }`.
let renderDesc (shader: Shader) (format: string) : RenderPipelineDesc =
    { Shader = shader; VertexEntry = "vs"; FragmentEntry = "fs"; Format = format
      Topology = TriangleList; Layouts = []; Blend = false }

let createRenderPipeline (Dev device) (desc: RenderPipelineDesc) : RenderPipeline =
    let (Shader shader) = desc.Shader
    RPipe (jsCreateRenderPipeline device shader desc.VertexEntry desc.FragmentEntry desc.Format (topologyName desc.Topology) (layoutsText desc.Layouts) desc.Blend)

/// A compute pipeline over one entry point of the shader.
let createComputePipeline (Dev device) (Shader shader) (entry: string) : ComputePipeline =
    CPipe (jsCreateComputePipeline device shader entry)

/// A buffer at a `@binding` of a bind group; `Size` 0 is the rest of the buffer from `Offset`.
type Binding = { Slot: int; Buffer: GpuBuffer; Offset: int; Size: int }

/// The whole buffer at binding `slot`.
let bindBuffer (slot: int) (buffer: GpuBuffer) : Binding = { Slot = slot; Buffer = buffer; Offset = 0; Size = 0 }

let private bindGroup device pipeline (group: int) (bindings: Binding list) : BindGroup =
    let entry b =
        let (Buf buffer) = b.Buffer
        string b.Slot + ":" + string buffer + ":" + string b.Offset + ":" + string b.Size
    Group (jsCreateBindGroup device pipeline group (bindings |> List.map entry |> String.concat ","))

/// The bind group `group` of the pipeline's shader (`@group(n)`), with these buffers.
let createRenderBindGroup (Dev device) (RPipe pipeline) (group: int) (bindings: Binding list) : BindGroup =
    bindGroup device pipeline group bindings

let createComputeBindGroup (Dev device) (CPipe pipeline) (group: int) (bindings: Binding list) : BindGroup =
    bindGroup device pipeline group bindings

/// Frees the handle of something made once; the GPU keeps what is still in use. Buffers: `destroyBuffer`.
let releaseShader (Shader shader) : unit = jsRelease shader
let releaseRenderPipeline (RPipe pipeline) : unit = jsRelease pipeline
let releaseComputePipeline (CPipe pipeline) : unit = jsRelease pipeline
let releaseBindGroup (Group group) : unit = jsRelease group

// ── commands ─────────────────────────────────────────────────────────────────

/// Records commands into an encoder and gives them to the queue when `record` returns.
let submit (Dev device) (record: Encoder -> unit) : unit =
    let encoder = jsCreateEncoder device
    record (Enc encoder)
    jsSubmit device encoder

/// A copy on the GPU, in bytes (a multiple of 4).
let copyBuffer (Enc encoder) (Buf src) (srcOffset: int) (Buf dst) (dstOffset: int) (size: int) : unit =
    jsCopyBuffer encoder src srcOffset dst dstOffset size

/// A pass that clears the canvas to the colour (r, g, b, a) and draws into it; `record` issues the draws.
let renderPass (Enc encoder) (GpuCtx context) (clear: float * float * float * float) (record: RenderPass -> unit) : unit =
    let (r, g, b, a) = clear
    let pass = jsBeginRenderPass encoder context r g b a
    record (RPass pass)
    jsPassEnd pass

/// The same into a texture (`TextureUsage.renderAttachment`): nothing is presented, so it works where no canvas does, and `readPixels` gives the picture back.
let renderPassToTexture (Enc encoder) (Tex texture) (clear: float * float * float * float) (record: RenderPass -> unit) : unit =
    let (r, g, b, a) = clear
    let pass = jsBeginTexturePass encoder texture r g b a
    record (RPass pass)
    jsPassEnd pass

let computePass (Enc encoder) (record: ComputePass -> unit) : unit =
    let pass = jsBeginComputePass encoder
    record (CPass pass)
    jsPassEnd pass

module Render =
    let setPipeline (RPass pass) (RPipe pipeline) : unit = jsPassSetPipeline pass pipeline
    let setBindGroup (RPass pass) (index: int) (Group group) : unit = jsPassSetBindGroup pass index group
    let setVertexBuffer (RPass pass) (slot: int) (Buf buffer) : unit = jsRenderSetVertexBuffer pass slot buffer
    /// Indices of 32 bits (written with `writeUints`).
    let setIndexBuffer (RPass pass) (Buf buffer) : unit = jsRenderSetIndexBuffer pass buffer "uint32"
    let draw (RPass pass) (vertices: int) (instances: int) : unit = jsRenderDraw pass vertices instances
    let drawIndexed (RPass pass) (indices: int) (instances: int) : unit = jsRenderDrawIndexed pass indices instances
    let setViewport (RPass pass) (x: float) (y: float) (width: float) (height: float) : unit = jsRenderSetViewport pass x y width height
    let setScissor (RPass pass) (x: int) (y: int) (width: int) (height: int) : unit = jsRenderSetScissor pass x y width height

module Compute =
    let setPipeline (CPass pass) (CPipe pipeline) : unit = jsPassSetPipeline pass pipeline
    let setBindGroup (CPass pass) (index: int) (Group group) : unit = jsPassSetBindGroup pass index group
    /// `x * y * z` workgroups of the size the shader declares.
    let dispatch (CPass pass) (x: int) (y: int) (z: int) : unit = jsComputeDispatch pass x y z

// ── errors ───────────────────────────────────────────────────────────────────

/// Runs `body` and gives `cb` the first validation error it caused ("" when there was none), instead of the console.
let validate (Dev device) (body: unit -> unit) (cb: string -> unit) : unit =
    jsPushErrorScope device
    body ()
    jsPopErrorScope device cb
