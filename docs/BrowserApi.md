# Browser API Reference

Complete reference for all `Browser.*` modules.

## Browser.Core

Foundation types shared by all modules.

```fsharp
type Handle = int        // Opaque handle to a JS object
let nil : Handle = 0     // Invalid/null handle
let body : Handle = 1    // document.body (pre-registered)
```

## Browser.Dom

DOM element creation and manipulation.

```fsharp
type Element                           // Typed wrapper around a handle

module Element =
    val create : string -> Element     // Create element by tag name
    val text : string -> Element       // Create text node
    val ofId : string -> Element       // Get element by DOM id
    val ofHandle : int -> Element      // Wrap a raw handle
    val nil : Element                  // Invalid element
    val isValid : Element -> bool      // Check if handle is valid
    val body : Element                 // document.body

val append : Element -> Element -> unit
val removeFrom : Element -> Element -> unit
val remove : Element -> unit
val setText : Element -> string -> unit
val setHtml : Element -> string -> unit
val setAttr : Element -> string -> string -> unit
val removeAttr : Element -> string -> unit
val setClass : Element -> string -> unit
val setStyle : Element -> string -> string -> unit
val clear : Element -> unit
val querySelector : Element -> string -> Element
val getValue : Element -> string
val setValue : Element -> string -> unit
val focus : Element -> unit
val scrollIntoView : Element -> unit
```

## Browser.Events

Event listener management.

```fsharp
val onClick      : Element -> (unit -> unit) -> unit
val onDblClick   : Element -> (unit -> unit) -> unit
val onFocus      : Element -> (unit -> unit) -> unit
val onBlur       : Element -> (unit -> unit) -> unit
val onSubmit     : Element -> (unit -> unit) -> unit
val onInput      : Element -> (string -> unit) -> unit
val onChange     : Element -> (string -> unit) -> unit
val onKeyDown    : Element -> (unit -> unit) -> unit
val onKeyUp      : Element -> (unit -> unit) -> unit
val onKeyPress   : Element -> (unit -> unit) -> unit
val onMouseDown  : Element -> (unit -> unit) -> unit
val onMouseUp    : Element -> (unit -> unit) -> unit
val onMouseMove  : Element -> (unit -> unit) -> unit
val onMouseOver  : Element -> (unit -> unit) -> unit
val onMouseOut   : Element -> (unit -> unit) -> unit
val onMouseEnter : Element -> (unit -> unit) -> unit
val onMouseLeave : Element -> (unit -> unit) -> unit
val onScroll     : Element -> (unit -> unit) -> unit
val onContextMenu: Element -> (unit -> unit) -> unit
val onDragStart  : Element -> (unit -> unit) -> unit
val onDragEnd    : Element -> (unit -> unit) -> unit
val onDrop       : Element -> (unit -> unit) -> unit
val off          : Element -> string -> unit
```

## Browser.Pointer

Pointer events — unified mouse, touch, and stylus input.

```fsharp
type PointerArgs = { X: float; Y: float; PointerId: int }

val onPointerDown   : Element -> (PointerArgs -> unit) -> unit
val onPointerMove   : Element -> (PointerArgs -> unit) -> unit
val onPointerUp     : Element -> (PointerArgs -> unit) -> unit
val onPointerCancel : Element -> (PointerArgs -> unit) -> unit
val onPointerEnter  : Element -> (PointerArgs -> unit) -> unit
val onPointerLeave  : Element -> (PointerArgs -> unit) -> unit
val offPointerDown  : Element -> unit
val offPointerMove  : Element -> unit
val offPointerUp    : Element -> unit
val setCapture      : Element -> int -> unit
val releaseCapture  : Element -> int -> unit
```

## Browser.Cookies

`document.cookie` read/write helpers.

```fsharp
val get      : string -> string         // read cookie (returns "" if missing)
val set      : string -> string -> int -> unit  // name, value, days
val setAtPath: string -> string -> int -> string -> unit
val delete   : string -> unit
val has      : string -> bool
val allNames : unit -> string list
```

## Browser.Clipboard

Async Clipboard API (text copy/paste).

```fsharp
val writeText : string -> (unit -> unit) -> (string -> unit) -> unit
val readText  : (string -> unit) -> (string -> unit) -> unit
```

