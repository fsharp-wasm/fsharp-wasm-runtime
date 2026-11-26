// End-to-end: WasmOS (demos/wasmos, the F# project lives in fsharp-wasm-embedded), a small desktop that is Windows, macOS, Android or a Linux desktop from one program.
//   node build/build.js --demo wasmos && node tests/e2e/wasmos.mjs      (E2E_ROOT=site: test the committed site instead of dist/)
import { serve, launch, checker } from './lib.mjs';

const { server, base } = await serve();
const { check, failures } = checker();
const { browser, page, errors } = await launch();
// tall enough for the whole screen under the page's header: where the stylesheet of the page is reachable (CI) the header is taller, the screen lies lower, and the mouse reaches only what is in the viewport
await page.setViewportSize({ width: 1280, height: 1500 });
await page.goto(`${base}/demos/wasmos/`);
await page.waitForSelector('.stage', { timeout: 20000 });

const stage = () => page.locator('.stage');
const win = (name) => page.locator('.win', { has: page.locator('.title', { hasText: name }) });
const box = (loc) => loc.boundingBox();
const skin = (name) => page.getByRole('button', { name, exact: true }).first().click().then(() => page.waitForTimeout(450));
// the icon on the desktop may be under a window: the click is the DOM's own, as a person's would be on the visible one
const openFromDesktop = (name) => page.locator('.dicon', { hasText: name }).evaluate((el) => el.click());
const near = (a, b, tolerance = 2) => Math.abs(a - b) <= tolerance;
const closeAll = async () => { while (await page.locator('.win').count()) await page.locator('.win .ctl.close').first().evaluate((el) => el.click()); };

// ── Windows ──
check('it starts as Windows: a taskbar at the bottom and no menu bar', (await stage().getAttribute('class')).includes('skin-windows') && (await page.locator('.launcher').boundingBox()).y > 400);
const { width: sw0, height: sh0 } = await box(stage());
check('the screen has the size the module states', near(sw0, 920) && near(sh0, 580), `${sw0}x${sh0}`);

await openFromDesktop('Notes');
await page.waitForSelector('.win');
check('an app opens in a window with a title bar and its controls', (await win('Notes').count()) === 1 && (await win('Notes').locator('.ctl').count()) === 3);
const textarea = win('Notes').locator('textarea');
await textarea.fill('one two three');
check('typing keeps the text and the app counts the words', (await textarea.inputValue()) === 'one two three' && (await win('Notes').locator('.foot').textContent()) === '3 words');
await openFromDesktop('Notes');
check('opening an app that is open does not open another window', (await page.locator('.win').count()) === 1);

// dragging the title: the window moves by the distance the pointer moved
const before = await box(win('Notes'));
const handle = await box(win('Notes').locator('.drag'));
await page.mouse.move(handle.x + 40, handle.y + 10); await page.mouse.down(); await page.mouse.move(handle.x + 140, handle.y + 70, { steps: 8 }); await page.mouse.up();
const after = await box(win('Notes'));
check('dragging the title bar moves the window by the distance of the pointer', near(after.x - before.x, 100) && near(after.y - before.y, 60), `${after.x - before.x}, ${after.y - before.y}`);
// resizing by the grip
const grip = await box(win('Notes').locator('.grip'));
await page.mouse.move(grip.x + 9, grip.y + 9); await page.mouse.down(); await page.mouse.move(grip.x + 59, grip.y + 49, { steps: 6 }); await page.mouse.up();
const resized = await box(win('Notes'));
check('dragging the grip resizes the window', near(resized.width - after.width, 50) && near(resized.height - after.height, 40), `${resized.width - after.width}, ${resized.height - after.height}`);
// the grip has moved with the window: look for it where it is now (and say what is under the pointer if the press does not land on it)
const grip2 = await box(win('Notes').locator('.grip'));
const gx = grip2.x + 9, gy = grip2.y + 9;
const under = await page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return e ? `${e.tagName}.${e.className}` : 'nothing'; }, [gx, gy]);
await page.mouse.move(gx - 6, gy - 6); await page.mouse.move(gx, gy); await page.mouse.down(); await page.mouse.move(2, 2, { steps: 6 }); await page.mouse.up();
const smallest = await box(win('Notes'));
check('a window is not made smaller than 240 by 160', near(smallest.width, 240) && near(smallest.height, 160), `${smallest.width}x${smallest.height}, pressed at ${Math.round(gx)},${Math.round(gy)} on ${under}, grip ${JSON.stringify(grip2)}, viewport ${JSON.stringify(page.viewportSize())}`);

