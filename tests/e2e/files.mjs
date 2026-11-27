// End-to-end: runtime/files.js hands a text to the person as a file.   node tests/e2e/files.mjs
// What a module's Browser.Files.download does: the file has the name that was given and the text that was given, as UTF-8; no page error follows.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { serve, launch, checker } from './lib.mjs';

const { server, base } = await serve(fileURLToPath(new URL('../..', import.meta.url)));
const { check, failures } = checker();
const { browser, page, errors } = await launch();
await page.goto(`${base}/tests/e2e/keys.html`);        // a page with nothing on it

const save = async (fileName, mimeType, text) => {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.evaluate(async ([f, m, t]) => (await import('/runtime/files.js')).download(f, m, t), [fileName, mimeType, text]),
  ]);
  return { name: download.suggestedFilename(), text: readFileSync(await download.path(), 'utf8') };
};

const html = '<!doctype html>\n<p>Grüße, € — "quoted" & <b>bold</b></p>\n';
const a = await save('newsletter-email.html', 'text/html', html);
check('the file has the name that was given', a.name === 'newsletter-email.html', a.name);
check('and the text that was given, with non-ASCII characters as UTF-8', a.text === html, JSON.stringify(a.text));
const b = await save('notes.txt', '', 'two\nlines');
check('an empty mime type is text/plain: the file is saved all the same', b.name === 'notes.txt' && b.text === 'two\nlines', JSON.stringify(b));
const c = await save('empty.json', 'application/json', '');
check('an empty text is an empty file', c.name === 'empty.json' && c.text === '', JSON.stringify(c));
check('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));

await browser.close();
server.close();
const failed = failures();
console.log(failed ? `\n${failed} check(s) failed` : '\nall file checks passed');
process.exit(failed ? 1 : 0);
