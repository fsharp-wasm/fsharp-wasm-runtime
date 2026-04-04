module Browser.Gpu

open Browser.Core

[<Import("isGpuAvailable",    "runtime/gpu.js")>] extern bool   jsIsGpuAvailable()
[<Import("requestAdapter",    "runtime/gpu.js")>] extern Handle jsRequestAdapter()
[<Import("requestDevice",     "runtime/gpu.js")>] extern Handle jsRequestDevice(Handle adapterId)
[<Import("configureContext",  "runtime/gpu.js")>] extern Handle jsConfigureContext(Handle canvasId, Handle deviceId, string format)
[<Import("getPreferredFormat","runtime/gpu.js")>] extern string jsGetPreferredFormat()

/// Typed wrappers for WebGPU resources.
type Adapter = private Adapter of Handle
type Device = private Device of Handle
type GpuContext = private GpuCtx of Handle

let isAvailable () = jsIsGpuAvailable ()
let requestAdapter () = Adapter (jsRequestAdapter ())
let requestDevice (Adapter id) = Device (jsRequestDevice id)
let configureContext canvasEl (Device deviceId) format =
    let (Browser.Dom.El canvasHandle) = canvasEl
    GpuCtx (jsConfigureContext canvasHandle deviceId format)
let getPreferredFormat () = jsGetPreferredFormat ()