// two windows: the one pressed comes to the front
await openFromDesktop('Todo');
check('the window opened last is in front', (await win('Todo').getAttribute('class')).includes('focused') && !(await win('Notes').getAttribute('class')).includes('focused'));
await win('Notes').locator('.title').evaluate((el) => el.click());
check('a press on a window brings it to the front', (await win('Notes').getAttribute('class')).includes('focused'));

// minimise, and the taskbar brings it back; maximise fills the desktop; close
await win('Notes').locator('.ctl.min').evaluate((el) => el.click());
check('minimise hides the window', (await win('Notes').getAttribute('class')).includes('min'));
await page.locator('.launcher .item', { hasText: 'Notes' }).click();
check('the taskbar brings a minimised window back', !(await win('Notes').getAttribute('class')).includes('min'));
await page.locator('.launcher .item', { hasText: 'Notes' }).click();
check('a press on the taskbar item of the window in front minimises it', (await win('Notes').getAttribute('class')).includes('min'));
await page.locator('.launcher .item', { hasText: 'Notes' }).click();
await win('Notes').locator('.ctl.max').click();
const desktop = await box(page.locator('.desktop')), maxed = await box(win('Notes'));
check('maximise fills the desktop', near(maxed.width, desktop.width) && near(maxed.height, desktop.height), `${maxed.width}x${maxed.height} in ${desktop.width}x${desktop.height}`);
await win('Notes').locator('.ctl.max').click();
await win('Notes').locator('.ctl.close').click();
check('close removes the window', (await win('Notes').count()) === 0 && (await page.locator('.win').count()) === 1);

// the start menu
await page.locator('.launcher .start').click();
check('the start menu opens with the apps', (await page.locator('.menu .tile').count()) === 5);
await page.locator('.menu .tile', { hasText: 'Primes' }).click();
check('an app chosen in the menu opens, and the menu closes', (await win('Primes').count()) === 1 && (await page.locator('.menu').count()) === 0);
await page.locator('.launcher .start').click();
await page.locator('.desktop').click({ position: { x: 20, y: 500 } });
check('a press on the desktop closes the menu', (await page.locator('.menu').count()) === 0);

// ── apps ──
const t0 = Date.now();
await win('Primes').getByRole('button', { name: '1000000', exact: true }).click();
check('Primes: 78 498 below a million, counted by the module, with its time', /78498\s*primes below 1000000, counted in [\d.]+ ms/.test(await win('Primes').locator('.result').innerText()));
await win('Primes').getByRole('button', { name: '10000000', exact: true }).click();
const ten = await win('Primes').locator('.result').innerText();
check('Primes: 664 579 below ten million', /664579\s*primes below 10000000/.test(ten), ten);
console.log(`  (ten million: ${ten.match(/in ([\d.]+) ms/)?.[1]} ms measured in the module, ${Date.now() - t0} ms for both clicks with the page)`);

await openFromDesktop('Todo');
const todo = win('Todo');
const items0 = await todo.locator('.todos li').count();
await todo.locator('input[type=text]').fill('call the compiler');
await todo.getByRole('button', { name: 'Add', exact: true }).click();
check('Todo: an item is added and the field is empty', (await todo.locator('.todos li').count()) === items0 + 1 && (await todo.locator('input[type=text]').inputValue()) === '');
await todo.locator('.todos li').last().locator('.check').click();
check('Todo: an item is marked done', (await todo.locator('.todos li').last().getAttribute('class')).includes('done'));
await todo.locator('.todos li').last().locator('.remove').click();
check('Todo: an item is removed', (await todo.locator('.todos li').count()) === items0);

await openFromDesktop('Task Manager');
const tasks = win('Task Manager');
check('Task Manager lists the open windows', (await tasks.locator('tbody tr').count()) === (await page.locator('.win').count()));
await tasks.getByRole('button', { name: 'End task Todo' }).click();
check('End task closes the window', (await win('Todo').count()) === 0);

// Settings: the system, the accent, the appearance
await openFromDesktop('Settings');
const settings = win('Settings');
await settings.getByRole('button', { name: '#8e44ad' }).click();
check('Settings: the accent is the screen\'s custom property', (await stage().getAttribute('style')).includes('--accent:#8e44ad'));
await settings.getByRole('button', { name: 'Light' }).click();
check('Settings: dark appearance', (await stage().getAttribute('class')).includes('dark'));
await settings.getByRole('button', { name: 'Dark' }).click();
await closeAll();

