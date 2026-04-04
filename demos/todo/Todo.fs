module Demos.Todo

open Browser.Elmish.Core
open Browser.Html.Elements
open Browser.Html.Attrs

type Todo = { Id: int; Text: string; Done: bool }

type Model = { Todos: Todo list; Input: string; NextId: int }

type Msg =
    | InputChanged of string
    | AddTodo
    | ToggleTodo of int
    | RemoveTodo of int

let init () =
    { Todos = []; Input = ""; NextId = 1 }, Cmd.none

let update msg model =
    match msg with
    | InputChanged s ->
        { model with Input = s }, Cmd.none
    | AddTodo when model.Input.Trim() <> "" ->
        let todo = { Id = model.NextId; Text = model.Input.Trim(); Done = false }
        { model with
            Todos = model.Todos @ [todo]
            Input = ""
            NextId = model.NextId + 1 }, Cmd.none
    | AddTodo ->
        model, Cmd.none
    | ToggleTodo id ->
        let todos =
            model.Todos
            |> List.map (fun t ->
                if t.Id = id then { t with Done = not t.Done } else t)
        { model with Todos = todos }, Cmd.none
    | RemoveTodo id ->
        { model with Todos = model.Todos |> List.filter (fun t -> t.Id <> id) }, Cmd.none

let viewTodo dispatch (todo: Todo) =
    li [class_ (if todo.Done then "done" else "")] [
        span [onClick_ (fun () -> dispatch (ToggleTodo todo.Id))] [
            text (if todo.Done then "☑ " else "☐ ")
            text todo.Text
        ]
        button [class_ "secondary"; onClick_ (fun () -> dispatch (RemoveTodo todo.Id))] [
            text "×"
        ]
    ]

let view model dispatch =
    article [class_ "todo-demo"] [
        header [] [h2 [] [text "Todo List"]]
        section [] [
            div [class_ "input-group"] [
                input [
                    type_ "text"
                    value_ model.Input
                    placeholder "Add a todo..."
                    onInput_ (fun s -> dispatch (InputChanged s))
                ]
                button [onClick_ (fun () -> dispatch AddTodo)] [text "Add"]
            ]
            ul [] (model.Todos |> List.map (viewTodo dispatch))
            p [class_ "hint"] [
                text (
                    sprintf "%d of %d completed"
                        (model.Todos |> List.filter (fun t -> t.Done) |> List.length)
                        (model.Todos |> List.length))
            ]
        ]
    ]

let start () =
    run "todo-root" { Init = init; Update = update; View = view }
