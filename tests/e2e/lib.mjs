// Shared scaffolding for the end-to-end tests: a static file server over dist/ and a Chromium page that records errors.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execSync } from 'node:child_process';

// `playwright` from node_modules, else from the global install
const { chromium } = await import('playwright').catch(() =>
  import(pathToFileURL(join(execSync('npm root -g').toString().trim(), 'playwright', 'index.mjs')).href));

const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.wasm': 'application/wasm', '.css': 'text/css', '.json': 'application/json' };

export const serve = (root = fileURLToPath(new URL(`../../${process.env.E2E_ROOT ?? 'dist'}`, import.meta.url))) =>
  new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      try {
        let path = normalize(join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname)));
        if (!path.startsWith(root)) throw new Error('outside');
        if (extname(path) === '') path = join(path, 'index.html');
        const body = await readFile(path);
        res.writeHead(200, { 'content-type': types[extname(path)] ?? 'application/octet-stream' });
        res.end(body);
      } catch { res.writeHead(404); res.end('not found'); }
    }).listen(0, () => resolve({ server, base: `http://127.0.0.1:${server.address().port}` }));
  });

export const launch = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
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
