// End-to-end: the pointer events of runtime/events.js, without a compiled module.   node tests/e2e/events.mjs
// A render builds a fresh element for each node of the view and dom.js merges it into the live one (`adoptHandlers`), so a handler must act on the element
// the event came to, not on the one it was built for: the press has to capture the pointer on the live element, and the moves outside it must still arrive.
import { fileURLToPath } from 'node:url';
import { serve, launch, checker } from './lib.mjs';

const { server, base } = await serve(fileURLToPath(new URL('../..', import.meta.url)));
const { check, failures } = checker();
const { browser, page, errors } = await launch();
await page.goto(`${base}/tests/e2e/events.html`);

await page.evaluate(async () => {
  const { save } = await import('/runtime/core.js');
  const { onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onKeyDown, swallowClick, adoptHandlers } = await import('/runtime/events.js');
  const live = document.createElement('button');
  live.id = 'handle'; live.textContent = 'drag';
  live.style.cssText = 'position:fixed;left:20px;top:20px;width:60px;height:30px';
  document.body.append(live);
  window.log = [];
  window.clicks = 0;
  window.swallow = false;                                       // what the page decides on release: was it a drag
  live.addEventListener('click', () => window.clicks++);
  const log = (kind) => (x, y) => window.log.push(`${kind} ${Math.round(x ?? 0)} ${Math.round(y ?? 0)}`);
  // what a render does: build the element of the view with its handlers, merge it into the live one
  const render = () => {
    const next = document.createElement('button');
    const id = save(next);
    onPointerDown(id, log('down')); onPointerMove(id, log('move')); onPointerUp(id, (x, y) => { log('up')(x, y); if (window.swallow) swallowClick(); }); onPointerCancel(id, () => window.log.push('cancel'));
    onKeyDown(id, (key) => window.log.push(`key ${key}`));
    adoptHandlers(live, next);
  };
  render(); render();                                            // the second render replaces the first one's handlers on the same element
});

await page.mouse.move(40, 35);
await page.mouse.down();
await page.mouse.move(300, 300, { steps: 4 });                   // far outside the element: only a captured pointer still reports
await page.mouse.up();
const log = await page.evaluate(() => window.log);
check('a press on a kept element does not throw (it captures the pointer on the live element)', errors.length === 0, errors.join(' | '));
check('the press is delivered with the viewport position', log.includes('down 40 35'), log.join(', '));
check('the moves outside the element arrive (the pointer is captured)', log.filter((l) => l.startsWith('move') && l.endsWith('300')).length >= 1, log.join(', '));
check('the release arrives where the pointer is', log.at(-1) === 'up 300 300', log.join(', '));
check('the press focuses the element, so that a key comes to it', await page.evaluate(() => document.activeElement?.id === 'handle'));
await page.keyboard.press('Escape');
check('a key is delivered with its name', (await page.evaluate(() => window.log)).at(-1) === 'key Escape');

// the browser clicks a captured element after a drag (measured: 1 click for the drag above); a page that took the sequence as a drag swallows it, and only that one
check('a drag ends in a click on the captured element, unless the page swallows it', await page.evaluate(() => window.clicks) === 1);
await page.evaluate(() => { window.swallow = true; });
await page.mouse.move(40, 35); await page.mouse.down(); await page.mouse.move(300, 300, { steps: 4 }); await page.mouse.up();
check('the click after a drag is swallowed when the page says so', await page.evaluate(() => window.clicks) === 1);
await page.evaluate(() => { window.swallow = false; });
await page.mouse.move(40, 35); await page.mouse.down(); await page.mouse.up();
check('and only that one: the next click comes through', await page.evaluate(() => window.clicks) === 2);
await page.mouse.move(40, 35); await page.keyboard.press('Space');
check('a key press on the element still clicks it', await page.evaluate(() => window.clicks) === 3);

await browser.close(); server.close();
console.log(failures() ? `\n${failures()} check(s) failed` : '\nevents: all checks passed');
process.exit(failures() ? 1 : 0);
