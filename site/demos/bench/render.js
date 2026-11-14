// Drawing for the benchmark page: the results table and the chart.  Every value that reaches the DOM goes through textContent.
const SVG = 'http://www.w3.org/2000/svg';

const svg = (name, attrs = {}, text) => {
  const e = document.createElementNS(SVG, name);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text != null) e.textContent = text;
  return e;
};
const html = (name, attrs = {}, ...children) => {
  const e = document.createElement(name);
  for (const [k, v] of Object.entries(attrs)) k === 'class' ? (e.className = v) : e.setAttribute(k, v);
  e.append(...children);
  return e;
};

export const fmtMs = (ms) => (ms >= 100 ? ms.toFixed(0) : ms >= 10 ? ms.toFixed(1) : ms.toFixed(2));
const fmtX = (r) => (r >= 10 ? r.toFixed(0) : r.toFixed(1)) + '×';
export const fmtRatio = (r) => (r >= 1 ? `${fmtX(r)} faster` : `${fmtX(1 / r)} slower`);
const fmtInt = (n) => n.toLocaleString('en-US');
const fmtResult = (v) => (Number.isInteger(v) ? String(v) : v.toPrecision(9));
const spread = (s) => `${fmtMs(s.p25)}–${fmtMs(s.p75)}`;

// ── table ───────────────────────────────────────────────────────────────────

export function renderTable(tbody, rows) {
  tbody.replaceChildren(...rows.map((r) => {
    const side = (s) => html('td', { class: 'num' }, `${fmtMs(s.median)} ms`, html('small', { class: 'muted' }, ` ${spread(s)}`));
    const ratio = html('td', { class: `num${r.ratio >= 1 ? ' win' : ''}` }, r.same ? fmtRatio(r.ratio) : '—');
    const tr = html('tr', {},
      html('th', { scope: 'row', title: r.what }, r.label + (r.fused ? ' †' : ''), html('small', { class: 'muted block' }, `n = ${fmtInt(r.size)}`)),
      side(r.js), side(r.wasm), ratio,
      html('td', { class: 'num muted' }, `${fmtMs(r.js.cold)} / ${fmtMs(r.wasm.cold)} ms`),
      html('td', { class: r.same ? '' : 'bad' }, r.same ? `✓ ${fmtResult(r.result)}` : '✗ results differ'));
    return tr;
  }));
}

// ── chart: one bar per kernel, from 1× (same speed); right of it the F# module is faster, left of it JavaScript ──────────

