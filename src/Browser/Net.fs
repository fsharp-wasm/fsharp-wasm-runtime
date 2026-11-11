module Browser.Net

open Fable.Core
open Browser.Core

[<Import("fetchText", "runtime/net.js")>]
let jsFetchText (url: string) : string = nativeOnly
[<Import("fetchJson", "runtime/net.js")>]
let jsFetchJson (url: string) : Handle = nativeOnly
[<Import("postJson",  "runtime/net.js")>]
let jsPostJson (url: string) (body: string) : Handle = nativeOnly
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

let fetchText url = jsFetchText url
let fetchJson url = jsFetchJson url
let postJson url body = jsPostJson url body

let wsOpen url = WS (jsWsOpen url)
let wsSend (WS id) msg = jsWsSend id msg
let wsOnMessage (WS id) cb = jsWsOnMessage id cb
let wsOnOpen (WS id) cb = jsWsOnOpen id (fun _ -> cb ())
let wsOnClose (WS id) cb = jsWsOnClose id (fun _ -> cb ())
let wsClose (WS id) = jsWsClose id
