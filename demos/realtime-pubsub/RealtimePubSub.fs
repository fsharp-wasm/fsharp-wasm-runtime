module Demos.RealtimePubSub

open Browser.Dom
open Browser.Events
open Browser.PubSub
open Browser.Html.Elements
open Browser.Html.Attrs
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
    article [class_ "pubsub-demo"] [
        header [] [h2 [] [text "Realtime Pub/Sub"]]
        section [] [
            div [class_ "input-group"] [
                input [
                    type_ "text"
                    value_ model.Input
                    placeholder "Type a message..."
                    onInput_ (fun s -> dispatch (InputChanged s))
                ]
                button [onClick_ (fun () -> dispatch SendMessage)] [text "Send"]
            ]
            ul [] (model.Messages |> List.map (fun m -> li [] [text m]))
        ]
    ]

let start () =
    let program = { Init = init; Update = update; View = view }
    subscribe "chat" (fun msg ->
        // In a real app, dispatch would be captured; this is a demo placeholder
        ()
    )
    run "pubsub-root" program
