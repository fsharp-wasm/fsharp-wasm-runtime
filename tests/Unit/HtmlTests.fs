module Tests.HtmlTests

open Browser.Html.Elements
open Browser.Html.Attrs

/// Test that element constructors produce correct Node structures.
let testDivCreation () =
    let node = div [class_ "test"] [text "Hello"]
    match node with
    | El("div", [Class "test"], [Text "Hello"]) -> true
    | _ -> false

let testNestedElements () =
    let node =
        article [class_ "card"] [
            header [] [h1 [] [text "Title"]]
            section [] [
                p [] [text "Content"]
                button [onClick_ (fun () -> ())] [text "Click"]
            ]
        ]
    match node with
    | El("article", _, children) -> List.length children = 2
    | _ -> false

let testEmptyElement () =
    let node = div [] []
    match node with
    | El("div", [], []) -> true
    | _ -> false

let testTextNode () =
    let node = text "Hello World"
    match node with
    | Text "Hello World" -> true
    | _ -> false

let testImgElement () =
    let node = img [src "test.png"; attr_ "alt" "Test"]
    match node with
    | El("img", attrs, []) -> List.length attrs = 2
    | _ -> false

let testAttributes () =
    let attrs = [
        class_ "main"
        id_ "app"
        type_ "text"
        placeholder "Enter..."
        value_ "hello"
        href "https://example.com"
        disabled_ true
    ]
    List.length attrs = 7

let testAllElementConstructors () =
    let nodes = [
        div [] []; span [] []; p [] []; h1 [] []; h2 [] []; h3 [] []
        h4 [] []; h5 [] []; h6 [] []; button [] []; input [] []
        form [] []; nav [] []; header [] []; main_ [] []; footer [] []
        article [] []; section [] []; aside [] []; ul [] []; ol [] []
        li [] []; a [] []; strong [] []; em [] []; code [] []; pre [] []
        table [] []; thead [] []; tbody [] []; tr [] []; th [] []; td [] []
        label [] []; select [] []; option [] []; details [] []; summary [] []
        dialog [] []; progress [] []; canvas []; img []; br; hr
    ]
    List.length nodes = 42

/// Run all HTML tests and report results.
let runAll () =
    let results = [
        ("div creation", testDivCreation ())
        ("nested elements", testNestedElements ())
        ("empty element", testEmptyElement ())
        ("text node", testTextNode ())
        ("img element", testImgElement ())
        ("attributes", testAttributes ())
        ("all element constructors", testAllElementConstructors ())
    ]
    let passed = results |> List.filter snd |> List.length
    let total = List.length results
    sprintf "HtmlTests: %d/%d passed" passed total
