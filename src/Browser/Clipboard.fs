/// Browser.Clipboard — Async Clipboard API (read/write text).
///
/// Requires a secure context (HTTPS or localhost) and a user gesture.
/// Callbacks are used instead of F# async because the WasmGC target does not
/// yet support async/await in the same way as the .NET runtime.
module Browser.Clipboard

[<Import("writeText", "runtime/clipboard.js")>] extern unit jsWriteText(string text, (unit -> unit) onOk, (string -> unit) onErr)
[<Import("readText",  "runtime/clipboard.js")>] extern unit jsReadText((string -> unit) onOk, (string -> unit) onErr)

/// Write `text` to the system clipboard.
/// `onSuccess` is called if the write succeeds; `onError` receives the error message.
let writeText (text: string) (onSuccess: unit -> unit) (onError: string -> unit) : unit =
    jsWriteText text onSuccess onError

/// Read text from the system clipboard.
/// `onSuccess` receives the clipboard content; `onError` receives the error message.
let readText (onSuccess: string -> unit) (onError: string -> unit) : unit =
    jsReadText onSuccess onError
