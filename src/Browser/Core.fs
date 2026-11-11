module Browser.Core

/// Opaque handle to a JS object in the runtime object store.
type Handle = int

/// The invalid/null handle.
let nil : Handle = 0

/// document.body — always available as handle 1.
let body : Handle = 1
