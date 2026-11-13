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
    | Class c         -> setClass el c
    | Id i            -> setAttr el "id" i
    | Style(p, v)     -> setStyle el p v
    | Attribute(k, v) -> setAttr el k v
    | OnClick f       -> onClick el f
    | OnInput f       -> onInput el f
    | OnChange f      -> onChange el f

/// Make the children of `parent` show `nodes`.  The view is built off-document and merged into what is on the page:
/// elements that stay are updated in place, so a focused input keeps focus, caret and selection through every render,
/// and scroll positions and CSS transitions survive.  (Children match by `data-key` when they have one, else by
/// position and tag.)
let render (parent: Element) (nodes: Node list) =
    let scratch = Element.create "div"
    nodes |> List.iter (fun n -> renderInto scratch n |> ignore)
    morphChildren parent scratch

/// Clear a parent element and render children from scratch (nothing of what was there is kept).
let clearAndRender (parent: Element) (nodes: Node list) =
    clear parent
    nodes |> List.iter (fun n -> renderInto parent n |> ignore)

/// Raw text node.
let text (s: string) = Text s

/// Empty placeholder node.
let empty = Empty
