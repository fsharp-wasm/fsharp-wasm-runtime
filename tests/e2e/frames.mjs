// End-to-end: messages between the page and a sandboxed iframe (runtime/events.js), without a compiled module.   node tests/e2e/frames.mjs
// The iframe of a preview runs with `sandbox="allow-scripts"`: no access to the page, only postMessage.  The page hears it as JSON text, from that frame only
// (a message of any other window is not the frame's), finds the frame at the moment of each message (a render may have replaced it) and can answer it.
import { fileURLToPath } from 'node:url';
import { serve, launch, checker } from './lib.mjs';

const { server, base } = await serve(fileURLToPath(new URL('../..', import.meta.url)));
const { check, failures } = checker();
const { browser, page, errors } = await launch();
await page.goto(`${base}/tests/e2e/events.html`);

await page.evaluate(async () => {
  const { onFrameMessage, postToFrame } = await import('/runtime/events.js');
  window.heard = [];
  onFrameMessage('iframe.preview', (json) => window.heard.push(json));
  window.postToFrame = postToFrame;
  window.makeFrame = (name) => {
    document.querySelector('iframe.preview')?.remove();
    const f = document.createElement('iframe');
    f.className = 'preview'; f.setAttribute('sandbox', 'allow-scripts');
    // says hello with its name, echoes what it is sent
    f.srcdoc = `<script>parent.postMessage({hello:'${name}',n:1},'*');addEventListener('message',function(e){parent.postMessage({echo:e.data},'*')})<\/script>`;
    document.body.append(f);
  };
  window.makeFrame('first');
});
const heard = () => page.evaluate(() => window.heard);
const until = async (read, ms = 4000) => { const end = Date.now() + ms; for (;;) { if (await read()) return true; if (Date.now() > end) return false; await page.waitForTimeout(50); } };

check('a message of the frame arrives as JSON text', await until(async () => (await heard()).includes('{"hello":"first","n":1}')), (await heard()).join(' | '));
await page.evaluate(() => window.postMessage({ fake: true }, '*'));
await page.evaluate(() => window.postToFrame('iframe.preview', JSON.stringify({ scroll: 120, name: 'a "quote"' })));
check('the page can post to the frame, and what it sent is what the frame got', await until(async () => (await heard()).includes('{"echo":{"scroll":120,"name":"a \\"quote\\""}}')), (await heard()).join(' | '));
check('a message of the page itself, or of another window, is not the frame\'s', !(await heard()).some((m) => m.includes('fake')));
await page.evaluate(() => window.makeFrame('second'));
check('a frame that replaced the first is heard too (looked up at each message)', await until(async () => (await heard()).includes('{"hello":"second","n":1}')), (await heard()).join(' | '));
check('posting with no such frame does nothing', await page.evaluate(() => { window.postToFrame('iframe.none', '{"x":1}'); return true; }));
check('no error in the page', errors.length === 0, errors.join(' | '));

await browser.close(); server.close();
console.log(failures() ? `\n${failures()} check(s) failed` : '\nframes: all checks passed');
process.exit(failures() ? 1 : 0);
