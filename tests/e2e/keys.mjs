// End-to-end: what runtime/gfx.js tells a module about the keyboard, without a compiled module.   node tests/e2e/keys.mjs
// A module that exports `onText` is told what a person types as text (the character, with the layout, Shift, Caps Lock and AltGr applied), and the other keys as keys;
// a module that does not gets every key as a key.  The events are the ones a browser makes: AltGr is Ctrl+Alt with the AltGraph state on Windows, Option is Alt on a Mac.
import { fileURLToPath } from 'node:url';
import { serve, launch, checker } from './lib.mjs';

const { server, base } = await serve(fileURLToPath(new URL('../..', import.meta.url)));
const { check, failures } = checker();
const { browser, page, errors } = await launch();
await page.goto(`${base}/tests/e2e/keys.html`);

const heard = await page.evaluate(async () => {
  const { mount, pendingKey } = await import('/runtime/gfx.js');
  const noop = () => {};
  // every run has a canvas of its own: what mount returns does not take the key listeners off
  let n = 0;
  const run = (withText, steps) => {
    const canvas = document.createElement('canvas');
    canvas.id = `gfx${n++}`; canvas.width = canvas.height = 100;
    document.body.append(canvas);
    const log = [];
    const exports = { onResize: noop, onPointer: noop, onWheel: noop, frame: noop, onKey: (kind) => log.push(`key${kind}:${pendingKey()}`) };
    if (withText) exports.onText = () => log.push(`text:${pendingKey()}`);
    const stop = mount({ exports }, canvas.id);
    const press = (init) => { canvas.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init })); };
    const release = (init) => { canvas.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, ...init })); };
    steps(press, release);
    stop();
    return log;
  };

  const withText = run(true, (press, release) => {
    press({ key: 'H', shiftKey: true });                                       // Shift or Caps Lock: the character
    press({ key: '.' }); press({ key: '?', shiftKey: true }); press({ key: '"', shiftKey: true });
    press({ key: 'ä' }); press({ key: 'ß' }); press({ key: 'é' }); press({ key: '€' });
    press({ key: '@', ctrlKey: true, altKey: true, modifierAltGraph: true });   // AltGr on Windows and Linux
    press({ key: '{', altKey: true });                                          // Option on a Mac
    press({ key: 'f', altKey: true });                                          // Alt+F: a shortcut of the browser, not an f
    press({ key: 'c', ctrlKey: true });                                         // Ctrl+C
    press({ key: 'c', metaKey: true });                                         // Cmd+C
    press({ key: 'c', ctrlKey: true, altKey: true });                           // Ctrl+Alt+C without AltGr: not text
    release({ key: 'H' });                                                      // a key up of text is not sent
    press({ key: ' ' }); press({ key: 'Backspace' }); press({ key: 'ArrowLeft' }); press({ key: 'Enter' });
    press({ key: 'Dead' });
    press({ key: 'z', ctrlKey: true });                                         // the editing shortcuts are the module's
  });
  const without = run(false, (press, release) => { press({ key: 'H' }); release({ key: 'H' }); press({ key: '.' }); });
  return { withText, without };
});

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
check('with onText: the characters are text, a key up of them is not sent, the other keys are keys',
  same(heard.withText, ['text:H', 'text:.', 'text:?', 'text:"', 'text:ä', 'text:ß', 'text:é', 'text:€', 'text:@', 'text:{',
                        'key0: ', 'key0:Backspace', 'key0:ArrowLeft', 'key0:Enter', 'key0:Dead', 'key0:Undo']),
  JSON.stringify(heard.withText));
check('Alt+F, Ctrl+C, Cmd+C and Ctrl+Alt+C (no AltGr) are the browser\'s: nothing is sent',
  !heard.withText.some((s) => /f$|c$|C$/.test(s)));
check('without onText every key is a key, as before', same(heard.without, ['key0:H', 'key1:H', 'key0:.']), JSON.stringify(heard.without));
check('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));

await browser.close();
server.close();
const failed = failures();
console.log(failed ? `\n${failed} check(s) failed` : '\nall key checks passed');
process.exit(failed ? 1 : 0);
