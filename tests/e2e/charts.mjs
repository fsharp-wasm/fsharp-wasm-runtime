// End-to-end: the chart demo (fsharp-wasm-graphics, FSharp.Graphics.Charts) in a real Chromium.
//   E2E_ROOT=site node tests/e2e/charts.mjs       (or after `node build/build.js`: dist/)
// What is judged: that the four charts draw, that zoom keeps the point under the pointer and a drag moves the data by the distance of the pointer, that a spike one sample wide among ten million is
// still on the screen at the widest zoom (the point of the pyramid), that a stream grows, and the numbers of the benchmark (the pyramid against reading every sample).
import { serve, launch, checker } from './lib.mjs';

const { server, base } = await serve();
const { check, failures } = checker();
const { browser, page, errors } = await launch();
await page.setViewportSize({ width: 1280, height: 1400 });          // the whole chart is in the viewport also where the page's stylesheet makes the header taller (CI)
await page.goto(`${base}/demos/charts/`);
await page.waitForFunction(() => /Loaded/.test(document.getElementById('status')?.textContent ?? ''), null, { timeout: 90000 });

const canvas = page.locator('#gfx');
const box = async () => (await canvas.boundingBox());
const viewText = () => page.textContent('#view');
/** The numbers of the two ends of what is in view: "showing 0 to 10 000 000", "from 0.00 to 3.00 seconds". */
const range = async () => {
  const m = (await viewText()).replace(/ /g, '').match(/showing (-?[\d.]+)(?: seconds)? to (-?[\d.]+)/) ?? (await viewText()).replace(/ /g, '').match(/(-?[\d.]+) to (-?[\d.]+) seconds/);
  return m ? [Number(m[1]), Number(m[2])] : [NaN, NaN];
};
const settle = (ms = 220) => page.waitForTimeout(ms);
/** Pixels of the canvas: a hash, the number of colours, and how many pixels are near a colour. */
const look = (near) => page.evaluate((near) => {
  const c = document.getElementById('gfx');
  const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
  let h = 0, hits = 0; const colours = new Set();
  for (let i = 0; i < d.length; i += 4) {
    h = (Math.imul(h, 31) + d[i] + (d[i + 1] << 8) + (d[i + 2] << 16)) | 0;
    if (i % 52 === 0) colours.add((d[i] << 16) | (d[i + 1] << 8) | d[i + 2]);
    if (near && Math.abs(d[i] - near[0]) < 14 && Math.abs(d[i + 1] - near[1]) < 14 && Math.abs(d[i + 2] - near[2]) < 14) hits++;
  }
  return { hash: h, colours: colours.size, hits, ratio: c.width / c.getBoundingClientRect().width };
}, near);
/** The topmost pixel of a colour in the canvas column at CSS x (null when there is none). */
const topOf = (x, near) => page.evaluate(([x, near]) => {
  const c = document.getElementById('gfx');
  const r = c.width / c.getBoundingClientRect().width;
  const px = Math.round(x * r);
  const d = c.getContext('2d').getImageData(px, 0, 1, c.height).data;
  for (let y = 0; y < c.height; y++) {
    const i = y * 4;
    if (Math.abs(d[i] - near[0]) < 14 && Math.abs(d[i + 1] - near[1]) < 14 && Math.abs(d[i + 2] - near[2]) < 14) return y / r;
  }
  return null;
}, [x, near]);
const BLUE = [0x3b, 0x82, 0xf6];
const LEFT = 76, RIGHT = 20, TOP = 62, BOTTOM = 36;           // the margins of the plot, as the module sets them
const plot = async () => { const b = await box(); return { x: b.x + LEFT, y: b.y + TOP, w: b.width - LEFT - RIGHT, h: b.height - TOP - BOTTOM }; };
const num = (t) => Number(String(t).replace(/ /g, '').replace(/,/g, ''));

// ── the tabs ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
const tabs = page.locator('#charts button');
check('the module announces four charts', (await tabs.count()) === 4 && (await tabs.allTextContents()).join('|') === 'Ten million samples|A stream|Five million points|Two hundred thousand candles', (await tabs.allTextContents()).join('|'));
check('the first is selected and says what making the data cost', (await tabs.first().getAttribute('aria-selected')) === 'true' && /10 000 000 samples made in [\d.]+ ms, pyramid built in [\d.]+ ms/.test(await page.textContent('#info')), await page.textContent('#info'));
console.log(`  (${await page.textContent('#info')})`);

