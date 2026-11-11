module Demos.IndexedDbCrud

open Browser.IndexedDb
open Browser.Html
open Browser.Elmish.Core

type Model = {
    DbHandle: Database option
    Key: string
    Value: string
    Result: string
    Keys: string list
}

type Msg =
    | KeyChanged of string
    | ValueChanged of string
    | Save
    | Load
    | Delete
    | ListKeys
    | SetResult of string
    | SetKeys of string list
    | InitDb of Database

let init () =
    { DbHandle = None; Key = ""; Value = ""; Result = ""; Keys = [] },
    [ fun dispatch -> openDb "fsharp-wasm-demo" 1 (fun db -> dispatch (InitDb db)) ]

/// Every database operation is asynchronous: the command starts it, its callback dispatches the outcome.
let update msg model =
    match msg with
    | KeyChanged s -> { model with Key = s }, Cmd.none
    | ValueChanged s -> { model with Value = s }, Cmd.none
    | InitDb db -> { model with DbHandle = Some db }, Cmd.none
    | Save ->
        match model.DbHandle with
        | Some db when model.Key <> "" ->
            model, [ fun dispatch -> put db model.Key model.Value (fun () -> dispatch (SetResult (sprintf "Saved: %s = %s" model.Key model.Value))) ]
        | _ -> model, Cmd.none
    | Load ->
        match model.DbHandle with
        | Some db when model.Key <> "" ->
            model, [ fun dispatch -> get db model.Key (fun v -> dispatch (SetResult (sprintf "Loaded: %s = %s" model.Key v))) ]
        | _ -> model, Cmd.none
    | Delete ->
        match model.DbHandle with
        | Some db when model.Key <> "" ->
            model, [ fun dispatch -> delete db model.Key (fun () -> dispatch (SetResult (sprintf "Deleted: %s" model.Key))) ]
        | _ -> model, Cmd.none
    | ListKeys ->
        match model.DbHandle with
        | Some db -> model, [ fun dispatch -> getAllKeys db (fun keys -> dispatch (SetKeys (Array.toList keys))) ]
        | None -> model, Cmd.none
    | SetResult s -> { model with Result = s }, Cmd.none
    | SetKeys keys -> { model with Keys = keys }, Cmd.none

let view model dispatch =
    article {
        class' "indexeddb-demo"
        header { h2 "IndexedDB CRUD" }
        section {
            div {
                class' "input-group"
                input { type' "text"; placeholder "Key";   value' model.Key;   onInput (fun s -> dispatch (KeyChanged s)) }
                input { type' "text"; placeholder "Value"; value' model.Value; onInput (fun s -> dispatch (ValueChanged s)) }
            }
            div {
                class' "button-group"
                button { onClick (fun () -> dispatch Save);     "Save" }
                button { onClick (fun () -> dispatch Load);     "Load" }
                button { onClick (fun () -> dispatch Delete);   "Delete" }
                button { onClick (fun () -> dispatch ListKeys); "List Keys" }
            }
            p model.Result
            ul {
                for k in model.Keys do
                    li { k }
            }
        }
    }

let start () =
    run "indexeddb-root" { Init = init; Update = update; View = view }
