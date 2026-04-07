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

/// Run an Elmish program mounted at the given DOM element ID.
///
/// Implements the standard MVU loop: Init → View → Update → View → …
/// The model is updated in place; the dispatch closure is stable across renders.
///
/// NOTE: Mutable captures shared between `dispatch` and `render` (via `let mutable model`)
/// and mutual recursion (`let rec … and …`) require call_ref / func_ref support in the
/// WasmGC binary emitter.  The F# source is production-correct; full interactivity
/// activates once the compiler supports these patterns end-to-end.
let run (mountId: string) (program: Program<'Model, 'Msg>) =
    let container = Element.ofId mountId
    let mutable model = fst (program.Init ())
    let mutable cmds  = snd (program.Init ())
    let rec dispatch (msg: 'Msg) =
        let newModel, newCmds = program.Update msg model
        model <- newModel
        render ()
        newCmds |> List.iter (fun cmd -> cmd dispatch)
    and render () =
        clearAndRender container [program.View model dispatch]
    render ()
    cmds |> List.iter (fun cmd -> cmd dispatch)
