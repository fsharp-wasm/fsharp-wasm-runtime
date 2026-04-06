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
/// NOTE: Mutable closures (required for MVU dispatch/render loop) are not yet fully
/// supported by the WasmGC binary emitter. This stub renders the initial view only.
let run (mountId: string) (program: Program<'Model, 'Msg>) =
    let container = Element.ofId mountId
    let initResult = program.Init ()
    let model = fst initResult
    let view = program.View model (fun _ -> ())
    clearAndRender container [view]
