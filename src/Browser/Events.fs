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
