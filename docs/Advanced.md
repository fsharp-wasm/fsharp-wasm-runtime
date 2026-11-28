# Advanced Topics

## Quotations for Meta-Programming

F# quotations enable compile-time and runtime inspection of code:

```fsharp
open Browser.Quotations

let description = describe <@ fun x -> x + 1 @>
// "Lambda: x -> ..."
```

This enables future AI-driven UI generation where quoted F# fragments can be analyzed, transformed, or compiled to DOM nodes.

## Web Workers + PubSub Actor Pattern

Combine Workers and PubSub for a mini actor system:

```fsharp
open Browser.Workers
open Browser.PubSub

// Create a worker
let worker = Workers.create "worker.js"

// Worker receives messages and publishes results
Workers.onMessage worker (fun result ->
    PubSub.publish "results" result)

// Subscribe to results
PubSub.subscribe "results" (fun msg ->
    // Update UI with result
    ())

// Send work to worker
Workers.postMessage worker "compute something"
```

## WebGPU Integration

`Browser.Gpu` drives WebGPU directly: the device, WGSL shaders, buffers, render and compute pipelines. A canvas that a pass
draws into needs `configureContext`; every asynchronous step ends in a callback.

```fsharp
open Browser.Gpu

let shader = """
@vertex fn vs(@builtin(vertex_index) i: u32) -> @builtin(position) vec4f {
    let p = array(vec2f(0.0, 0.7), vec2f(-0.7, -0.6), vec2f(0.7, -0.6));
    return vec4f(p[i], 0.0, 1.0);
}
@fragment fn fs() -> @location(0) vec4f { return vec4f(1.0, 0.5, 0.0, 1.0); }
"""

requestDevice
    (fun device ->
        let format = getPreferredFormat ()
        let context = configureContext (Element.ofId "scene") device format
        let pipeline = createRenderPipeline device (renderDesc (createShader device shader) format)
        submit device (fun enc ->
            renderPass enc context (0.0, 0.0, 0.0, 1.0) (fun pass ->
                Render.setPipeline pass pipeline
                Render.draw pass 3 1)))
    (fun why -> printfn "%s" why)
```

Buffers, uniforms, vertex layouts, compute and readback are in [webgpu-direct.md](webgpu-direct.md).

## IndexedDB Persistence

Store and retrieve data that persists across page reloads. Every operation is asynchronous: it takes the callback
that continues the program (in an Elmish program, a callback that dispatches a message — see `demos/indexeddb-crud`).

```fsharp
open Browser.IndexedDb

// as commands of an Elmish program
let init () = model, [ fun dispatch -> openDb "myapp" 1 (fun db -> dispatch (Opened db)) ]

let update msg model =
    match msg with
    | Opened db -> { model with Db = Some db }, [ fun dispatch -> put db "user" "Alice" (fun () -> dispatch Saved) ]
    | Saved -> model, [ fun dispatch -> get model.Db.Value "user" (fun v -> dispatch (Loaded v)) ]   // v = "Alice"
    | Loaded v -> { model with User = v }, Cmd.none
```

## Custom Web Components

Define native HTML custom elements from F#:

```fsharp
open Browser.Components
open Browser.Dom
open Browser.Events

define "my-widget" (fun root ->
    let title = Element.create "h3"
    setText title "My Widget"
    append root title

    let btn = Element.create "button"
    setText btn "Click me"
    onClick btn (fun () -> setText title "Clicked!")
    append root btn)
```

Usage in HTML:
```html
<my-widget></my-widget>
```

## CSS Active Patterns

Use F#'s active patterns for elegant CSS handling:

```fsharp
let applyAttr el = function
    | Class c when (match c with Class _ -> true | _ -> false) ->
        setClass el c
    | _ -> ()
```

## Timing and Animation

```fsharp
open Browser.Timing

// One-shot timer
let id = setTimeout 1000 (fun () -> printfn "Done!")
clearTimeout id

// Recurring timer
let intervalId = setInterval 16 (fun () -> render ())
clearInterval intervalId

// Animation frame
let frameId = requestAnimationFrame (fun () -> animate ())
cancelAnimationFrame frameId
```
