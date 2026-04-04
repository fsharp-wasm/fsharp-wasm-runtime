module Demos.IndexedDbCrud

open Browser.Dom
open Browser.Events
open Browser.IndexedDb
open Browser.Html.Elements
open Browser.Html.Attrs
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
    { DbHandle = None; Key = ""; Value = ""; Result = ""; Keys = [] }, Cmd.none

let update msg model =
    match msg with
    | KeyChanged s -> { model with Key = s }, Cmd.none
    | ValueChanged s -> { model with Value = s }, Cmd.none
    | InitDb db -> { model with DbHandle = Some db }, Cmd.none
    | Save ->
        match model.DbHandle with
        | Some db when model.Key <> "" ->
            put db model.Key model.Value
            { model with Result = sprintf "Saved: %s = %s" model.Key model.Value }, Cmd.none
        | _ -> model, Cmd.none
    | Load ->
        match model.DbHandle with
        | Some db when model.Key <> "" ->
            let v = get db model.Key
            { model with Result = sprintf "Loaded: %s = %s" model.Key v }, Cmd.none
        | _ -> model, Cmd.none
    | Delete ->
        match model.DbHandle with
        | Some db when model.Key <> "" ->
            delete db model.Key
            { model with Result = sprintf "Deleted: %s" model.Key }, Cmd.none
        | _ -> model, Cmd.none
    | ListKeys ->
        match model.DbHandle with
        | Some db ->
            let keys = getAllKeys db |> Array.toList
            { model with Keys = keys }, Cmd.none
        | None -> model, Cmd.none
    | SetResult s -> { model with Result = s }, Cmd.none
    | SetKeys keys -> { model with Keys = keys }, Cmd.none

let view model dispatch =
    article [class_ "indexeddb-demo"] [
        header [] [h2 [] [text "IndexedDB CRUD"]]
        section [] [
            div [class_ "input-group"] [
                input [type_ "text"; placeholder "Key"; value_ model.Key; onInput_ (fun s -> dispatch (KeyChanged s))]
                input [type_ "text"; placeholder "Value"; value_ model.Value; onInput_ (fun s -> dispatch (ValueChanged s))]
            ]
            div [class_ "button-group"] [
                button [onClick_ (fun () -> dispatch Save)] [text "Save"]
                button [onClick_ (fun () -> dispatch Load)] [text "Load"]
                button [onClick_ (fun () -> dispatch Delete)] [text "Delete"]
                button [onClick_ (fun () -> dispatch ListKeys)] [text "List Keys"]
            ]
            p [] [text model.Result]
            ul [] (model.Keys |> List.map (fun k -> li [] [text k]))
        ]
    ]

let start () =
    run "indexeddb-root" { Init = init; Update = update; View = view }
