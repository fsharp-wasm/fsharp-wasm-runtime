/**
 * actors.js — processes in Web Workers, for fsharp-wasm's FSharp.Wasm.Actors.
 *
 * A process is a module worker.  The worker says `{ ready: true }` when it is up, `{ job, value }` when it has an answer, and `{ exit: reason }` just before it closes itself or when it fails;
 * these arrive at the module as the three callbacks of `spawn`, each with the time (`performance.now()`) as the last argument, because a module's `update` is a pure function and does not read
 * the clock.  What goes in is numbers only: `send(process, job, a, b)`.  `kill` is the host ending a process (the handlers are taken off first, so that it is not heard of again; the module
 * knows that it did it); `crash` asks the worker to fail by itself, which is how a process dies when nobody kills it.
 */
import { save, get } from "./core.js";

export const spawn = (url, onReady, onReply, onExit) => {
    const w = new Worker(url, { type: "module" });
    w.onmessage = (e) => {
        const m = e.data;
        if (m.ready) onReady(performance.now());
        else if (m.exit !== undefined) onExit(performance.now());
        else onReply(m.job, m.value, performance.now());
    };
    w.onerror = () => onExit(performance.now());
    return save(w);
};

export const send = (id, job, a, b) => { get(id)?.postMessage({ job, a, b }); };
export const crash = (id) => { get(id)?.postMessage({ crash: true }); };
export const kill = (id) => {
    const w = get(id);
    if (!w) return;
    w.onmessage = null; w.onerror = null;
    w.terminate();
};

/** `performance.now()`: the clock the callbacks of `spawn` use, for a module that stamps what it starts. */
export const now = () => performance.now();
