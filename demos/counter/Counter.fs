module Demos.Counter

open Browser.Elmish.Core
open Browser.Html

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
    article {
        class' "counter-demo"
        header { h2 "Counter" }
        section {
            el "p" { class' "count-display"; string model.Count }
            div {
                class' "button-group"
                button { onClick (fun () -> dispatch Decrement); "−" }
                button { onClick (fun () -> dispatch Reset);     "Reset" }
                button { onClick (fun () -> dispatch Increment); "+" }
            }
        }
    }

let start () =
    run "counter-root" { Init = init; Update = update; View = view }
