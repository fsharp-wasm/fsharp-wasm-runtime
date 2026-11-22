// End-to-end: the requests of runtime/net.js, without a compiled module.   node tests/e2e/net.mjs
// A module cannot wait for a promise, so every answer is a callback: the status and the text of the body, and a status of 0 when nothing came back
// at all (the network failed), so that a failure is a value the program can match on.
import { fileURLToPath } from 'node:url';
import { serve, launch, checker } from './lib.mjs';

const { server, base } = await serve(fileURLToPath(new URL('../..', import.meta.url)));
const { check, failures } = checker();
const { browser, page, errors } = await launch();
await page.goto(`${base}/tests/e2e/events.html`);

const seen = [];                                                // what reached the "server"
await page.route('**/api/**', async (route) => {
  const req = route.request(), url = new URL(req.url());
  seen.push({ method: req.method(), path: url.pathname + url.search, body: req.postData(), txn: req.headers()['x-transaction'], type: req.headers()['content-type'] });
  if (url.pathname === '/api/down') return route.abort();
  if (url.pathname === '/api/missing') return route.fulfill({ status: 404, body: 'no such todo' });
  if (url.pathname === '/api/text') return route.fulfill({ status: 200, body: 'ok' });
  return route.fulfill({ status: 201, contentType: 'application/json', body: '{"version":3,"todos":[{"id":1}]}' });
});

const run = (code) => page.evaluate(async (code) => {
  const net = await import('/runtime/net.js'), { get } = await import('/runtime/core.js');
  const call = (f) => new Promise((resolve) => f((...answer) => resolve(answer)));
  return await eval(`(async () => { ${code} })()`);
}, code);

let r = await run(`return await call((cb) => net.request("POST", "/api/todos", '{"text":"milk"}', "content-type: application/json\\nx-transaction: 7", cb))`);
check('a POST answers with its status and its body', r[0] === 201 && r[1].includes('"version":3'), JSON.stringify(r));
check('… and reached the server with its method, body and headers', seen[0]?.method === 'POST' && seen[0].body === '{"text":"milk"}' && seen[0].txn === '7' && seen[0].type === 'application/json', JSON.stringify(seen[0]));

r = await run(`return await call((cb) => net.request("DELETE", "/api/todos/1", "", "", cb))`);
check('a DELETE without a body', r[0] === 201 && seen[1].method === 'DELETE' && seen[1].body === null, JSON.stringify(seen[1]));

r = await run(`return await call((cb) => net.request("GET", "/api/patches?since=4", "ignored", "", cb))`);
check('a GET sends no body, whatever it was given', seen[2].method === 'GET' && seen[2].body === null && seen[2].path === '/api/patches?since=4', JSON.stringify(seen[2]));

r = await run(`return await call((cb) => net.request("GET", "/api/missing", "", "", cb))`);
check('an answer of the server that is an error is still an answer: its status and its body', r[0] === 404 && r[1] === 'no such todo', JSON.stringify(r));

r = await run(`return await call((cb) => net.request("GET", "/api/down", "", "", cb))`);
check('no answer at all is status 0 and an empty body', r[0] === 0 && r[1] === '', JSON.stringify(r));

r = await run(`return await call((cb) => net.fetchText("/api/text", cb))`);
check('fetchText gives the text', r[0] === 'ok', JSON.stringify(r));

r = await run(`const [h] = await call((cb) => net.fetchJson("/api/state", cb)); return [h, get(h)?.version]`);
check('fetchJson gives a handle to the parsed value', r[0] > 0 && r[1] === 3, JSON.stringify(r));

r = await run(`const [h] = await call((cb) => net.fetchJson("/api/text", cb)); return [h]`);
check('fetchJson gives the nil handle for a body that is not JSON', r[0] === 0, JSON.stringify(r));

r = await run(`return await call((cb) => net.postJson("/api/todos", '{"text":"x"}', cb))`);
check('postJson sends the JSON text as it is (not encoded a second time)', seen.at(-1).body === '{"text":"x"}' && seen.at(-1).type === 'application/json', JSON.stringify(seen.at(-1)));

check('no page errors', errors.every((e) => /net::ERR_FAILED|Failed to load resource/.test(e)), JSON.stringify(errors).slice(0, 300));
await browser.close();
server.close();
const failed = failures();
console.log(failed ? `\n${failed} check(s) failed` : '\nall e2e checks passed');
process.exit(failed ? 1 : 0);
