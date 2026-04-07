/// Browser.Html — The primary public API for building HTML in F#.
///
/// Feliz-style CE DSL: standalone attribute/event functions yield HtmlItem values
/// inside CE blocks; no [<CustomOperation>] members on the builder.
///
/// Usage:
///   open Browser.Html
///
///   let view model dispatch =
///       div {
///           id' "app"
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
/// Uses the Feliz pattern: standalone let-functions produce HtmlItem values
/// that are yielded via Yield(HtmlItem) — no [<CustomOperation>] needed.
///
///   div {
///       class' "card"
///       id' "my-card"
///       h1 "Title"           ← Yield(Node)
///       p  "Body text"       ← Yield(Node)
///       button { onClick f; "Click me" }
///   }
type ElementBuilder(tag: string) =

    member _.Zero() : HtmlItem list = []

    /// Yield a plain text string as a text-node child.
    member _.Yield(s: string) : HtmlItem list = [KidItem (Text s)]

    /// Yield a Node as a child (enables `h1 "text"`, `p "text"`, etc.).
    member _.Yield(n: Node) : HtmlItem list = [KidItem n]

    /// Yield a pre-built HtmlItem (attribute, event, or child) directly.
    /// This allows standalone attribute/event functions to be used in CE blocks:
    ///   button { class' "btn"; onClick (fun () -> f()); "Click" }
    member _.Yield(item: HtmlItem) : HtmlItem list = [item]

    member _.Combine(a: HtmlItem list, b: HtmlItem list) : HtmlItem list = a @ b

    member _.Delay(f: unit -> HtmlItem list) : HtmlItem list = f ()

    member _.For(xs: 'a seq, f: 'a -> HtmlItem list) : HtmlItem list =
        xs |> Seq.toList |> List.collect f

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

// ─── Attribute helpers (return HtmlItem — yield-able in CE blocks) ────────────
// Usage:
//   button { class' "btn"; id' "submit-btn"; onClick (fun () -> f()); "Click" }
//
// These are standalone functions (not CE custom-operations) so they work equally
// with newline syntax AND semicolons, and don't conflict with Browser.Events.onClick.

let class'     (v: string)            : HtmlItem = AttrItem("class", v)
let id'        (v: string)            : HtmlItem = AttrItem("id", v)
let type'      (v: string)            : HtmlItem = AttrItem("type", v)
let placeholder(v: string)            : HtmlItem = AttrItem("placeholder", v)
let value'     (v: string)            : HtmlItem = AttrItem("value", v)
let href       (v: string)            : HtmlItem = AttrItem("href", v)
let src        (v: string)            : HtmlItem = AttrItem("src", v)
let name'      (v: string)            : HtmlItem = AttrItem("name", v)
let target     (v: string)            : HtmlItem = AttrItem("target", v)
let rel        (v: string)            : HtmlItem = AttrItem("rel", v)
let role       (v: string)            : HtmlItem = AttrItem("role", v)
let ariaLabel  (v: string)            : HtmlItem = AttrItem("aria-label", v)
let attr       (k: string) (v: string): HtmlItem = AttrItem(k, v)
let style'     (p: string) (v: string): HtmlItem = AttrItem("style", p + ":" + v)
let width'     (v: int)               : HtmlItem = AttrItem("width", string v)
let height'    (v: int)               : HtmlItem = AttrItem("height", string v)
let tabindex   (v: int)               : HtmlItem = AttrItem("tabindex", string v)
let data'      (k: string) (v: string): HtmlItem = AttrItem("data-" + k, v)
let disabled   (v: bool)              : HtmlItem = if v then AttrItem("disabled", "") else AttrItem("", "")
let checked'   (v: bool)              : HtmlItem = if v then AttrItem("checked", "")  else AttrItem("", "")
let readonly'  (v: bool)              : HtmlItem = if v then AttrItem("readonly", "") else AttrItem("", "")
let hidden     (v: bool)              : HtmlItem = if v then AttrItem("hidden", "")   else AttrItem("", "")

// ─── Event helpers (return HtmlItem — yield-able in CE blocks) ─────────────────
// These shadow Browser.Events.onClick / onInput / onChange inside open Browser.Html,
// so `onClick (fun () -> dispatch Msg)` inside a CE block correctly produces HtmlItem.

let onClick   (f: unit -> unit)   : HtmlItem = EventItem f
let onSubmit  (f: unit -> unit)   : HtmlItem = EventItem f
let onInput   (f: string -> unit) : HtmlItem = InputItem f
let onChange  (f: string -> unit) : HtmlItem = ChangeItem f

// ─── Text shorthand functions ──────────────────────────────────────────────────
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
