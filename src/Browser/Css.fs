module Browser.Css

/// Active patterns for CSS property validation.
let (|Class|_|) (s: string) =
    if System.String.IsNullOrWhiteSpace s || s.Contains(" ") then None else Some s

let (|StyleProp|_|) (k: string, v: string) =
    if System.String.IsNullOrEmpty k || System.String.IsNullOrEmpty v then None
    else Some (k, v)

/// CSS property key-value pair.
type CssProp = string * string

/// Style builder computation expression for inline styles.
type StyleBuilder() =
    member _.Zero() : CssProp list = []
    member _.Yield(prop: CssProp) : CssProp list = [prop]
    member _.Combine(a: CssProp list, b: CssProp list) : CssProp list = a @ b
    member _.Delay(f: unit -> CssProp list) : CssProp list = f ()

let styles = StyleBuilder()

// Common CSS property helpers
let background v : CssProp = ("background", v)
let color v : CssProp = ("color", v)
let fontSize v : CssProp = ("font-size", v)
let fontWeight v : CssProp = ("font-weight", v)
let margin v : CssProp = ("margin", v)
let padding v : CssProp = ("padding", v)
let border v : CssProp = ("border", v)
let borderRadius v : CssProp = ("border-radius", v)
let display v : CssProp = ("display", v)
let width v : CssProp = ("width", v)
let height v : CssProp = ("height", v)
let textAlign v : CssProp = ("text-align", v)
let cursor v : CssProp = ("cursor", v)
let opacity v : CssProp = ("opacity", v)
let transition v : CssProp = ("transition", v)

/// Apply a list of CSS properties to a DOM element.
let applyStyles (el: Browser.Dom.Element) (props: CssProp list) =
    props |> List.iter (fun (k, v) -> Browser.Dom.setStyle el k v)
