module Browser.Components

open Browser.Core
open Browser.Dom

[<Import("defineComponent", "runtime/components.js")>] extern unit jsDefineComponent(string name, (Handle -> unit) factory)

/// Register a native Web Component defined in F#.
let define (name: string) (render: Element -> unit) =
    jsDefineComponent name (fun handle -> render (Element.ofHandle handle))
