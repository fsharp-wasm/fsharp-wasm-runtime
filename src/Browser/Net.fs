module Browser.Net

open Fable.Core
open Browser.Core

[<Import("request",   "runtime/net.js")>]
let private jsRequest (httpMethod: string) (url: string) (body: string) (headers: string) (cb: int -> string -> unit) : unit = nativeOnly
[<Import("fetchText", "runtime/net.js")>]
let private jsFetchText (url: string) (cb: string -> unit) : unit = nativeOnly
[<Import("fetchJson", "runtime/net.js")>]
let private jsFetchJson (url: string) (cb: Handle -> unit) : unit = nativeOnly
[<Import("postJson",  "runtime/net.js")>]
let private jsPostJson (url: string) (body: string) (cb: Handle -> unit) : unit = nativeOnly
[<Import("wsOpen",    "runtime/net.js")>]
let jsWsOpen (url: string) : Handle = nativeOnly
[<Import("wsSend",    "runtime/net.js")>]
let jsWsSend (id: Handle) (msg: string) : unit = nativeOnly
[<Import("wsClose",   "runtime/net.js")>]
let jsWsClose (id: Handle) : unit = nativeOnly

[<Import("wsOnMessage",  "runtime/net.js")>]
let jsWsOnMessage (id: Handle) (cb: string -> unit) : unit = nativeOnly

[<Import("wsOnOpen",     "runtime/net.js")>]
let jsWsOnOpen (id: Handle) (cb: Handle -> unit) : unit = nativeOnly

[<Import("wsOnClose",    "runtime/net.js")>]
let jsWsOnClose (id: Handle) (cb: Handle -> unit) : unit = nativeOnly

/// Typed wrapper for a WebSocket connection.
type WebSocket = private WS of Handle

/// One HTTP request.  The callback gets the status and the body as text; the status is 0 when no answer arrived at all (the network failed), so a failure is a value to match on.
/// A module cannot wait for a promise: the callback is where the program continues (in Elmish: it dispatches a message).
let request (httpMethod: string) (url: string) (body: string) (headers: (string * string) list) (cb: int -> string -> unit) : unit =
    jsRequest httpMethod url body (headers |> List.map (fun (k, v) -> k + ": " + v) |> String.concat "\n") cb

let get (url: string) (cb: int -> string -> unit) : unit = request "GET" url "" [] cb
let post (url: string) (body: string) (cb: int -> string -> unit) : unit = request "POST" url body [ "content-type", "application/json" ] cb

let fetchText (url: string) (cb: string -> unit) : unit = jsFetchText url cb
/// The parsed body as a handle to the JS value (nil when it is not JSON).
let fetchJson (url: string) (cb: Handle -> unit) : unit = jsFetchJson url cb
/// `body` is JSON text already; the answer is parsed as in `fetchJson`.
let postJson (url: string) (body: string) (cb: Handle -> unit) : unit = jsPostJson url body cb

let wsOpen url = WS (jsWsOpen url)
let wsSend (WS id) msg = jsWsSend id msg
let wsOnMessage (WS id) cb = jsWsOnMessage id cb
let wsOnOpen (WS id) cb = jsWsOnOpen id (fun _ -> cb ())
let wsOnClose (WS id) cb = jsWsOnClose id (fun _ -> cb ())
let wsClose (WS id) = jsWsClose id
