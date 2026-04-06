module Browser.Dom

open Fable.Core
open Browser.Core

// ─── Raw JS imports ───────────────────────────────────────────────────────────

[<Import("createElement",   "runtime/dom.js")>]
let jsCreateElement (tag: string) : Handle = nativeOnly
[<Import("createTextNode",  "runtime/dom.js")>]
let jsCreateTextNode (text: string) : Handle = nativeOnly
[<Import("setTextContent",  "runtime/dom.js")>]
let jsSetTextContent (id: Handle) (text: string) : unit = nativeOnly
[<Import("setInnerHtml",    "runtime/dom.js")>]
let jsSetInnerHtml (id: Handle) (html: string) : unit = nativeOnly
[<Import("appendChild",     "runtime/dom.js")>]
let jsAppendChild (parent: Handle) (child: Handle) : unit = nativeOnly
[<Import("removeChild",     "runtime/dom.js")>]
let jsRemoveChild (parent: Handle) (child: Handle) : unit = nativeOnly
[<Import("removeElement",   "runtime/dom.js")>]
let jsRemoveElement (id: Handle) : unit = nativeOnly
[<Import("setAttribute",    "runtime/dom.js")>]
let jsSetAttribute (id: Handle) (key: string) (v: string) : unit = nativeOnly
[<Import("removeAttribute", "runtime/dom.js")>]
let jsRemoveAttribute (id: Handle) (key: string) : unit = nativeOnly
[<Import("setClassName",    "runtime/dom.js")>]
let jsSetClassName (id: Handle) (cls: string) : unit = nativeOnly
[<Import("setStyle",        "runtime/dom.js")>]
let jsSetStyle (id: Handle) (prop: string) (v: string) : unit = nativeOnly
[<Import("clearInnerHtml",  "runtime/dom.js")>]
let jsClearInnerHtml (id: Handle) : unit = nativeOnly
[<Import("querySelector",   "runtime/dom.js")>]
let jsQuerySelector (id: Handle) (sel: string) : Handle = nativeOnly
[<Import("getById",         "runtime/dom.js")>]
let jsGetById (id: string) : Handle = nativeOnly
[<Import("getValue",        "runtime/dom.js")>]
let jsGetValue (id: Handle) : string = nativeOnly
[<Import("setValue",        "runtime/dom.js")>]
let jsSetValue (id: Handle) (value: string) : unit = nativeOnly
[<Import("focus",           "runtime/dom.js")>]
let jsFocus (id: Handle) : unit = nativeOnly
[<Import("scrollIntoView",  "runtime/dom.js")>]
let jsScrollIntoView (id: Handle) : unit = nativeOnly

// ─── Typed Element wrapper ────────────────────────────────────────────────────

/// Typed wrapper around a DOM element handle.
type Element = El of Handle with
    member e.Handle = let (El h) = e in h

module Element =
    let create tag       = El (jsCreateElement tag)
    let text s           = El (jsCreateTextNode s)
    let ofId domId       = El (jsGetById domId)
    let ofHandle h       = El h
    let nil              = El 0
    let isValid (El h)   = h <> 0
    let body ()          = El Browser.Core.body

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
