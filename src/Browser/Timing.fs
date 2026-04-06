module Browser.Timing

open Fable.Core

[<Import("timeout",                "runtime/timing.js")>]
let jsTimeout (ms: int) (cb: unit -> unit) : int = nativeOnly

[<Import("interval",               "runtime/timing.js")>]
let jsInterval (ms: int) (cb: unit -> unit) : int = nativeOnly

[<Import("clearTimeout_",          "runtime/timing.js")>]
let jsClearTimeout (id: int) : unit = nativeOnly

[<Import("clearInterval_",         "runtime/timing.js")>]
let jsClearInterval (id: int) : unit = nativeOnly

[<Import("requestAnimationFrame_", "runtime/timing.js")>]
let jsRequestAnimationFrame (cb: unit -> unit) : int = nativeOnly

[<Import("cancelAnimationFrame_",  "runtime/timing.js")>]
let jsCancelAnimationFrame (id: int) : unit = nativeOnly

let setTimeout ms cb = jsTimeout ms cb
let setInterval ms cb = jsInterval ms cb
let clearTimeout id = jsClearTimeout id
let clearInterval id = jsClearInterval id
let requestAnimationFrame cb = jsRequestAnimationFrame cb
let cancelAnimationFrame id = jsCancelAnimationFrame id
