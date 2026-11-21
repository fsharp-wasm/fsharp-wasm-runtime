module Browser.Events

open Fable.Core
open Browser.Core
open Browser.Dom

[<Import("on",       "runtime/events.js")>]
let jsOn (id: Handle) (event: string) (cb: Handle -> unit) : unit = nativeOnly

[<Import("off",      "runtime/events.js")>]
let jsOff (id: Handle) (event: string) : unit = nativeOnly

[<Import("onInput",  "runtime/events.js")>]
let jsOnInput (id: Handle) (cb: string -> unit) : unit = nativeOnly

[<Import("onChange",  "runtime/events.js")>]
let jsOnChange (id: Handle) (cb: string -> unit) : unit = nativeOnly

[<Import("onPointerDown",   "runtime/events.js")>]
let jsOnPointerDown (id: Handle) (cb: float -> float -> unit) : unit = nativeOnly

[<Import("onPointerMove",   "runtime/events.js")>]
let jsOnPointerMove (id: Handle) (cb: float -> float -> unit) : unit = nativeOnly

[<Import("onPointerUp",     "runtime/events.js")>]
let jsOnPointerUp (id: Handle) (cb: float -> float -> unit) : unit = nativeOnly

[<Import("onPointerCancel", "runtime/events.js")>]
let jsOnPointerCancel (id: Handle) (cb: unit -> unit) : unit = nativeOnly

[<Import("onKeyDown",       "runtime/events.js")>]
let jsOnKeyDown (id: Handle) (cb: string -> unit) : unit = nativeOnly

[<Import("onFrameMessage",  "runtime/events.js")>]
let jsOnFrameMessage (selector: string) (cb: string -> unit) : unit = nativeOnly

[<Import("postToFrame",     "runtime/events.js")>]
let jsPostToFrame (selector: string) (json: string) : unit = nativeOnly

[<Import("swallowClick",    "runtime/events.js")>]
let jsSwallowClick () : unit = nativeOnly

[<Import("measureSlots",    "runtime/events.js")>]
let jsMeasureSlots (cb: float -> float -> float -> float -> float -> float -> unit) : unit = nativeOnly

// ─── Click / Focus / Blur ────────────────────────────────────────────────────

let onClick    (el: Element) (f: unit -> unit)   = let (El id) = el in jsOn id "click"    (fun _ -> f ())
let onDblClick (el: Element) (f: unit -> unit)   = let (El id) = el in jsOn id "dblclick" (fun _ -> f ())
let onFocus    (el: Element) (f: unit -> unit)   = let (El id) = el in jsOn id "focus"    (fun _ -> f ())
let onBlur     (el: Element) (f: unit -> unit)   = let (El id) = el in jsOn id "blur"     (fun _ -> f ())
let onSubmit   (el: Element) (f: unit -> unit)   = let (El id) = el in jsOn id "submit"   (fun _ -> f ())

// ─── Input / Change ──────────────────────────────────────────────────────────

let onInput  (el: Element) (f: string -> unit) = let (El id) = el in jsOnInput  id f
let onChange (el: Element) (f: string -> unit) = let (El id) = el in jsOnChange id f

// ─── Keyboard ────────────────────────────────────────────────────────────────

let onKeyDown  (el: Element) (f: unit -> unit) = let (El id) = el in jsOn id "keydown"  (fun _ -> f ())
let onKeyUp    (el: Element) (f: unit -> unit) = let (El id) = el in jsOn id "keyup"    (fun _ -> f ())
let onKeyPress (el: Element) (f: unit -> unit) = let (El id) = el in jsOn id "keypress" (fun _ -> f ())

// ─── Mouse ───────────────────────────────────────────────────────────────────

