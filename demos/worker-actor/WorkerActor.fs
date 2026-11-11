module Demos.WorkerActor

open Browser.Workers
open Browser.Html
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
    article {
        class' "worker-demo"
        header { h2 "Worker Actor" }
        section {
            p (sprintf "Status: %s" model.WorkerStatus)
            div {
                class' "input-group"
                input {
                    type' "text"
                    value' model.Input
                    placeholder "Message for worker..."
                    onInput (fun s -> dispatch (InputChanged s))
                }
                button {
                    onClick (fun () -> dispatch SendToWorker)
                    "Send"
                }
            }
            ul {
                for r in model.Results do
                    li { r }
            }
        }
    }

let start () =
    run "worker-root" { Init = init; Update = update; View = view }
