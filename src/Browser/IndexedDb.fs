module Browser.IndexedDb

open Browser.Core

[<Import("openDb",     "runtime/indexeddb.js")>] extern Handle jsOpenDb(string name, int version)
[<Import("put",        "runtime/indexeddb.js")>] extern unit   jsPut(Handle db, string key, string value)
[<Import("getItem",    "runtime/indexeddb.js")>] extern string jsGetItem(Handle db, string key)
[<Import("deleteItem", "runtime/indexeddb.js")>] extern unit   jsDeleteItem(Handle db, string key)
[<Import("getAllKeys",  "runtime/indexeddb.js")>] extern string[] jsGetAllKeys(Handle db)

/// Typed wrapper for an IndexedDB database.
type Database = private DB of Handle

let openDb name version = DB (jsOpenDb name version)
let put (DB db) key value = jsPut db key value
let get (DB db) key = jsGetItem db key
let delete (DB db) key = jsDeleteItem db key
let getAllKeys (DB db) = jsGetAllKeys db
