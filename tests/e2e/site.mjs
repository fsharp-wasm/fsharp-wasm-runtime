// End-to-end: the deployable site (site/) — landing page, the demos embedded in it, the live benchmark, every link.
//   node build/build.js && node build/site.mjs && node tests/e2e/site.mjs
import { fileURLToPath } from 'node:url';
import { serve, launch, checker } from './lib.mjs';

const { server, base } = await serve(fileURLToPath(new URL('../../site', import.meta.url)));
const { check, failures } = checker();
const { browser, page, errors } = await launch();

await page.goto(`${base}/`);
await page.waitForFunction(() => window.__ready === true);

check('title', /WebAssembly GC/.test(await page.title()), await page.title());
check('sponsor link', (await page.locator('a[href="https://github.com/sponsors/aiqs4"]').count()) >= 2);

// the demos embedded in the page run
const frame = (title) => page.frameLocator(`iframe[title="${title}"]`);
await page.locator('#live').scrollIntoViewIfNeeded();
for (const t of ['Counter', 'Todo list', 'Mandelbrot: F# vs JavaScript', 'Dashboard', 'Scene gallery']) await page.locator(`iframe[title="${t}"]`).scrollIntoViewIfNeeded();

const counter = frame('Counter');
await counter.locator('.count-display').waitFor({ timeout: 15000 });
await counter.locator('button:has-text("+")').click();
await counter.locator('button:has-text("+")').click();
check('embedded counter counts', (await counter.locator('.count-display').textContent()) === '2');

const todo = frame('Todo list');
await todo.locator('input[placeholder]').waitFor({ timeout: 15000 });
await todo.locator('input[placeholder]').fill('Sponsor fsharp-wasm');
await todo.locator('button:has-text("Add")').click();
check('embedded todo adds an item', (await todo.locator('li').allTextContents()).join().includes('Sponsor fsharp-wasm'));

const mandel = frame('Mandelbrot: F# vs JavaScript');
await mandel.locator('#render-btn').waitFor({ timeout: 15000 });
await mandel.locator('#render-btn').click();
await mandel.locator('#timing:not(:empty)').waitFor({ timeout: 20000 });
check('embedded mandelbrot reports timings', /ms/.test(await mandel.locator('#timing').textContent()));

const dash = frame('Dashboard');
await dash.locator('nav button:has-text("Todo")').waitFor({ timeout: 15000 });
await dash.locator('nav button:has-text("Todo")').click();
check('embedded dashboard switches tabs', (await dash.locator('input[placeholder]').count()) === 1);

// the graphics demos draw onto one canvas each: judged by what the canvas shows
const painted = (f) => f.locator('#gfx').evaluate((c) => {
  const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
  const colours = new Set(); for (let i = 0; i < d.length; i += 4 * 13) colours.add((d[i] << 16) | (d[i + 1] << 8) | d[i + 2]);
  return colours.size;
});
const gallery = frame('Scene gallery');
await gallery.locator('#scenes button').nth(12).waitFor({ timeout: 20000 });
check('embedded scene gallery lists thirteen scenes', (await gallery.locator('#scenes button').count()) === 13);
check('embedded scene gallery opens the scene its link names', (await gallery.locator('#scenes button[aria-selected="true"]').textContent()) === 'Dashboard');
check('embedded scene gallery is painted', (await painted(gallery)) > 100);


// the live benchmark
await page.click('#run-bench');
await page.waitForFunction(() => window.__benchDone === true, null, { timeout: 120000 });
const rows = await page.locator('#bench-rows tr').evaluateAll((trs) => trs.map((tr) => [...tr.children].map((td) => td.textContent)));
check('benchmark: four kernels', rows.length === 4, JSON.stringify(rows));
check('benchmark: F# and JavaScript agree on every result', rows.every((r) => r[4].startsWith('✓')), JSON.stringify(rows.map((r) => r[4])));

// every demo in the gallery opens and boots
const links = await page.locator('#demos .gallery a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
check('gallery lists twelve demos', links.length === 12, String(links.length));
for (const href of links) {
  const p = await browser.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto(`${base}/${href}`);
  await p.waitForFunction(() => /Loaded|loaded/.test(document.getElementById('status')?.textContent ?? '') || document.body.dataset.done !== undefined || document.getElementById('run') !== null, null, { timeout: 15000 }).catch(() => {});
  const status = (await p.textContent('#status').catch(() => '')) ?? '';
  check(`${href} boots`, !/Error/.test(status) && errs.length === 0, status + errs.join());
  await p.close();
}

check('landing page: no page errors', errors.filter((e) => !/WebGPU|ERR_/.test(e)).length === 0, JSON.stringify(errors).slice(0, 300));
await browser.close();
server.close();
console.log(failures() ? `\n${failures()} check(s) failed` : '\nall site checks passed');
process.exit(failures() ? 1 : 0);
