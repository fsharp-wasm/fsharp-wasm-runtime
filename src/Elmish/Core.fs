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

type RuntimeState<'Model, 'Msg> = {
    mutable Model: 'Model
    mutable Dispatch: Dispatch<'Msg>
}

/// Run an Elmish program mounted at the given DOM element ID.
///
/// Implements the standard MVU loop: Init → View → Update → View → …
/// The dispatch function is stable across renders; the model is kept in a
/// mutable record so closures can share state without ref-cell boxing.
let runWith
    (mountId: string)
    (init: unit -> 'Model * Cmd<'Msg>)
    (update: 'Msg -> 'Model -> 'Model * Cmd<'Msg>)
    (view: 'Model -> Dispatch<'Msg> -> Node) =
    let container = Element.ofId mountId
    let initialModel, initialCmds = init ()
    let state = {
        Model = initialModel
        Dispatch = fun _ -> ()
    }

    let render (model: 'Model) (dispatch: Dispatch<'Msg>) =
        clearAndRender container [view model dispatch]

    let dispatchImpl (msg: 'Msg) =
        let newModel, newCmds = update msg state.Model
        state.Model <- newModel
        render state.Model state.Dispatch
        newCmds |> List.iter (fun cmd -> cmd state.Dispatch)

    state.Dispatch <- dispatchImpl
    render state.Model state.Dispatch
    initialCmds |> List.iter (fun cmd -> cmd state.Dispatch)

let run (mountId: string) (program: Program<'Model, 'Msg>) =
    runWith mountId program.Init program.Update program.View
