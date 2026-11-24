// End-to-end: the accounting grid, a module written without WebGPU in mind, drawn by the WebGPU host and by the Canvas 2D host.   node tests/e2e/gpu-grid.mjs
// Two pages load the same compiled module from site/, one with ?renderer=webgpu&offscreen, and get the same events (a wheel, keys); the pictures are compared after each step.
// Also the time the main thread spends per frame in each host (recording and submitting against issuing the canvas calls).  No GPU here (SwiftShader), so what a GPU needs
// for the frame is not measured, and neither is what the browser needs to rasterise the 2D canvas.
import { fileURLToPath } from 'node:url';
import { writeFileSync } from 'node:fs';
import zlib from 'node:zlib';
import { serve, launch, checker, GPU_FLAGS } from './lib.mjs';

const { server, base } = await serve(fileURLToPath(new URL('../../site', import.meta.url)));
const { check, failures } = checker();
const open = async (query) => {
  const { browser, page, errors } = await launch(GPU_FLAGS);
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto(`${base}/demos/accounting-grid/index.html${query}`);
  await page.waitForFunction(() => window.__instance && document.getElementById('renderer').textContent !== '…');
  await page.waitForTimeout(1500);
  return { browser, page, errors };
};
const ref = await open('');
const gpu = await open('?renderer=webgpu&offscreen');
if ((await gpu.page.textContent('#renderer')) !== 'WebGPU') {
  // no adapter: a skip, said as one; E2E_GPU_REQUIRED=1 (CI) makes it a failure
  console.log('SKIPPED: this test needs a WebGPU adapter (SwiftShader: Chromium with --enable-unsafe-webgpu); the page said: ' + (await gpu.page.textContent('#renderer')));
  for (const x of [ref, gpu]) await x.browser.close();
  server.close();
  process.exit(process.env.E2E_GPU_REQUIRED ? 1 : 0);
}
check('the GPU page draws with WebGPU', true);

// a PNG of the two pictures and of where they differ (GPU_PNG=prefix), for a person to look at
const png = (w, h, rgba) => {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) { raw[y * (w * 4 + 1)] = 0; Buffer.from(rgba.buffer, rgba.byteOffset + y * w * 4, w * 4).copy(raw, y * (w * 4 + 1) + 1); }
  const chunk = (type, data) => { const b = Buffer.alloc(12 + data.length); b.writeUInt32BE(data.length, 0); b.write(type, 4); data.copy(b, 8); b.writeUInt32BE(zlib.crc32(b.subarray(4, 8 + data.length)), 8 + data.length); return b; };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
};
const dump = (label, a, b) => {
  if (!process.env.GPU_PNG) return;
  const w = a.width, h = a.height, out = new Uint8ClampedArray(w * 3 * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    for (let k = 0; k < 4; k++) { out[(y * w * 3 + x) * 4 + k] = a.data[i + k]; out[(y * w * 3 + w + x) * 4 + k] = b.data[i + k]; }
    const d = Math.min(255, 4 * Math.max(Math.abs(a.data[i] - b.data[i]), Math.abs(a.data[i + 1] - b.data[i + 1]), Math.abs(a.data[i + 2] - b.data[i + 2])));
    const o = (y * w * 3 + 2 * w + x) * 4; out[o] = 255 - d; out[o + 1] = 255 - d; out[o + 2] = 255 - d; out[o + 3] = 255;
  }
  writeFileSync(`${process.env.GPU_PNG}-${label.replace(/ /g, '-')}.png`, png(w * 3, h, out));
};
const picture = (p, isGpu) => p.evaluate(async (g) => {
  if (g) { await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); const { width, height, data } = await window.__gpu.readPixels(); return { width, height, b64: btoa(String.fromCharCode(...data.subarray(0, 0))) , data: Array.from(data) }; }
  const c = document.getElementById('gfx'); const d = c.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, c.width, c.height);
  return { width: c.width, height: c.height, data: Array.from(d.data) };
}, isGpu);
// measured 2026-11-24 (SwiftShader, Chromium 153): mean 0.75 to 1.42 of 255, 0.74 to 0.78 % of the pixels over 40 — the glyphs, which sit on a quarter of a pixel in the atlas
const compare = async (label, limit = { mean: 2, big: 0.012 }) => {
  const [a, b] = [await picture(ref.page, false), await picture(gpu.page, true)];
  check(`${label}: the two canvases have the same size`, a.width === b.width && a.height === b.height, `${a.width}x${a.height} against ${b.width}x${b.height}`);
  if (a.width !== b.width) return;
  dump(label, a, b);
  let sum = 0, big = 0, max = 0; const n = a.width * a.height;
  for (let i = 0; i < n; i++) { const o = i * 4; const d = Math.max(Math.abs(a.data[o] - b.data[o]), Math.abs(a.data[o + 1] - b.data[o + 1]), Math.abs(a.data[o + 2] - b.data[o + 2])); sum += d; if (d > 40) big++; if (d > max) max = d; }
  check(`${label}: the pictures agree (mean ${(sum / n).toFixed(3)} of 255, ${(100 * big / n).toFixed(3)} % of the pixels differ by more than 40, max ${max})`, sum / n <= limit.mean && big / n <= limit.big);
};

