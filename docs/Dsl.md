# DSL Guide — HTML, CSS, and Elmish

## HTML DSL

The HTML DSL uses F# computation expressions for a clean, hierarchical syntax.
Open `Browser.Html` to get all element builders and helper functions.

### Basic Usage

```fsharp
open Browser.Html

let view model dispatch =
    div {
        id "app"
        class' "container"

        h1 "Hello from F# + WasmGC"
        p  "Running entirely in WebAssembly."

        div {
            class' "button-group"
            button { onClick (fun () -> dispatch Increment); "+" }
            button { onClick (fun () -> dispatch Decrement); "−" }
        }
    }
```

### Attribute Custom Operations

Attributes are set directly inside the CE block using custom operations:

```fsharp
div {
    id "my-div"
    class' "card"
    type' "text"
    placeholder "Enter text..."
    value' model.Input
    href "https://example.com"
    src "image.png"
    disabled model.IsLoading
    checked' model.IsSelected
    attr "data-id" "42"    // generic attribute
}
```

### Event Handlers

```fsharp
button {
    class' "primary"
    onClick (fun () -> dispatch Save)
    "Save"
}

input {
    type' "text"
    value' model.Text
    onInput (fun s -> dispatch (TextChanged s))
    onChange (fun s -> dispatch (Committed s))
}

form {
    onSubmit (fun () -> dispatch Submit)
    // ...fields...
}
```

### Text Shorthand Functions

Headings and paragraphs have shorthand forms that can be yielded inline:

```fsharp
div {
    h1 "Page Title"          // El("h1", [], [Text "..."])
    h2 "Section"
    h3 "Sub-section"
    p  "A paragraph of text."
    strong "Bold text"
    em "Italic text"
    code "inline code"
}
```

### Nested Elements

```fsharp
article {
    class' "card"
    header { h2 "Card Title" }
    section {
        p "Card body content."
        ul {
            li { "Item one" }
            li { "Item two" }
        }
    }
    footer { p "Card footer" }
}
```

### List Rendering with `for`

```fsharp
ul {
    for todo in model.Todos do
        li {
            class' (if todo.Done then "done" else "")
            span {
                onClick (fun () -> dispatch (Toggle todo.Id))
                if todo.Done then "☑ " else "☐ "
                todo.Text
            }
        }
}
```

### Conditional Rendering

```fsharp
div {
    // when' returns Empty when false (renders nothing)
    when' model.IsLoggedIn (p "Welcome back!")

    // Inline if/else also works
    if model.Count > 0 then p (sprintf "Count: %d" model.Count)
    else p "No items."
}
```

### Generic Builder for Edge Cases

Use `el "tagname"` for any element, including headings with attributes:

```fsharp
// h1 with a class (h1 is a function, not a builder)
el "h1" { class' "display-title"; "Hello World" }

// Custom element
el "my-widget" { attr "config" "value"; "Content" }
```

### Void / Self-closing Elements

```fsharp
div {
    br          // line break
    hr          // horizontal rule
    img { src "photo.png"; attr "alt" "Photo" }
    input { type' "checkbox"; checked' model.IsChecked }
}
```

## CSS DSL

### Active Patterns

```fsharp
open Browser.Css

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

applyStyles myElement myStyles
```

### CSS Property Helpers

```fsharp
background "#fff"    color "red"        fontSize "16px"
fontWeight "bold"    margin "10px"      padding "5px"
border "1px solid"   borderRadius "8px"  display "flex"
width "100%"         height "auto"       textAlign "center"
cursor "pointer"     opacity "0.8"       transition "all 0.2s"
```

## Elmish MVU

### Program Structure

```fsharp
open Browser.Html
open Browser.Elmish.Core

type Model = { Count: int }
type Msg = Increment | Decrement

let init () = { Count = 0 }, Cmd.none

let update msg model =
    match msg with
    | Increment -> { model with Count = model.Count + 1 }, Cmd.none
    | Decrement -> { model with Count = model.Count - 1 }, Cmd.none

let view model dispatch =
    div {
        el "p" { class' "count"; string model.Count }
        button { onClick (fun () -> dispatch Increment); "+" }
        button { onClick (fun () -> dispatch Decrement); "−" }
    }

let start () =
    run "app" { Init = init; Update = update; View = view }
```

### Commands

```fsharp
Cmd.none                   // No side effects
Cmd.ofMsg Increment        // Dispatch a message
Cmd.batch [cmd1; cmd2]     // Combine commands
```