## Browser.Files

Hand a text to the person as a file (a download). Call it from a click handler: the browser saves or asks by its own rules.

```fsharp
val download : string -> string -> string -> unit   // file name, mime type ("" is text/plain), text
```

## Browser.Location

Browser URL and History API.

```fsharp
val href        : unit -> string
val pathname    : unit -> string
val hash        : unit -> string
val search      : unit -> string
val origin      : unit -> string
val queryParam  : string -> string
val navigateTo  : string -> unit
val pushState   : string -> unit
val replaceState: string -> unit
val back        : unit -> unit
val forward     : unit -> unit
val reload      : unit -> unit
val onPopState  : (string -> unit) -> unit
```

## Browser.Canvas

The 2D canvas. See `demos/canvas-draw` for all of it on one picture; the e2e test checks its pixels.

```fsharp
type Context2D                          // Typed 2D context wrapper
type Gradient

val getContext : Element -> Context2D

// rectangles and paths
val fillRect : Context2D -> float -> float -> float -> float -> unit
val strokeRect : Context2D -> float -> float -> float -> float -> unit
val clearRect : Context2D -> float -> float -> float -> float -> unit
val beginPath : Context2D -> unit
val closePath : Context2D -> unit
val moveTo : Context2D -> float -> float -> unit
val lineTo : Context2D -> float -> float -> unit
val arc : Context2D -> float -> float -> float -> float -> float -> unit
val arcTo : Context2D -> float -> float -> float -> float -> float -> unit
val ellipse : Context2D -> float -> float -> float -> float -> float -> float -> float -> unit
val rect : Context2D -> float -> float -> float -> float -> unit          // a rectangle as a subpath
val roundRect : Context2D -> float -> float -> float -> float -> float -> unit
val quadraticCurveTo : Context2D -> float -> float -> float -> float -> unit
val bezierCurveTo : Context2D -> float -> float -> float -> float -> float -> float -> unit
val fill : Context2D -> unit
val fillEvenOdd : Context2D -> unit     // a subpath inside another one is a hole
val stroke : Context2D -> unit
val clip : Context2D -> unit            // what is drawn next shows only inside the path
val clipEvenOdd : Context2D -> unit

// transforms and state
val save : Context2D -> unit
val restore : Context2D -> unit
val withState : Context2D -> (unit -> 'T) -> 'T    // save, run, restore: the transform, clip and style are put back
val translate : Context2D -> float -> float -> unit
val rotate : Context2D -> float -> unit            // radians
val scale : Context2D -> float -> float -> unit
val setTransform : Context2D -> float -> float -> float -> float -> float -> float -> unit
val resetTransform : Context2D -> unit

// colour, line, shadow, compositing
val setFillStyle : Context2D -> string -> unit
val setStrokeStyle : Context2D -> string -> unit
val setLineWidth : Context2D -> float -> unit
val setLineCap : Context2D -> string -> unit       // "butt" | "round" | "square"
val setLineJoin : Context2D -> string -> unit      // "miter" | "round" | "bevel"
val setMiterLimit : Context2D -> float -> unit
val setLineDash : Context2D -> float list -> unit  // dash and gap lengths; [] is a solid line
val setGlobalAlpha : Context2D -> float -> unit
val setShadow : Context2D -> string -> float -> float -> float -> unit   // colour, blur, dx, dy
val clearShadow : Context2D -> unit
val setCompositeOperation : Context2D -> string -> unit                  // "source-over", "multiply", "lighter", …

// gradients
val createLinearGradient : Context2D -> float -> float -> float -> float -> Gradient
val createRadialGradient : Context2D -> float -> float -> float -> float -> float -> float -> Gradient
val addColorStop : Gradient -> float -> string -> unit
val setFillGradient : Context2D -> Gradient -> unit
val setStrokeGradient : Context2D -> Gradient -> unit
val linearGradient : Context2D -> float -> float -> float -> float -> (float * string) list -> Gradient

// text
val setFont : Context2D -> string -> unit
val fillText : Context2D -> string -> float -> float -> unit
val strokeText : Context2D -> string -> float -> float -> unit
val setTextAlign : Context2D -> string -> unit
val setTextBaseline : Context2D -> string -> unit
val measureText : Context2D -> string -> float     // the width the text takes in the current font

// another canvas drawn into this one
val drawCanvas : Context2D -> Element -> float -> float -> float -> float -> unit
```

