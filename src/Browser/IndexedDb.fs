module Browser.IndexedDb

open Fable.Core
open Browser.Core

// IndexedDB is asynchronous.  A WasmGC module cannot block on a JS promise, so every operation takes the callback
// that continues the program; in an Elmish program that callback dispatches a message.

[<Import("openDb",     "runtime/indexeddb.js")>]
let jsOpenDb (name: string) (version: int) (cb: Handle -> unit) : unit = nativeOnly
[<Import("put",        "runtime/indexeddb.js")>]
let jsPut (db: Handle) (key: string) (v: string) (cb: unit -> unit) : unit = nativeOnly
[<Import("getItem",    "runtime/indexeddb.js")>]
let jsGetItem (db: Handle) (key: string) (cb: string -> unit) : unit = nativeOnly
[<Import("deleteItem", "runtime/indexeddb.js")>]
let jsDeleteItem (db: Handle) (key: string) (cb: unit -> unit) : unit = nativeOnly
[<Import("getAllKeys", "runtime/indexeddb.js")>]
let jsGetAllKeys (db: Handle) (cb: string array -> unit) : unit = nativeOnly

/// Typed wrapper for an IndexedDB database.
type Database = private DB of Handle

/// Open (or create) a database; `onOpen` receives it.
let openDb name version (onOpen: Database -> unit) = jsOpenDb name version (fun h -> onOpen (DB h))
let put (DB db) key value (onDone: unit -> unit) = jsPut db key value onDone
/// `onValue` receives the stored value ("" when the key does not exist).
[<CompiledName("indexedDbGet")>]
let get (DB db) key (onValue: string -> unit) = jsGetItem db key onValue
[<CompiledName("indexedDbDelete")>]
let delete (DB db) key (onDone: unit -> unit) = jsDeleteItem db key onDone
let getAllKeys (DB db) (onKeys: string array -> unit) = jsGetAllKeys db onKeys