// ── the line of ten million samples ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
await settle(400);
const full = await look(BLUE);
check('the line is drawn: a band of the series colour and more than a handful of colours', full.hits > 800 && full.colours > 8, JSON.stringify(full));
check('it shows all of the samples', /showing 0 to 10 000 000 \(10 000 samples per pixel\)/.test(await viewText()) || /showing 0 to 10 000 000/.test(await viewText()), await viewText());
let p = await plot();
// the spike one sample wide at sample 1 000 003 is among 10 000 samples of every pixel: it must still stand out of the band
const xs = LEFT + (1000003 / 1e7) * p.w;                      // in the canvas, not the page
const here = await topOf(xs, BLUE), left = await topOf(xs - 60, BLUE), right = await topOf(xs + 60, BLUE);
check('the spike one sample wide stands out of the band at the widest zoom', here !== null && left !== null && right !== null && here < Math.min(left, right) - 25, `${here} against ${left} and ${right}`);
// zoom about a point: the data under the pointer stays under it
const [a0, b0] = await range();
const at = 0.3;                                               // a third of the way from the left edge of the plot
await page.mouse.move(p.x + at * p.w, p.y + p.h / 2);
const anchor = a0 + at * (b0 - a0);
await page.mouse.wheel(0, -500);                              // five notches in: 0.8 ** 5 = 0.328
await settle();
const [a1, b1] = await range();
check('the wheel zooms in: five notches leave a third of the span', Math.abs((b1 - a1) / (b0 - a0) - 0.328) < 0.02, `${(b1 - a1) / (b0 - a0)}`);
check('and the value under the pointer stays under it', Math.abs((anchor - a1) / (b1 - a1) - at) < 0.01, `${(anchor - a1) / (b1 - a1)}`);
// a drag moves the data by the distance of the pointer
await page.mouse.move(p.x + 300, p.y + 100); await page.mouse.down(); await page.mouse.move(p.x + 100, p.y + 100, { steps: 8 }); await page.mouse.up();
await settle();
const [a2, b2] = await range();
const expected = 200 * (b1 - a1) / p.w;
check('a drag of 200 px to the left moves the data by 200 pixels of it', Math.abs((a2 - a1) - expected) < expected * 0.06 && Math.abs((b2 - b1) - expected) < expected * 0.06, `${a2 - a1} against ${expected}`);
// hover: the crosshair and its card change the picture, and the line stays
const before = await look(BLUE);
await page.mouse.move(p.x + p.w / 2, p.y + p.h / 2); await settle();
const hovered = await look(BLUE);
check('the pointer over the plot draws the crosshair', hovered.hash !== before.hash && hovered.hits > 100, JSON.stringify([before.hits, hovered.hits]));
// zoomed in until the samples are pixels apart: a ribbon through them, still drawn
for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, -1000); await page.waitForTimeout(40); }
await settle();
const deep = await look(BLUE);
check('far in, the line is still drawn (a ribbon through the samples)', deep.hits > 300, JSON.stringify(deep) + ' ' + await viewText());
await canvas.focus();
await page.keyboard.press('Home'); await settle();
const [a3, b3] = await range();
check('Home shows everything again', a3 === 0 && b3 === 1e7, `${a3} ${b3}`);
await page.keyboard.press('ArrowUp'); await settle();
const [a4, b4] = await range();
check('ArrowUp zooms in about the middle', Math.abs((b4 - a4) / 1e7 - 0.8) < 0.01, `${(b4 - a4) / 1e7}`);
await page.keyboard.press('Home');

// ── a stream ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
await tabs.nth(1).click();
await page.waitForFunction(() => document.querySelector('#charts button[aria-selected="true"]')?.textContent === 'A stream', null, { timeout: 30000 });
await settle(500);
const count1 = num(((await viewText()).match(/series, ([\d ]+) samples/) ?? [])[1]);
await page.waitForTimeout(1500);
const count2 = num(((await viewText()).match(/series, ([\d ]+) samples/) ?? [])[1]);
check('the stream grows while it is shown (about 100 000 a second)', count2 - count1 > 80000 && count2 - count1 < 400000, `${count1} -> ${count2}`);
const [s0, s1] = await range();
await page.waitForTimeout(600);
const [t0, t1] = await range();
check('and the view follows its end', t1 > s1 && Math.abs((t1 - t0) - (s1 - s0)) < 0.01, `${s0}..${s1} -> ${t0}..${t1}`);
const stream = await look(null);
check('both series are drawn', stream.colours > 10, JSON.stringify(stream));
p = await plot();
await page.mouse.move(p.x + p.w / 2, p.y + p.h / 2); await page.mouse.down(); await page.mouse.move(p.x + p.w / 2 + 160, p.y + p.h / 2, { steps: 6 }); await page.mouse.up();
await page.waitForTimeout(300);
const [u0, u1] = await range();
await page.waitForTimeout(700);
const [v0, v1] = await range();
check('a drag stops following: the view stays where it is put', Math.abs(v0 - u0) < 0.005 && Math.abs(v1 - u1) < 0.005, `${u0}..${u1} -> ${v0}..${v1}`);
await canvas.focus(); await page.keyboard.press('End'); await page.waitForTimeout(500);
const [w0, w1] = await range();
check('End follows it again', w1 > v1 + 0.5, `${v1} -> ${w1}`);
check('the page shows how long a frame takes', Number(await page.textContent('#frame-ms')) > 0, await page.textContent('#frame-ms'));
console.log(`  (the stream: a frame takes ${await page.textContent('#frame-ms')} ms, 95th percentile ${await page.textContent('#frame-p95')} ms)`);

