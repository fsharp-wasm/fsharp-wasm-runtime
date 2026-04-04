module Browser.Canvas

open Browser.Core
open Browser.Dom

[<Import("getContext2D",   "runtime/canvas.js")>] extern Handle jsGetContext2D(Handle canvasId)
[<Import("fillRect",      "runtime/canvas.js")>] extern unit   jsFillRect(Handle ctx, float x, float y, float w, float h)
[<Import("strokeRect",    "runtime/canvas.js")>] extern unit   jsStrokeRect(Handle ctx, float x, float y, float w, float h)
[<Import("clearRect",     "runtime/canvas.js")>] extern unit   jsClearRect(Handle ctx, float x, float y, float w, float h)
[<Import("setFillStyle",  "runtime/canvas.js")>] extern unit   jsSetFillStyle(Handle ctx, string style)
[<Import("setStrokeStyle","runtime/canvas.js")>] extern unit   jsSetStrokeStyle(Handle ctx, string style)
[<Import("setLineWidth",  "runtime/canvas.js")>] extern unit   jsSetLineWidth(Handle ctx, float width)
[<Import("beginPath",     "runtime/canvas.js")>] extern unit   jsBeginPath(Handle ctx)
[<Import("closePath",     "runtime/canvas.js")>] extern unit   jsClosePath(Handle ctx)
[<Import("moveTo",        "runtime/canvas.js")>] extern unit   jsMoveTo(Handle ctx, float x, float y)
[<Import("lineTo",        "runtime/canvas.js")>] extern unit   jsLineTo(Handle ctx, float x, float y)
[<Import("arc",           "runtime/canvas.js")>] extern unit   jsArc(Handle ctx, float x, float y, float r, float startAngle, float endAngle)
[<Import("fill",          "runtime/canvas.js")>] extern unit   jsFill(Handle ctx)
[<Import("stroke",        "runtime/canvas.js")>] extern unit   jsStroke(Handle ctx)
[<Import("fillText",      "runtime/canvas.js")>] extern unit   jsFillText(Handle ctx, string text, float x, float y)
[<Import("setFont",       "runtime/canvas.js")>] extern unit   jsSetFont(Handle ctx, string font)

/// Typed wrapper for a Canvas 2D context.
type Context2D = private Ctx of Handle

let getContext (El canvasId) = Ctx (jsGetContext2D canvasId)

let fillRect (Ctx ctx) x y w h     = jsFillRect ctx x y w h
let strokeRect (Ctx ctx) x y w h   = jsStrokeRect ctx x y w h
let clearRect (Ctx ctx) x y w h    = jsClearRect ctx x y w h
let setFillStyle (Ctx ctx) style    = jsSetFillStyle ctx style
let setStrokeStyle (Ctx ctx) style  = jsSetStrokeStyle ctx style
let setLineWidth (Ctx ctx) width    = jsSetLineWidth ctx width
let beginPath (Ctx ctx)             = jsBeginPath ctx
let closePath (Ctx ctx)             = jsClosePath ctx
let moveTo (Ctx ctx) x y           = jsMoveTo ctx x y
let lineTo (Ctx ctx) x y           = jsLineTo ctx x y
let arc (Ctx ctx) x y r s e        = jsArc ctx x y r s e
let fill (Ctx ctx)                  = jsFill ctx
let stroke (Ctx ctx)                = jsStroke ctx
let fillText (Ctx ctx) text x y    = jsFillText ctx text x y
let setFont (Ctx ctx) font          = jsSetFont ctx font
