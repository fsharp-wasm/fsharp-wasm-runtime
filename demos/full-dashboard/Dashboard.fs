module Demos.Dashboard

open Browser.Elmish.Core
open Browser.Html
open Browser.Storage
open Browser.PubSub

type Tab = Counter | Todo | Canvas | PubSub | Storage

type Model = {
    ActiveTab: Tab
    Counter: int
    TodoInput: string
    Todos: (int * string * bool) list
    NextTodoId: int
    Messages: string list
    MessageInput: string
    StorageKey: string
    StorageValue: string
    StorageResult: string
    Clock: string
}

type Msg =
    | SwitchTab of Tab
    | CounterIncrement
    | CounterDecrement
    | CounterReset
    | TodoInputChanged of string
    | AddTodo
    | ToggleTodo of int
    | RemoveTodo of int
    | PubSubInputChanged of string
    | SendPubSubMessage
    | PubSubReceived of string
    | StorageKeyChanged of string
    | StorageValueChanged of string
    | SaveToStorage
    | LoadFromStorage
    | ClockTick of string

let init () =
    { ActiveTab = Counter
      Counter = 0
      TodoInput = ""
      Todos = []
      NextTodoId = 1
      Messages = []
      MessageInput = ""
      StorageKey = ""
      StorageValue = ""
      StorageResult = ""
      Clock = "" }, Cmd.none

let update msg model =
    match msg with
    | SwitchTab tab -> { model with ActiveTab = tab }, Cmd.none
    | CounterIncrement -> { model with Counter = model.Counter + 1 }, Cmd.none
    | CounterDecrement -> { model with Counter = model.Counter - 1 }, Cmd.none
    | CounterReset -> { model with Counter = 0 }, Cmd.none
    | TodoInputChanged s -> { model with TodoInput = s }, Cmd.none
    | AddTodo when model.TodoInput.Trim() <> "" ->
        { model with
            Todos = model.Todos @ [(model.NextTodoId, model.TodoInput.Trim(), false)]
            TodoInput = ""
            NextTodoId = model.NextTodoId + 1 }, Cmd.none
    | AddTodo -> model, Cmd.none
    | ToggleTodo id ->
        let todos = model.Todos |> List.map (fun (i, t, d) -> if i = id then (i, t, not d) else (i, t, d))
        { model with Todos = todos }, Cmd.none
    | RemoveTodo id ->
        { model with Todos = model.Todos |> List.filter (fun (i, _, _) -> i <> id) }, Cmd.none
    | PubSubInputChanged s -> { model with MessageInput = s }, Cmd.none
    | SendPubSubMessage when model.MessageInput.Trim() <> "" ->
        publish "dashboard" model.MessageInput
        { model with MessageInput = "" }, Cmd.none
    | SendPubSubMessage -> model, Cmd.none
    | PubSubReceived s -> { model with Messages = model.Messages @ [s] }, Cmd.none
    | StorageKeyChanged s -> { model with StorageKey = s }, Cmd.none
    | StorageValueChanged s -> { model with StorageValue = s }, Cmd.none
    | SaveToStorage ->
        if model.StorageKey <> "" then Local.set model.StorageKey model.StorageValue
        { model with StorageResult = sprintf "Saved: %s = %s" model.StorageKey model.StorageValue }, Cmd.none
    | LoadFromStorage ->
        if model.StorageKey <> "" then
            let v = Local.get model.StorageKey
            { model with StorageResult = sprintf "Loaded: %s = %s" model.StorageKey (if v = null then "(not found)" else v) }, Cmd.none
        else model, Cmd.none
    | ClockTick s -> { model with Clock = s }, Cmd.none

let tabBtn activeTab tab label dispatch =
    button {
        class' (if activeTab = tab then "primary" else "secondary")
        onClick (fun () -> dispatch (SwitchTab tab))
        label
    }

