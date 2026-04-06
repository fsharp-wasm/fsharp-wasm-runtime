module Browser.Components

open Fable.Core
open Browser.Core
open Browser.Dom

[<Import("defineComponent", "runtime/components.js")>]
let jsDefineComponent (name: string) (factory: Handle -> unit) : unit = nativeOnly

/// Register a native Web Component defined in F#.
let define (name: string) (render: Element -> unit) =
    jsDefineComponent name (fun handle -> render (Element.ofHandle handle))
