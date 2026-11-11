module Tests.ElmishTests

open Browser.Elmish.Core

/// Test Cmd.none produces empty list.
let testCmdNone () =
    let cmd : Cmd<int> = Cmd.none
    List.isEmpty cmd

/// Test Cmd.ofMsg produces single command.
let testCmdOfMsg () =
    let cmd = Cmd.ofMsg 42
    List.length cmd = 1

/// Test Cmd.batch combines commands.
let testCmdBatch () =
    let cmd1 = Cmd.ofMsg 1
    let cmd2 = Cmd.ofMsg 2
    let batched = Cmd.batch [cmd1; cmd2]
    List.length batched = 2

/// Test Program type can be constructed.
let testProgramCreation () =
    let program : Program<int, string> = {
        Init = fun () -> (0, Cmd.none)
        Update = fun msg model -> (model, Cmd.none)
        View = fun model dispatch -> Browser.Html.Elements.Empty
    }
    let model, cmds = program.Init ()
    model = 0 && List.isEmpty cmds

/// Test update function produces new model.
let testUpdateProducesNewModel () =
    let update msg model =
        match msg with
        | "inc" -> model + 1, Cmd.none
        | "dec" -> model - 1, Cmd.none
        | _ -> model, Cmd.none
    let newModel, _ = update "inc" 0
    newModel = 1

/// Run all Elmish tests.
let runAll () =
    let results = [
        ("Cmd.none", testCmdNone ())
        ("Cmd.ofMsg", testCmdOfMsg ())
        ("Cmd.batch", testCmdBatch ())
        ("Program creation", testProgramCreation ())
        ("Update produces new model", testUpdateProducesNewModel ())
    ]
    let passed = results |> List.filter snd |> List.length
    let total = List.length results
    sprintf "ElmishTests: %d/%d passed" passed total
