module Browser.Elmish.Core

open Browser.Dom
open Browser.Html.Elements

type Dispatch<'Msg> = 'Msg -> unit
type Cmd<'Msg> = (Dispatch<'Msg> -> unit) list

module Cmd =
    let none : Cmd<'Msg> = []
    let ofMsg msg : Cmd<'Msg> = [fun dispatch -> dispatch msg]
    let batch (cmds: Cmd<'Msg> list) : Cmd<'Msg> = List.concat cmds

type Program<'Model, 'Msg> = {
    Init   : unit -> 'Model * Cmd<'Msg>
    Update : 'Msg -> 'Model -> 'Model * Cmd<'Msg>
    View   : 'Model -> Dispatch<'Msg> -> Node
}

/// Run an Elmish program inside a DOM element identified by its ID.
let run (mountId: string) (program: Program<'Model, 'Msg>) =
    let container = Element.ofId mountId
    let mutable model = fst (program.Init ())
    let mutable cmds = snd (program.Init ())

    let rec dispatch msg =
        let newModel, newCmds = program.Update msg model
        model <- newModel
        render ()
        newCmds |> List.iter (fun cmd -> cmd dispatch)

    and render () =
        let view = program.View model dispatch
        clearAndRender container [view]

    render ()
    cmds |> List.iter (fun cmd -> cmd dispatch)
