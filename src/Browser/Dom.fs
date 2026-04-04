module Browser.Dom

open Browser.Core

// ─── Raw JS imports ───────────────────────────────────────────────────────────

[<Import("createElement",    "runtime/dom.js")>] extern Handle jsCreateElement(string tag)
[<Import("createTextNode",   "runtime/dom.js")>] extern Handle jsCreateTextNode(string text)
[<Import("setTextContent",   "runtime/dom.js")>] extern unit   jsSetTextContent(Handle id, string text)
[<Import("setInnerHtml",     "runtime/dom.js")>] extern unit   jsSetInnerHtml(Handle id, string html)
[<Import("appendChild",      "runtime/dom.js")>] extern unit   jsAppendChild(Handle parent, Handle child)
[<Import("removeChild",      "runtime/dom.js")>] extern unit   jsRemoveChild(Handle parent, Handle child)
[<Import("removeElement",    "runtime/dom.js")>] extern unit   jsRemoveElement(Handle id)
[<Import("setAttribute",     "runtime/dom.js")>] extern unit   jsSetAttribute(Handle id, string key, string value)
[<Import("removeAttribute",  "runtime/dom.js")>] extern unit   jsRemoveAttribute(Handle id, string key)
[<Import("setClassName",     "runtime/dom.js")>] extern unit   jsSetClassName(Handle id, string cls)
[<Import("setStyle",         "runtime/dom.js")>] extern unit   jsSetStyle(Handle id, string prop, string value)
[<Import("clearInnerHtml",   "runtime/dom.js")>] extern unit   jsClearInnerHtml(Handle id)
[<Import("querySelector",    "runtime/dom.js")>] extern Handle jsQuerySelector(Handle id, string sel)
[<Import("getById",          "runtime/dom.js")>] extern Handle jsGetById(string id)
[<Import("getValue",         "runtime/dom.js")>] extern string jsGetValue(Handle id)
[<Import("setValue",         "runtime/dom.js")>] extern unit   jsSetValue(Handle id, string value)
[<Import("focus",            "runtime/dom.js")>] extern unit   jsFocus(Handle id)
[<Import("scrollIntoView",   "runtime/dom.js")>] extern unit   jsScrollIntoView(Handle id)

// ─── Typed Element wrapper ────────────────────────────────────────────────────

/// Typed wrapper around a DOM element handle.
type Element = private El of Handle with
    member e.Handle = let (El h) = e in h

module Element =
    let create tag       = El (jsCreateElement tag)
    let text s           = El (jsCreateTextNode s)
    let ofId domId       = El (jsGetById domId)
    let ofHandle h       = El h
    let nil              = El 0
    let isValid (El h)   = h <> 0
    let body             = El Browser.Core.body

// ─── DOM operations ───────────────────────────────────────────────────────────

let append (El parent) (El child) = jsAppendChild parent child
let removeFrom (El parent) (El child) = jsRemoveChild parent child
let remove (El id) = jsRemoveElement id

let setText  (El id) text         = jsSetTextContent id text
let setHtml  (El id) html         = jsSetInnerHtml id html
let setAttr  (El id) key value    = jsSetAttribute id key value
let removeAttr (El id) key        = jsRemoveAttribute id key
let setClass (El id) cls          = jsSetClassName id cls
let setStyle (El id) prop value   = jsSetStyle id prop value
let clear    (El id)              = jsClearInnerHtml id

let querySelector (El id) sel     = El (jsQuerySelector id sel)

let getValue (El id)              = jsGetValue id
let setValue (El id) value        = jsSetValue id value
let focus    (El id)              = jsFocus id
let scrollIntoView (El id)        = jsScrollIntoView id

let body = Element.body
