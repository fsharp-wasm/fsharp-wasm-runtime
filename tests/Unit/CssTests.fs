module Tests.CssTests

open Browser.Css

/// Test Class active pattern.
let testClassPattern () =
    match "primary" with
    | Class c -> c = "primary"
    | _ -> false

/// Test Class pattern rejects spaces.
let testClassPatternRejectsSpaces () =
    match "class one" with
    | Class _ -> false
    | _ -> true

/// Test StyleProp active pattern.
let testStylePropPattern () =
    match ("color", "red") with
    | StyleProp(k, v) -> k = "color" && v = "red"
    | _ -> false

/// Test StyleProp rejects empty values.
let testStylePropRejectsEmpty () =
    match ("color", "") with
    | StyleProp _ -> false
    | _ -> true

/// Test style builder computation expression.
let testStyleBuilder () =
    let result = styles {
        background "#0ea5e9"
        color "white"
        fontSize "1.1rem"
    }
    List.length result = 3

/// Test individual CSS property helpers.
let testCssHelpers () =
    let bg = background "#fff"
    let c = color "red"
    let fs = fontSize "16px"
    let fw = fontWeight "bold"
    let m = margin "10px"
    let p = padding "5px"
    fst bg = "background" && fst c = "color" && fst fs = "font-size"

/// Run all CSS tests.
let runAll () =
    let results = [
        ("Class pattern", testClassPattern ())
        ("Class rejects spaces", testClassPatternRejectsSpaces ())
        ("StyleProp pattern", testStylePropPattern ())
        ("StyleProp rejects empty", testStylePropRejectsEmpty ())
        ("Style builder", testStyleBuilder ())
        ("CSS helpers", testCssHelpers ())
    ]
    let passed = results |> List.filter snd |> List.length
    let total = List.length results
    sprintf "CssTests: %d/%d passed" passed total
