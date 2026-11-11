// End-to-end: every demo, compiled from F# to WasmGC, runs in a real Chromium and does what its source says.
//   node build/build.js && node tests/e2e/demos.mjs [demo …]      (E2E_ROOT=site: test the committed site instead of dist/)
import { serve, launch, checker } from './lib.mjs';

const { server, base } = await serve();
const { check, failures } = checker();
const only = process.argv.slice(2);

/** One demo = one page: run `body(page, t)` against it and assert that nothing threw. */
const demo = async (name, body) => {
  if (only.length && !only.includes(name)) return;
  console.log(`\n── ${name}`);
  const { browser, page, errors } = await launch();
  try {
    await page.goto(`${base}/demos/${name}/`);
    await page.waitForFunction(() => /Loaded|loaded/.test(document.getElementById('status')?.textContent ?? ''), null, { timeout: 15000 });
    await body(page);
  } catch (e) {
    check(`${name}: ran to the end`, false, String(e.message).split('\n')[0]);
  }
  check(`${name}: no page errors`, errors.filter((e) => !/WebGPU|ERR_/.test(e)).length === 0, JSON.stringify(errors).slice(0, 300));
  await browser.close();
};
const text = (page, sel) => page.textContent(sel);

await demo('counter', async (page) => {
  const n = () => text(page, '.count-display');
  check('starts at 0', (await n()) === '0');
  await page.click('button:has-text("+")');
  await page.click('button:has-text("+")');
  check('two + → 2', (await n()) === '2');
  await page.click('button:has-text("−")');
  check('− → 1', (await n()) === '1');
  await page.click('button:has-text("Reset")');
  check('Reset → 0', (await n()) === '0');
});

await demo('todo', async (page) => {
  const hint = () => text(page, '.hint');
  check('starts empty', (await page.locator('li').count()) === 0 && (await hint()) === '0 of 0 completed');
  await page.fill('input[placeholder]', 'Buy milk');
  await page.click('button:has-text("Add")');
  check('item added', (await page.locator('li').count()) === 1 && (await text(page, 'li span')).includes('Buy milk'));
  check('input cleared', (await page.inputValue('input[placeholder]')) === '');
  await page.fill('input[placeholder]', 'Write docs');
  await page.press('input[placeholder]', 'Enter').catch(() => {});
  await page.click('button:has-text("Add")');
  check('second item', (await page.locator('li').count()) === 2);
  await page.click('li:first-child span');
  check('toggle → done', (await hint()) === '1 of 2 completed' && (await page.getAttribute('li:first-child', 'class')) === 'done');
  await page.click('li:last-child button');
  check('remove', (await page.locator('li').count()) === 1);
  await page.fill('input[placeholder]', '   ');
  await page.click('button:has-text("Add")');
  check('blank input is ignored', (await page.locator('li').count()) === 1);
});

await demo('canvas-mandelbrot', async (page) => {
  await page.click('#render-btn');
  await page.waitForFunction(() => document.getElementById('timing')?.textContent.length > 0, null, { timeout: 15000 });
  const timing = await text(page, '#timing');
  check('timing reported', /ms/.test(timing), timing);
  const painted = (id) => page.evaluate((id) => {
    const c = document.getElementById(id);
    const data = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    const colours = new Set();
    for (let i = 0; i < data.length; i += 4 * 97) colours.add(data[i] + ',' + data[i + 1] + ',' + data[i + 2]);
    return colours.size;
  }, id);
  check('F# → WasmGC canvas is painted', (await painted('mandelbrot')) > 5);
  check('reference canvas is painted', (await painted('mandelbrot-js')) > 5);
  // both renderers must produce the same picture
  const same = await page.evaluate(() => {
    const px = (id) => { const c = document.getElementById(id); return c.getContext('2d').getImageData(0, 0, c.width, c.height).data; };
    const a = px('mandelbrot'), b = px('mandelbrot-js');
    let diff = 0; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) diff++;
    return { diff, len: a.length };
  });
  check('both renderers draw the same picture', same.diff === 0, `${same.diff} of ${same.len} channel values differ`);
});

