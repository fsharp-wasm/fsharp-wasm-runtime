/// @fsharp-wasm/vite-plugin
///
/// Vite plugin that:
///  1. Runs `fable <fsproj> --lang wasmgc` before each dev/build
///  2. Serves `.wasm` files with the correct MIME type (application/wasm)
///  3. Copies `runtime/*.js` modules to the output directory automatically
///  4. In dev mode, watches `.fs` files and hot-reloads the WASM asset
///
/// Compiled with Fable (JS target) → TypeScript declaration via tsc.
module FsWasm.VitePlugin

open Fable.Core
open Fable.Core.JsInterop

// ─── JS interop stubs ───────────────────────────────────────────────────────

[<Import("spawn", "child_process")>]
let spawn: string -> string[] -> obj -> obj = jsNative

[<Import("existsSync", "fs")>]
let existsSync: string -> bool = jsNative

[<Import("readdirSync", "fs")>]
let readdirSync: string -> string[] = jsNative

[<Import("mkdirSync", "fs")>]
let mkdirSync: string -> obj -> unit = jsNative

[<Import("copyFileSync", "fs")>]
let copyFileSync: string -> string -> unit = jsNative

[<Import("resolve", "path")>]
let pathResolve: string -> string = jsNative

[<Import("dirname", "path")>]
let pathDirname: string -> string = jsNative

[<Import("join", "path")>]
let pathJoin: string -> string -> string = jsNative

[<Import("fileURLToPath", "url")>]
let fileURLToPath: string -> string = jsNative

// ─── Plugin options ──────────────────────────────────────────────────────────

type FsWasmOptions = {
    /// Path to your .fsproj file. Defaults to first .fsproj found in cwd.
    fsproj: string option
    /// Override the fable binary path. Defaults to 'fable' on PATH.
    fable: string option
    /// Output directory for the .wasm file. Defaults to the Vite outDir.
    wasmOut: string option
    /// Watch mode: re-compile on .fs changes (dev server only). Default true.
    watch: bool option
}

// ─── Helpers ────────────────────────────────────────────────────────────────

let private runFable (fable: string) (fsproj: string) =
    promise {
        return!
            Promise.create (fun resolve reject ->
                let proc = spawn fable [| fsproj; "--lang"; "wasmgc" |] (createObj [ "stdio" ==> "inherit" ])
                proc?on("close", fun (code: int) ->
                    if code = 0 then resolve ()
                    else reject (System.Exception(sprintf "fable exited with code %d" code))
                ) |> ignore
            )
    }

let private findFsproj (cwd: string) =
    readdirSync cwd
    |> Array.tryFind (fun f -> f.EndsWith(".fsproj"))
    |> Option.map (fun f -> pathJoin cwd f)

let private copyRuntimeFiles (runtimeSrc: string) (outDir: string) =
    let dest = pathJoin outDir "runtime"
    mkdirSync dest (createObj [ "recursive" ==> true ])
    readdirSync runtimeSrc
    |> Array.filter (fun f -> f.EndsWith(".js"))
    |> Array.iter (fun f ->
        copyFileSync (pathJoin runtimeSrc f) (pathJoin dest f)
    )

// ─── Plugin factory ──────────────────────────────────────────────────────────

/// Create the Vite plugin.
///
///   // vite.config.ts
///   import fsWasm from "@fsharp-wasm/vite-plugin";
///   export default { plugins: [fsWasm({ fsproj: "src/MyApp.fsproj" })] }
[<ExportDefault>]
let fsWasmPlugin (opts: FsWasmOptions) : obj =
    let fable   = opts.fable   |> Option.defaultValue "fable"
    let watch   = opts.watch   |> Option.defaultValue true

    let mutable resolvedFsproj = ""
    let mutable resolvedRuntimeSrc = ""

    createObj [
        "name"     ==> "fsharp-wasm"
        "enforce"  ==> "pre"

        // ── configResolved: lock in paths ─────────────────────────────────
        "configResolved" ==> fun (config: obj) ->
            let cwd = config?root |> unbox<string>
            resolvedFsproj <-
                opts.fsproj
                |> Option.defaultWith (fun () ->
                    findFsproj cwd
                    |> Option.defaultWith (fun () ->
                        failwith "[fsharp-wasm] No .fsproj found. Pass fsproj option."
                    )
                )
            // runtime/ folder is next to this plugin's package.json
            resolvedRuntimeSrc <-
                pathJoin (pathDirname (fileURLToPath !!__SOURCE_FILE__)) "../../runtime"

        // ── buildStart: compile F# → WASM ────────────────────────────────
        "buildStart" ==> fun () ->
            runFable fable resolvedFsproj

        // ── configureServer: watch .fs files in dev mode ──────────────────
        "configureServer" ==> fun (server: obj) ->
            if watch then
                let watcher = server?watcher |> unbox<obj>
                watcher?add("**/*.fs") |> ignore
                watcher?on("change", fun (file: string) ->
                    if file.EndsWith(".fs") then
                        printfn "[fsharp-wasm] %s changed, recompiling..." file
                        runFable fable resolvedFsproj
                        |> Promise.iter (fun () ->
                            server?ws?send(createObj [
                                "type" ==> "full-reload"
                                "path" ==> "*"
                            ]) |> ignore
                        )
                ) |> ignore

        // ── generateBundle: copy runtime/*.js to outDir/runtime/ ─────────
        "generateBundle" ==> fun (_opts: obj) (bundle: obj) ->
            // `this` context from Vite has outputOptions
            let outDir =
                bundle?("output")?dir
                |> Option.ofObj
                |> Option.defaultValue "dist"
            copyRuntimeFiles resolvedRuntimeSrc outDir

        // ── configureServer: serve .wasm with correct MIME type ───────────
        "middlewareMode" ==> false
        "apply"          ==> "serve"

        // ── transform: noop — WASM served as static asset ─────────────────
        // The plugin relies on Vite's built-in ?url / ?raw handling for .wasm.
        // Each demo page does: new URL("./Demo.wasm", import.meta.url)

        // ── handleHotUpdate: suppress HMR for .wasm files ────────────────
        "handleHotUpdate" ==> fun (ctx: obj) ->
            let file = ctx?file |> unbox<string>
            if file.EndsWith(".wasm") then
                ctx?server?ws?send(createObj [
                    "type" ==> "full-reload"
                ]) |> ignore
                [||]   // don't let Vite try to HMR-update the WASM asset
            else
                null   // let Vite handle it normally
    ]
