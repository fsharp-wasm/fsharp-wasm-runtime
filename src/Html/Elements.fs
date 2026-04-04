module Browser.Html.Elements

open Browser.Dom
open Browser.Events

/// A node in the immediate-mode render tree.
type Node =
    | El    of tag: string * attrs: Attr list * children: Node list
    | Text  of string
    | Empty

and Attr =
    | Class     of string
    | Id        of string
    | Style     of string * string
    | Attribute of string * string
    | OnClick   of (unit -> unit)
    | OnInput   of (string -> unit)
    | OnChange  of (string -> unit)

/// Render a Node tree into a parent Element.
let rec renderInto (parent: Element) (node: Node) : Element =
    match node with
    | Empty -> Element.nil

    | Text t ->
        let el = Element.text t
        append parent el
        el

    | El(tag, attrs, children) ->
        let el = Element.create tag
        attrs |> List.iter (applyAttr el)
        children |> List.iter (fun child -> renderInto el child |> ignore)
        append parent el
        el

and applyAttr (el: Element) (attr: Attr) =
    match attr with
    | Class c        -> setClass el c
    | Id i           -> setAttr el "id" i
    | Style(p, v)    -> setStyle el p v
    | Attribute(k, v) -> setAttr el k v
    | OnClick f      -> onClick el f
    | OnInput f      -> onInput el f
    | OnChange f     -> onChange el f

/// Clear a parent element and re-render children.
let clearAndRender (parent: Element) (nodes: Node list) =
    clear parent
    nodes |> List.iter (fun n -> renderInto parent n |> ignore)

// ─── HTML element constructors ─────────────────────────────────────────────────

let inline el tag attrs children = El(tag, attrs, children)
let div      = el "div"
let span     = el "span"
let p        = el "p"
let h1       = el "h1"
let h2       = el "h2"
let h3       = el "h3"
let h4       = el "h4"
let h5       = el "h5"
let h6       = el "h6"
let button   = el "button"
let input    = el "input"
let textarea = el "textarea"
let form     = el "form"
let nav      = el "nav"
let header   = el "header"
let main_    = el "main"
let footer   = el "footer"
let article  = el "article"
let section  = el "section"
let aside    = el "aside"
let ul       = el "ul"
let ol       = el "ol"
let li       = el "li"
let a        = el "a"
let strong   = el "strong"
let em       = el "em"
let code     = el "code"
let pre      = el "pre"
let table    = el "table"
let thead    = el "thead"
let tbody    = el "tbody"
let tr       = el "tr"
let th       = el "th"
let td       = el "td"
let label    = el "label"
let select   = el "select"
let option   = el "option"
let details  = el "details"
let summary  = el "summary"
let dialog   = el "dialog"
let progress = el "progress"
let canvas attrs = El("canvas", attrs, [])
let img attrs = El("img", attrs, [])
let br = El("br", [], [])
let hr = El("hr", [], [])
let text s = Text s
let empty = Empty
