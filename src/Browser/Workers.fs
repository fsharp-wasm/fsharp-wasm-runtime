module Browser.Workers

open Browser.Core

[<Import("createWorker",     "runtime/workers.js")>] extern Handle jsCreateWorker(string url)
[<Import("postMessage",      "runtime/workers.js")>] extern unit   jsPostMessage(Handle id, string msg)
[<Import("onMessage",        "runtime/workers.js")>] extern unit   jsOnMessage(Handle id, (string -> unit) cb)
[<Import("onError",          "runtime/workers.js")>] extern unit   jsOnError(Handle id, (string -> unit) cb)
[<Import("terminateWorker",  "runtime/workers.js")>] extern unit   jsTerminateWorker(Handle id)

/// Typed wrapper for a Web Worker.
type Worker = private Wk of Handle

let create url = Wk (jsCreateWorker url)
let postMessage (Wk id) msg = jsPostMessage id msg
let onMessage (Wk id) cb = jsOnMessage id cb
let onError (Wk id) cb = jsOnError id cb
let terminate (Wk id) = jsTerminateWorker id