let counterView model dispatch =
    div {
        el "p" { class' "count-display"; string model.Counter }
        div {
            class' "button-group"
            button { onClick (fun () -> dispatch CounterDecrement); "−" }
            button { onClick (fun () -> dispatch CounterReset);     "Reset" }
            button { onClick (fun () -> dispatch CounterIncrement); "+" }
        }
    }

let todoView model dispatch =
    div {
        div {
            class' "input-group"
            input { type' "text"; value' model.TodoInput; placeholder "New todo..."; onInput (fun s -> dispatch (TodoInputChanged s)) }
            button { onClick (fun () -> dispatch AddTodo); "Add" }
        }
        ul {
            for (id, txt, done') in model.Todos do
                li {
                    class' (if done' then "done" else "")
                    span {
                        onClick (fun () -> dispatch (ToggleTodo id))
                        if done' then "☑ " else "☐ "
                        txt
                    }
                    button { class' "secondary"; onClick (fun () -> dispatch (RemoveTodo id)); "×" }
                }
        }
    }

let pubsubView model dispatch =
    div {
        div {
            class' "input-group"
            input { type' "text"; value' model.MessageInput; placeholder "Message..."; onInput (fun s -> dispatch (PubSubInputChanged s)) }
            button { onClick (fun () -> dispatch SendPubSubMessage); "Send" }
        }
        ul {
            for m in model.Messages do
                li { m }
        }
    }

let storageView model dispatch =
    div {
        div {
            class' "input-group"
            input { type' "text"; placeholder "Key";   value' model.StorageKey;   onInput (fun s -> dispatch (StorageKeyChanged s)) }
            input { type' "text"; placeholder "Value"; value' model.StorageValue; onInput (fun s -> dispatch (StorageValueChanged s)) }
        }
        div {
            class' "button-group"
            button { onClick (fun () -> dispatch SaveToStorage);  "Save" }
            button { onClick (fun () -> dispatch LoadFromStorage); "Load" }
        }
        p model.StorageResult
    }

let view model dispatch =
    article {
        class' "dashboard"
        header {
            h2 "Full Dashboard"
            p model.Clock
        }
        nav {
            class' "button-group"
            tabBtn model.ActiveTab Counter "Counter" dispatch
            tabBtn model.ActiveTab Todo    "Todo"    dispatch
            tabBtn model.ActiveTab Canvas  "Canvas"  dispatch
            tabBtn model.ActiveTab PubSub  "Pub/Sub" dispatch
            tabBtn model.ActiveTab Storage "Storage" dispatch
        }
        section {
            match model.ActiveTab with
            | Counter -> counterView model dispatch
            | Todo    -> todoView model dispatch
            | Canvas  -> p "Canvas rendering available in the Mandelbrot demo above."
            | PubSub  -> pubsubView model dispatch
            | Storage -> storageView model dispatch
        }
    }

let start () =
    run "dashboard-root" { Init = init; Update = update; View = view }

type Tab = Counter | Todo | Canvas | PubSub | Storage

type Model = {
    ActiveTab: Tab
    Counter: int
    TodoInput: string
    Todos: (int * string * bool) list
    NextTodoId: int
    Messages: string list
    MessageInput: string
    StorageKey: string
    StorageValue: string
    StorageResult: string
    Clock: string
}

type Msg =
    | SwitchTab of Tab
    | CounterIncrement
    | CounterDecrement
    | CounterReset
    | TodoInputChanged of string
    | AddTodo
    | ToggleTodo of int
    | RemoveTodo of int
    | PubSubInputChanged of string
    | SendPubSubMessage
    | PubSubReceived of string
    | StorageKeyChanged of string
    | StorageValueChanged of string
    | SaveToStorage
    | LoadFromStorage
    | ClockTick of string

let init () =
    { ActiveTab = Counter
      Counter = 0
      TodoInput = ""
      Todos = []
      NextTodoId = 1
      Messages = []
      MessageInput = ""
      StorageKey = ""
      StorageValue = ""
      StorageResult = ""
      Clock = "" }, Cmd.none

let update msg model =
    match msg with
    | SwitchTab tab -> { model with ActiveTab = tab }, Cmd.none
    | CounterIncrement -> { model with Counter = model.Counter + 1 }, Cmd.none
    | CounterDecrement -> { model with Counter = model.Counter - 1 }, Cmd.none
    | CounterReset -> { model with Counter = 0 }, Cmd.none
    | TodoInputChanged s -> { model with TodoInput = s }, Cmd.none
    | AddTodo when model.TodoInput.Trim() <> "" ->
        { model with
            Todos = model.Todos @ [(model.NextTodoId, model.TodoInput.Trim(), false)]
            TodoInput = ""
            NextTodoId = model.NextTodoId + 1 }, Cmd.none
    | AddTodo -> model, Cmd.none
    | ToggleTodo id ->
        let todos = model.Todos |> List.map (fun (i, t, d) -> if i = id then (i, t, not d) else (i, t, d))
        { model with Todos = todos }, Cmd.none
    | RemoveTodo id ->
        { model with Todos = model.Todos |> List.filter (fun (i, _, _) -> i <> id) }, Cmd.none
    | PubSubInputChanged s -> { model with MessageInput = s }, Cmd.none
    | SendPubSubMessage when model.MessageInput.Trim() <> "" ->
        publish "dashboard" model.MessageInput
        { model with MessageInput = "" }, Cmd.none
    | SendPubSubMessage -> model, Cmd.none
    | PubSubReceived s -> { model with Messages = model.Messages @ [s] }, Cmd.none
    | StorageKeyChanged s -> { model with StorageKey = s }, Cmd.none
    | StorageValueChanged s -> { model with StorageValue = s }, Cmd.none
    | SaveToStorage ->
        if model.StorageKey <> "" then
            Local.set model.StorageKey model.StorageValue
        { model with StorageResult = sprintf "Saved: %s = %s" model.StorageKey model.StorageValue }, Cmd.none
    | LoadFromStorage ->
        if model.StorageKey <> "" then
            let v = Local.get model.StorageKey
            { model with StorageResult = sprintf "Loaded: %s = %s" model.StorageKey (if v = null then "(not found)" else v) }, Cmd.none
        else model, Cmd.none
    | ClockTick s -> { model with Clock = s }, Cmd.none

let tabButton activeTab tab label dispatch =
    button [
        class_ (if activeTab = tab then "primary" else "secondary")
        onClick_ (fun () -> dispatch (SwitchTab tab))
    ] [text label]

let counterView model dispatch =
    div [] [
        p [class_ "count-display"] [text (string model.Counter)]
        div [class_ "button-group"] [
            button [onClick_ (fun () -> dispatch CounterDecrement)] [text "−"]
            button [onClick_ (fun () -> dispatch CounterReset)] [text "Reset"]
            button [onClick_ (fun () -> dispatch CounterIncrement)] [text "+"]
        ]
    ]

let todoView model dispatch =
    div [] [
        div [class_ "input-group"] [
            input [type_ "text"; value_ model.TodoInput; placeholder "New todo..."; onInput_ (fun s -> dispatch (TodoInputChanged s))]
            button [onClick_ (fun () -> dispatch AddTodo)] [text "Add"]
        ]
        ul [] (model.Todos |> List.map (fun (id, txt, done') ->
            li [class_ (if done' then "done" else "")] [
                span [onClick_ (fun () -> dispatch (ToggleTodo id))] [
                    text (if done' then "☑ " else "☐ ")
                    text txt
                ]
                button [class_ "secondary"; onClick_ (fun () -> dispatch (RemoveTodo id))] [text "×"]
            ]))
    ]

let pubsubView model dispatch =
    div [] [
        div [class_ "input-group"] [
            input [type_ "text"; value_ model.MessageInput; placeholder "Message..."; onInput_ (fun s -> dispatch (PubSubInputChanged s))]
            button [onClick_ (fun () -> dispatch SendPubSubMessage)] [text "Send"]
        ]
        ul [] (model.Messages |> List.map (fun m -> li [] [text m]))
    ]

let storageView model dispatch =
    div [] [
        div [class_ "input-group"] [
            input [type_ "text"; placeholder "Key"; value_ model.StorageKey; onInput_ (fun s -> dispatch (StorageKeyChanged s))]
            input [type_ "text"; placeholder "Value"; value_ model.StorageValue; onInput_ (fun s -> dispatch (StorageValueChanged s))]
        ]
        div [class_ "button-group"] [
            button [onClick_ (fun () -> dispatch SaveToStorage)] [text "Save"]
            button [onClick_ (fun () -> dispatch LoadFromStorage)] [text "Load"]
        ]
        p [] [text model.StorageResult]
    ]

let view model dispatch =
    article [class_ "dashboard"] [
        header [] [
            h2 [] [text "Full Dashboard"]
            p [] [text model.Clock]
        ]
        nav [class_ "button-group"] [
            tabButton model.ActiveTab Counter "Counter" dispatch
            tabButton model.ActiveTab Todo "Todo" dispatch
            tabButton model.ActiveTab Canvas "Canvas" dispatch
            tabButton model.ActiveTab PubSub "Pub/Sub" dispatch
            tabButton model.ActiveTab Storage "Storage" dispatch
        ]
        section [] [
            match model.ActiveTab with
            | Counter -> counterView model dispatch
            | Todo -> todoView model dispatch
            | Canvas -> p [] [text "Canvas rendering available in the Mandelbrot demo above."]
            | PubSub -> pubsubView model dispatch
            | Storage -> storageView model dispatch
        ]
    ]

let start () =
    run "dashboard-root" { Init = init; Update = update; View = view }
