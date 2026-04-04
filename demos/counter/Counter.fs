module Demos.Counter

open Browser.Elmish.Core
open Browser.Html.Elements
open Browser.Html.Attrs

type Model = { Count: int }

type Msg =
    | Increment
    | Decrement
    | Reset

let init () = { Count = 0 }, Cmd.none

let update msg model =
    match msg with
    | Increment -> { model with Count = model.Count + 1 }, Cmd.none
    | Decrement -> { model with Count = model.Count - 1 }, Cmd.none
    | Reset     -> { model with Count = 0 }, Cmd.none

let view model dispatch =
    article [class_ "counter-demo"] [
        header [] [h2 [] [text "Counter"]]
        section [] [
            p [class_ "count-display"] [text (string model.Count)]
            div [class_ "button-group"] [
                button [onClick_ (fun () -> dispatch Decrement)] [text "−"]
                button [onClick_ (fun () -> dispatch Reset)]     [text "Reset"]
                button [onClick_ (fun () -> dispatch Increment)] [text "+"]
            ]
        ]
    ]

let start () =
    run "counter-root" { Init = init; Update = update; View = view }
