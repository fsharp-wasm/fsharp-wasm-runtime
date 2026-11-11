/// Browser.Timing — a repeating timer.  The host calls the exported `tick` every `ms` milliseconds.
module Browser.Timing

open Fable.Core

/// Host: start calling `tick` every `ms` milliseconds; returns the timer id.
[<Import("setInterval", "timing")>]
let hostSetInterval (ms: int) : int = nativeOnly

/// Host: stop a timer started with `hostSetInterval`.
[<Import("clearInterval", "timing")>]
let hostClearInterval (id: int) : unit = nativeOnly

let mutable private tickSlot : unit -> unit = fun () -> ()

/// Host → wasm: the timer fired.
let tick () : unit = tickSlot ()

/// Call `f` every `ms` milliseconds (replaces any earlier handler).
let every (ms: int) (f: unit -> unit) : int =
    tickSlot <- f
    hostSetInterval ms
