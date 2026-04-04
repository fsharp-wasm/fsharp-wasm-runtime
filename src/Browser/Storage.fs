module Browser.Storage

[<Import("getLocal",      "runtime/storage.js")>] extern string jsGetLocal(string key)
[<Import("setLocal",      "runtime/storage.js")>] extern unit   jsSetLocal(string key, string value)
[<Import("removeLocal",   "runtime/storage.js")>] extern unit   jsRemoveLocal(string key)
[<Import("clearLocal",    "runtime/storage.js")>] extern unit   jsClearLocal()
[<Import("getSession",    "runtime/storage.js")>] extern string jsGetSession(string key)
[<Import("setSession",    "runtime/storage.js")>] extern unit   jsSetSession(string key, string value)
[<Import("removeSession", "runtime/storage.js")>] extern unit   jsRemoveSession(string key)
[<Import("clearSession",  "runtime/storage.js")>] extern unit   jsClearSession()

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