## Browser.Components

Native Web Components defined in F#.

```fsharp
val define : string -> (Element -> unit) -> unit
```

**Example:**
```fsharp
Browser.Components.define "my-widget" (fun root ->
    let el = Element.create "div"
    setText el "Hello from F#!"
    append root el)
```

## Browser.Net

HTTP and WebSocket.  A module cannot wait for a promise, so every answer comes to a callback; `request` gives it the status (0 when no answer arrived at all) and the body.

```fsharp
type WebSocket                         // Typed WebSocket wrapper

val request : httpMethod: string -> url: string -> body: string -> headers: (string * string) list -> (int -> string -> unit) -> unit
val get : string -> (int -> string -> unit) -> unit
val post : string -> string -> (int -> string -> unit) -> unit   // the body is JSON text
val fetchText : string -> (string -> unit) -> unit
val fetchJson : string -> (Handle -> unit) -> unit
val postJson : string -> string -> (Handle -> unit) -> unit
val wsOpen : string -> WebSocket
val wsSend : WebSocket -> string -> unit
val wsOnMessage : WebSocket -> (string -> unit) -> unit
val wsOnOpen : WebSocket -> (unit -> unit) -> unit
val wsOnClose : WebSocket -> (unit -> unit) -> unit
val wsClose : WebSocket -> unit
```

## Browser.PubSub

Local in-process event bus.

```fsharp
val subscribe : string -> (string -> unit) -> unit
val unsubscribe : string -> (string -> unit) -> unit
val publish : string -> string -> unit
val clearTopic : string -> unit
```

## Browser.Storage

localStorage and sessionStorage.

```fsharp
module Local =
    val get : string -> string
    val set : string -> string -> unit
    val remove : string -> unit
    val clear : unit -> unit

module Session =
    val get : string -> string
    val set : string -> string -> unit
    val remove : string -> unit
    val clear : unit -> unit
```

## Browser.IndexedDb

Persistent key-value storage. IndexedDB is asynchronous and a WasmGC module cannot block on a promise, so every
operation takes the callback that continues the program — in an Elmish program, a callback that dispatches a message.

```fsharp
type Database                          // Typed DB wrapper

val openDb : string -> int -> (Database -> unit) -> unit
val put : Database -> string -> string -> (unit -> unit) -> unit
val get : Database -> string -> (string -> unit) -> unit      // "" when the key does not exist
val delete : Database -> string -> (unit -> unit) -> unit
val getAllKeys : Database -> (string[] -> unit) -> unit
```

## Browser.Workers

Web Worker management.

```fsharp
type Worker                            // Typed Worker wrapper

val create : string -> Worker
val postMessage : Worker -> string -> unit
val onMessage : Worker -> (string -> unit) -> unit
val onError : Worker -> (string -> unit) -> unit
val terminate : Worker -> unit
```

## Browser.Timing

Timer and animation frame scheduling.

```fsharp
val setTimeout : int -> (unit -> unit) -> int
val setInterval : int -> (unit -> unit) -> int
val clearTimeout : int -> unit
val clearInterval : int -> unit
val requestAnimationFrame : (unit -> unit) -> int
val cancelAnimationFrame : int -> unit
```

## Browser.Gpu

WebGPU, directly: a device, WGSL shaders, buffers, render and compute pipelines, bind groups, passes and readback. What is
asynchronous (`requestDevice`, `readFloats`, `readToMemory`, `shaderErrors`) ends in a callback. What is made once is a handle
in the runtime's store; an encoder and a pass live for one frame and are released by `submit`, `renderPass` and `computePass`,
so a frame loop leaks nothing. See `docs/webgpu-direct.md` and `demos/webgpu-direct`.

