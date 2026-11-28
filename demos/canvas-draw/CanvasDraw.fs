module Demos.CanvasDraw

// Canvas 2D drawn from F#, with the whole of Browser.Canvas: a gradient, a transformed and shadowed rounded rectangle, a clip, a curve,
// dashes, an even-odd fill (a hole stays a hole), text with its measured width, and another canvas drawn into this one.
// The page checks pixels, so what is drawn here is what the test expects (see tests/e2e/demos.mjs).

open Browser.Dom
open Browser.Canvas

let width = 400.0
let height = 300.0

let background (c: Context2D) =
    setFillGradient c (linearGradient c 0.0 0.0 0.0 height [ 0.0, "#1e3a8a"; 1.0, "#38bdf8" ])
    fillRect c 0.0 0.0 width height

/// An orange rounded rectangle, turned and with a shadow; `withState` puts the transform and the shadow back.
let card (c: Context2D) =
    withState c (fun () ->
        translate c 200.0 150.0
        rotate c 0.35
        setShadow c "rgba(0,0,0,0.45)" 14.0 4.0 6.0
        setFillStyle c "#f59e0b"
        beginPath c
        roundRect c -80.0 -40.0 160.0 80.0 16.0
        fill c)

/// A white band that only shows inside a circle: the circle is the clip.
let clipped (c: Context2D) =
    withState c (fun () ->
        beginPath c
        arc c 70.0 70.0 40.0 0.0 (2.0 * System.Math.PI)
        clip c
        setFillStyle c "#ffffff"
        fillRect c 0.0 55.0 140.0 30.0)

/// Two nested squares drawn as one path: with the even-odd rule the inner one is a hole.
let frame (c: Context2D) =
    withState c (fun () ->
        beginPath c
        rect c 290.0 20.0 90.0 90.0
        rect c 310.0 40.0 50.0 50.0
        setFillStyle c "#dc2626"
        fillEvenOdd c)

let curve (c: Context2D) =
    withState c (fun () ->
        setStrokeStyle c "#facc15"
        setLineWidth c 4.0
        setLineCap c "round"
        setLineDash c [ 10.0; 8.0 ]
        beginPath c
        moveTo c 20.0 270.0
        bezierCurveTo c 100.0 180.0 160.0 280.0 260.0 230.0
        quadraticCurveTo c 320.0 200.0 380.0 270.0
        stroke c)

let label (c: Context2D) =
    withState c (fun () ->
        setFont c "20px sans-serif"
        setFillStyle c "#ffffff"
        setTextAlign c "left"
        setTextBaseline c "alphabetic"
        fillText c "F# on a canvas" 20.0 30.0
        measureText c "F# on a canvas")

/// A small second canvas, drawn on, and then drawn into the first one.
let inset (c: Context2D) =
    let small = Element.ofId "inset"
    let s = getContext small
    setFillStyle s "#16a34a"
    fillRect s 0.0 0.0 40.0 40.0
    setFillStyle s "#ffffff"
    fillRect s 10.0 10.0 20.0 20.0
    drawCanvas c small 330.0 230.0 40.0 40.0

let start () =
    let c = getContext (Element.ofId "scene")
    background c
    card c
    clipped c
    frame c
    curve c
    let w = label c
    inset c
    // the measured width goes to the page: the test reads it, a person can see it
    setText (Element.ofId "measured") (sprintf "width of the label: %d px" (int (w + 0.5)))
