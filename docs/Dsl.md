# DSL Guide — HTML, CSS, and Elmish

## HTML DSL

The HTML DSL provides a declarative way to construct DOM trees in F#.

### Node Types

```fsharp
type Node =
    | El    of tag: string * attrs: Attr list * children: Node list
    | Text  of string
    | Empty
```

### Element Constructors

```fsharp
div [class_ "container"] [
    h1 [] [text "Hello"]
    p [] [text "World"]
    button [onClick_ (fun () -> doSomething ())] [text "Click"]
]
```

All standard HTML elements are available: `div`, `span`, `p`, `h1`–`h6`, `button`, `input`, `form`, `nav`, `header`, `footer`, `article`, `section`, `ul`, `ol`, `li`, `a`, `table`, `canvas`, `img`, etc.

### Attribute Constructors

```fsharp
class_ "my-class"
id_ "my-id"
type_ "text"
placeholder "Enter text..."
value_ "initial"
href "https://example.com"
src "image.png"
onClick_ (fun () -> dispatch Msg)
onInput_ (fun text -> dispatch (TextChanged text))
disabled_ true
```

### Rendering

```fsharp
// Render into a parent element
renderInto parentElement node

// Clear and re-render (Elmish-style)
clearAndRender parentElement [node1; node2]
```

## Computation Expression Builder

F# 10 computation expressions for elegant HTML construction:

```fsharp
open Browser.Html.CeBuilder

let myView model dispatch =
    html {
        article [class_ "card"] [
            header [] [
                h1 [] [text "Dashboard"]
            ]
            section [] [
                div [class_ "grid"] [
                    button [onClick_ (fun () -> dispatch Increment)] [text "+"]
                    span [] [text (string model.Count)]
                ]
            ]
        ]
    }
```

## CSS DSL

### Active Patterns

```fsharp
open Browser.Css

// Pattern match CSS values
match "primary" with
| Class c -> setClass el c
| _ -> ()

match ("color", "red") with
| StyleProp(k, v) -> setStyle el k v
| _ -> ()
```

### Style Builder CE

```fsharp
let myStyles = styles {
    background "#0ea5e9"
    color "white"
    fontSize "1.1rem"
    padding "0.5rem 1rem"
    borderRadius "0.5rem"
}

// Apply to element
applyStyles myElement myStyles
```

## Elmish MVU

### Program Structure

```fsharp
type Model = { Count: int }
type Msg = Increment | Decrement

let init () = { Count = 0 }, Cmd.none

let update msg model =
    match msg with
    | Increment -> { model with Count = model.Count + 1 }, Cmd.none
    | Decrement -> { model with Count = model.Count - 1 }, Cmd.none

let view model dispatch =
    div [] [
        text (string model.Count)
        button [onClick_ (fun () -> dispatch Increment)] [text "+"]
        button [onClick_ (fun () -> dispatch Decrement)] [text "−"]
    ]

let start () =
    run "app" { Init = init; Update = update; View = view }
```

### Commands

```fsharp
Cmd.none                   // No side effects
Cmd.ofMsg Increment        // Dispatch a message
Cmd.batch [cmd1; cmd2]     // Combine commands
```
