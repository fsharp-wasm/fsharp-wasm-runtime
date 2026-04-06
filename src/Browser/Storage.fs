module Browser.Storage

open Fable.Core

[<Import("getLocal",      "runtime/storage.js")>]
let jsGetLocal (key: string) : string = nativeOnly
[<Import("setLocal",      "runtime/storage.js")>]
let jsSetLocal (key: string) (value: string) : unit = nativeOnly
[<Import("removeLocal",   "runtime/storage.js")>]
let jsRemoveLocal (key: string) : unit = nativeOnly
[<Import("clearLocal",    "runtime/storage.js")>]
let jsClearLocal () : unit = nativeOnly
[<Import("getSession",    "runtime/storage.js")>]
let jsGetSession (key: string) : string = nativeOnly
[<Import("setSession",    "runtime/storage.js")>]
let jsSetSession (key: string) (value: string) : unit = nativeOnly
[<Import("removeSession", "runtime/storage.js")>]
let jsRemoveSession (key: string) : unit = nativeOnly
[<Import("clearSession",  "runtime/storage.js")>]
let jsClearSession () : unit = nativeOnly

module Local =
    let get key = jsGetLocal key
    let set key value = jsSetLocal key value
    let remove key = jsRemoveLocal key
    let clear () = jsClearLocal ()

module Session =
    let get key = jsGetSession key
    let set key value = jsSetSession key value
    let remove key = jsRemoveSession key
    let clear () = jsClearSession ()