await compare('first frame');
// the same real mouse events to both pages: the wheel under the pointer scrolls the table sideways (it has more columns than the canvas shows)
const wheel = async (dx) => { for (const p of [ref.page, gpu.page]) { const r = await p.evaluate(() => { const b = document.getElementById('gfx').getBoundingClientRect(); return [b.x, b.y]; }); await p.mouse.move(r[0] + 600, r[1] + 300); await p.mouse.wheel(dx, 0); } await ref.page.waitForTimeout(400); };
await wheel(300);
check('the table scrolled', (await ref.page.evaluate(() => window.__instance.exports.offsetX())) > 0);
await compare('after scrolling right');
await wheel(300);
await compare('after scrolling further');
await wheel(-600);
await compare('after scrolling back');
// a click on a cell selects it (a highlight and a ring: strokes and fills over text)
for (const p of [ref.page, gpu.page]) { const r = await p.evaluate(() => { const b = document.getElementById('gfx').getBoundingClientRect(); return [b.x, b.y]; }); await p.mouse.click(r[0] + 420, r[1] + 200); }
await ref.page.waitForTimeout(400);
check('a cell is selected', (await ref.page.evaluate(() => window.__instance.exports.selectedRow())) >= 0);
await compare('with a cell selected');

// the main thread's time per frame: a wheel notch, the module's frame, and in the GPU host the submit
const cost = (p, isGpu) => p.evaluate((g) => {
  const ex = window.__instance.exports, times = [];
  ex.onPointer(2, 600, 300, 0);                       // the pointer over the table: the wheel reaches it
  for (let i = 0; i < 160; i++) {
    ex.onWheel(i % 2 ? -1 : 1, 0);                  // a notch right, a notch left: every frame draws something different
    const t0 = performance.now();
    ex.frame(performance.now()); if (g) window.__gpu.flush();
    times.push(performance.now() - t0);
  }
  times.sort((x, y) => x - y);
  return { median: times[80], p95: times[152], stats: g ? window.__gpu.gpuStats() : null };
}, isGpu);
const c2 = await cost(ref.page, false), cg = await cost(gpu.page, true);
console.log(`  main-thread time per scrolled frame: Canvas 2D median ${c2.median.toFixed(2)} ms (p95 ${c2.p95.toFixed(2)}), WebGPU median ${cg.median.toFixed(2)} ms (p95 ${cg.p95.toFixed(2)})`);
console.log(`  WebGPU: ${cg.stats.instances} instances in ${cg.stats.drawCalls} draw calls over ${cg.stats.frames} frames, ${cg.stats.atlasRuns} text runs in the atlas`);
check('the grid skipped nothing: every operation it uses is supported', Object.keys(cg.stats.unsupported).length === 0, JSON.stringify(cg.stats.unsupported));
check('no WebGPU validation errors', cg.stats.errors.length === 0, cg.stats.errors.join('; '));
check('no page errors', ref.errors.length + gpu.errors.length === 0, [...ref.errors, ...gpu.errors].join('; '));
for (const x of [ref, gpu]) await x.browser.close();
server.close();
process.exit(failures() ? 1 : 0);
