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

// ── state and transforms ─────────────────────────────────────────────────────
[<Import("save",           "runtime/canvas.js")>]
let jsSave (ctx: Handle) : unit = nativeOnly
[<Import("restore",        "runtime/canvas.js")>]
let jsRestore (ctx: Handle) : unit = nativeOnly
[<Import("translate",      "runtime/canvas.js")>]
let jsTranslate (ctx: Handle) (x: float) (y: float) : unit = nativeOnly
[<Import("rotate",         "runtime/canvas.js")>]
let jsRotate (ctx: Handle) (angle: float) : unit = nativeOnly
[<Import("scale",          "runtime/canvas.js")>]
let jsScale (ctx: Handle) (x: float) (y: float) : unit = nativeOnly
[<Import("setTransform",   "runtime/canvas.js")>]
let jsSetTransform (ctx: Handle) (a: float) (b: float) (c: float) (d: float) (e: float) (f: float) : unit = nativeOnly
[<Import("resetTransform", "runtime/canvas.js")>]
let jsResetTransform (ctx: Handle) : unit = nativeOnly

// ── paths ────────────────────────────────────────────────────────────────────
[<Import("rect",             "runtime/canvas.js")>]
let jsRect (ctx: Handle) (x: float) (y: float) (w: float) (h: float) : unit = nativeOnly
[<Import("roundRect",        "runtime/canvas.js")>]
let jsRoundRect (ctx: Handle) (x: float) (y: float) (w: float) (h: float) (r: float) : unit = nativeOnly
[<Import("ellipse",          "runtime/canvas.js")>]
let jsEllipse (ctx: Handle) (x: float) (y: float) (rx: float) (ry: float) (rot: float) (s: float) (e: float) : unit = nativeOnly
[<Import("arcTo",            "runtime/canvas.js")>]
let jsArcTo (ctx: Handle) (x1: float) (y1: float) (x2: float) (y2: float) (r: float) : unit = nativeOnly
[<Import("quadraticCurveTo", "runtime/canvas.js")>]
let jsQuadraticCurveTo (ctx: Handle) (cx: float) (cy: float) (x: float) (y: float) : unit = nativeOnly
[<Import("bezierCurveTo",    "runtime/canvas.js")>]
let jsBezierCurveTo (ctx: Handle) (c1x: float) (c1y: float) (c2x: float) (c2y: float) (x: float) (y: float) : unit = nativeOnly
[<Import("fillRule",         "runtime/canvas.js")>]
let jsFillRule (ctx: Handle) (evenOdd: int) : unit = nativeOnly
[<Import("clip",             "runtime/canvas.js")>]
let jsClip (ctx: Handle) (evenOdd: int) : unit = nativeOnly

// ── stroke and fill style ────────────────────────────────────────────────────
[<Import("setGlobalAlpha",        "runtime/canvas.js")>]
let jsSetGlobalAlpha (ctx: Handle) (alpha: float) : unit = nativeOnly
[<Import("setLineCap",            "runtime/canvas.js")>]
let jsSetLineCap (ctx: Handle) (cap: string) : unit = nativeOnly
[<Import("setLineJoin",           "runtime/canvas.js")>]
let jsSetLineJoin (ctx: Handle) (join: string) : unit = nativeOnly
[<Import("setMiterLimit",         "runtime/canvas.js")>]
let jsSetMiterLimit (ctx: Handle) (limit: float) : unit = nativeOnly
[<Import("setLineDash",           "runtime/canvas.js")>]
let jsSetLineDash (ctx: Handle) (pattern: string) : unit = nativeOnly
[<Import("setShadow",             "runtime/canvas.js")>]
let jsSetShadow (ctx: Handle) (color: string) (blur: float) (dx: float) (dy: float) : unit = nativeOnly
[<Import("setCompositeOperation", "runtime/canvas.js")>]
let jsSetCompositeOperation (ctx: Handle) (op: string) : unit = nativeOnly

// ── gradients ────────────────────────────────────────────────────────────────
[<Import("createLinearGradient", "runtime/canvas.js")>]
let jsCreateLinearGradient (ctx: Handle) (x0: float) (y0: float) (x1: float) (y1: float) : Handle = nativeOnly
[<Import("createRadialGradient", "runtime/canvas.js")>]
let jsCreateRadialGradient (ctx: Handle) (x0: float) (y0: float) (r0: float) (x1: float) (y1: float) (r1: float) : Handle = nativeOnly
[<Import("addColorStop",         "runtime/canvas.js")>]
let jsAddColorStop (grad: Handle) (offset: float) (color: string) : unit = nativeOnly
[<Import("setFillGradient",      "runtime/canvas.js")>]
let jsSetFillGradient (ctx: Handle) (grad: Handle) : unit = nativeOnly
[<Import("setStrokeGradient",    "runtime/canvas.js")>]
let jsSetStrokeGradient (ctx: Handle) (grad: Handle) : unit = nativeOnly

// ── text and pictures ────────────────────────────────────────────────────────
[<Import("strokeText",      "runtime/canvas.js")>]
let jsStrokeText (ctx: Handle) (text: string) (x: float) (y: float) : unit = nativeOnly
[<Import("setTextAlign",    "runtime/canvas.js")>]
let jsSetTextAlign (ctx: Handle) (align: string) : unit = nativeOnly
[<Import("setTextBaseline", "runtime/canvas.js")>]
let jsSetTextBaseline (ctx: Handle) (baseline: string) : unit = nativeOnly
[<Import("measureText",     "runtime/canvas.js")>]
let jsMeasureText (ctx: Handle) (text: string) : float = nativeOnly
[<Import("drawCanvas",      "runtime/canvas.js")>]
let jsDrawCanvas (ctx: Handle) (src: Handle) (dx: float) (dy: float) (dw: float) (dh: float) : unit = nativeOnly

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

