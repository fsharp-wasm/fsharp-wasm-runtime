// gpu.js — WebGPU for F# programs, directly: adapter and device, shaders, buffers, pipelines, passes, readback.
//
// A module cannot wait for a promise, so everything asynchronous (adapter, device, readback, error scopes) ends in a callback.
// What lives for a while (device, shader, buffer, pipeline, bind group) is a handle in the store of core.js and is released by
// `release` / `destroyBuffer`; what lives for one frame (an encoder, a pass) is released by the call that ends it, so a frame
// loop does not leak handles.
//
// Structured arguments cross as text, like the other glue modules (a vertex layout, bind group entries, a list of numbers);
// bulk data can bypass the text through the module's own linear memory (`writeFromMemory`, `readToMemory`, Browser.WasmMemory).
import { save, get, drop, memoryBuffer } from "./core.js";

export const isGpuAvailable = () => !!navigator.gpu;
export const getPreferredFormat = () => (navigator.gpu ? navigator.gpu.getPreferredCanvasFormat() : "");

// ── adapter, device, canvas ──────────────────────────────────────────────────────────────────────────────────────────

const lostWatchers = new WeakSet();

/** `cb` gets the adapter's handle, 0 when there is none (no WebGPU, or the browser has no suitable adapter). */
export const requestAdapter = (cb) => {
    if (!navigator.gpu) return cb(0);
    navigator.gpu.requestAdapter().then((a) => cb(a ? save(a) : 0), () => cb(0));
};

/** `cb` gets the device's handle, 0 when it could not be had. A validation error nobody asked for goes to the console. */
export const requestDevice = (adapterId, cb) => {
    const adapter = get(adapterId);
    if (!adapter) return cb(0);
    adapter.requestDevice().then((d) => {
        d.addEventListener("uncapturederror", (e) => console.error("[gpu]", e.error.message));
        d.lost.then((info) => { if (!lostWatchers.has(d)) console.warn("[gpu] device lost:", info.reason, info.message); });
        cb(save(d));
    }, () => cb(0));
};

/** `cb` gets "reason: message" when the device is lost (a driver reset, a GPU process that died, `destroy`); the console is told only if nobody asked. */
export const onLost = (deviceId, cb) => {
    const device = get(deviceId);
    lostWatchers.add(device);
    device.lost.then((info) => cb(info.reason + ": " + info.message));
};

export const configureContext = (canvasId, deviceId, format) => {
    const canvas = get(canvasId);
    const device = get(deviceId);
    if (!canvas || !device) return 0;
    const ctx = canvas.getContext("webgpu");
    ctx.configure({ device, format: format || navigator.gpu.getPreferredCanvasFormat() });
    return save(ctx);
};

/** Frees the handle of anything that was made once (a pipeline, a bind group, a shader, a context); it does not destroy the GPU object. */
export const release = (id) => { drop(id); };

// ── shaders ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export const createShaderModule = (deviceId, code) => save(get(deviceId).createShaderModule({ code }));

/** The compiler's messages for the shader as "error 3:5 message" lines, "" when it is clean (or only has info). */
export const shaderErrors = (shaderId, cb) => {
    get(shaderId).getCompilationInfo().then(
        (info) => cb(info.messages.filter((m) => m.type === "error").map((m) => `error ${m.lineNum}:${m.linePos} ${m.message}`).join("\n")),
        (e) => cb(String(e)));
};

// ── buffers ──────────────────────────────────────────────────────────────────────────────────────────────────────────

export const createBuffer = (deviceId, size, usage) => save(get(deviceId).createBuffer({ size, usage }));
export const destroyBuffer = (id) => { const b = get(id); if (b) b.destroy(); drop(id); };

const numbers = (csv, Type) => new Type(csv === "" ? [] : csv.split(",").map(Number));

export const writeFloats = (deviceId, bufId, byteOffset, csv) => get(deviceId).queue.writeBuffer(get(bufId), byteOffset, numbers(csv, Float32Array));
export const writeUints  = (deviceId, bufId, byteOffset, csv) => get(deviceId).queue.writeBuffer(get(bufId), byteOffset, numbers(csv, Uint32Array));

