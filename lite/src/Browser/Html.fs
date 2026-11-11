/// Browser.Html — element constructors.  `div [ class' "card" ] [ h1 [] [ text "Hi" ] ]`
module Browser.Html

open Browser.Elmish

let text (s: string) : Html<'msg> = Text s
let el (tag: string) (attrs: Attr<'msg> list) (children: Html<'msg> list) : Html<'msg> = El(tag, attrs, children)

let div attrs children = el "div" attrs children
let span attrs children = el "span" attrs children
let h1 attrs children = el "h1" attrs children
let h2 attrs children = el "h2" attrs children
let h3 attrs children = el "h3" attrs children
let p attrs children = el "p" attrs children
let small attrs children = el "small" attrs children
let button attrs children = el "button" attrs children
let ul attrs children = el "ul" attrs children
let li attrs children = el "li" attrs children
let label attrs children = el "label" attrs children
let article attrs children = el "article" attrs children
let canvas attrs = el "canvas" attrs []
let input attrs = el "input" attrs []

let class' (name: string) : Attr<'msg> = Attr("class", name)
let attr (name: string) (value: string) : Attr<'msg> = Attr(name, value)
let value' (v: string) : Attr<'msg> = Attr("value", v)
let placeholder (v: string) : Attr<'msg> = Attr("placeholder", v)
let onClick (msg: 'msg) : Attr<'msg> = OnClick msg
let onInput (f: string -> 'msg) : Attr<'msg> = OnInput f
let onPointer (f: int -> int -> 'msg) : Attr<'msg> = OnPointer f
