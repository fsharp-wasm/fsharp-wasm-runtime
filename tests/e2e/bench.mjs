// End-to-end: the benchmark page — the module and the worker load, every kernel agrees with its JavaScript twin, the chart and the table
// show every kernel, the tooltip answers, the JSON can be downloaded.  With --record <file> the report is also written (docs/benchmarks).
import { writeFile } from 'node:fs/promises';
import { checker, launch, serve } from './lib.mjs';

const record = process.argv.includes('--record') ? process.argv[process.argv.indexOf('--record') + 1] : null;
const profile = process.argv.includes('--standard') ? 'standard' : 'quick';
const { check, failures } = checker();
const { server, base } = await serve();
const { browser, page, errors } = await launch();
try {
  await page.goto(`${base}/demos/bench/?profile=${profile}&autorun`);
  await page.waitForFunction(() => document.body.dataset.done === 'true', null, { timeout: 600000 });
  const report = await page.evaluate(() => window.__bench);
  check('a report came back', !!report && report.rows?.length === 13, JSON.stringify(report?.summary));
  check('every kernel: F# and JavaScript agree', report?.rows.every((r) => r.same), JSON.stringify(report?.rows.filter((r) => !r.same).map((r) => r.id)));
  check('every kernel has samples and positive times', report?.rows.every((r) => r.js.n >= 3 && r.wasm.n >= 3 && r.js.median > 0 && r.wasm.median > 0));
  const rows = await page.locator('#rows tr').count();
  check('table: one row per kernel', rows === 13, String(rows));
  const bars = await page.locator('#chart .row').count();
  check('chart: one row per kernel', bars === 13, String(bars));
  check('chart: bars drawn for every kernel', (await page.locator('#chart .bar').count()) === 13);
  await page.locator('#chart .row').first().hover();
  const tip = await page.locator('#tip').isVisible();
  check('tooltip shows on hover', tip);
  check('tooltip names the kernel and both sides', /JavaScript/.test(await page.locator('#tip').innerText()) && /F# → WasmGC/.test(await page.locator('#tip').innerText()));
  check('summary line', /faster in \d+ of 13 kernels/.test(await page.locator('#summary').innerText()), await page.locator('#summary').innerText());
  check('environment line names the browser', /Chrom/.test(await page.locator('#env').innerText()), await page.locator('#env').innerText());
  const [download] = await Promise.all([page.waitForEvent('download'), page.click('#save')]);
  check('JSON download', /^bench-browser-.*\.json$/.test(download.suggestedFilename()), download.suggestedFilename());
  // narrow screen: the chart re-lays out (names above the bars) without horizontal overflow
  await page.setViewportSize({ width: 360, height: 800 });
  await page.waitForTimeout(300);
  check('phone width: no horizontal scroll', await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  check('no page errors', errors.length === 0, errors.join(' | '));
  if (record) await writeFile(record, JSON.stringify(report, null, 2) + '\n');
} finally {
  await browser.close();
  server.close();
}
process.exit(failures() === 0 ? 0 : 1);
