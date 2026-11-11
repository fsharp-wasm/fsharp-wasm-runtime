module Demos.WebGpuBasic

open Browser.Gpu
open Browser.Html
open Browser.Elmish.Core

type Model = {
    Status: string
    IsAvailable: bool
}

type Msg =
    | CheckAvailability
    | SetStatus of string

let init () =
    { Status = "Checking WebGPU availability..."
      IsAvailable = false }, Cmd.none

let update msg model =
    match msg with
    | CheckAvailability ->
        let available = isAvailable ()
        { model with
            IsAvailable = available
            Status =
                if available then "WebGPU is available!"
                else "WebGPU is not available in this browser." }, Cmd.none
    | SetStatus s -> { model with Status = s }, Cmd.none

let view model dispatch =
    article {
        class' "webgpu-demo"
        header { h2 "WebGPU Basic" }
        section {
            p model.Status
            button {
                onClick (fun () -> dispatch CheckAvailability)
                "Check WebGPU"
            }
            when' model.IsAvailable (
                div {
                    canvas { id "webgpu-canvas"; width' 400; height' 300 }
                    p "WebGPU canvas ready for rendering"
                })
        }
    }

let start () =
    run "webgpu-root" { Init = init; Update = update; View = view }
