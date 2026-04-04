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
val onClick : Element -> (unit -> unit) -> unit
val onSubmit : Element -> (unit -> unit) -> unit
val onInput : Element -> (string -> unit) -> unit
val onChange : Element -> (string -> unit) -> unit
val onKeyDown : Element -> (unit -> unit) -> unit
val onKeyUp : Element -> (unit -> unit) -> unit
val onMouseOver : Element -> (unit -> unit) -> unit
val onMouseOut : Element -> (unit -> unit) -> unit
val off : Element -> string -> unit
```

## Browser.Canvas

Canvas 2D drawing API.

```fsharp
type Context2D                          // Typed 2D context wrapper

val getContext : Element -> Context2D
val fillRect : Context2D -> float -> float -> float -> float -> unit
val strokeRect : Context2D -> float -> float -> float -> float -> unit
val clearRect : Context2D -> float -> float -> float -> float -> unit
val setFillStyle : Context2D -> string -> unit
val setStrokeStyle : Context2D -> string -> unit
val setLineWidth : Context2D -> float -> unit
val beginPath : Context2D -> unit
val closePath : Context2D -> unit
val moveTo : Context2D -> float -> float -> unit
val lineTo : Context2D -> float -> float -> unit
val arc : Context2D -> float -> float -> float -> float -> float -> unit
val fill : Context2D -> unit
val stroke : Context2D -> unit
val fillText : Context2D -> string -> float -> float -> unit
val setFont : Context2D -> string -> unit
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

HTTP Fetch and WebSocket.

```fsharp
type WebSocket                         // Typed WebSocket wrapper

val fetchText : string -> string
val fetchJson : string -> Handle
val postJson : string -> obj -> Handle
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

Persistent key-value storage.

```fsharp
type Database                          // Typed DB wrapper

val openDb : string -> int -> Database
val put : Database -> string -> string -> unit
val get : Database -> string -> string
val delete : Database -> string -> unit
val getAllKeys : Database -> string[]
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

WebGPU (basic support).

```fsharp
type Adapter
type Device
type GpuContext

val isAvailable : unit -> bool
val requestAdapter : unit -> Adapter
val requestDevice : Adapter -> Device
val configureContext : Element -> Device -> string -> GpuContext
val getPreferredFormat : unit -> string
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
