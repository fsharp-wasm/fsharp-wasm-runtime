module Browser.IndexedDb

open Fable.Core
open Browser.Core

[<Import("openDb",     "runtime/indexeddb.js")>]
let jsOpenDb (name: string) (version: int) : Handle = nativeOnly
[<Import("put",        "runtime/indexeddb.js")>]
let jsPut (db: Handle) (key: string) (v: string) : unit = nativeOnly
[<Import("getItem",    "runtime/indexeddb.js")>]
let jsGetItem (db: Handle) (key: string) : string = nativeOnly
[<Import("deleteItem", "runtime/indexeddb.js")>]
let jsDeleteItem (db: Handle) (key: string) : unit = nativeOnly
[<Import("getAllKeys",  "runtime/indexeddb.js")>]
let jsGetAllKeys (db: Handle) : string array = nativeOnly

/// Typed wrapper for an IndexedDB database.
type Database = private DB of Handle

let openDb name version = DB (jsOpenDb name version)
let put (DB db) key value = jsPut db key value
let get (DB db) key = jsGetItem db key
let delete (DB db) key = jsDeleteItem db key
let getAllKeys (DB db) = jsGetAllKeys db
