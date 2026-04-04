/// Browser.Cookies — document.cookie read/write/delete helpers.
///
/// Cookies are simple key/value pairs stored per origin. They can carry
/// an expiry date; without one they are session cookies (cleared on tab close).
module Browser.Cookies

[<Import("getCookie",         "runtime/cookies.js")>] extern string jsGet(string name)
[<Import("setCookie",         "runtime/cookies.js")>] extern unit   jsSet(string name, string value, int days, string path)
[<Import("deleteCookie",      "runtime/cookies.js")>] extern unit   jsDelete(string name, string path)
[<Import("hasCookie",         "runtime/cookies.js")>] extern bool   jsHas(string name)
[<Import("getAllCookieNames",  "runtime/cookies.js")>] extern string jsAllNames()

/// Read the value of a cookie by name. Returns "" if not found.
let get (name: string) : string = jsGet name

/// Write a cookie.
/// `days = 0` creates a session cookie (expires when the browser tab closes).
let set (name: string) (value: string) (days: int) : unit =
    jsSet name value days "/"

/// Write a cookie with a custom path.
let setAtPath (name: string) (value: string) (days: int) (path: string) : unit =
    jsSet name value days path

/// Delete a cookie. The path must match the one used when it was written.
let delete (name: string) : unit = jsDelete name "/"

/// Check whether a cookie with the given name exists.
let has (name: string) : bool = jsHas name

/// Return all cookie names visible to this page.
let allNames () : string list =
    let raw = jsAllNames ()
    if raw = "" then []
    else raw.Split('\n') |> Array.filter (fun s -> s <> "") |> Array.toList
