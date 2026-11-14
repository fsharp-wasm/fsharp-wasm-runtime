// Sizes and load times of the site's modules and pages — the data of the public benchmarks page (site/benchmarks/).
//
//   E2E_ROOT=site node tests/e2e/network.mjs [--out docs/benchmarks] [--runs 3]
//
// size.json     per page of the site: every same-origin request with its size as the server holds it, gzip (level 9) and brotli (quality 11);
//               per module: the same three sizes.
// network.json  per module, per network profile, per encoding: the time to download the module and the time to compile it, as the
//               median of --runs runs.  The network is emulated by Chromium (DevTools: a round trip of latency added to every request,
//               the bandwidth capped); there is no connection setup, no TLS, no server think time.  It is the shape of the cost, not the
//               line of the reader: the page "Load times on your connection" measures that.
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import { join } from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { launch, serve } from './lib.mjs';

process.env.E2E_ROOT ??= 'site';
const args = Object.fromEntries(process.argv.slice(2).join(' ').split(/\s*--/).filter(Boolean).map((a) => { const [k, ...v] = a.trim().split(/\s+/); return [k, v.join(' ') || true]; }));
const outDir = typeof args.out === 'string' ? args.out : fileURLToPath(new URL('../../docs/benchmarks', import.meta.url));
const runs = Number(args.runs ?? 3);
const root = fileURLToPath(new URL(`../../${process.env.E2E_ROOT}`, import.meta.url));

export const profiles = [
  { id: 'local', label: 'Localhost', mbps: null, rtt: 0 },
  { id: 'wifi', label: 'Wi-Fi', mbps: 30, rtt: 20 },
  { id: '4g', label: '4G', mbps: 9, rtt: 85 },
  { id: 'slow-4g', label: 'Slow 4G', mbps: 1.6, rtt: 150 },
  { id: '3g', label: '3G', mbps: 0.78, rtt: 300 },
];
const encodings = ['identity', 'gzip', 'br'];

const gz = (b) => zlib.gzipSync(b, { level: 9 }).length;
const br = (b) => zlib.brotliCompressSync(b, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11, [zlib.constants.BROTLI_PARAM_SIZE_HINT]: b.length } }).length;
const sizes = (b) => ({ raw: b.length, gzip: gz(b), brotli: br(b) });
const add = (a, b) => ({ raw: a.raw + b.raw, gzip: a.gzip + b.gzip, brotli: a.brotli + b.brotli });
const zero = { raw: 0, gzip: 0, brotli: 0 };
const median = (xs) => { const s = [...xs].sort((a, b) => a - b), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

// what each page loads at start; the benchmark page loads its module in a worker only when it runs
const pages = [{ id: '(landing page)', url: '/' }];
// graphics-editor is the old address of the widget editor: one page that forwards, not a demo of its own
const demos = (await readdir(join(root, 'demos'), { withFileTypes: true })).filter((d) => d.isDirectory() && d.name !== 'graphics-editor').map((d) => d.name).sort();
for (const d of demos) pages.push({ id: d, url: `/demos/${d}/${d === 'bench' ? '?profile=quick&only=fib&autorun' : ''}`, done: d === 'bench' ? () => document.body.dataset.done === 'true' : null });

const modules = [];
for (const d of demos)
  for (const f of (await readdir(join(root, 'demos', d))).filter((f) => f.endsWith('.wasm') && !/-(embedded|component)\.wasm$/.test(f)))
    modules.push({ id: `${d}/${f}`, demo: d, file: f, path: `/demos/${d}/${f}`, ...sizes(await readFile(join(root, 'demos', d, f))) });

const { browser, page, errors } = await launch();
const env = { chromium: browser.version(), os: `${os.platform()} ${os.arch()}`, cpu: os.cpus()[0]?.model, cores: os.cpus().length, node: process.versions.node };
const date = new Date().toISOString();

// ── sizes: what a page loads ─────────────────────────────────────────────────
{
  const { server, base } = await serve(root, 0, 'identity');
  const report = [];
  for (const p of pages) {
    const requests = [], external = [];
    const onResponse = async (r) => {
      const url = new URL(r.url());
      if (url.origin !== base) { external.push(r.url()); return; }
      try { requests.push({ path: url.pathname, type: r.request().resourceType(), ...sizes(await r.body()) }); } catch { /* a redirect has no body */ }
    };
    page.on('response', onResponse);
    await page.goto(base + p.url, { waitUntil: 'networkidle' });
    if (p.done) await page.waitForFunction(p.done, null, { timeout: 120000 });
    await page.waitForTimeout(500);
    page.off('response', onResponse);
    const byPath = [...new Map(requests.map((r) => [r.path, r])).values()].sort((a, b) => b.raw - a.raw);
    report.push({ id: p.id, requests: byPath, total: byPath.reduce(add, zero), externalRequests: [...new Set(external)].length });
  }
  server.close();
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, 'size.json'), JSON.stringify({ schema: 'size-1', date, env, note: 'Same-origin requests only; sizes as the server holds them, gzip level 9, brotli quality 11.', modules: modules.map(({ path, ...m }) => m), pages: report }, null, 2) + '\n');
  console.log(`size.json: ${report.length} pages, ${modules.length} modules`);
}

