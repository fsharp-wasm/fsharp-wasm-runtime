// Turns size.json and network.json (tests/e2e/network.mjs) into the tables of docs/benchmarks.md.
//   node demos/bench/report-size.mjs [docs/benchmarks]
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

const dir = process.argv[2] ?? new URL('../../docs/benchmarks', import.meta.url).pathname;
const size = JSON.parse(readFileSync(join(dir, 'size.json'), 'utf8'));
const net = JSON.parse(readFileSync(join(dir, 'network.json'), 'utf8'));
const kb = (n) => (n / 1024).toFixed(n >= 10240 ? 0 : 1) + ' KB';
const ms = (x) => (x >= 1000 ? (x / 1000).toFixed(2) + ' s' : Math.round(x) + ' ms');
const byRaw = (a, b) => b.raw - a.raw;

console.log('| module | raw | gzip | brotli | brotli / raw |\n|---|---:|---:|---:|---:|');
for (const m of [...size.modules].sort(byRaw)) console.log(`| ${m.id} | ${kb(m.raw)} | ${kb(m.gzip)} | ${kb(m.brotli)} | ${Math.round((m.brotli / m.raw) * 100)} % |`);

console.log('\n| page | requests | raw | gzip | brotli |\n|---|---:|---:|---:|---:|');
for (const p of size.pages) console.log(`| ${p.id} | ${p.requests.length} | ${kb(p.total.raw)} | ${kb(p.total.gzip)} | ${kb(p.total.brotli)} |`);

for (const enc of ['gzip', 'br']) {
  console.log(`\nDownload + compile, ${enc === 'br' ? 'brotli' : 'gzip'} (median of ${net.runs} runs):\n`);
  console.log(`| module | on the wire | ${net.profiles.map((p) => `${p.label}${p.mbps ? ` (${p.mbps} Mbps, ${p.rtt} ms)` : ''}`).join(' | ')} |\n|---|---:|${net.profiles.map(() => '---:').join('|')}|`);
  for (const m of [...net.modules].sort(byRaw)) console.log(`| ${m.id} | ${kb(m.results.local[enc].wireBytes)} | ${net.profiles.map((p) => ms(m.results[p.id][enc].downloadMs + m.results[p.id][enc].compileMs)).join(' | ')} |`);
}
const big = [...net.modules].sort(byRaw)[0];
console.log(`\nThe largest module (${big.id}) by encoding:\n\n| encoding | on the wire | ${net.profiles.map((p) => p.label).join(' | ')} |\n|---|---:|${net.profiles.map(() => '---:').join('|')}|`);
for (const enc of net.encodings) console.log(`| ${enc === 'br' ? 'brotli' : enc === 'identity' ? 'none' : enc} | ${kb(big.results.local[enc].wireBytes)} | ${net.profiles.map((p) => ms(big.results[p.id][enc].downloadMs + big.results[p.id][enc].compileMs)).join(' | ')} |`);
console.log(`\nEnvironment: Chromium ${net.env.chromium}, ${net.env.os}, ${net.env.cpu} × ${net.env.cores}; recorded ${net.date.slice(0, 10)}.`);
