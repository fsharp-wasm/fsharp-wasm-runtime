module Life

open Browser.Elmish
open Browser.Html
open Browser.Canvas

let cols = 80
let rows = 50
let cell = 8

type Model = { Cells: int[]; Running: bool; Generation: int; Seed: int }

type Msg =
    | Tick
    | ToggleRun
    | Step
    | Randomize
    | Clear
    | Paint of int * int

let private next (seed: int) : int = (seed * 1103515245 + 12345) &&& 0x7fffffff

let private random (seed: int) : Model =
    let cells = Array.zeroCreate<int> (cols * rows)
    let mutable s = seed
    for i in 0 .. cells.Length - 1 do
        s <- next s
        cells.[i] <- if (s >>> 16) % 4 = 0 then 1 else 0
    { Cells = cells; Running = true; Generation = 0; Seed = s }

let private neighbours (cells: int[]) (x: int) (y: int) : int =
    let mutable n = 0
    for dy in -1 .. 1 do
        for dx in -1 .. 1 do
            if dx <> 0 || dy <> 0 then
                n <- n + cells.[((y + dy + rows) % rows) * cols + (x + dx + cols) % cols]
    n

let private step (m: Model) : Model =
    let cells = Array.zeroCreate<int> (cols * rows)
    for y in 0 .. rows - 1 do
        for x in 0 .. cols - 1 do
            let n = neighbours m.Cells x y
            let alive = m.Cells.[y * cols + x] = 1
            cells.[y * cols + x] <- if n = 3 || (alive && n = 2) then 1 else 0
    { m with Cells = cells; Generation = m.Generation + 1 }

let update (msg: Msg) (m: Model) : Model =
    match msg with
    | Tick -> if m.Running then step m else m
    | ToggleRun -> { m with Running = not m.Running }
    | Step -> step m
    | Randomize -> random m.Seed
    | Clear -> { m with Cells = Array.zeroCreate<int> (cols * rows); Running = false; Generation = 0 }
    | Paint(px, py) ->
        let i = (py / cell) * cols + px / cell
        if i >= 0 && i < m.Cells.Length then
            let cells = Array.copy m.Cells
            cells.[i] <- 1 - cells.[i]
            { m with Cells = cells }
        else m

let view (m: Model) : Html<Msg> =
    let alive = m.Cells |> Array.sum
    article [] [
        h2 [] [ text "Game of Life" ]
        canvas [ attr "width" (string (cols * cell)); attr "height" (string (rows * cell)); attr "style" "width:100%;background:#0b1020;border-radius:8px;cursor:crosshair"; onPointer (fun x y -> Paint(x, y)) ]
        div [ class' "grid" ] [
            button [ onClick ToggleRun ] [ text (if m.Running then "pause" else "run") ]
            button [ class' "secondary"; onClick Step ] [ text "step" ]
            button [ class' "secondary"; onClick Randomize ] [ text "randomize" ]
            button [ class' "outline"; onClick Clear ] [ text "clear" ]
        ]
        small [] [ text ("generation " + string m.Generation + " · " + string alive + " cells alive · click the canvas to draw") ]
    ]

let draw (m: Model) : unit =
    clear 0x0b1020
    for y in 0 .. rows - 1 do
        for x in 0 .. cols - 1 do
            if m.Cells.[y * cols + x] = 1 then fillRect (x * cell) (y * cell) (cell - 1) (cell - 1) 0x7cf5c0

let main () : unit =
    run { Init = random 12345; Update = update; View = view; TickMs = 60; TickMsg = Tick; Effect = draw }