// ── five million points ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
await tabs.nth(2).click();
await page.waitForFunction(() => document.querySelector('#charts button[aria-selected="true"]')?.textContent === 'Five million points', null, { timeout: 60000 });
await settle(500);
check('the density map says what making five million points cost', /5 000 000 points made in [\d.]+ ms, grid built in [\d.]+ ms/.test(await page.textContent('#info')), await page.textContent('#info'));
console.log(`  (${await page.textContent('#info')})`);
const map0 = await look(null);
check('the map is drawn in many colours', map0.colours > 14, JSON.stringify(map0));
p = await plot();
await page.mouse.move(p.x + p.w * 0.4, p.y + p.h * 0.5); await page.mouse.wheel(0, -400); await settle();
const map1 = await look(null);
check('zooming into the map changes the picture', map1.hash !== map0.hash && map1.colours > 14, JSON.stringify(map1));
check('and says what is in view', /showing x from -?[\d.]+ to -?[\d.]+ and y from/.test(await viewText()), await viewText());
console.log(`  (the map: a frame takes ${await page.textContent('#frame-ms')} ms)`);

// ── candles ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
await tabs.nth(3).click();
await page.waitForFunction(() => document.querySelector('#charts button[aria-selected="true"]')?.textContent === 'Two hundred thousand candles', null, { timeout: 60000 });
await settle(500);
const GREEN = [0x22, 0xc5, 0x5e], RED = [0xef, 0x44, 0x44];
const c0 = await look(GREEN);
const c0r = await look(RED);
check('200 000 candles in 1100 pixels are drawn, up and down', c0.hits > 300 && c0r.hits > 300, `${c0.hits} ${c0r.hits}`);
p = await plot();
await page.mouse.move(p.x + p.w * 0.5, p.y + p.h * 0.5); await page.mouse.wheel(0, -3600); await settle();                // 36 notches: 200 000 bars * 0.8 ** 36 = 64
const [d0, d1] = await range();
check('zoomed in to a few dozen bars', d1 - d0 < 120 && d1 - d0 > 20, `${d0}..${d1}`);
console.log(`  (${Math.round(d1 - d0)} bars in view)`);
const c1 = await look(GREEN);
check('each bar is its own candle', c1.hits > 300, JSON.stringify(c1));

// ── the benchmark ──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
await page.evaluate(() => { document.getElementById('bench').open = true; });
await page.click('#bench-run');
await page.waitForFunction(() => window.__bench && (window.__bench.heat !== undefined || window.__bench.error), null, { timeout: 240000 });
const bench = await page.evaluate(() => window.__bench);
check('the benchmark ran without an error', !bench.error, bench.error);
check('the pyramid and a pass over every sample find the same columns, exactly', bench.agree === 0, String(bench.agree));
const c1000 = bench.columns1000;
check('a frame of the line is found at least 50 times faster than by reading ten million samples', c1000.naive / c1000.pyramid > 50, `${c1000.pyramid * 1000} µs against ${c1000.naive} ms`);
check('the scene of the line is built in well under a frame', bench.scene < 8, `${bench.scene} ms`);
check('the density map is some thousands of rectangles, not the 20 000 cells of 3 pixels of its plot', bench.shapes > 100 && bench.shapes < 20000, String(bench.shapes));
console.log(`  pyramid build: 1M ${bench.build1000000.toFixed(1)} ms, 10M ${bench.build10000000.toFixed(1)} ms; append 1M ${bench.append.toFixed(1)} ms`);
console.log(`  one frame of 1000 columns over 10M samples: pyramid ${(c1000.pyramid * 1000).toFixed(0)} µs, every sample ${c1000.naive.toFixed(1)} ms (${Math.round(c1000.naive / c1000.pyramid)}x)`);
console.log(`  scene of the line ${(bench.scene * 1000).toFixed(0)} µs; density grid of 5M points ${bench.grid.toFixed(1)} ms; its scene ${bench.heat.toFixed(2)} ms (${bench.shapes} rectangles)`);

check('no page errors', errors.filter((e) => !/WebGPU|ERR_/.test(e)).length === 0, JSON.stringify(errors).slice(0, 400));
await browser.close();
server.close();
if (failures() > 0) { console.log(`\n${failures()} failed`); process.exit(1); }
