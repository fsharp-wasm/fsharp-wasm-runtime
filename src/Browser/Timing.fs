module Browser.Timing

[<Import("timeout",                  "runtime/timing.js")>] extern int  jsTimeout(int ms, (unit -> unit) cb)
[<Import("interval",                 "runtime/timing.js")>] extern int  jsInterval(int ms, (unit -> unit) cb)
[<Import("clearTimeout_",            "runtime/timing.js")>] extern unit jsClearTimeout(int id)
[<Import("clearInterval_",           "runtime/timing.js")>] extern unit jsClearInterval(int id)
[<Import("requestAnimationFrame_",   "runtime/timing.js")>] extern int  jsRequestAnimationFrame((unit -> unit) cb)
[<Import("cancelAnimationFrame_",    "runtime/timing.js")>] extern unit jsCancelAnimationFrame(int id)

let setTimeout ms cb = jsTimeout ms cb
let setInterval ms cb = jsInterval ms cb
let clearTimeout id = jsClearTimeout id
let clearInterval id = jsClearInterval id
let requestAnimationFrame cb = jsRequestAnimationFrame cb
let cancelAnimationFrame id = jsCancelAnimationFrame id
