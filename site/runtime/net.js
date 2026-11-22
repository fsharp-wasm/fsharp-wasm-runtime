import { save } from "./core.js";

/**
 * One HTTP request.  A module cannot wait for a promise, so the answer comes to the callback: `cb(status, body)`, the body as text.
 * The status is 0 when no answer arrived at all (the network failed, the host is unknown, CORS refused), so that a failure is a
 * value the program can match on, not an exception it cannot catch.  `headers` are lines of `name: value`; a GET or HEAD has no body.
 */
export const request = (method, url, body, headers, cb) => {
    const init = { method, headers: Object.fromEntries(headers.split("\n").filter(Boolean).map((l) => { const i = l.indexOf(":"); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })) };
    if (body !== "" && method !== "GET" && method !== "HEAD") init.body = body;
    (async () => {
        let answer = [0, ""];
        try { const res = await fetch(url, init); answer = [res.status, await res.text()]; } catch { /* answer stays [0, ""] */ }
        cb(...answer);
    })();
};

const parse = (text) => { try { return save(JSON.parse(text)); } catch { return 0; } };

export const fetchText = (url, cb) => request("GET", url, "", "", (_, text) => cb(text));

/** The parsed body as a handle to the JS value (0 when it is not JSON). */
export const fetchJson = (url, cb) => request("GET", url, "", "", (_, text) => cb(parse(text)));

/** `body` is JSON text already; the answer is parsed as in fetchJson. */
export const postJson = (url, body, cb) => request("POST", url, body, "content-type: application/json", (_, text) => cb(parse(text)));

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
