module Browser.Html.Events

open Browser.Html.Elements

[<CompiledName("htmlEventsOnClick")>]
let onClick     f = OnClick f
[<CompiledName("htmlEventsOnInput")>]
let onInput     f = OnInput f
[<CompiledName("htmlEventsOnChange")>]
let onChange     f = OnChange f