// ── state and transforms ─────────────────────────────────────────────────────
/// Saves the drawing state (transform, clip, styles); `restore` brings it back.  Pairs nest.
let save (Ctx ctx)                      = jsSave ctx
let restore (Ctx ctx)                   = jsRestore ctx
/// `save`, run `draw`, `restore`: the state cannot be left unrestored by a missing call.  What `draw` returns is returned.
let withState (c: Context2D) (draw: unit -> 'T) : 'T =
    save c
    let result = draw ()
    restore c
    result
let translate (Ctx ctx) x y             = jsTranslate ctx x y
/// Rotates by `angle` radians, clockwise on the screen.
let rotate (Ctx ctx) angle              = jsRotate ctx angle
let scale (Ctx ctx) x y                 = jsScale ctx x y
/// The matrix [a c e; b d f; 0 0 1] replaces the transform.
let setTransform (Ctx ctx) a b c d e f  = jsSetTransform ctx a b c d e f
let resetTransform (Ctx ctx)            = jsResetTransform ctx

// ── paths ────────────────────────────────────────────────────────────────────
let rect (Ctx ctx) x y w h              = jsRect ctx x y w h
let roundRect (Ctx ctx) x y w h r       = jsRoundRect ctx x y w h r
let ellipse (Ctx ctx) x y rx ry rot s e = jsEllipse ctx x y rx ry rot s e
let arcTo (Ctx ctx) x1 y1 x2 y2 r       = jsArcTo ctx x1 y1 x2 y2 r
let quadraticCurveTo (Ctx ctx) cx cy x y = jsQuadraticCurveTo ctx cx cy x y
let bezierCurveTo (Ctx ctx) c1x c1y c2x c2y x y = jsBezierCurveTo ctx c1x c1y c2x c2y x y
/// Fills with the even-odd rule: a region inside an odd number of outlines is filled (a hole stays a hole).
let fillEvenOdd (Ctx ctx)               = jsFillRule ctx 1
/// Clips what is drawn next to the current path (non-zero rule); `save` before and `restore` after to undo it.
let clip (Ctx ctx)                      = jsClip ctx 0
let clipEvenOdd (Ctx ctx)               = jsClip ctx 1

// ── stroke and fill style ────────────────────────────────────────────────────
/// 0 is invisible, 1 opaque; it multiplies what is drawn.
let setGlobalAlpha (Ctx ctx) alpha      = jsSetGlobalAlpha ctx alpha
/// "butt", "round" or "square".
let setLineCap (Ctx ctx) cap            = jsSetLineCap ctx cap
/// "miter", "round" or "bevel".
let setLineJoin (Ctx ctx) join          = jsSetLineJoin ctx join
let setMiterLimit (Ctx ctx) limit       = jsSetMiterLimit ctx limit
/// Dash and gap lengths in turn, `[ 5.0; 3.0 ]`; `[]` is a solid line.
let setLineDash (Ctx ctx) (pattern: float list) =
    jsSetLineDash ctx (pattern |> List.map string |> String.concat ",")
/// A blurred shadow behind what is drawn; a transparent colour (or `clearShadow`) switches it off.
let setShadow (Ctx ctx) color blur dx dy = jsSetShadow ctx color blur dx dy
let clearShadow (Ctx ctx)               = jsSetShadow ctx "rgba(0,0,0,0)" 0.0 0.0 0.0
/// "source-over" (the default), "multiply", "lighter", "destination-out", …
let setCompositeOperation (Ctx ctx) op  = jsSetCompositeOperation ctx op

// ── gradients ────────────────────────────────────────────────────────────────
/// A gradient, to be given colour stops and then used as a fill or stroke.
type Gradient = private Grad of Handle

let createLinearGradient (Ctx ctx) x0 y0 x1 y1 = Grad (jsCreateLinearGradient ctx x0 y0 x1 y1)
/// From the circle (x0, y0, r0) to the circle (x1, y1, r1).
let createRadialGradient (Ctx ctx) x0 y0 r0 x1 y1 r1 = Grad (jsCreateRadialGradient ctx x0 y0 r0 x1 y1 r1)
/// `offset` is 0 at the start of the gradient and 1 at its end.
let addColorStop (Grad g) offset color  = jsAddColorStop g offset color
let setFillGradient (Ctx ctx) (Grad g)   = jsSetFillGradient ctx g
let setStrokeGradient (Ctx ctx) (Grad g) = jsSetStrokeGradient ctx g
/// A linear gradient with its stops: `linearGradient c 0.0 0.0 0.0 100.0 [ 0.0, "#fff"; 1.0, "#06c" ]`.
let linearGradient (c: Context2D) x0 y0 x1 y1 (stops: (float * string) list) =
    let g = createLinearGradient c x0 y0 x1 y1
    for (offset, color) in stops do addColorStop g offset color
    g

// ── text and pictures ────────────────────────────────────────────────────────
let strokeText (Ctx ctx) text x y       = jsStrokeText ctx text x y
/// "start", "end", "left", "right" or "center".
let setTextAlign (Ctx ctx) align        = jsSetTextAlign ctx align
/// "top", "hanging", "middle", "alphabetic", "ideographic" or "bottom".
let setTextBaseline (Ctx ctx) baseline  = jsSetTextBaseline ctx baseline
/// The width of `text` in the current font, in CSS pixels.
let measureText (Ctx ctx) text : float  = jsMeasureText ctx text
/// Draws another canvas, scaled to (dw, dh), with its top left at (dx, dy).
let drawCanvas (Ctx ctx) (El src) dx dy dw dh = jsDrawCanvas ctx src dx dy dw dh
