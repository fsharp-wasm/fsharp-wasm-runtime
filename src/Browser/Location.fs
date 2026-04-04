/// Browser.Location — window.location and window.history API.
///
/// Provides read access to the current URL components and helpers for
/// SPA-style navigation without page reloads via the History API.
module Browser.Location

[<Import("getHref",       "runtime/location.js")>] extern string jsGetHref()
[<Import("getPathname",   "runtime/location.js")>] extern string jsGetPathname()
[<Import("getHash",       "runtime/location.js")>] extern string jsGetHash()
[<Import("getSearch",     "runtime/location.js")>] extern string jsGetSearch()
[<Import("getOrigin",     "runtime/location.js")>] extern string jsGetOrigin()
[<Import("navigateTo",    "runtime/location.js")>] extern unit   jsNavigateTo(string url)
[<Import("pushState",     "runtime/location.js")>] extern unit   jsPushState(string path, string title)
[<Import("replaceState",  "runtime/location.js")>] extern unit   jsReplaceState(string path, string title)
[<Import("goBack",        "runtime/location.js")>] extern unit   jsGoBack()
[<Import("goForward",     "runtime/location.js")>] extern unit   jsGoForward()
[<Import("onPopState",    "runtime/location.js")>] extern unit   jsOnPopState((string -> unit) cb)
[<Import("reload",        "runtime/location.js")>] extern unit   jsReload()
[<Import("getQueryParam", "runtime/location.js")>] extern string jsGetQueryParam(string key)

// ─── Current URL components ───────────────────────────────────────────────────

/// Full href, e.g. "https://example.com/path?q=1#hash"
let href ()     = jsGetHref ()

/// Path portion, e.g. "/about"
let pathname () = jsGetPathname ()

/// Hash fragment including "#", e.g. "#section"
let hash ()     = jsGetHash ()

/// Search string including "?", e.g. "?q=test"
let search ()   = jsGetSearch ()

/// Origin, e.g. "https://example.com"
let origin ()   = jsGetOrigin ()

/// Read a single query-string parameter. Returns "" if not present.
let queryParam (key: string) = jsGetQueryParam key

// ─── Navigation ───────────────────────────────────────────────────────────────

/// Hard-navigate to a URL (triggers a page load).
let navigateTo (url: string) = jsNavigateTo url

/// Push a new entry onto the history stack (SPA navigation, no reload).
let pushState (path: string) = jsPushState path ""

/// Replace the current history entry (no new entry, no reload).
let replaceState (path: string) = jsReplaceState path ""

/// Go back one step in the browser history.
let back () = jsGoBack ()

/// Go forward one step in the browser history.
let forward () = jsGoForward ()

/// Reload the current page.
let reload () = jsReload ()

// ─── Events ───────────────────────────────────────────────────────────────────

/// Register a callback that fires when the user navigates back/forward.
/// The callback receives the new pathname.
let onPopState (cb: string -> unit) = jsOnPopState cb
