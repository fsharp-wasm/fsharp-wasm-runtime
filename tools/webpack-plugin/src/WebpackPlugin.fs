/// @fsharp-wasm/webpack-plugin
///
/// Webpack plugin that:
///  1. Runs `fable <fsproj> --lang wasmgc` in a beforeRun hook
///  2. Emits `runtime/*.js` files as webpack assets
///  3. In watch mode, invalidates compilation when .fs files change
///
/// Compiled with Fable (JS target) → TypeScript declaration via tsc.
module FsWasm.WebpackPlugin

open Fable.Core
open Fable.Core.JsInterop

// ─── JS interop stubs ───────────────────────────────────────────────────────

[<Import("spawn", "child_process")>]
let spawn: string -> string[] -> obj -> obj = jsNative

[<Import("readdirSync", "fs")>]
let readdirSync: string -> string[] = jsNative

[<Import("readFileSync", "fs")>]
let readFileSync: string -> Buffer = jsNative

[<Import("join", "path")>]
let pathJoin: string -> string -> string = jsNative

[<Import("dirname", "path")>]
let pathDirname: string -> string = jsNative

[<Import("fileURLToPath", "url")>]
let fileURLToPath: string -> string = jsNative

// ─── Plugin options ──────────────────────────────────────────────────────────

type FsWasmWebpackOptions = {
    /// Path to your .fsproj file.
    fsproj: string
    /// Override fable binary. Defaults to 'fable' on PATH.
    fable: string option
}

// ─── Helpers ────────────────────────────────────────────────────────────────

let private runFable (fable: string) (fsproj: string) =
    Promise.create (fun resolve reject ->
        let proc = spawn fable [| fsproj; "--lang"; "wasmgc" |] (createObj [ "stdio" ==> "inherit" ])
        proc?on("close", fun (code: int) ->
            if code = 0 then resolve ()
            else reject (System.Exception(sprintf "fable exited with code %d" code))
        ) |> ignore
    )

// ─── Plugin class ────────────────────────────────────────────────────────────

/// Webpack plugin for F# WasmGC projects.
///
///   // webpack.config.js (CJS)
///   const { FsWasmPlugin } = require("@fsharp-wasm/webpack-plugin");
///   module.exports = {
///     plugins: [new FsWasmPlugin({ fsproj: "src/MyApp.fsproj" })]
///   };
[<Export("FsWasmPlugin")>]
type FsWasmPlugin(opts: FsWasmWebpackOptions) =

    let fable = opts.fable |> Option.defaultValue "fable"

    let runtimeSrc =
        pathJoin (pathDirname (fileURLToPath !!__SOURCE_FILE__)) "../../runtime"

    member _.apply(compiler: obj) =
        let pluginName = "FsWasmPlugin"

        // 1. Compile F# before webpack starts processing
        compiler?hooks?beforeRun?tapPromise(
            pluginName,
            fun () -> runFable fable opts.fsproj
        ) |> ignore

        // 2. In watch mode, also compile on watchRun
        compiler?hooks?watchRun?tapPromise(
            pluginName,
            fun () -> runFable fable opts.fsproj
        ) |> ignore

        // 3. Emit runtime/*.js as webpack assets
        compiler?hooks?emit?tapAsync(
            pluginName,
            fun (compilation: obj) (callback: unit -> unit) ->
                readdirSync runtimeSrc
                |> Array.filter (fun f -> f.EndsWith(".js"))
                |> Array.iter (fun f ->
                    let src  = pathJoin runtimeSrc f
                    let dest = pathJoin "runtime" f
                    let buf  = readFileSync src
                    compilation?assets?(dest) <- createObj [
                        "source"    ==> fun () -> buf
                        "size"      ==> fun () -> buf?length
                    ]
                )
                callback ()
        ) |> ignore

        // 4. Watch .fs files in the fsproj directory
        compiler?hooks?afterEnvironment?tap(
            pluginName,
            fun () ->
                let fsprojDir = pathDirname opts.fsproj
                compiler?watchFileSystem?watch(
                    [| pathJoin fsprojDir "**/*.fs" |],
                    [||], 300,
                    fun () -> compiler?watching?invalidate() |> ignore
                ) |> ignore
        ) |> ignore
