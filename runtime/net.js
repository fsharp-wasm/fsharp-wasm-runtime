import { save, get } from "./core.js";

export const fetchText = async (url) => {
    const res = await fetch(url);
    return await res.text();
};

export const fetchJson = async (url) => {
    const res = await fetch(url);
    return save(await res.json());
};

export const postJson = async (url, body) => {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });
    return save(await res.json());
};

export const wsOpen = (url) => save(new WebSocket(url));

export const wsSend = (id, msg) => {
    const ws = get(id);
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(msg);
};

export const wsOnMessage = (id, cb) => {
    const ws = get(id);
    if (ws) ws.onmessage = (e) => cb(e.data);
};

export const wsOnOpen = (id, cb) => {
    const ws = get(id);
    if (ws) ws.onopen = () => cb(id);
};

export const wsOnClose = (id, cb) => {
    const ws = get(id);
    if (ws) ws.onclose = () => cb(id);
};

export const wsClose = (id) => {
    const ws = get(id);
    if (ws) ws.close();
};
