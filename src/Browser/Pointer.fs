/// Browser.Pointer — Pointer event bindings (mouse, touch, stylus).
///
/// Pointer events unify mouse/touch/pen input in a single event model.
/// Use these instead of separate mouse and touch handlers.
module Browser.Pointer

open Fable.Core
open Browser.Core
open Browser.Dom

[<Import("onPointer",             "runtime/pointer.js")>]
let jsOnPointer (id: Handle) (event: string) (cb: float -> float -> int -> unit) : unit = nativeOnly

[<Import("offPointer",            "runtime/pointer.js")>]
let jsOffPointer (id: Handle) (event: string) : unit = nativeOnly

[<Import("setPointerCapture",     "runtime/pointer.js")>]
let jsSetPointerCapture (id: Handle) (pointerId: int) : unit = nativeOnly

[<Import("releasePointerCapture", "runtime/pointer.js")>]
let jsReleasePointerCapture (id: Handle) (pointerId: int) : unit = nativeOnly

/// Payload delivered to every pointer callback.
type PointerArgs = { X: float; Y: float; PointerId: int }

let private mkCb (f: PointerArgs -> unit) =
    fun x y pid -> f { X = x; Y = y; PointerId = pid }

// ─── Attach helpers ───────────────────────────────────────────────────────────

let onPointerDown   (El id) f = jsOnPointer id "pointerdown"   (mkCb f)
let onPointerMove   (El id) f = jsOnPointer id "pointermove"   (mkCb f)
let onPointerUp     (El id) f = jsOnPointer id "pointerup"     (mkCb f)
let onPointerCancel (El id) f = jsOnPointer id "pointercancel" (mkCb f)
let onPointerEnter  (El id) f = jsOnPointer id "pointerenter"  (mkCb f)
let onPointerLeave  (El id) f = jsOnPointer id "pointerleave"  (mkCb f)

// ─── Detach ───────────────────────────────────────────────────────────────────

let offPointerDown   (El id) = jsOffPointer id "pointerdown"
let offPointerMove   (El id) = jsOffPointer id "pointermove"
let offPointerUp     (El id) = jsOffPointer id "pointerup"
let offPointerCancel (El id) = jsOffPointer id "pointercancel"

// ─── Pointer capture ──────────────────────────────────────────────────────────

/// Capture all pointer events for the given pointer ID, even outside the element.
let setCapture   (El id) pointerId = jsSetPointerCapture id pointerId
let releaseCapture (El id) pointerId = jsReleasePointerCapture id pointerId
