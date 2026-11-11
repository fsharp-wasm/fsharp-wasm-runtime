module Todo

open Browser.Elmish
open Browser.Html

type Item = { Id: int; Title: string; Done: bool }

type Model = { Items: Item list; Draft: string; NextId: int }

type Msg =
    | SetDraft of string
    | Add
    | Toggle of int
    | Remove of int
    | ClearDone

let init : Model =
    { Items =
        [ { Id = 1; Title = "Compile F# to WasmGC"; Done = true }
          { Id = 2; Title = "Run it in a browser"; Done = true }
          { Id = 3; Title = "Find sponsors"; Done = false } ]
      Draft = ""
      NextId = 4 }

let update (msg: Msg) (m: Model) : Model =
    match msg with
    | SetDraft s -> { m with Draft = s }
    | Add ->
        let title = m.Draft.Trim()
        if title = "" then m
        else { m with Items = m.Items @ [ { Id = m.NextId; Title = title; Done = false } ]; Draft = ""; NextId = m.NextId + 1 }
    | Toggle id -> { m with Items = m.Items |> List.map (fun i -> if i.Id = id then { i with Done = not i.Done } else i) }
    | Remove id -> { m with Items = m.Items |> List.filter (fun i -> i.Id <> id) }
    | ClearDone -> { m with Items = m.Items |> List.filter (fun i -> not i.Done) }

let viewItem (i: Item) : Html<Msg> =
    li [] [
        label [] [
            input [ attr "type" "checkbox"; attr (if i.Done then "checked" else "data-open") "checked"; onClick (Toggle i.Id) ]
            span [ attr "style" (if i.Done then "text-decoration: line-through; opacity: .6" else "") ] [ text i.Title ]
        ]
        button [ class' "outline secondary"; attr "style" "padding:.1rem .6rem;margin-left:.5rem"; onClick (Remove i.Id) ] [ text "×" ]
    ]

let view (m: Model) : Html<Msg> =
    let open' = m.Items |> List.filter (fun i -> not i.Done) |> List.length
    article [] [
        h2 [] [ text "Todo" ]
        div [ class' "grid" ] [
            input [ placeholder "What needs doing?"; value' m.Draft; onInput SetDraft ]
            button [ onClick Add ] [ text "Add" ]
        ]
        ul [ attr "style" "list-style:none;padding:0" ] (m.Items |> List.map viewItem)
        p [] [
            small [] [ text (string open' + " open · " + string (List.length m.Items - open') + " done  ") ]
            button [ class' "outline"; attr "style" "padding:.1rem .6rem"; onClick ClearDone ] [ text "clear done" ]
        ]
    ]

let main () : unit = run (simple init update view Add)
