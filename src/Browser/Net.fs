module Browser.Net

open Browser.Core

[<Import("fetchText",    "runtime/net.js")>] extern string jsFetchText(string url)
[<Import("fetchJson",    "runtime/net.js")>] extern Handle jsFetchJson(string url)
[<Import("postJson",     "runtime/net.js")>] extern Handle jsPostJson(string url, obj body)
[<Import("wsOpen",       "runtime/net.js")>] extern Handle jsWsOpen(string url)
[<Import("wsSend",       "runtime/net.js")>] extern unit   jsWsSend(Handle id, string msg)
[<Import("wsOnMessage",  "runtime/net.js")>] extern unit   jsWsOnMessage(Handle id, (string -> unit) cb)
[<Import("wsOnOpen",     "runtime/net.js")>] extern unit   jsWsOnOpen(Handle id, (Handle -> unit) cb)
[<Import("wsOnClose",    "runtime/net.js")>] extern unit   jsWsOnClose(Handle id, (Handle -> unit) cb)
[<Import("wsClose",      "runtime/net.js")>] extern unit   jsWsClose(Handle id)

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
