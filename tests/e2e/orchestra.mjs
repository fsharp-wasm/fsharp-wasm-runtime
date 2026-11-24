// End-to-end: the actor orchestra (demos/actor-orchestra): a pool of four Web Workers under a supervisor, driven by an F# orchestrator.
//   node build/build.js --demo actor-orchestra && node tests/e2e/orchestra.mjs      (E2E_ROOT=site: test the committed site instead of dist/)
// One worker is killed from outside and one crashes by itself while the run is under way.  The supervisor starts both again, the jobs of their mailboxes
// go to the others, and the total of the run is exactly that of the same chunks computed in order: a chunk counted twice or not at all would change it.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { serve, launch, checker } from './lib.mjs';

const root = fileURLToPath(new URL(`../../${process.env.E2E_ROOT ?? 'dist'}`, import.meta.url));
const CHUNKS = 48, SAMPLES = 40_000_000, SEED = 7919;                // the constants of ActorOrchestra.fs

/** The same chunks in order, in this process, with the kernel of the module itself. */
const expected = async () => {
  const mod = await WebAssembly.compile(await readFile(`${root}/demos/actor-orchestra/ActorOrchestra.wasm`), { builtins: ['js-string'] });
  const stub = {};
  for (const { module, name, kind } of WebAssembly.Module.imports(mod)) if (module !== 'wasm:js-string' && kind === 'function') (stub[module] ??= {})[name] = () => 0;
  const { exports } = await WebAssembly.instantiate(mod, stub);
  let hits = 0;
  for (let i = 1; i <= CHUNKS; i++) hits += exports.piHits(i * SEED, SAMPLES);
  return hits;
};

const { server, base } = await serve(root);
const { check, failures } = checker();
const { browser, page, errors } = await launch();
const rows = () => page.locator('tr.worker');
const column = async (n) => (await rows().locator(`td:nth-child(${n})`).allTextContents());
const sum = async (n) => (await column(n)).reduce((a, b) => a + Number(b), 0);

try {
  await page.goto(`${base}/demos/actor-orchestra/`);
  await page.waitForFunction(() => document.querySelectorAll('tr.worker.ready').length === 4, null, { timeout: 20000 });
  check('four workers come up, each a process of its own', (await rows().count()) === 4);

  await page.click('button.run');
  await page.waitForFunction(() => [...document.querySelectorAll('tr.worker td:nth-child(4)')].reduce((a, td) => a + Number(td.textContent), 0) >= 4, null, { timeout: 20000 });
  await rows().nth(0).locator('button.kill').click();                   // from outside: the host ends the worker
  await rows().nth(1).locator('button.crash').click();                  // from inside: the worker says it fails and ends itself
  check('a run is under way when they go', !(await page.textContent('.orchestra')).includes('All 48 chunks'));

  await page.waitForFunction(() => /All 48 chunks are done/.test(document.querySelector('.orchestra').textContent), null, { timeout: 90000 });
  const text = await page.textContent('.orchestra');
  check('every chunk has its result', /All 48 chunks are done in [\d.]+ s/.test(text), text.slice(0, 200));
  check('both exits were seen and answered with a restart', (await sum(5)) >= 2 && (text.match(/started again/g) ?? []).length >= 2, `restarts ${await sum(5)}`);
  check('all four workers are ready again', (await page.locator('tr.worker.ready').count()) === 4);

  const [, hits, points] = text.match(/(\d+) of (\d+) points inside/) ?? [];
  const want = await expected();
  check('the total is that of the same chunks in order: each one counted exactly once', Number(hits) === want && Number(points) === CHUNKS * SAMPLES, `${hits} of ${points}, want ${want}`);
  const pi = Number(text.match(/pi is about ([\d.]+)/)?.[1]);
  check('and it estimates pi', Math.abs(pi - Math.PI) < 1e-3, String(pi));

  // again, with every worker up and nothing killed: the same chunks, the same total
  await page.click('button.run');
  check('Run is not offered while a run is under way', await page.locator('button.run').isDisabled());
  await page.waitForFunction(() => document.querySelector('button.run').disabled === false && /All 48 chunks are done/.test(document.querySelector('.orchestra').textContent), null, { timeout: 90000 });
  const again = (await page.textContent('.orchestra')).match(/(\d+) of \d+ points inside/)?.[1];
  check('a second run gives the same total', Number(again) === want, `${again}, want ${want}`);
} catch (e) {
  check('ran to the end', false, String(e.message).split('\n')[0]);
}
check('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));
await browser.close();
server.close();
process.exit(failures() ? 1 : 0);
