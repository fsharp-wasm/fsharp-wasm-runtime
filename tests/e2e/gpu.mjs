// End-to-end: the WebGPU host (runtime/gfx-gpu.js) against the Canvas 2D host (runtime/gfx.js), by pixels.   node tests/e2e/gpu.mjs
// One drawing script, a band per feature, drawn by both hosts at device pixel ratio 1 and 2.  Headless Chromium has no GPU: the adapter is SwiftShader's (a software
// Vulkan), so this shows that the pictures agree, and nothing about how fast a real GPU is.  Without an adapter the test says SKIPPED.
import { fileURLToPath } from 'node:url';
import { writeFileSync } from 'node:fs';
import { serve, launch, checker, GPU_FLAGS } from './lib.mjs';

const { server, base } = await serve(fileURLToPath(new URL('../..', import.meta.url)));
const { check, failures } = checker();
const { browser, page, errors } = await launch(GPU_FLAGS);
await page.goto(`${base}/tests/e2e/gpu-host.html`);

// what a feature may differ by: the two anti-aliase differently (the share of pixels that differ by more than 40 of 255, and the mean difference), and shadows and text most
const limits = { default: { mean: 1.2, big: 0.012 }, shadow: { mean: 2.5, big: 0.03 }, text: { mean: 3.5, big: 0.06 } };
const gate = (name) => limits[name] ?? limits.default;

let any = false;
for (const ratio of [1, 2]) {
  const r = await page.evaluate((x) => window.run(x), ratio);
  if (!r.gpu) { console.log('— no WebGPU adapter in this browser: nothing was checked'); break; }
  any = true;
  for (const b of r.report) {
    const g = gate(b.name);
    check(`ratio ${ratio}: ${b.name} agrees (mean ${b.mean}, ${(b.bigShare * 100).toFixed(2)} % over 40, max ${b.max})`, b.mean <= g.mean && b.bigShare <= g.big);
  }
  check(`ratio ${ratio}: no WebGPU validation errors`, r.stats.errors.length === 0, r.stats.errors.join('; '));
  check(`ratio ${ratio}: nothing was skipped (${JSON.stringify(r.stats.unsupported)})`, Object.keys(r.stats.unsupported).length === 0);
  console.log(`  ratio ${ratio}: ${r.stats.instances} instances in ${r.stats.drawCalls} draw calls, ${r.stats.atlasRuns} text runs in the atlas`);
  if (process.env.GPU_PNG) writeFileSync(`${process.env.GPU_PNG}-${ratio}.png`, Buffer.from((await page.evaluate(() => window.__png.a)).split(',')[1], 'base64'));
}
check('no page errors', errors.length === 0, errors.join('; '));
await browser.close(); server.close();
// no adapter is a skip, said as one; E2E_GPU_REQUIRED=1 (CI) makes it a failure, so that a runner that lost its software adapter does not pass for nothing
if (!any) console.log('SKIPPED: this test needs a WebGPU adapter (SwiftShader: Chromium with --enable-unsafe-webgpu)');
process.exit(failures() || (!any && process.env.E2E_GPU_REQUIRED) ? 1 : 0);