let onMouseDown  (el: Element) (f: unit -> unit) = let (El id) = el in jsOn id "mousedown"  (fun _ -> f ())
let onMouseUp    (el: Element) (f: unit -> unit) = let (El id) = el in jsOn id "mouseup"    (fun _ -> f ())
let onMouseMove  (el: Element) (f: unit -> unit) = let (El id) = el in jsOn id "mousemove"  (fun _ -> f ())
let onMouseOver  (el: Element) (f: unit -> unit) = let (El id) = el in jsOn id "mouseover"  (fun _ -> f ())
let onMouseOut   (el: Element) (f: unit -> unit) = let (El id) = el in jsOn id "mouseout"   (fun _ -> f ())
let onMouseEnter (el: Element) (f: unit -> unit) = let (El id) = el in jsOn id "mouseenter" (fun _ -> f ())
let onMouseLeave (el: Element) (f: unit -> unit) = let (El id) = el in jsOn id "mouseleave" (fun _ -> f ())

// ─── Scroll / Resize ─────────────────────────────────────────────────────────

let onScroll (el: Element) (f: unit -> unit) = let (El id) = el in jsOn id "scroll" (fun _ -> f ())
let onResize (el: Element) (f: unit -> unit) = let (El id) = el in jsOn id "resize" (fun _ -> f ())

// ─── Context menu / Drag ─────────────────────────────────────────────────────

let onContextMenu  (el: Element) (f: unit -> unit) = let (El id) = el in jsOn id "contextmenu" (fun _ -> f ())
let onDragStart    (el: Element) (f: unit -> unit) = let (El id) = el in jsOn id "dragstart"   (fun _ -> f ())
let onDragEnd      (el: Element) (f: unit -> unit) = let (El id) = el in jsOn id "dragend"     (fun _ -> f ())
let onDrop         (el: Element) (f: unit -> unit) = let (El id) = el in jsOn id "drop"        (fun _ -> f ())

// ─── Detach ───────────────────────────────────────────────────────────────────

let off (el: Element) event = let (El id) = el in jsOff id event

// ─── Dragging ────────────────────────────────────────────────

/// A press on the element, with the pointer captured: the moves and the release come to the element wherever the pointer goes.  (x, y) in viewport pixels.
let onPointerDown   (el: Element) (f: float -> float -> unit) = let (El id) = el in jsOnPointerDown id f
let onPointerMove   (el: Element) (f: float -> float -> unit) = let (El id) = el in jsOnPointerMove id f
let onPointerUp     (el: Element) (f: float -> float -> unit) = let (El id) = el in jsOnPointerUp id f
let onPointerCancel (el: Element) (f: unit -> unit)           = let (El id) = el in jsOnPointerCancel id f
/// A key press on the element, with the key (`"Escape"`, `"ArrowDown"`, `"a"`); `onKeyDown` above says only that one happened.
let onKeyDownWith   (el: Element) (f: string -> unit)         = let (El id) = el in jsOnKeyDown id f

/// Call it when the page knows a pointer sequence was a drag, from the release handler or, when Escape ends the drag, while the pointer is still down: the click that the
/// browser sends to the pressed element after a drag is not a click, and the next one is swallowed (it ends at that click, or at the next press or key).
let swallowClick () : unit = jsSwallowClick ()

/// What the iframe that `selector` finds says (`parent.postMessage` in the frame), as JSON text.  A preview in a sandboxed frame (`sandbox="allow-scripts"`) cannot touch the
/// page: this is how the two talk.  The frame is looked up at each message, and the messages of other windows are not heard.
let onFrameMessage (selector: string) (f: string -> unit) : unit = jsOnFrameMessage selector f

/// Say something to the iframe that `selector` finds, as JSON text (nothing happens when there is none).
let postToFrame (selector: string) (json: string) : unit = jsPostToFrame selector json

/// The places a drag can drop, measured now: every element with a `data-slot` number, as (slot, x, y, width, height, nests), in document order.
let measureSlots () : (int * float * float * float * float * bool) list =
    let found = ResizeArray<int * float * float * float * float * bool>()
    jsMeasureSlots (fun id x y w h nests -> found.Add((int id, x, y, w, h, nests > 0.5)))
    List.ofSeq found
