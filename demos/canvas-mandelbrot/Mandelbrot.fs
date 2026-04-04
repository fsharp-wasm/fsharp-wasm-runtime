module Demos.Mandelbrot

open Browser.Dom
open Browser.Canvas

let iterate (cx: float) (cy: float) (maxIter: int) : int =
    let mutable x = 0.0
    let mutable y = 0.0
    let mutable i = 0
    while i < maxIter && x * x + y * y < 4.0 do
        let xn = x * x - y * y + cx
        y <- 2.0 * x * y + cy
        x <- xn
        i <- i + 1
    i

let colorForIter (iter: int) (maxIter: int) : string =
    if iter = maxIter then "rgb(0,0,0)"
    else
        let t = float iter / float maxIter
        let r = int (9.0 * (1.0 - t) * t * t * t * 255.0)
        let g = int (15.0 * (1.0 - t) * (1.0 - t) * t * t * 255.0)
        let b = int (8.5 * (1.0 - t) * (1.0 - t) * (1.0 - t) * t * 255.0)
        sprintf "rgb(%d,%d,%d)" r g b

let render (canvasId: string) (width: int) (height: int) =
    let canvasEl = Element.ofId canvasId
    let ctx = getContext canvasEl
    let maxIter = 100
    for py in 0 .. height - 1 do
        for px in 0 .. width - 1 do
            let cx = float px / float width * 3.5 - 2.5
            let cy = float py / float height * 2.0 - 1.0
            let iter = iterate cx cy maxIter
            setFillStyle ctx (colorForIter iter maxIter)
            fillRect ctx (float px) (float py) 1.0 1.0

let setup () =
    render "mandelbrot" 400 300
