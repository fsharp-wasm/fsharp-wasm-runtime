module Counter

open Browser.Elmish
open Browser.Html

type Msg =
    | Increment
    | Decrement
    | Reset

let update (msg: Msg) (model: int) : int =
    match msg with
    | Increment -> model + 1
    | Decrement -> model - 1
    | Reset -> 0

let view (model: int) : Html<Msg> =
    article [ class' "card" ] [
        h1 [] [ text "Hello from F# on WasmGC" ]
        p [] [ text ("Count: " + string model) ]
        button [ onClick Decrement ] [ text "−" ]
        button [ onClick Increment ] [ text "+" ]
        button [ onClick Reset ] [ text "reset" ]
    ]

let main () : unit = run (simple 0 update view Reset)