/** `byteLength` bytes of the module's linear memory, from `memOffset`, into the buffer (the copy is made now, the memory may change after). */
export const writeFromMemory = (deviceId, bufId, byteOffset, memOffset, byteLength) =>
    get(deviceId).queue.writeBuffer(get(bufId), byteOffset, new Uint8Array(memoryBuffer(), memOffset, byteLength));

/**
 * Lets `copy(encoder, staging)` fill a staging buffer of `byteSize` bytes on the GPU, waits for it and gives the bytes to `then`
 * (null when it failed); the staging buffer is gone again afterwards.
 */
const readStaging = (device, byteSize, copy, then) => {
    const staging = device.createBuffer({ size: byteSize, usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST });
    const encoder = device.createCommandEncoder();
    copy(encoder, staging);
    device.queue.submit([encoder.finish()]);
    staging.mapAsync(GPUMapMode.READ).then(() => {
        const bytes = new Uint8Array(staging.getMappedRange().slice(0));
        staging.destroy();
        then(bytes);
    }, (e) => {
        console.error("[gpu] readback failed:", e.message);
        staging.destroy();
        then(null);
    });
};

/** `byteSize` bytes of the buffer (it needs COPY_SRC). */
const readBack = (deviceId, bufId, byteSize, then) =>
    readStaging(get(deviceId), byteSize, (encoder, staging) => encoder.copyBufferToBuffer(get(bufId), 0, staging, 0, byteSize), then);

/** The buffer read as float32 and given to `cb` as "1,2.5,…"; "" when it failed. */
export const readFloats = (deviceId, bufId, byteSize, cb) =>
    readBack(deviceId, bufId, byteSize, (bytes) => cb(bytes ? Array.from(new Float32Array(bytes.buffer)).join(",") : ""));

/** The buffer's bytes are written into the module's linear memory at `memOffset`; `cb` gets 1 when that worked, 0 when it failed. */
export const readToMemory = (deviceId, bufId, byteSize, memOffset, cb) =>
    readBack(deviceId, bufId, byteSize, (bytes) => {
        if (bytes) new Uint8Array(memoryBuffer(), memOffset, byteSize).set(bytes);
        cb(bytes ? 1 : 0);
    });

// ── textures ─────────────────────────────────────────────────────────────────────────────────────────────────────────

export const createTexture = (deviceId, width, height, format, usage) =>
    save(get(deviceId).createTexture({ size: [width, height], format, usage }));
export const destroyTexture = (id) => { const t = get(id); if (t) t.destroy(); drop(id); };

/**
 * A rectangle of the texture (8 bits per channel, 4 channels: rgba8unorm, bgra8unorm; it needs COPY_SRC) as "r,g,b,a,r,g,b,a,…"
 * in the texture's own channel order, row by row from the top; "" when it failed. The GPU wants rows of a multiple of 256 bytes;
 * they are packed here.
 */
export const readPixels = (deviceId, textureId, x, y, width, height, cb) => {
    const row = Math.ceil((width * 4) / 256) * 256;
    readStaging(get(deviceId), row * height, (encoder, staging) =>
        encoder.copyTextureToBuffer({ texture: get(textureId), origin: [x, y] }, { buffer: staging, bytesPerRow: row }, [width, height]),
        (bytes) => {
            if (!bytes) return cb("");
            const out = new Array(width * height * 4);
            for (let r = 0; r < height; r++) for (let i = 0; i < width * 4; i++) out[r * width * 4 + i] = bytes[r * row + i];
            cb(out.join(","));
        });
};

// ── pipelines ────────────────────────────────────────────────────────────────────────────────────────────────────────

/** "stride:step|location:format:offset,…;stride:step|…", one group per vertex buffer; "" is a pipeline without vertex buffers. */
const vertexBuffers = (text) =>
    text === ""
        ? []
        : text.split(";").map((buffer) => {
              const [head, attributes] = buffer.split("|");
              const [stride, step] = head.split(":");
              return {
                  arrayStride: Number(stride),
                  stepMode: step,
                  attributes: attributes.split(",").map((a) => {
                      const [location, format, offset] = a.split(":");
                      return { shaderLocation: Number(location), format, offset: Number(offset) };
                  }),
              };
          });

const alphaBlend = {
    color: { srcFactor: "src-alpha", dstFactor: "one-minus-src-alpha", operation: "add" },
    alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" },
};

