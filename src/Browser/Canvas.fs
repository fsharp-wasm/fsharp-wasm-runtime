/// Browser.Canvas — immediate-mode drawing on the first `<canvas>` inside the mount point.  Colours are 0xRRGGBB.
module Browser.Canvas

open Fable.Core

[<Import("fillRect", "canvas")>]
let fillRect (x: int) (y: int) (w: int) (h: int) (rgb: int) : unit = nativeOnly

[<Import("clear", "canvas")>]
let clear (rgb: int) : unit = nativeOnly
