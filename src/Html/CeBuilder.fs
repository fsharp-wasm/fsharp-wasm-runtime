module Browser.Html.CeBuilder

open Browser.Html.Elements

/// Computation expression builder for HTML nodes.
/// Leverages F# 10 tail-call support and typed bindings for elegant DSL.
type HtmlBuilder() =
    member _.Zero() = Empty
    member _.Yield(node: Node) = node
    member _.Yield(text: string) = Text text

    member _.Delay(f: unit -> Node) = f ()

    member _.Combine(a: Node, b: Node) =
        match a, b with
        | Empty, x -> x
        | x, Empty -> x
        | El(t, at, ch), other -> El(t, at, ch @ [other])
        | _ -> El("div", [], [a; b])

    member _.For(sequence: 'a seq, body: 'a -> Node) =
        let nodes = sequence |> Seq.map body |> Seq.toList
        match nodes with
        | [] -> Empty
        | [single] -> single
        | multiple -> El("div", [], multiple)

/// The html computation expression builder instance.
let html = HtmlBuilder()