export const createRenderPipeline = (deviceId, shaderId, vertexEntry, fragmentEntry, format, topology, layouts, blend) => {
    const module = get(shaderId);
    return save(get(deviceId).createRenderPipeline({
        layout: "auto",
        vertex: { module, entryPoint: vertexEntry, buffers: vertexBuffers(layouts) },
        fragment: { module, entryPoint: fragmentEntry, targets: [blend ? { format, blend: alphaBlend } : { format }] },
        primitive: { topology },
    }));
};

export const createComputePipeline = (deviceId, shaderId, entry) =>
    save(get(deviceId).createComputePipeline({ layout: "auto", compute: { module: get(shaderId), entryPoint: entry } }));

/** `entries` is "binding:buffer:offset:size,…"; a size of 0 is the rest of the buffer. The layout is the pipeline's own (`layout: "auto"`). */
export const createBindGroup = (deviceId, pipelineId, group, entries) =>
    save(get(deviceId).createBindGroup({
        layout: get(pipelineId).getBindGroupLayout(group),
        entries: entries.split(",").map((e) => {
            const [binding, buffer, offset, size] = e.split(":").map(Number);
            return { binding, resource: { buffer: get(buffer), offset, ...(size > 0 ? { size } : {}) } };
        }),
    }));

// ── commands ─────────────────────────────────────────────────────────────────────────────────────────────────────────

export const createEncoder = (deviceId) => save(get(deviceId).createCommandEncoder());

/** Finishes the encoder, hands it to the queue and releases its handle. */
export const submit = (deviceId, encoderId) => {
    get(deviceId).queue.submit([get(encoderId).finish()]);
    drop(encoderId);
};

export const copyBuffer = (encoderId, srcId, srcOffset, dstId, dstOffset, size) =>
    get(encoderId).copyBufferToBuffer(get(srcId), srcOffset, get(dstId), dstOffset, size);

/** A pass that clears the canvas to (r, g, b, a) and draws into it; the view of the frame is taken here, so no handle is made for it. */
export const beginRenderPass = (encoderId, contextId, r, g, b, a) =>
    save(get(encoderId).beginRenderPass({
        colorAttachments: [{ view: get(contextId).getCurrentTexture().createView(), clearValue: { r, g, b, a }, loadOp: "clear", storeOp: "store" }],
    }));

/** The same, into a texture (it needs RENDER_ATTACHMENT): nothing is presented, so this works where no canvas does, and the result can be read back. */
export const beginTexturePass = (encoderId, textureId, r, g, b, a) =>
    save(get(encoderId).beginRenderPass({
        colorAttachments: [{ view: get(textureId).createView(), clearValue: { r, g, b, a }, loadOp: "clear", storeOp: "store" }],
    }));

export const beginComputePass = (encoderId) => save(get(encoderId).beginComputePass());

// the same calls for both kinds of pass
export const passSetPipeline  = (passId, pipelineId)         => get(passId).setPipeline(get(pipelineId));
export const passSetBindGroup = (passId, index, bindGroupId) => get(passId).setBindGroup(index, get(bindGroupId));
export const passEnd          = (passId)                     => { get(passId).end(); drop(passId); };

export const renderSetVertexBuffer = (passId, slot, bufId)   => get(passId).setVertexBuffer(slot, get(bufId));
export const renderSetIndexBuffer  = (passId, bufId, format) => get(passId).setIndexBuffer(get(bufId), format);
export const renderDraw            = (passId, vertices, instances) => get(passId).draw(vertices, instances);
export const renderDrawIndexed     = (passId, indices, instances)  => get(passId).drawIndexed(indices, instances);
export const renderSetViewport     = (passId, x, y, w, h)    => get(passId).setViewport(x, y, w, h, 0, 1);
export const renderSetScissor      = (passId, x, y, w, h)    => get(passId).setScissorRect(x, y, w, h);

export const computeDispatch = (passId, x, y, z) => get(passId).dispatchWorkgroups(x, y, z);

// ── errors ───────────────────────────────────────────────────────────────────────────────────────────────────────────

/** Errors of validation between `pushErrorScope` and `popErrorScope` are not reported to the console but given to `cb` ("" when there was none). */
export const pushErrorScope = (deviceId) => get(deviceId).pushErrorScope("validation");
export const popErrorScope  = (deviceId, cb) => {
    get(deviceId).popErrorScope().then((e) => cb(e ? e.message : ""), (e) => cb(String(e)));
};
