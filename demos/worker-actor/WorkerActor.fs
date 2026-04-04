module Demos.WorkerActor

open Browser.Dom
open Browser.Events
open Browser.Workers
open Browser.PubSub
open Browser.Html.Elements
open Browser.Html.Attrs
open Browser.Elmish.Core

type Model = {
    Input: string
    Results: string list
    WorkerStatus: string
}

type Msg =
    | InputChanged of string
    | SendToWorker
    | WorkerResult of string
    | StatusChanged of string

let init () =
    { Input = ""; Results = []; WorkerStatus = "Ready" }, Cmd.none

let update msg model =
    match msg with
    | InputChanged s -> { model with Input = s }, Cmd.none
    | SendToWorker ->
        { model with WorkerStatus = "Processing..." }, Cmd.none
    | WorkerResult s ->
        { model with
            Results = model.Results @ [s]
            WorkerStatus = "Ready" }, Cmd.none
    | StatusChanged s ->
        { model with WorkerStatus = s }, Cmd.none

let view model dispatch =
    article [class_ "worker-demo"] [
        header [] [h2 [] [text "Worker Actor"]]
        section [] [
            p [] [text (sprintf "Status: %s" model.WorkerStatus)]
            div [class_ "input-group"] [
                input [
                    type_ "text"
                    value_ model.Input
                    placeholder "Message for worker..."
                    onInput_ (fun s -> dispatch (InputChanged s))
                ]
                button [onClick_ (fun () -> dispatch SendToWorker)] [text "Send"]
            ]
            ul [] (model.Results |> List.map (fun r -> li [] [text r]))
        ]
    ]

let start () =
    run "worker-root" { Init = init; Update = update; View = view }
