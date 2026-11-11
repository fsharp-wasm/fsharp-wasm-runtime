/// Attribute helpers for the list-based DSL (kept for compatibility).
/// Prefer using the CE DSL via `open Browser.Html` and custom operations
/// such as `class'`, `id`, `onClick`, etc.
module Browser.Html.Attrs

open Browser.Html.Elements

let class_      c   = Class c
let id_         i   = Id i
let style_      p v = Style(p, v)
let attr_       k v = Attribute(k, v)
let onClick_    f   = OnClick f
let onInput_    f   = OnInput f
let onChange_   f   = OnChange f
[<CompiledName("htmlAttrHref")>]
let href        url = Attribute("href", url)
[<CompiledName("htmlAttrSrc")>]
let src         url = Attribute("src", url)
let type_       t   = Attribute("type", t)
[<CompiledName("htmlAttrPlaceholder")>]
let placeholder t   = Attribute("placeholder", t)
let value_      v   = Attribute("value", v)
let disabled_   b   = if b then Attribute("disabled", "") else Attribute("data-enabled", "")
let checked_    b   = if b then Attribute("checked", "") else Attribute("data-unchecked", "")
