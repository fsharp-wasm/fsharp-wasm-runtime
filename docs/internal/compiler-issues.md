# Compiler Issues — fsharp-wasm WasmGC Backend

This document tracks issues found in the fsharp-wasm compiler backend while building
the runtime library. Each entry describes the root cause, the runtime workaround
(if any), and the required compiler fix.

---

## FIXED — BUG-01: `collectFreeVars` missing `NewList` case

**File:** `src/Runtime/WasmGcFreeVars.fs`
**Status:** Fixed in commit after Sprint 30 (NewList case added)
**Severity:** Critical — all closures that reference a variable only inside an F# list literal silently drop the capture, generating invalid Wasm.

### Root Cause

`collectFreeVars` computes captured (free) variables for closure lifting.  
It handled `NewArray`, `NewRecord`, `NewUnion`, etc. but was **missing `NewList`**.

F# list literals `[expr]` compile to `Fable.ValueKind.NewList(Some(head, tail), elemType)`.  
Without a handler, the match fell through to `| _ -> Set.empty`, returning **no free
variables** from inside the list. Any variable referenced exclusively inside a list
literal was silently excluded from the closure's capture set.

### Example

```fsharp
let render (model: 'Model) (dispatch: Dispatch<'Msg>) =
    clearAndRender container [view model dispatch]   // ← [view ...] is a NewList!
```

`view` appeared only inside the `[...]` list literal. `collectFreeVars` returned `{}`,
so `view` was never added to the closure's struct fields. The generated WAT then
emitted `local.get $view` with no corresponding local declaration → emitter crash:

```
Emitter: unknown local 'view' (available: $clo_apply_tmp, $self, $self_cast, container, dispatch, model)
```

This caused **every demo** to fail at browser instantiation with a `CompileError`.

### Fix

```fsharp
// In WasmGcFreeVars.fs, inside the Value(kind) match:
| Fable.ValueKind.NewList(Some(headExpr, tailExpr), _) ->
    Set.union (collectFreeVars bound headExpr) (collectFreeVars bound tailExpr)
| Fable.ValueKind.NewList(None, _) -> Set.empty
```

### Impact on Runtime

The `Browser.Elmish` MVU loop and any F# code passing list literals to functions
from inside a closure depends on this fix. Without it, patterns like:

```fsharp
let f x = g [computedValue x]  // computedValue captured; x bound — must capture!
```

...silently drop the capture.

---

## OPEN — BUG-02: Duplicate Wasm export names across modules

**File:** `src/Emit/WasmGcEmit.fs` (export generation) / `src/Transforms/Fable2WasmGc.fs`
**Status:** Workaround in runtime; compiler fix needed
**Severity:** High — produces invalid Wasm binary (duplicate export names)

### Root Cause

All top-level F# functions are exported with their SHORT F# name by default.
Example: `Browser.Html.CeBuilder.onClick`, `Browser.Html.Events.onClick`, and
`Browser.Dom.body` all export as `"onClick"` / `"body"`, colliding in the single flat
Wasm export namespace.

The browser rejects the module at instantiation:
```
WebAssembly.instantiateStreaming(): Duplicate export name 'src' for function 394
```

Duplicate names found in the runtime:

| F# name | Modules |
|---------|---------|
| `onClick` | `Html.CeBuilder`, `Html.Events` |
| `onInput` | `Html.CeBuilder`, `Html.Events` |
| `onChange` | `Html.CeBuilder`, `Html.Events` |
| `href`     | `Html.CeBuilder`, `Html.Attrs` |
| `src`      | `Html.CeBuilder`, `Html.Attrs` |
| `placeholder` | `Html.CeBuilder`, `Html.Attrs` |
| `body`     | `Html.CeBuilder`, `Browser.Dom` |
| `onSubmit` | `Html.CeBuilder` (×2 in list) |
| `get` / `delete` | `Browser.IndexedDb`, `Browser.Cookies` |

### Runtime Workaround

`[<CompiledName("qualifiedName")>]` attributes on the conflicting functions in:
- `src/Html/CeBuilder.fs` — `htmlBody`, `htmlHref`, `htmlSrc`, `htmlPlaceholder`, `htmlOnClick`, `htmlOnSubmit`, `htmlOnInput`, `htmlOnChange`
- `src/Html/Attrs.fs` — `htmlAttrHref`, `htmlAttrSrc`, `htmlAttrPlaceholder`
- `src/Html/Events.fs` — `htmlEventsOnClick`, `htmlEventsOnInput`, `htmlEventsOnChange`
- `src/Browser/IndexedDb.fs` — `indexedDbGet`, `indexedDbDelete`

