/// Browser.Html — The primary public API for building HTML in F#.
///
/// Usage:
///   open Browser.Html
///
///   let view model dispatch =
///       div {
///           id "app"
///           class' "container"
///
///           h1 "Hello from F# + WasmGC"
///           p  "Running entirely in WebAssembly."
///
///           div {
///               class' "button-group"
///               button { onClick (fun () -> dispatch Increment); "+" }
///               button { onClick (fun () -> dispatch Decrement); "−" }
///           }
///       }
module Browser.Html

open Browser.Html.Elements

// ─── Internal CE accumulator ──────────────────────────────────────────────────

/// State item used while building an element inside a CE block.
type HtmlItem =
    | AttrItem   of string * string
    | EventItem  of (unit -> unit)
    | InputItem  of (string -> unit)
    | ChangeItem of (string -> unit)
    | KidItem    of Node

// ─── Element CE builder ───────────────────────────────────────────────────────

/// Computation expression builder for a single HTML element.
/// Attributes are set via custom operations; text and child nodes are yielded.
///
///   div {
///       class' "card"
///       id "my-card"
///       h1 "Title"           ← implicitly yielded (h1 : string -> Node)
///       p  "Body text"       ← implicitly yielded
///       button { onClick f; "Click me" }
///   }
type ElementBuilder(tag: string) =

    member _.Zero() : HtmlItem list = []

    /// Yield a plain text string as a text-node child.
    member _.Yield(s: string) : HtmlItem list = [KidItem (Text s)]

    /// Yield a Node as a child (enables `h1 "text"`, `p "text"`, etc.).
    member _.Yield(n: Node) : HtmlItem list = [KidItem n]

    member _.Combine(a: HtmlItem list, b: HtmlItem list) : HtmlItem list = a @ b

    member _.Delay(f: unit -> HtmlItem list) : HtmlItem list = f ()

    member _.For(xs: 'a seq, f: 'a -> HtmlItem list) : HtmlItem list =
        xs |> Seq.toList |> List.collect f

    // ─── Attribute custom operations ──────────────────────────────────────────

    [<CustomOperation("id")>]
    member _.Id(state, v: string) = AttrItem("id", v) :: state

    [<CustomOperation("class'")>]
    member _.Class'(state, v: string) = AttrItem("class", v) :: state

    [<CustomOperation("type'")>]
    member _.Type'(state, v: string) = AttrItem("type", v) :: state

    [<CustomOperation("placeholder")>]
    member _.Placeholder(state, v: string) = AttrItem("placeholder", v) :: state

    [<CustomOperation("value'")>]
    member _.Value'(state, v: string) = AttrItem("value", v) :: state

    [<CustomOperation("href")>]
    member _.Href(state, v: string) = AttrItem("href", v) :: state

    [<CustomOperation("src")>]
    member _.Src(state, v: string) = AttrItem("src", v) :: state

    [<CustomOperation("name'")>]
    member _.Name'(state, v: string) = AttrItem("name", v) :: state

    [<CustomOperation("target")>]
    member _.Target(state, v: string) = AttrItem("target", v) :: state

    [<CustomOperation("rel")>]
    member _.Rel(state, v: string) = AttrItem("rel", v) :: state

    [<CustomOperation("attr")>]
    member _.Attr(state, k: string, v: string) = AttrItem(k, v) :: state

    [<CustomOperation("style'")>]
    member _.Style'(state, prop: string, value: string) = AttrItem("style", prop + ":" + value) :: state

    [<CustomOperation("disabled")>]
    member _.Disabled(state, v: bool) =
        if v then AttrItem("disabled", "") :: state else state

    [<CustomOperation("checked'")>]
    member _.Checked'(state, v: bool) =
        if v then AttrItem("checked", "") :: state else state

    [<CustomOperation("readonly'")>]
    member _.Readonly'(state, v: bool) =
        if v then AttrItem("readonly", "") :: state else state

    [<CustomOperation("hidden")>]
    member _.Hidden(state, v: bool) =
        if v then AttrItem("hidden", "") :: state else state

    [<CustomOperation("width'")>]
    member _.Width'(state, v: int) = AttrItem("width", string v) :: state

    [<CustomOperation("height'")>]
    member _.Height'(state, v: int) = AttrItem("height", string v) :: state

    [<CustomOperation("tabindex")>]
    member _.Tabindex(state, v: int) = AttrItem("tabindex", string v) :: state

    [<CustomOperation("role")>]
    member _.Role(state, v: string) = AttrItem("role", v) :: state

    [<CustomOperation("ariaLabel")>]
    member _.AriaLabel(state, v: string) = AttrItem("aria-label", v) :: state

    [<CustomOperation("data'")>]
    member _.Data'(state, k: string, v: string) = AttrItem("data-" + k, v) :: state

    // ─── Event custom operations ──────────────────────────────────────────────

    [<CustomOperation("onClick")>]
    member _.OnClick(state, f: unit -> unit) = EventItem f :: state

    [<CustomOperation("onInput")>]
    member _.OnInput(state, f: string -> unit) = InputItem f :: state

    [<CustomOperation("onChange")>]
    member _.OnChange(state, f: string -> unit) = ChangeItem f :: state

    [<CustomOperation("onSubmit")>]
    member _.OnSubmit(state, f: unit -> unit) = EventItem f :: state

    // ─── Run: convert accumulated items → Node ────────────────────────────────

    /// Build the final Node from the accumulated CE state.
    /// Custom operations on attributes and events come first (prepended),
    /// children follow — both are extracted via List.choose.
    member _.Run(items: HtmlItem list) : Node =
        let attrs =
            items |> List.choose (function
                | AttrItem(k, v) -> Some (Attribute(k, v))
                | EventItem f    -> Some (OnClick f)
                | InputItem f    -> Some (OnInput f)
                | ChangeItem f   -> Some (OnChange f)
                | _              -> None)
        let children =
            items |> List.choose (function KidItem n -> Some n | _ -> None)
        El(tag, attrs, children)

