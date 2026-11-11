// End-to-end: real Chromium loads the page, the F# (WasmGC) counter renders, clicks come back as messages.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

// `playwright` from node_modules, else from the global install (what the cloud image ships)
const { chromium } = await import('playwright').catch(() =>
  import(pathToFileURL(join(execSync('npm root -g').toString().trim(), 'playwright', 'index.mjs')).href));

const root = fileURLToPath(new URL('../..', import.meta.url));   // repository root (serves /site)
const types = { '.html': 'text/html', '.js': 'text/javascript', '.wasm': 'application/wasm', '.css': 'text/css' };
const server = http.createServer(async (req, res) => {
  try {
    const path = normalize(join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname)));
    if (!path.startsWith(root)) throw new Error('outside');
    res.writeHead(200, { 'content-type': types[extname(path)] ?? 'application/octet-stream' });
    res.end(await readFile(path));
  } catch { res.writeHead(404); res.end('not found'); }
}).listen(0);
const base = `http://127.0.0.1:${server.address().port}`;

let failed = 0;
const check = (name, ok, extra = '') => { console.log(`${ok ? '✓' : '✗'} ${name} ${ok ? '' : extra}`); if (!ok) failed++; };

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto(`${base}/site/index.html`);
await page.waitForFunction(() => window.__ready === true, null, { timeout: 20000 });
const text = (sel) => page.textContent(sel);
const ignorable = (e) => /ERR_|Failed to load resource/.test(e);

// ── Counter ────────────────────────────────────────────────────────────────────────────────────────
check('counter renders', (await text('#counter h1')) === 'Hello from F# on WasmGC');
check('counter starts at 0', (await text('#counter p')) === 'Count: 0');
await page.click('#counter button:has-text("+")');
await page.click('#counter button:has-text("+")');
check('counter: two clicks → 2', (await text('#counter p')) === 'Count: 2');
await page.click('#counter button:has-text("−")');
check('counter: minus → 1', (await text('#counter p')) === 'Count: 1');
await page.click('#counter button:has-text("reset")');
check('counter: reset → 0', (await text('#counter p')) === 'Count: 0');

// ── Todo ───────────────────────────────────────────────────────────────────────────────────────────
check('todo lists 3 items', (await page.locator('#todo li').count()) === 3);
check('todo: 1 open', (await text('#todo small')).startsWith('1 open · 2 done'));
await page.fill('#todo input[placeholder]', 'Write the docs');
await page.click('#todo button:has-text("Add")');
check('todo: item added', (await page.locator('#todo li').count()) === 4);
check('todo: draft cleared', (await page.inputValue('#todo input[placeholder]')) === '');
check('todo: new item text', (await text('#todo li:last-child span')) === 'Write the docs');
await page.click('#todo li:last-child input[type=checkbox]');
check('todo: toggle → done', (await text('#todo small')).startsWith('1 open · 3 done'));
await page.click('#todo button:has-text("clear done")');
check('todo: clear done', (await page.locator('#todo li').count()) === 1);
await page.click('#todo li button:has-text("×")');
check('todo: remove', (await page.locator('#todo li').count()) === 0);

// ── Game of Life (timer + canvas) ──────────────────────────────────────────────────────────────────
const gen = async () => Number(/generation (\d+)/.exec(await text('#life small'))[1]);
const g1 = await gen();
await page.waitForTimeout(600);
const g2 = await gen();
check('life: timer advances generations', g2 > g1, `${g1} → ${g2}`);
const lit = await page.evaluate(() => {
  const c = document.querySelector('#life canvas'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
  let n = 0; for (let i = 0; i < d.length; i += 4) if (d[i + 1] > 200) n++; return n; });
check('life: canvas has live cells drawn', lit > 500, String(lit));
await page.click('#life button:has-text("pause")');
const p1 = await gen(); await page.waitForTimeout(300);
check('life: pause stops the timer effect', (await gen()) === p1);
await page.click('#life button:has-text("clear")');
check('life: clear → 0 alive', (await text('#life small')).includes('0 cells alive'));
await page.click('#life canvas', { position: { x: 100, y: 60 } });
check('life: click paints a cell', (await text('#life small')).includes('1 cells alive'));

// ── benchmark (JS vs F# → WasmGC) ──────────────────────────────────────────────────────────────────
await page.click('#run-bench');
await page.waitForFunction(() => window.__benchDone === true, null, { timeout: 120000 });
const rows = await page.locator('#bench-rows tr').allTextContents();
check('bench: 4 workloads', rows.length === 4, rows.join(' / '));
check('bench: F# and JS agree on every result', rows.every((r) => r.includes('✓')), rows.join(' / '));
console.log(rows.map((r) => '    ' + r).join('\n'));

check('no page errors', errors.filter((e) => !ignorable(e)).length === 0, errors.join(' | '));

await browser.close(); server.close();
process.exit(failed ? 1 : 0);
