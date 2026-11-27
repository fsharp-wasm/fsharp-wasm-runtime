/// Browser.Files — hand a text to the person as a file (a download).
///
/// The browser saves or asks by its own rules, so a call needs a user gesture (a click handler) to be allowed to.
module Browser.Files

open Fable.Core

[<Import("download", "runtime/files.js")>]
let private jsDownload (fileName: string) (mimeType: string) (text: string) : unit = nativeOnly

/// Save `text` as a file called `fileName` (`mimeType`, e.g. "text/html"; "" is "text/plain").
let download (fileName: string) (mimeType: string) (text: string) : unit =
    jsDownload fileName mimeType text
