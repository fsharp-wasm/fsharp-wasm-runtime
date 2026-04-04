module Browser.PubSub

[<Import("subscribe",   "runtime/pubsub.js")>] extern unit jsSubscribe(string topic, (string -> unit) cb)
[<Import("unsubscribe", "runtime/pubsub.js")>] extern unit jsUnsubscribe(string topic, (string -> unit) cb)
[<Import("publish",     "runtime/pubsub.js")>] extern unit jsPublish(string topic, string msg)
[<Import("clearTopic",  "runtime/pubsub.js")>] extern unit jsClearTopic(string topic)

let subscribe topic cb = jsSubscribe topic cb
let unsubscribe topic cb = jsUnsubscribe topic cb
let publish topic msg = jsPublish topic msg
let clearTopic topic = jsClearTopic topic
