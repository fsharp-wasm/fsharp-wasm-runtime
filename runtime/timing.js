export const timeout  = (ms, cb)  => setTimeout(cb, ms);
export const interval = (ms, cb)  => setInterval(cb, ms);
export const clearTimeout_  = (id) => clearTimeout(id);
export const clearInterval_ = (id) => clearInterval(id);
export const requestAnimationFrame_ = (cb) => requestAnimationFrame(cb);
export const cancelAnimationFrame_  = (id) => cancelAnimationFrame(id);
/** Milliseconds since the epoch: what a program that stamps a save needs (the clock is not part of a pure `update`; it is a message). */
export const now = () => Date.now();
