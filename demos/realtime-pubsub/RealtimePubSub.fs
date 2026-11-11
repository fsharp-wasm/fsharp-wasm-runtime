module Demos.RealtimePubSub

open Browser.PubSub
open Browser.Html
open Browser.Elmish.Core

type Model = { Messages: string list; Input: string }

type Msg =
    | InputChanged of string
    | SendMessage
    | MessageReceived of string

let init () =
    { Messages = []; Input = "" }, Cmd.none

let update msg model =
    match msg with
    | InputChanged s ->
        { model with Input = s }, Cmd.none
    | SendMessage when model.Input.Trim() <> "" ->
        publish "chat" model.Input
        { model with Input = "" }, Cmd.none
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
    subscribe "chat" (fun _ -> ())
    run "pubsub-root" { Init = init; Update = update; View = view }
