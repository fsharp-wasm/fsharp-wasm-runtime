/// Browser.Elmish — the Model–View–Update loop and the HTML tree it renders.
///
/// `view` returns a `Html<'msg>`; the runtime serialises it to HTML, gives every event handler a numeric id
/// (`data-ev="3"`) and ships the string to the host, which morphs the DOM.  A DOM event comes back as `dispatch(id)`;
/// the handler produces a message, `update` produces the next model, `view` is called again.
module Browser.Elmish

open Browser.Core
open Browser.Timing

type Attr<'msg> =
    | Attr of string * string
    | OnClick of 'msg
    | OnInput of (string -> 'msg)
    /// a click with the pointer position inside the element (canvas drawing: pixels from the top left)
    | OnPointer of (int -> int -> 'msg)

type Html<'msg> =
    | Text of string
    | El of string * Attr<'msg> list * Html<'msg> list

/// An application.  `Tick`: every `ms` milliseconds the message is dispatched.  `Effect` runs after every render
/// (drawing on a canvas, focusing an element, …).
type Program<'model, 'msg> =
    { Init: 'model
      Update: 'msg -> 'model -> 'model
      View: 'model -> Html<'msg>
      TickMs: int
      TickMsg: 'msg
      Effect: 'model -> unit }

let private escape (s: string) : string =
    s.Replace("&", "&amp;").Replace("<", "&lt;").Replace(">", "&gt;").Replace("\"", "&quot;")

/// The handler of the last render, by id: (event text) → next model, installed by `run`.
let mutable private handlerSlot : int -> string -> unit = fun _ _ -> ()

/// Host → wasm: a DOM event with the given handler id (the event's text, if any, is in the inbox).
let dispatch (id: int) : unit = handlerSlot id (inboxText ())

let private renderAttr (handlers: ResizeArray<string -> 'msg>) (sb: System.Text.StringBuilder) (a: Attr<'msg>) : unit =
    let register (kind: string) (h: string -> 'msg) =
        handlers.Add h
        sb.Append(" data-ev=\"").Append(string (handlers.Count - 1)).Append("\" data-on=\"").Append(kind).Append("\"") |> ignore
    match a with
    | Attr(k, v) -> sb.Append(" ").Append(k).Append("=\"").Append(escape v).Append("\"") |> ignore
    | OnClick msg -> register "click" (fun _ -> msg)
    | OnInput f -> register "input" f
    | OnPointer f ->
        register "click" (fun xy ->
            let parts = xy.Split(',')
            f (int parts.[0]) (int parts.[1]))

let rec private renderTo (handlers: ResizeArray<string -> 'msg>) (sb: System.Text.StringBuilder) (html: Html<'msg>) : unit =
    match html with
    | Text s -> sb.Append(escape s) |> ignore
    | El(tag, attrs, children) ->
        sb.Append("<").Append(tag) |> ignore
        List.iter (renderAttr handlers sb) attrs
        sb.Append(">") |> ignore
        List.iter (renderTo handlers sb) children
        sb.Append("</").Append(tag).Append(">") |> ignore

/// Start an application in the host's mount point.
let run (p: Program<'model, 'msg>) : unit =
    let model = ref p.Init
    let rec render () =
        let handlers = ResizeArray<string -> 'msg>()
        let sb = System.Text.StringBuilder()
        renderTo handlers sb (p.View model.Value)
        send 0 (sb.ToString())
        p.Effect model.Value
        handlerSlot <-
            fun id text ->
                model.Value <- p.Update (handlers.[id] text) model.Value
                render ()
    render ()
    if p.TickMs > 0 then
        every p.TickMs (fun () ->
            model.Value <- p.Update p.TickMsg model.Value
            render ())
        |> ignore

/// A program without timer and effect.
let simple (init: 'model) (update: 'msg -> 'model -> 'model) (view: 'model -> Html<'msg>) (noMsg: 'msg) : Program<'model, 'msg> =
    { Init = init; Update = update; View = view; TickMs = 0; TickMsg = noMsg; Effect = fun _ -> () }
