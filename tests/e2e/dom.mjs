// End-to-end: the DOM reconciler of runtime/dom.js with SVG, without a compiled module.   node tests/e2e/dom.mjs
// An element of SVG made with createElement is an unknown HTML element and draws nothing: it has to be created in the SVG namespace.  The reconciler must keep such an
// element through a render (so a morph does not rebuild an icon), update its attributes in their own case (`viewBox`), and set its class (an SVG element's className is
// not a string).
import { fileURLToPath } from 'node:url';
import { serve, launch, checker } from './lib.mjs';

const { server, base } = await serve(fileURLToPath(new URL('../..', import.meta.url)));
const { check, failures } = checker();
const { browser, page, errors } = await launch();
await page.goto(`${base}/tests/e2e/events.html`);

const result = await page.evaluate(async () => {
  const { get } = await import('/runtime/core.js');
  const dom = await import('/runtime/dom.js');
  const SVG = 'http://www.w3.org/2000/svg';
  // a view: <button><svg viewBox=… class=…><path d=…/><circle …/></svg> label</button>, built the way the Html DSL builds it: off the page, element by element
  const view = (d, cls) => {
    const scratch = dom.createElement('div');
    const button = dom.createElement('button');
    const svg = dom.createElement('svg');
    dom.setAttribute(svg, 'viewBox', '0 0 24 24');
    dom.setClassName(svg, cls);
    const path = dom.createElement('path');
    dom.setAttribute(path, 'd', d);
    const circle = dom.createElement('circle');
    dom.setAttribute(circle, 'r', '2');
    dom.appendChild(svg, path); dom.appendChild(svg, circle);
    dom.appendChild(button, svg); dom.appendChild(button, dom.createTextNode(' label'));
    dom.appendChild(scratch, button);
    return scratch;
  };
  const host = dom.createElement('div');
  document.body.append(get(host));
  dom.morphChildrenOf(host, view('M5 12h14', 'icon one'));
  const first = get(host).querySelector('svg');
  const path1 = first.querySelector('path');
  const out = {
    namespace: first.namespaceURI === SVG && path1.namespaceURI === SVG && first.querySelector('circle').namespaceURI === SVG,
    html: get(host).querySelector('button').namespaceURI === 'http://www.w3.org/1999/xhtml',
    viewBox: first.getAttribute('viewBox'),
    classOfSvg: first.getAttribute('class'),
    box: (() => { const r = first.getBoundingClientRect(); return [r.width, r.height]; })(),
  };
  dom.morphChildrenOf(host, view('M12 5v14', 'icon two'));
  const second = get(host).querySelector('svg');
  out.sameSvg = second === first;
  out.samePath = second.querySelector('path') === path1;
  out.dAfter = path1.getAttribute('d');
  out.classAfter = second.getAttribute('class');
  out.viewBoxAfter = second.getAttribute('viewBox');
  return out;
});

check('svg, path and circle are created in the SVG namespace, the button stays HTML', result.namespace && result.html);
check('an attribute keeps its case (viewBox)', result.viewBox === '0 0 24 24');
check('the class of an svg element is set', result.classOfSvg === 'icon one', String(result.classOfSvg));
check('the svg takes room: it has a size (an unknown element would not)', result.box[0] > 0 && result.box[1] > 0, result.box.join(' x '));
check('a render keeps the svg and its path (the morph does not rebuild an icon)', result.sameSvg && result.samePath);
check('and updates what changed: the path data, the class', result.dAfter === 'M12 5v14' && result.classAfter === 'icon two', `${result.dAfter} / ${result.classAfter}`);
check('the view box survives the morph', result.viewBoxAfter === '0 0 24 24');
check('no error in the page', errors.length === 0, errors.join(' | '));

await browser.close(); server.close();
console.log(failures() ? `\n${failures()} check(s) failed` : '\ndom: all checks passed');
process.exit(failures() ? 1 : 0);