// ─── Block / structural element CE builders ───────────────────────────────────

let html       = ElementBuilder "html"
let head       = ElementBuilder "head"
let body       = ElementBuilder "body"
let div        = ElementBuilder "div"
let nav        = ElementBuilder "nav"
let header     = ElementBuilder "header"
let main'      = ElementBuilder "main"
let footer     = ElementBuilder "footer"
let article    = ElementBuilder "article"
let section    = ElementBuilder "section"
let aside      = ElementBuilder "aside"
let ul         = ElementBuilder "ul"
let ol         = ElementBuilder "ol"
let li         = ElementBuilder "li"
let form       = ElementBuilder "form"
let fieldset   = ElementBuilder "fieldset"
let table      = ElementBuilder "table"
let thead      = ElementBuilder "thead"
let tbody      = ElementBuilder "tbody"
let tr         = ElementBuilder "tr"
let td         = ElementBuilder "td"
let th         = ElementBuilder "th"
let details    = ElementBuilder "details"
let summary'   = ElementBuilder "summary"
let dialog     = ElementBuilder "dialog"
let figure     = ElementBuilder "figure"
let figcaption = ElementBuilder "figcaption"
let blockquote = ElementBuilder "blockquote"
let pre        = ElementBuilder "pre"
let canvas     = ElementBuilder "canvas"
let a          = ElementBuilder "a"
let span       = ElementBuilder "span"
let label      = ElementBuilder "label"
let button     = ElementBuilder "button"
let input      = ElementBuilder "input"
let textarea   = ElementBuilder "textarea"
let select     = ElementBuilder "select"
let option     = ElementBuilder "option"
let progress   = ElementBuilder "progress"
let img        = ElementBuilder "img"

// ─── Text shorthand functions ──────────────────────────────────────────────────
// These return Node directly. Inside a CE block they are implicitly yielded
// via Yield(Node), enabling the `h1 "Hello"` / `p "text"` syntax without braces.

let h1 (s: string) : Node = El("h1", [], [Text s])
let h2 (s: string) : Node = El("h2", [], [Text s])
let h3 (s: string) : Node = El("h3", [], [Text s])
let h4 (s: string) : Node = El("h4", [], [Text s])
let h5 (s: string) : Node = El("h5", [], [Text s])
let h6 (s: string) : Node = El("h6", [], [Text s])

/// Paragraph with plain text — `p "Some text"` inside a CE block.
/// For paragraphs with attributes, use `el "p" { class' "lead"; "Text" }`.
let p (s: string) : Node = El("p", [], [Text s])

/// Inline text elements — `strong "bold"`, `em "italic"`, `code "snippet"`.
let strong (s: string) : Node = El("strong", [], [Text s])
let em     (s: string) : Node = El("em",     [], [Text s])
let code   (s: string) : Node = El("code",   [], [Text s])

// ─── Void / self-closing elements ─────────────────────────────────────────────

let br : Node = El("br", [], [])
let hr : Node = El("hr", [], [])

// ─── Generic element builder ──────────────────────────────────────────────────
// For any element not listed above, or when heading elements need attributes:
//   el "h1" { class' "display-title"; "Hello World" }

let el (tag: string) = ElementBuilder tag

// ─── Utility helpers ──────────────────────────────────────────────────────────

/// Conditional rendering: returns the node when cond is true, Empty otherwise.
let when' (cond: bool) (node: Node) : Node = if cond then node else Empty

/// Map a list to nodes (for use outside a CE block).
let eachOf (items: 'a list) (f: 'a -> Node) : Node list = List.map f items
