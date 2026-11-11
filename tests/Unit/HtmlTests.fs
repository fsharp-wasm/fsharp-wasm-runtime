module Tests.HtmlTests

open Browser.Html
open Browser.Html.Elements

// ─── CE DSL Tests ─────────────────────────────────────────────────────────────

/// Test that CE div produces the correct Node structure.
let testDivCreation () =
    let node = div { class' "test"; text "Hello" }
    match node with
    | El("div", [Attribute("class", "test")], [Text "Hello"]) -> true
    | _ -> false

/// Test nested CE elements.
let testNestedElements () =
    let node =
        article {
            class' "card"
            header { h2 "Title" }
            section {
                p "Content"
                button { onClick (fun () -> ()); "Click" }
            }
        }
    match node with
    | El("article", _, children) -> List.length children = 2
    | _ -> false

/// Test CE with only an attribute (no children — empty child list).
let testEmptyElement () =
    let node = div { class' "container" }
    match node with
    | El("div", [Attribute("class", "container")], []) -> true
    | _ -> false

/// Test text shorthand functions.
let testTextShorthands () =
    let n1 = h1 "Hello"
    let n2 = h2 "World"
    let n3 = p "Paragraph"
    match n1, n2, n3 with
    | El("h1", [], [Text "Hello"]),
      El("h2", [], [Text "World"]),
      El("p",  [], [Text "Paragraph"]) -> true
    | _ -> false

/// Test text node via Elements.text.
let testTextNode () =
    let node = text "Hello World"
    match node with
    | Text "Hello World" -> true
    | _ -> false

/// Test CE img element with attributes.
let testImgElement () =
    let node = img { src "test.png"; attr "alt" "Test" }
    match node with
    | El("img", attrs, []) -> List.length attrs = 2
    | _ -> false

/// Test multiple attribute custom operations.
let testAttributes () =
    let node =
        div {
            class' "main"
            id "app"
            attr "data-x" "1"
        }
    match node with
    | El("div", attrs, []) -> List.length attrs = 3
    | _ -> false

/// Test CE event handler.
let testEventHandler () =
    let node = button { onClick (fun () -> ()); "OK" }
    match node with
    | El("button", attrs, [Text "OK"]) ->
        attrs |> List.exists (function OnClick _ -> true | _ -> false)
    | _ -> false

/// Test CE for loop (list rendering).
let testForLoop () =
    let items = ["a"; "b"; "c"]
    let node = ul { for i in items do li { i } }
    match node with
    | El("ul", [], children) -> List.length children = 3
    | _ -> false

/// Test when' conditional rendering.
let testConditional () =
    let showNode = when' true (h1 "Visible")
    let hideNode = when' false (h1 "Hidden")
    match showNode, hideNode with
    | El("h1", [], [Text "Visible"]), Empty -> true
    | _ -> false

/// Test el generic builder.
let testGenericBuilder () =
    let node = el "h1" { class' "title"; "Hello" }
    match node with
    | El("h1", [Attribute("class", "title")], [Text "Hello"]) -> true
    | _ -> false

/// Run all HTML tests and report results.
let runAll () =
    let results = [
        ("div CE creation",      testDivCreation ())
        ("nested CE elements",   testNestedElements ())
        ("empty CE element",     testEmptyElement ())
        ("text shorthands",      testTextShorthands ())
        ("text node",            testTextNode ())
        ("img CE element",       testImgElement ())
        ("CE attributes",        testAttributes ())
        ("CE event handler",     testEventHandler ())
        ("CE for loop",          testForLoop ())
        ("conditional when'",    testConditional ())
        ("generic el builder",   testGenericBuilder ())
    ]
    let passed = results |> List.filter snd |> List.length
    let total = List.length results
    sprintf "HtmlTests: %d/%d passed" passed total
