module Browser.Events

open Browser.Core
open Browser.Dom

[<Import("on",       "runtime/events.js")>] extern unit jsOn(Handle id, string event, (Handle -> unit) cb)
[<Import("off",      "runtime/events.js")>] extern unit jsOff(Handle id, string event)
[<Import("onInput",  "runtime/events.js")>] extern unit jsOnInput(Handle id, (string -> unit) cb)
[<Import("onChange",  "runtime/events.js")>] extern unit jsOnChange(Handle id, (string -> unit) cb)

let onClick (El id) (f: unit -> unit) = jsOn id "click" (fun _ -> f ())
let onSubmit (El id) (f: unit -> unit) = jsOn id "submit" (fun _ -> f ())
let onInput (El id) (f: string -> unit) = jsOnInput id f
let onChange (El id) (f: string -> unit) = jsOnChange id f
let onKeyDown (El id) (f: unit -> unit) = jsOn id "keydown" (fun _ -> f ())
let onKeyUp (El id) (f: unit -> unit) = jsOn id "keyup" (fun _ -> f ())
let onMouseOver (El id) (f: unit -> unit) = jsOn id "mouseover" (fun _ -> f ())
let onMouseOut (El id) (f: unit -> unit) = jsOn id "mouseout" (fun _ -> f ())
let off (El id) event = jsOff id event
