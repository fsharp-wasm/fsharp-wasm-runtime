module Browser.PubSub

open Fable.Core

[<Import("subscribe",   "runtime/pubsub.js")>]
let jsSubscribe (topic: string) (cb: string -> unit) : unit = nativeOnly

[<Import("unsubscribe", "runtime/pubsub.js")>]
let jsUnsubscribe (topic: string) (cb: string -> unit) : unit = nativeOnly

[<Import("publish",    "runtime/pubsub.js")>]
let jsPublish (topic: string) (msg: string) : unit = nativeOnly
[<Import("clearTopic", "runtime/pubsub.js")>]
let jsClearTopic (topic: string) : unit = nativeOnly

let subscribe topic cb = jsSubscribe topic cb
let unsubscribe topic cb = jsUnsubscribe topic cb
let publish topic msg = jsPublish topic msg
let clearTopic topic = jsClearTopic topic
