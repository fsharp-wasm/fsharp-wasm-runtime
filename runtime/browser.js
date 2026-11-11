// fsharp-wasm-runtime — the whole JavaScript side of an F# → WasmGC browser app.
//
// F# strings are WasmGC arrays: JavaScript cannot read them, so text crosses the boundary one UTF-16 code unit at a
// time through two plain-integer imports (`putc`, `commit`), and comes back through the exported `inboxPut`.
// Rendering is "F# builds an HTML string, JS morphs the DOM to match it"; events are delegated from the mount point
// to the exported `dispatch(id)`.  No framework, no build step, ~100 lines.

const CHUNK = 8192;

/** Turn the collected UTF-16 code units into a string (chunked: spread would overflow the stack). */
function decode(units) {
  let s = '';
  for (let i = 0; i < units.length; i += CHUNK) s += String.fromCharCode.apply(null, units.slice(i, i + CHUNK));
  return s;
}

/** Make `dst` look like `src` (both element trees) touching as little of the live DOM as possible. */
function morph(dst, src) {
  const a = [...dst.childNodes], b = [...src.childNodes];
  for (let i = 0; i < b.length; i++) {
    const x = a[i], y = b[i];
    if (!x) { dst.appendChild(y.cloneNode(true)); continue; }
    if (x.nodeType !== y.nodeType || x.nodeName !== y.nodeName) { dst.replaceChild(y.cloneNode(true), x); continue; }
    if (y.nodeType === Node.TEXT_NODE) { if (x.nodeValue !== y.nodeValue) x.nodeValue = y.nodeValue; continue; }
    // same element: attributes, then children
    for (const { name } of [...x.attributes]) if (!y.hasAttribute(name)) x.removeAttribute(name);
    for (const { name, value } of [...y.attributes]) if (x.getAttribute(name) !== value) x.setAttribute(name, value);
    if (x.nodeName === 'INPUT' && document.activeElement !== x && x.value !== (y.getAttribute('value') ?? '')) {
      x.value = y.getAttribute('value') ?? '';
    }
    morph(x, y);
  }
  while (dst.childNodes.length > b.length) dst.removeChild(dst.lastChild);
}

/**
 * Load a compiled F# module and run its `main` inside `root`.
 * @param {string} wasmUrl   URL of the .wasm produced by fsharp-wasm
 * @param {Element} root     mount point (receives the rendered HTML)
 * @param {object}  [host]   extra imports, e.g. `{ env: {...} }`
 * @returns the wasm exports
 */
export async function mount(wasmUrl, root, host = {}) {
  let out = [];
  let exports;
  const imports = {
    browser: {
      putc: (c) => { out.push(c); },
      commit: (target) => {
        const text = decode(out); out = [];
        if (target === 0) {                       // DOM render
          const tpl = document.createElement('div'); tpl.innerHTML = text;
          morph(root, tpl);
        } else if (target === 1) console.log(text);
        else if (target === 2) document.title = text;
      },
      ...(host.browser ?? {}),
    },
    // Browser.Canvas: drawing on the first <canvas> inside the mount point
    canvas: {
      fillRect: (x, y, w, h, rgb) => { const c = ctx2d(); c.fillStyle = '#' + (rgb >>> 0).toString(16).padStart(6, '0'); c.fillRect(x, y, w, h); },
      clear: (rgb) => { const c = ctx2d(); if (c) { c.fillStyle = '#' + (rgb >>> 0).toString(16).padStart(6, '0'); c.fillRect(0, 0, c.canvas.width, c.canvas.height); } },
    },
    // Browser.Timing: a repeating timer that calls the exported `tick`
    timing: {
      setInterval: (ms) => { const id = setInterval(() => exports.tick(), ms); timers.add(id); return id; },
      clearInterval: (id) => { clearInterval(id); timers.delete(id); },
    },
    env: { consolePrint: () => {}, ...(host.env ?? {}) },
  };
  const timers = new Set();
  const ctx2d = () => root.querySelector('canvas')?.getContext('2d');
  const bytes = await (await fetch(wasmUrl)).arrayBuffer();
  ({ instance: { exports } } = await WebAssembly.instantiate(bytes, imports));

  const send = (text) => { exports.inboxClear(); for (let i = 0; i < text.length; i++) exports.inboxPut(text.charCodeAt(i)); };
  const on = (type) => root.addEventListener(type, (e) => {
    const el = e.target.closest?.(`[data-on="${type}"]`);
    if (!el || !root.contains(el)) return;
    send(type === 'input' ? e.target.value : el.tagName === 'CANVAS' ? `${Math.floor((e.offsetX * el.width) / el.clientWidth)},${Math.floor((e.offsetY * el.height) / el.clientHeight)}` : '');
    exports.dispatch(Number(el.dataset.ev));
  });
  on('click'); on('input');
  exports.main();
  return exports;
}
