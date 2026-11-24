export const timeout  = (ms, cb)  => setTimeout(cb, ms);
export const interval = (ms, cb)  => setInterval(cb, ms);
export const clearTimeout_  = (id) => clearTimeout(id);
export const clearInterval_ = (id) => clearInterval(id);
export const requestAnimationFrame_ = (cb) => requestAnimationFrame(cb);
export const cancelAnimationFrame_  = (id) => cancelAnimationFrame(id);
/** Milliseconds since the epoch: what a program that stamps a save needs (the clock is not part of a pure `update`; it is a message). */
export const now = () => Date.now();

/** Minutes since midnight in the local time zone of the browser (a clock face needs the hour and the minute where the person is). */
export const localMinutes = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };

/** `performance.now()`: milliseconds with fractions, from the start of the page, for timing a computation (Date.now() has whole milliseconds). */
export const highNow = () => performance.now();
