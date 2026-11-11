/// Browser.Quotations — placeholder module.
/// F# Quotations (FSharp.Quotations) are not supported by the Fable WasmGC backend.
/// This module is reserved for future meta-programming support once the backend matures.
module Browser.Quotations

/// Not yet implemented — Quotations are unsupported under WasmGC.
let describe (_expr: string) : string = "Quotations not supported in WasmGC"

/// Not yet implemented — Quotations are unsupported under WasmGC.
let compileToNode (_expr: string) : string = "Quotations not supported in WasmGC"