### Required Compiler Fix

**Option A (preferred):** Export functions with module-qualified names by default.
Export as `Browser_Html_CeBuilder_onClick` (using the existing internal naming
scheme the compiler already uses for internal call targets). Functions annotated
with `[<CompiledName("name")>]` keep using the explicit short name.

**Option B:** Detect duplicate export names at compile time and emit an error,
forcing the author to use `[<CompiledName>]` to disambiguate. Less disruptive.

**Option C:** Only export functions that are annotated `[<Export>]` or are entry
points. This matches WebAssembly component model expectations for libraries.

Option A is cleanest for the demo/glue use case. Option C scales better when building
reusable library wasm modules.

**Relevant code:** `src/Emit/WasmGcEmit.fs`, export list construction (~line 955);
`src/Transforms/Fable2WasmGc.fs`, `transformMemberDecl` sets `Exported = true`.

---

## OPEN — BUG-03: `let mutable` closure capture requires ref-cell support

**File:** `src/Transforms/Fable2WasmGc.fs`
**Status:** Open — no runtime workaround needed yet (RuntimeState record used)
**Severity:** Medium

### Root Cause

Fable compiles `let mutable x = v` captured by a closure into a `Fable.Core.ref`
cell (a boxed reference). The WasmGC backend needs to handle the `ref` DeclaredType
and generate correct struct.get/struct.set for `x.contents`. If this path is
incomplete, any Elmish-style loop using `let mutable model` will fail.

### Current Avoidance

`Browser.Elmish.Core` uses a `RuntimeState<'Model,'Msg>` record with `mutable` fields
instead of `let mutable` locals. Mutable record fields are struct fields — they use
`struct.set` which the backend handles. This avoids `let mutable` capture entirely.

### Required Compiler Fix

Ensure `Fable.Core.FSharpRef<T>` is mapped to a mutable WasmGC struct `{ mutable contents: T }`,
and that `IdentExpr` lookup for mutable-captured locals emits `struct.get` rather than
`local.get`. Fable represents captured mutables as `Get(refExpr, ByKey "contents")` and
`Set(refExpr, ByKey "contents", value)`.

---

## OPEN — BUG-04: `collectFreeVars` catch-all may hide other missing cases

**File:** `src/Runtime/WasmGcFreeVars.fs`  
**Status:** Open — audit recommended
**Severity:** Low-Medium

### Description

The `| _ -> Set.empty` catch-all in `collectFreeVars` silently returns no free
variables for any unhandled Fable expression kind. BUG-01 (`NewList`) was in this
category. Other `ValueKind` and `Expr` variants may also be missing.

### Recommended Fix

1. Make the catch-all emit a compile-time/runtime warning when hit in debug builds.
2. Audit all `Fable.ValueKind` and `Fable.Expr` variants and ensure each has an
   explicit case (even if `Set.empty` is correct for some of them).
3. Consider adding `Fable.Expr.Extended` and any new AST nodes from recent Fable
   versions.

Missing cases suspected:
- `Fable.ValueKind.NewStringTemplate` — string interpolation
- `Fable.Expr.Emit` — raw JS/Wasm emit expressions
- `Fable.Expr.ObjectExpr` — object expressions (interface implementations)

---

## OPEN — BUG-05: No detection of duplicate Wasm exports at compile time

**File:** `src/Emit/WasmGcEmit.fs`
**Status:** Open
**Severity:** Medium

### Description

When two top-level functions have the same export name, the compiler silently produces
a binary that browsers reject. The error only appears at runtime, not at compile time.

### Required Fix

Before emitting the exports section, check for duplicate names:

```fsharp
let duplicates =
    wmod.Exports
    |> List.groupBy (fun e -> e.ExportName)
    |> List.filter (fun (_, es) -> es.Length > 1)
if not duplicates.IsEmpty then
    let names = duplicates |> List.map fst |> String.concat ", "
    failwith $"Duplicate Wasm export names: {names}. Use [<CompiledName(\"...\")>] to disambiguate."
```

---

*Last updated: 2026-04-10 — runtime team (fsharp-wasm-runtime)*
