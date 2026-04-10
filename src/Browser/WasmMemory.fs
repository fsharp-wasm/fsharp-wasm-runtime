/// Browser.WasmMemory — zero-copy linear memory access for WasmGC modules.
///
/// Usage: declare imports with the `wasm:memory` sentinel path.
/// The compiler lowers these to native WASM load/store instructions —
/// no JS import is emitted.  The module automatically gets a `(memory 1)`
/// section and exports `"memory"`, so JS can access the buffer zero-copy via
/// `instance.exports.memory.buffer`.
///
/// Alignment rules (same as plain WASM):
///   storeI32 / loadI32  — byteOffset must be 4-byte aligned
///   storeI64 / loadI64  — byteOffset must be 8-byte aligned
///   storeF32 / loadF32  — byteOffset must be 4-byte aligned
///   storeF64 / loadF64  — byteOffset must be 8-byte aligned
///   storeByte / loadByte — any byte offset is fine
module Browser.WasmMemory

open Fable.Core

// ── Stores ────────────────────────────────────────────────────────────────────

/// Write a byte (low 8 bits of `value`) to linear memory at `byteOffset`.
[<Import("i32.store8", "wasm:memory")>]
let storeByte (byteOffset: int) (value: int) : unit = nativeOnly

/// Write an int32 to linear memory at `byteOffset` (must be 4-byte aligned).
[<Import("i32.store", "wasm:memory")>]
let storeI32 (byteOffset: int) (value: int) : unit = nativeOnly

/// Write an int64 to linear memory at `byteOffset` (must be 8-byte aligned).
[<Import("i64.store", "wasm:memory")>]
let storeI64 (byteOffset: int) (value: int64) : unit = nativeOnly

/// Write a float32 to linear memory at `byteOffset` (must be 4-byte aligned).
[<Import("f32.store", "wasm:memory")>]
let storeF32 (byteOffset: int) (value: float32) : unit = nativeOnly

/// Write a float64 to linear memory at `byteOffset` (must be 8-byte aligned).
[<Import("f64.store", "wasm:memory")>]
let storeF64 (byteOffset: int) (value: float) : unit = nativeOnly

// ── Loads ─────────────────────────────────────────────────────────────────────

/// Read a byte (zero-extended to int32) from linear memory at `byteOffset`.
[<Import("i32.load8_u", "wasm:memory")>]
let loadByte (byteOffset: int) : int = nativeOnly

/// Read an int32 from linear memory at `byteOffset` (must be 4-byte aligned).
[<Import("i32.load", "wasm:memory")>]
let loadI32 (byteOffset: int) : int = nativeOnly

/// Read an int64 from linear memory at `byteOffset` (must be 8-byte aligned).
[<Import("i64.load", "wasm:memory")>]
let loadI64 (byteOffset: int) : int64 = nativeOnly

/// Read a float32 from linear memory at `byteOffset` (must be 4-byte aligned).
[<Import("f32.load", "wasm:memory")>]
let loadF32 (byteOffset: int) : float32 = nativeOnly

/// Read a float64 from linear memory at `byteOffset` (must be 8-byte aligned).
[<Import("f64.load", "wasm:memory")>]
let loadF64 (byteOffset: int) : float = nativeOnly

// ── Memory management ─────────────────────────────────────────────────────────

/// Returns the current size of linear memory in 64KB pages.
[<Import("memory.size", "wasm:memory")>]
let memoryPages () : int = nativeOnly

/// Grow linear memory by `pages` × 64KB pages.
/// Returns the old size in pages, or -1 if the grow failed.
[<Import("memory.grow", "wasm:memory")>]
let memoryGrow (pages: int) : int = nativeOnly