// ── network: download and compile, per profile and encoding ──────────────────
const cdp = await page.context().newCDPSession(page);
const throttle = (p) => cdp.send('Network.emulateNetworkConditions', {
  offline: false, latency: p.rtt,
  downloadThroughput: p.mbps ? (p.mbps * 1e6) / 8 : -1, uploadThroughput: p.mbps ? (p.mbps * 1e6) / 16 : -1,
});
await cdp.send('Network.enable');
const results = Object.fromEntries(modules.map((m) => [m.id, {}]));
for (const enc of encodings) {
  const { server, base } = await serve(root, 0, enc);
  await page.route(`${base}/__blank`, (r) => r.fulfill({ contentType: 'text/html', body: '<!doctype html><title>blank</title>' }));
  await page.goto(`${base}/__blank`);                                 // a page of the same origin to fetch from
  for (const p of profiles) {
    await throttle(p);
    for (const m of modules) {
      const samples = [];
      // unmeasured: the server compresses a file the first time it is asked for (brotli quality 11 takes a while), then serves it from memory
      await page.evaluate((url) => fetch(url, { cache: 'no-store' }).then((r) => r.arrayBuffer()), base + m.path);
      for (let i = 0; i < runs; i++)
        samples.push(await page.evaluate(async (url) => {
          const t0 = performance.now();
          const res = await fetch(url, { cache: 'no-store' });
          const bytes = await res.arrayBuffer();
          const t1 = performance.now();
          await WebAssembly.compile(bytes);
          const t2 = performance.now();
          const e = performance.getEntriesByName(new URL(url, location.href).href).pop();
          return { downloadMs: t1 - t0, compileMs: t2 - t1, wire: e?.encodedBodySize ?? 0 };
        }, base + m.path));
      ((results[m.id][p.id] ??= {})[enc]) = { wireBytes: samples[0].wire, downloadMs: median(samples.map((s) => s.downloadMs)), compileMs: median(samples.map((s) => s.compileMs)) };
    }
    process.stdout.write(`  ${enc} / ${p.id} done\n`);
  }
  await throttle(profiles[0]);
  server.close();
}
await writeFile(join(outDir, 'network.json'), JSON.stringify({ schema: 'network-1', date, env, runs, profiles, encodings, modules: modules.map(({ path, ...m }) => ({ ...m, results: results[m.id] })) }, null, 2) + '\n');
console.log(`network.json: ${modules.length} modules × ${profiles.length} profiles × ${encodings.length} encodings × ${runs} runs`);
if (errors.length) console.log(`page errors (${errors.length}): ${errors.slice(0, 3).join(' | ')}`);
await browser.close();
