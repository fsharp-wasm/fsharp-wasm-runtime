import { save, get } from "./core.js";

export const isGpuAvailable = () => !!navigator.gpu;

export const requestAdapter = async () => {
    if (!navigator.gpu) return 0;
    const adapter = await navigator.gpu.requestAdapter();
    return adapter ? save(adapter) : 0;
};

export const requestDevice = async (adapterId) => {
    const adapter = get(adapterId);
    if (!adapter) return 0;
    const device = await adapter.requestDevice();
    return device ? save(device) : 0;
};

export const configureContext = (canvasId, deviceId, format) => {
    const canvas = get(canvasId);
    const device = get(deviceId);
    if (!canvas || !device) return 0;
    const ctx = canvas.getContext("webgpu");
    ctx.configure({ device, format: format || navigator.gpu.getPreferredCanvasFormat() });
    return save(ctx);
};

export const getPreferredFormat = () => {
    return navigator.gpu ? navigator.gpu.getPreferredCanvasFormat() : "";
};