```fsharp
type Device; GpuContext; GpuTexture; Shader; GpuBuffer; RenderPipeline; ComputePipeline; BindGroup; Encoder; RenderPass; ComputePass

module Usage =                                    // GPUBufferUsage, combined with |||
    val mapRead; mapWrite; copySrc; copyDst; index; vertex; uniform; storage : int

val isAvailable : unit -> bool
val getPreferredFormat : unit -> string
val requestDevice : (Device -> unit) -> (string -> unit) -> unit      // onReady, onFail (why there is none)
val configureContext : Element -> Device -> string -> GpuContext

val createShader : Device -> string -> Shader                         // WGSL
val shaderErrors : Shader -> (string -> unit) -> unit                 // "error line:col message" lines, "" when clean

module TextureUsage =                             // GPUTextureUsage, combined with |||
    val copySrc; copyDst; textureBinding; storageBinding; renderAttachment : int

val onLost : Device -> (string -> unit) -> unit                       // "reason: message", when the device is lost

val createBuffer : Device -> int -> int -> GpuBuffer                  // size in bytes (a multiple of 4), usage
val destroyBuffer : GpuBuffer -> unit
val writeFloats : Device -> GpuBuffer -> int -> float list -> unit    // float32, at a byte offset
val writeUints : Device -> GpuBuffer -> int -> int list -> unit       // uint32
val writeFromMemory : Device -> GpuBuffer -> int -> int -> int -> unit // byte offset, memory offset, byte length
val readFloats : Device -> GpuBuffer -> int -> (float list -> unit) -> unit
val readToMemory : Device -> GpuBuffer -> int -> int -> (bool -> unit) -> unit

val createTexture : Device -> int -> int -> string -> int -> GpuTexture   // width, height, format ("rgba8unorm"), usage
val destroyTexture : GpuTexture -> unit
val readPixels : Device -> GpuTexture -> int -> int -> int -> int -> (int list -> unit) -> unit   // x, y, width, height; r,g,b,a,…

type VertexFormat = Float32 | Float32x2 | Float32x3 | Float32x4 | Uint32 | Sint32 | Unorm8x4
type Topology = TriangleList | TriangleStrip | LineList | LineStrip | PointList
type VertexAttribute = { Location: int; Format: VertexFormat; Offset: int }
type VertexLayout = { Stride: int; PerInstance: bool; Attributes: VertexAttribute list }
type RenderPipelineDesc = { Shader; VertexEntry; FragmentEntry; Format; Topology; Layouts; Blend }
val renderDesc : Shader -> string -> RenderPipelineDesc               // entry points "vs" and "fs", triangles, no blending
val createRenderPipeline : Device -> RenderPipelineDesc -> RenderPipeline
val createComputePipeline : Device -> Shader -> string -> ComputePipeline

type Binding = { Slot: int; Buffer: GpuBuffer; Offset: int; Size: int }
val bindBuffer : int -> GpuBuffer -> Binding
val createRenderBindGroup : Device -> RenderPipeline -> int -> Binding list -> BindGroup
val createComputeBindGroup : Device -> ComputePipeline -> int -> Binding list -> BindGroup

val submit : Device -> (Encoder -> unit) -> unit
val copyBuffer : Encoder -> GpuBuffer -> int -> GpuBuffer -> int -> int -> unit
val renderPass : Encoder -> GpuContext -> (float * float * float * float) -> (RenderPass -> unit) -> unit
val renderPassToTexture : Encoder -> GpuTexture -> (float * float * float * float) -> (RenderPass -> unit) -> unit
val computePass : Encoder -> (ComputePass -> unit) -> unit
module Render =  setPipeline; setBindGroup; setVertexBuffer; setIndexBuffer; draw; drawIndexed; setViewport; setScissor
module Compute = setPipeline; setBindGroup; dispatch

val validate : Device -> (unit -> unit) -> (string -> unit) -> unit   // the first validation error of the body, "" when none
val releaseShader; releaseRenderPipeline; releaseComputePipeline; releaseBindGroup
```

## Browser.Css

CSS DSL with active patterns and computation expressions.

```fsharp
// Active patterns
val (|Class|_|) : string -> string option
val (|StyleProp|_|) : string * string -> (string * string) option

// Style builder CE
val styles : StyleBuilder

// CSS property helpers
val background : string -> CssProp
val color : string -> CssProp
val fontSize : string -> CssProp
// ... (see full list in source)

val applyStyles : Element -> CssProp list -> unit
```