await demo('web-component', async (page) => {
  const counters = page.locator('fs-counter');
  check('three instances', (await counters.count()) === 3);
  await counters.nth(0).locator('button:has-text("+")').click();
  await counters.nth(0).locator('button:has-text("+")').click();
  await counters.nth(1).locator('button:has-text("−")').click();
  const values = await counters.evaluateAll((els) => els.map((e) => e.querySelector('span').textContent));
  check('instances count independently', values.join() === '2,-1,0', values.join());
});

await demo('realtime-pubsub', async (page) => {
  await page.fill('input[placeholder]', 'hello bus');
  await page.click('button:has-text("Send")');
  await page.waitForSelector('li');
  check('message published and received', (await text(page, 'li')).includes('hello bus'), await text(page, 'ul'));
});

await demo('indexeddb-crud', async (page) => {
  const msg = () => page.locator('section > p').textContent();
  await page.fill('input[placeholder="Key"]', 'answer');
  await page.fill('input[placeholder="Value"]', '42');
  await page.click('button:has-text("Save")');
  await page.waitForTimeout(300);
  await page.click('button:has-text("Load")');
  await page.waitForFunction(() => document.querySelector('section > p')?.textContent.includes('42'), null, { timeout: 5000 }).catch(() => {});
  check('saved value is loaded back', (await msg()).includes('42'), await msg());
  await page.click('button:has-text("List Keys")');
  await page.waitForFunction(() => document.querySelectorAll('li').length > 0, null, { timeout: 5000 }).catch(() => {});
  check('keys are listed', (await page.locator('li').allTextContents()).join().includes('answer'), (await page.locator('ul').textContent()));
  await page.click('button:has-text("Delete")');
  await page.waitForTimeout(300);
  await page.click('button:has-text("List Keys")');
  await page.waitForTimeout(300);
  check('deleted key is gone', !(await page.locator('li').allTextContents()).join().includes('answer'));
});

await demo('worker-actor', async (page) => {
  check('idle', (await text(page, 'section > p')).includes('Ready'));
  await page.fill('input[placeholder]', 'ping');
  await page.click('button:has-text("Send")');
  await page.waitForFunction(() => document.querySelectorAll('li').length > 0, null, { timeout: 5000 }).catch(() => {});
  check('worker answered', (await page.locator('li').count()) > 0, await text(page, 'section'));
});

await demo('webgpu-basic', async (page) => {
  await page.click('button:has-text("Check WebGPU")');
  await page.waitForTimeout(500);
  const status = await text(page, 'section > p');
  check('reports WebGPU availability', /WebGPU/i.test(status) && !/Checking/.test(status), status);
});

await demo('full-dashboard', async (page) => {
  const tab = (name) => page.click(`nav button:has-text("${name}")`);
  check('opens on Counter', (await text(page, '.count-display')) === '0');
  await page.click('button:has-text("+")');
  check('counter tab counts', (await text(page, '.count-display')) === '1');
  await tab('Todo');
  await page.fill('input[placeholder]', 'from the dashboard');
  await page.click('button:has-text("Add")');
  check('todo tab adds', (await page.locator('li').allTextContents()).join().includes('from the dashboard'));
  await tab('Pub/Sub');
  await page.fill('input[placeholder]', 'bus message');
  await page.click('button:has-text("Send")');
  check('pub/sub tab delivers', (await page.locator('li').allTextContents()).join().includes('bus message'));
  await tab('Storage');
  const inputs = page.locator('input');
  await inputs.nth(0).fill('k');
  await inputs.nth(1).fill('v');
  await page.click('button:has-text("Save")');
  await page.click('button:has-text("Load")');
  check('storage tab round-trips', (await text(page, '#dashboard-root')).includes('Loaded: k = v'));
  await tab('Counter');
  check('state survives tab switches', (await text(page, '.count-display')) === '1');
});

server.close();
const failed = failures();
console.log(failed ? `\n${failed} check(s) failed` : '\nall e2e checks passed');
process.exit(failed ? 1 : 0);