// ── macOS ──
await skin('macOS');
check('macOS: a menu bar on top and a dock', (await stage().getAttribute('class')).includes('skin-macos') && (await page.locator('.topbar').boundingBox()).height > 20 && /File\s+Edit\s+View/.test(await page.locator(".topbar").innerText()));
await openFromDesktop('Notes');
const lights = [await box(win('Notes').locator('.ctl.close')), await box(win('Notes').locator('.ctl.min')), await box(win('Notes').locator('.ctl.max'))];
check('macOS: the three lights are on the left, close first', lights[0].x < lights[1].x && lights[1].x < lights[2].x && lights[2].x < (await box(win('Notes').locator('.title'))).x);
check('macOS: the menu bar names the window in front', (await page.locator('.topbar strong').innerText()) === 'Notes');
const dock = await box(page.locator('.launcher')), stageBox = await box(stage());
check('macOS: the dock is centred at the bottom', near(dock.x + dock.width / 2, stageBox.x + stageBox.width / 2, 3) && dock.y > stageBox.y + stageBox.height - 90, JSON.stringify(dock));
await page.locator('.launcher .start').click();
check('macOS: Launchpad covers the screen', ((await box(page.locator('.menu'))).width > 800) && /Launchpad/.test(await page.locator('.menu h3').innerText()));
await page.locator('.menu .tile', { hasText: 'Todo' }).click();

// ── Android ──
await skin('Android');
const phone = await box(stage());
check('Android: the screen is a phone', near(phone.width, 390) && near(phone.height, 780), `${phone.width}x${phone.height}`);
check('Android: every window fills the screen and only the one in front is shown', (await page.locator('.win:visible').count()) === 1 && near((await box(page.locator('.win:visible'))).width, (await box(page.locator('.desktop'))).width));
check('Android: a status bar with the time, and a navigation bar', /\d\d:\d\d/.test(await page.locator('.topbar .clock').innerText()) && (await page.locator('.launcher .nav').count()) === 4);
await page.getByRole('button', { name: 'Home' }).click();
check('Android: Home puts every window away and shows the home screen', (await page.locator('.win:visible').count()) === 0 && (await page.locator('.dicon').first().isVisible()));
await page.getByRole('button', { name: 'All apps' }).click();
check('Android: the app drawer opens', (await page.locator('.menu .tile').count()) === 5);
await page.locator('.menu .tile', { hasText: 'Primes' }).click();
check('Android: an app from the drawer is in front', (await page.locator('.win:visible .title').innerText()) === 'Primes');
await page.getByRole('button', { name: 'Recent apps' }).click();
check('Android: Recents goes on to the window that has been behind longest', (await page.locator('.win:visible .title').innerText()) !== 'Primes');
const open = await page.locator('.win').count();
await page.getByRole('button', { name: 'Back' }).click();
check('Android: Back closes the window in front', (await page.locator('.win').count()) === open - 1);
await closeAll();

// ── Linux ──
await skin('Linux');
const dockL = await box(page.locator('.launcher'));
check('Linux: a top panel with Activities and a dock on the left', (await stage().getAttribute('class')).includes('skin-linux') && dockL.width < 80 && dockL.height > 400 && (await page.locator('.topbar .activities').count()) === 1);
await page.locator('.topbar .activities').click();
check('Linux: Activities shows the apps', (await page.locator('.menu .tile').count()) === 5 && /Activities/.test(await page.locator('.menu h3').innerText()));
await page.locator('.menu .tile', { hasText: 'Notes' }).click();
check('Linux: the window title is centred, the buttons are on the right', (await box(win('Notes').locator('.ctl.close'))).x > (await box(win('Notes').locator('.title'))).x);

// the system can be changed from inside it, and the windows stay
await openFromDesktop('Settings');
await win('Settings').getByRole('button', { name: 'Windows', exact: true }).click();
await page.waitForTimeout(450);
check('changing the system in Settings keeps the windows', (await stage().getAttribute('class')).includes('skin-windows') && (await win('Notes').count()) === 1 && (await win('Settings').count()) === 1);

// the screen is one element whose class says the system, and the windows are named for assistive technology
check('the screen and the windows are named', /WasmOS, Windows skin/.test(await stage().getAttribute('aria-label')) && (await win('Notes').getAttribute('aria-label')) === 'Notes');
check('no page errors', errors.length === 0, JSON.stringify(errors).slice(0, 300));

await browser.close();
server.close();
process.exit(failures() ? 1 : 0);
