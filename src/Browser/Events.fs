module Browser.Events

open Browser.Core
open Browser.Dom

[<Import("on",       "runtime/events.js")>] extern unit jsOn(Handle id, string event, (Handle -> unit) cb)
[<Import("off",      "runtime/events.js")>] extern unit jsOff(Handle id, string event)
[<Import("onInput",  "runtime/events.js")>] extern unit jsOnInput(Handle id, (string -> unit) cb)
[<Import("onChange",  "runtime/events.js")>] extern unit jsOnChange(Handle id, (string -> unit) cb)

// ─── Click / Focus / Blur ────────────────────────────────────────────────────

let onClick    (El id) (f: unit -> unit)   = jsOn id "click"    (fun _ -> f ())
let onDblClick (El id) (f: unit -> unit)   = jsOn id "dblclick" (fun _ -> f ())
let onFocus    (El id) (f: unit -> unit)   = jsOn id "focus"    (fun _ -> f ())
let onBlur     (El id) (f: unit -> unit)   = jsOn id "blur"     (fun _ -> f ())
let onSubmit   (El id) (f: unit -> unit)   = jsOn id "submit"   (fun _ -> f ())

// ─── Input / Change ──────────────────────────────────────────────────────────

let onInput  (El id) (f: string -> unit) = jsOnInput  id f
let onChange (El id) (f: string -> unit) = jsOnChange id f

// ─── Keyboard ────────────────────────────────────────────────────────────────

let onKeyDown  (El id) (f: unit -> unit) = jsOn id "keydown"  (fun _ -> f ())
let onKeyUp    (El id) (f: unit -> unit) = jsOn id "keyup"    (fun _ -> f ())
let onKeyPress (El id) (f: unit -> unit) = jsOn id "keypress" (fun _ -> f ())

// ─── Mouse ───────────────────────────────────────────────────────────────────

let onMouseDown  (El id) (f: unit -> unit) = jsOn id "mousedown"  (fun _ -> f ())
let onMouseUp    (El id) (f: unit -> unit) = jsOn id "mouseup"    (fun _ -> f ())
let onMouseMove  (El id) (f: unit -> unit) = jsOn id "mousemove"  (fun _ -> f ())
let onMouseOver  (El id) (f: unit -> unit) = jsOn id "mouseover"  (fun _ -> f ())
let onMouseOut   (El id) (f: unit -> unit) = jsOn id "mouseout"   (fun _ -> f ())
let onMouseEnter (El id) (f: unit -> unit) = jsOn id "mouseenter" (fun _ -> f ())
let onMouseLeave (El id) (f: unit -> unit) = jsOn id "mouseleave" (fun _ -> f ())

// ─── Scroll / Resize ─────────────────────────────────────────────────────────

let onScroll (El id) (f: unit -> unit) = jsOn id "scroll" (fun _ -> f ())
let onResize (El id) (f: unit -> unit) = jsOn id "resize" (fun _ -> f ())

// ─── Context menu / Drag ─────────────────────────────────────────────────────

let onContextMenu  (El id) (f: unit -> unit) = jsOn id "contextmenu" (fun _ -> f ())
let onDragStart    (El id) (f: unit -> unit) = jsOn id "dragstart"   (fun _ -> f ())
let onDragEnd      (El id) (f: unit -> unit) = jsOn id "dragend"     (fun _ -> f ())
let onDrop         (El id) (f: unit -> unit) = jsOn id "drop"        (fun _ -> f ())

// ─── Detach ───────────────────────────────────────────────────────────────────

let off (El id) event = jsOff id event
