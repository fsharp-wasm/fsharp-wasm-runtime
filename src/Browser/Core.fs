/// Browser.Core — the only two things the host has to provide: a character sink for text going OUT of wasm
/// (`putc` + `commit`) and a character source for text coming IN (`Inbox`).  Strings are WasmGC arrays that
/// JavaScript cannot read, so text crosses the boundary one UTF-16 code unit at a time; both directions are plain
/// integer calls (no linear memory, no shared buffers).
module Browser.Core

open Fable.Core

/// Host: append one UTF-16 code unit to the outgoing buffer.
[<Import("putc", "browser")>]
let hostPutc (c: int) : unit = nativeOnly

/// Host: hand the outgoing buffer to the host (`target` says what it is: 0 = DOM render, 1 = console log, …) and clear it.
[<Import("commit", "browser")>]
let hostCommit (target: int) : unit = nativeOnly

/// Send a whole string to the host.
let send (target: int) (s: string) : unit =
    for i in 0 .. s.Length - 1 do
        hostPutc (int s.[i])
    hostCommit target

// ── text coming in from the host (an `<input>` value, a key name, …) ──────────────────────────────────────────
let mutable private inbox = ""

/// Host → wasm: start a new incoming string.
let inboxClear () : unit = inbox <- ""

/// Host → wasm: append one UTF-16 code unit.
let inboxPut (c: int) : unit = inbox <- inbox + string (char c)

/// The string the host has just delivered.
let inboxText () : string = inbox
