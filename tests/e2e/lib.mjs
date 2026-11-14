// Shared scaffolding for the end-to-end tests: a static file server over dist/ and a Chromium page that records errors.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execSync } from 'node:child_process';
import zlib from 'node:zlib';

// `playwright` from node_modules, else from the global install
const { chromium } = await import('playwright').catch(() =>
  import(pathToFileURL(join(execSync('npm root -g').toString().trim(), 'playwright', 'index.mjs')).href));

const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.wasm': 'application/wasm', '.css': 'text/css', '.json': 'application/json' };

/** Compressors of the static server, as a real host has them (GitHub Pages sends gzip; a CDN may send brotli). */
const encoders = {
  gzip: (b) => zlib.gzipSync(b, { level: 9 }),
  br: (b) => zlib.brotliCompressSync(b, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11, [zlib.constants.BROTLI_PARAM_SIZE_HINT]: b.length } }),
};
const compressible = new Set(['.html', '.js', '.mjs', '.wasm', '.css', '.json']);

/**
 * A static file server over `root` (default: dist/ or $E2E_ROOT of this repository) on `port` (0: any free port).
 * `encoding`: 'identity' (default, or $E2E_ENCODING), 'gzip' or 'br' — what the server answers with when the browser accepts it.
 */
export const serve = (root = fileURLToPath(new URL(`../../${process.env.E2E_ROOT ?? 'dist'}`, import.meta.url)), port = 0, encoding = process.env.E2E_ENCODING ?? 'identity') =>
  new Promise((resolve) => {
    const cache = new Map();                                  // compressed bodies, by path and encoding
    const server = http.createServer(async (req, res) => {
      try {
        let path = normalize(join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname)));
        if (!path.startsWith(root)) throw new Error('outside');
        if (extname(path) === '') path = join(path, 'index.html');
        let body = await readFile(path);
        const headers = { 'content-type': types[extname(path)] ?? 'application/octet-stream' };
        if (encoding !== 'identity' && compressible.has(extname(path)) && String(req.headers['accept-encoding'] ?? '').includes(encoding === 'br' ? 'br' : 'gzip')) {
          const key = `${encoding}:${path}`;
          if (!cache.has(key)) cache.set(key, encoders[encoding](body));
          body = cache.get(key);
          headers['content-encoding'] = encoding;
        }
        res.writeHead(200, headers);
        res.end(body);
      } catch { res.writeHead(404); res.end('not found'); }
    }).listen(port, () => resolve({ server, base: `http://127.0.0.1:${server.address().port}` }));
  });

export const launch = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  // E2E_CPU_THROTTLE=6: run the page six times slower — a CI runner's timing, to reproduce a race that only a slow machine shows
  if (process.env.E2E_CPU_THROTTLE) await (await page.context().newCDPSession(page)).send('Emulation.setCPUThrottlingRate', { rate: Number(process.env.E2E_CPU_THROTTLE) });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  return { browser, page, errors };
};

export const checker = () => {
  let failed = 0;
  const check = (name, ok, extra = '') => { console.log(`${ok ? '✓' : '✗'} ${name}${ok ? '' : '  ' + extra}`); if (!ok) failed++; };
  return { check, failures: () => failed };
};
