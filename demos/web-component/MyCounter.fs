module Demos.MyCounter

open Browser.Dom
open Browser.Events
open Browser.Components

let register () =
    define "fs-counter" (fun root ->
        let mutable count = 0

        let countEl = Element.create "span"
        setText countEl (string count)

        let decBtn = Element.create "button"
        setText decBtn "−"

        let incBtn = Element.create "button"
        setText incBtn "+"

        let container = Element.create "div"
        setClass container "button-group"

        append container decBtn
        append container countEl
        append container incBtn
        append root container

        onClick decBtn (fun () ->
            count <- count - 1
            setText countEl (string count))

        onClick incBtn (fun () ->
            count <- count + 1
            setText countEl (string count))
    )
