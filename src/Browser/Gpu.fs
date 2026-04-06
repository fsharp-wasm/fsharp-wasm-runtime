module Browser.Gpu

open Fable.Core
open Browser.Core

[<Import("isGpuAvailable",   "runtime/gpu.js")>]
let jsIsGpuAvailable () : bool = nativeOnly
[<Import("requestAdapter",   "runtime/gpu.js")>]
let jsRequestAdapter () : Handle = nativeOnly
[<Import("requestDevice",    "runtime/gpu.js")>]
let jsRequestDevice (adapterId: Handle) : Handle = nativeOnly
[<Import("configureContext", "runtime/gpu.js")>]
let jsConfigureContext (canvasId: Handle) (deviceId: Handle) (fmt: string) : Handle = nativeOnly
[<Import("getPreferredFormat","runtime/gpu.js")>]
let jsGetPreferredFormat () : string = nativeOnly

/// Typed wrappers for WebGPU resources.
type Adapter = private Adapter of Handle
type Device = private Device of Handle
type GpuContext = private GpuCtx of Handle

let isAvailable () = jsIsGpuAvailable ()
let requestAdapter () = Adapter (jsRequestAdapter ())
let requestDevice (Adapter id) = Device (jsRequestDevice id)
let configureContext (canvasEl: Browser.Dom.Element) (Device deviceId) format =
    GpuCtx (jsConfigureContext canvasEl.Handle deviceId format)
let getPreferredFormat () = jsGetPreferredFormat ()
