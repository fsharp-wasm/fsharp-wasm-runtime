module Browser.Canvas

open Fable.Core
open Browser.Core
open Browser.Dom

[<Import("getContext2D",   "runtime/canvas.js")>]
let jsGetContext2D (canvasId: Handle) : Handle = nativeOnly
[<Import("fillRect",      "runtime/canvas.js")>]
let jsFillRect (ctx: Handle) (x: float) (y: float) (w: float) (h: float) : unit = nativeOnly
[<Import("strokeRect",    "runtime/canvas.js")>]
let jsStrokeRect (ctx: Handle) (x: float) (y: float) (w: float) (h: float) : unit = nativeOnly
[<Import("clearRect",     "runtime/canvas.js")>]
let jsClearRect (ctx: Handle) (x: float) (y: float) (w: float) (h: float) : unit = nativeOnly
[<Import("setFillStyle",  "runtime/canvas.js")>]
let jsSetFillStyle (ctx: Handle) (style: string) : unit = nativeOnly
[<Import("setStrokeStyle","runtime/canvas.js")>]
let jsSetStrokeStyle (ctx: Handle) (style: string) : unit = nativeOnly
[<Import("setLineWidth",  "runtime/canvas.js")>]
let jsSetLineWidth (ctx: Handle) (width: float) : unit = nativeOnly
[<Import("beginPath",     "runtime/canvas.js")>]
let jsBeginPath (ctx: Handle) : unit = nativeOnly
[<Import("closePath",     "runtime/canvas.js")>]
let jsClosePath (ctx: Handle) : unit = nativeOnly
[<Import("moveTo",        "runtime/canvas.js")>]
let jsMoveTo (ctx: Handle) (x: float) (y: float) : unit = nativeOnly
[<Import("lineTo",        "runtime/canvas.js")>]
let jsLineTo (ctx: Handle) (x: float) (y: float) : unit = nativeOnly
[<Import("arc",           "runtime/canvas.js")>]
let jsArc (ctx: Handle) (x: float) (y: float) (r: float) (s: float) (e: float) : unit = nativeOnly
[<Import("fill",          "runtime/canvas.js")>]
let jsFill (ctx: Handle) : unit = nativeOnly
[<Import("stroke",        "runtime/canvas.js")>]
let jsStroke (ctx: Handle) : unit = nativeOnly
[<Import("fillText",      "runtime/canvas.js")>]
let jsFillText (ctx: Handle) (text: string) (x: float) (y: float) : unit = nativeOnly
[<Import("setFont",       "runtime/canvas.js")>]
let jsSetFont (ctx: Handle) (font: string) : unit = nativeOnly

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
