// @fsharp-wasm/runtime — unified entry point
// Re-exports boot and all runtime modules.

export { boot } from "./runtime/boot.js";

// Individual module exports for tree-shaking
export * as core       from "./runtime/core.js";
export * as dom        from "./runtime/dom.js";
export * as canvas     from "./runtime/canvas.js";
export * as net        from "./runtime/net.js";
export * as storage    from "./runtime/storage.js";
export * as indexeddb  from "./runtime/indexeddb.js";
export * as workers    from "./runtime/workers.js";
export * as pubsub     from "./runtime/pubsub.js";
export * as timing     from "./runtime/timing.js";
export * as gpu        from "./runtime/gpu.js";
export * as components from "./runtime/components.js";
export * as clipboard  from "./runtime/clipboard.js";
export * as cookies    from "./runtime/cookies.js";
export * as location_  from "./runtime/location.js";
export * as pointer    from "./runtime/pointer.js";
export * as events     from "./runtime/events.js";