export function renderChart(host, rows, tip) {
  const W = Math.max(300, host.clientWidth), compact = W < 520;
  const sorted = [...rows].sort((a, b) => (b.same - a.same) || (b.ratio - a.ratio));
  const ok = sorted.filter((r) => r.same);
  const logs = ok.map((r) => Math.log2(r.ratio));
  const L = Math.max(1, Math.ceil(-Math.min(0, ...logs))), R = Math.max(1, Math.ceil(Math.max(0, ...logs)));
  const labelW = compact ? 0 : 138, rowH = compact ? 46 : 30, barH = 16, top = 26, valueW = compact ? 74 : 84;
  const x0 = labelW + (L > 1 || logs.some((v) => v < 0) ? valueW : 10), x1 = W - valueW;
  const px = (x1 - x0) / (L + R), zeroX = x0 + L * px;
  const H = top + sorted.length * rowH + 6;
  const root = svg('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, role: 'img', 'aria-label': 'Speed of the F# module relative to JavaScript, per kernel' });

  const step = Math.max(1, Math.ceil(44 / px));                    // labelled ticks at least 44px apart
  for (let t = -L; t <= R; t++) {
    if (t % step !== 0) continue;
    const x = zeroX + t * px;
    root.append(svg('line', { x1: x, x2: x, y1: top - 6, y2: H - 4, class: t === 0 ? 'axis' : 'grid' }),
      svg('text', { x, y: 12, 'text-anchor': 'middle', class: 'tick' }, t === 0 ? '1×' : t > 0 ? `${2 ** t}×` : `1/${2 ** -t}×`));
  }

  sorted.forEach((r, i) => {
    const y = top + i * rowH, cy = y + (compact ? 30 : rowH / 2);
    const g = svg('g', { class: 'row', tabindex: 0, role: 'img', 'aria-label': `${r.label}: ${r.same ? fmtRatio(r.ratio) : 'results differ'}` });
    g.append(svg('rect', { x: 0, y, width: W, height: rowH, class: 'hit' }));
    g.append(svg('text', compact ? { x: 0, y: y + 14, class: 'name' } : { x: 0, y: cy + 4, class: 'name' }, r.label + (r.fused ? ' †' : '')));
    if (r.same) {
      const w = Math.max(1.5, Math.abs(Math.log2(r.ratio)) * px), right = r.ratio >= 1, rad = Math.min(4, w / 2);
      const x = right ? zeroX : zeroX - w, yb = cy - barH / 2;
      // rounded at the data end, square on the baseline
      const d = right
        ? `M${x},${yb}h${w - rad}a${rad},${rad} 0 0 1 ${rad},${rad}v${barH - 2 * rad}a${rad},${rad} 0 0 1 -${rad},${rad}h-${w - rad}z`
        : `M${zeroX},${yb}h-${w - rad}a${rad},${rad} 0 0 0 -${rad},${rad}v${barH - 2 * rad}a${rad},${rad} 0 0 0 ${rad},${rad}h${w - rad}z`;
      g.append(svg('path', { d, class: right ? 'bar wasm' : 'bar js' }),
        svg('text', { x: right ? zeroX + w + 8 : zeroX - w - 8, y: cy + 4, 'text-anchor': right ? 'start' : 'end', class: 'value' }, fmtRatio(r.ratio)));
    } else {
      g.append(svg('text', { x: zeroX + 8, y: cy + 4, class: 'value' }, '✗ results differ'));
    }
    const show = (ev) => { const b = host.getBoundingClientRect(); tipShow(tip, r, ev.type === 'focus' ? { x: zeroX, y: y + rowH } : { x: ev.clientX - b.left, y: ev.clientY - b.top }); g.classList.add('on'); };
    const hide = () => { tip.hidden = true; g.classList.remove('on'); };
    g.addEventListener('pointermove', show); g.addEventListener('focus', show);
    g.addEventListener('pointerleave', hide); g.addEventListener('blur', hide);
    root.append(g);
  });
  host.replaceChildren(root);
}

function tipShow(tip, r, at) {
  const line = (cls, label, s) => html('div', { class: 'tip-row' }, html('i', { class: cls }), html('b', {}, `${fmtMs(s.median)} ms`),
    html('span', {}, ` ${label} · IQR ${spread(s)} · first call ${fmtMs(s.cold)} · ${s.n} samples`));
  tip.replaceChildren(html('div', { class: 'tip-head' }, r.label),
    line('js', 'JavaScript', r.js), line('wasm', 'F# → WasmGC', r.wasm),
    html('div', { class: 'tip-row' }, html('b', {}, r.same ? fmtRatio(r.ratio) : 'results differ'),
      html('span', {}, r.same ? ` (quartiles allow ${fmtX(r.ratioRange[0])} – ${fmtX(r.ratioRange[1])})` : '')),
    html('div', { class: 'tip-what' }, r.what + (r.note ? ` — ${r.note}` : '')));
  tip.hidden = false;
  const host = tip.parentElement, w = tip.offsetWidth, h = tip.offsetHeight;
  tip.style.left = `${Math.max(0, Math.min(at.x + 12, host.clientWidth - w))}px`;
  tip.style.top = `${Math.max(0, at.y + h + 16 > host.clientHeight ? at.y - h - 8 : at.y + 12)}px`;
}

// ── the lines around them ───────────────────────────────────────────────────

export function describeEnv(env, wasm) {
  const e = env.runtime === 'browser' ? env.userAgent + (env.cores ? ` · ${env.cores} logical cores` : '')
    : `${env.runtime} ${env.version}${env.v8 ? ` (V8 ${env.v8})` : ''} · ${env.os} ${env.arch}${env.cpu ? ` · ${env.cpu}` : ''}`;
  return `${e} — module ${(wasm.bytes / 1024).toFixed(1)} KB, compiled in ${fmtMs(wasm.compileMs)} ms, instantiated in ${fmtMs(wasm.instantiateMs)} ms`;
}

export function describeSummary(s) {
  if (!s.geomean) return '';
  return `F# → WasmGC is faster in ${s.wasmFaster} of ${s.agree} kernels. Geometric mean of the ratios: ${s.geomean.toFixed(2)}×, ` +
    `${s.geomeanVm.toFixed(2)}× without the rows a compiler optimisation decides (†).`;
}

export function downloadJson(report) {
  const a = html('a', { href: URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })), download: `bench-${report.env.runtime}-${report.profile}.json` });
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
