module Browser.Workers

open Fable.Core
open Browser.Core

[<Import("createWorker",     "runtime/workers.js")>]
let jsCreateWorker (url: string) : Handle = nativeOnly
[<Import("postMessage",      "runtime/workers.js")>]
let jsPostMessage (id: Handle) (msg: string) : unit = nativeOnly
[<Import("terminateWorker",  "runtime/workers.js")>]
let jsTerminateWorker (id: Handle) : unit = nativeOnly

[<Import("onMessage",        "runtime/workers.js")>]
let jsOnMessage (id: Handle) (cb: string -> unit) : unit = nativeOnly

[<Import("onError",          "runtime/workers.js")>]
let jsOnError (id: Handle) (cb: string -> unit) : unit = nativeOnly

/// Typed wrapper for a Web Worker.
type Worker = private Wk of Handle

let create url = Wk (jsCreateWorker url)
let postMessage (Wk id) msg = jsPostMessage id msg
let onMessage (Wk id) cb = jsOnMessage id cb
let onError (Wk id) cb = jsOnError id cb
let terminate (Wk id) = jsTerminateWorker id
