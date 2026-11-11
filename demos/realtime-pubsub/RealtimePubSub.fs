module Demos.RealtimePubSub

open Browser.PubSub
open Browser.Html
open Browser.Elmish.Core

type Model = { Messages: string list; Input: string }

type Msg =
    | InputChanged of string
    | SendMessage
    | MessageReceived of string

/// The bus delivers into the program: a startup command subscribes with the program's `dispatch`.
let init () =
    { Messages = []; Input = "" },
    [ fun dispatch -> subscribe "chat" (fun s -> dispatch (MessageReceived s)) ]

let update msg model =
    match msg with
    | InputChanged s ->
        { model with Input = s }, Cmd.none
    | SendMessage when model.Input.Trim() <> "" ->
        // publishing is an effect: it runs as a command, after this update has produced its model — the subscriber
        // dispatches synchronously, and doing it from inside `update` would be overwritten by this update's result
        { model with Input = "" }, [ fun _ -> publish "chat" model.Input ]
    | SendMessage ->
        model, Cmd.none
    | MessageReceived s ->
        { model with Messages = model.Messages @ [s] }, Cmd.none

let view model dispatch =
    article {
        class' "pubsub-demo"
        header { h2 "Realtime Pub/Sub" }
        section {
            div {
                class' "input-group"
                input {
                    type' "text"
                    value' model.Input
                    placeholder "Type a message..."
                    onInput (fun s -> dispatch (InputChanged s))
                }
                button {
                    onClick (fun () -> dispatch SendMessage)
                    "Send"
                }
            }
            ul {
                for m in model.Messages do
                    li { m }
            }
        }
    }

let start () =
    run "pubsub-root" { Init = init; Update = update; View = view }
