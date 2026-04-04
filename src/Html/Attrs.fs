module Browser.Html.Attrs

open Browser.Html.Elements

let class_       c     = Class c
let id_          i     = Id i
let style_       p v   = Style(p, v)
let attr_        k v   = Attribute(k, v)
let onClick_     f     = OnClick f
let onInput_     f     = OnInput f
let onChange_    f     = OnChange f
let href         url   = Attribute("href", url)
let src          url   = Attribute("src", url)
let type_        t     = Attribute("type", t)
let placeholder  t     = Attribute("placeholder", t)
let value_       v     = Attribute("value", v)
let name_        n     = Attribute("name", n)
let disabled_    b     = if b then Attribute("disabled", "") else Attribute("data-enabled", "")
let checked_     b     = if b then Attribute("checked", "") else Attribute("data-unchecked", "")
let readonly_    b     = if b then Attribute("readonly", "") else Attribute("data-editable", "")
let hidden_      b     = if b then Attribute("hidden", "") else Attribute("data-visible", "")
let title_       t     = Attribute("title", t)
let tabindex     i     = Attribute("tabindex", string i)
let role         r     = Attribute("role", r)
let ariaLabel    l     = Attribute("aria-label", l)
let dataAttr k v       = Attribute("data-" + k, v)
let target       t     = Attribute("target", t)
let rel          r     = Attribute("rel", r)
let action       a     = Attribute("action", a)
let method_      m     = Attribute("method", m)
let for_         f     = Attribute("for", f)
let width_       w     = Attribute("width", string w)
let height_      h     = Attribute("height", string h)
let min_         m     = Attribute("min", string m)
let max_         m     = Attribute("max", string m)
let step_        s     = Attribute("step", string s)
