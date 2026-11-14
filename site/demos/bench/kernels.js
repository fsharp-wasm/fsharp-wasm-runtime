// The kernels of `Bench.fs` in JavaScript: the same algorithms, the same order of operations, written the way a JavaScript
// programmer would (typed arrays where the F# side has arrays of numbers, objects for tree nodes).  Each returns a checksum;
// for every kernel it is bit for bit the one of the F# module, which the harness checks before it believes any time.

// Helpers at module level, like the private functions of Bench.fs: a closure created inside a kernel makes V8 run it several times slower
// (spectral norm: 180 ms against 68 ms), which would be a straw man.
const fibRec = (n) => n < 2 ? n : fibRec(n - 1) + fibRec(n - 2);

const evalA = (i, j) => 1.0 / (((i + j) * (i + j + 1) / 2) + i + 1);
function mulAv(n, v, out) { for (let i = 0; i < n; i++) { let s = 0; for (let j = 0; j < n; j++) s += evalA(i, j) * v[j]; out[i] = s; } }
function mulAtv(n, v, out) { for (let i = 0; i < n; i++) { let s = 0; for (let j = 0; j < n; j++) s += evalA(j, i) * v[j]; out[i] = s; } }

const make = (d) => d === 0 ? { l: null, r: null } : { l: make(d - 1), r: make(d - 1) };
const check = (t) => t === null ? 0 : 1 + check(t.l) + check(t.r);

function qsort(a, lo, hi) {
  if (hi - lo < 16) {
    for (let i = lo + 1; i <= hi; i++) { const v = a[i]; let j = i - 1; while (j >= lo && a[j] > v) { a[j + 1] = a[j]; j--; } a[j + 1] = v; }
    return;
  }
  const mid = lo + ((hi - lo) >> 1);
  let t;
  if (a[mid] < a[lo]) { t = a[mid]; a[mid] = a[lo]; a[lo] = t; }
  if (a[hi] < a[lo]) { t = a[hi]; a[hi] = a[lo]; a[lo] = t; }
  if (a[hi] < a[mid]) { t = a[hi]; a[hi] = a[mid]; a[mid] = t; }
  const pivot = a[mid];
  let i = lo, j = hi;
  while (i <= j) {
    while (a[i] < pivot) i++;
    while (a[j] > pivot) j--;
    if (i <= j) { t = a[i]; a[i] = a[j]; a[j] = t; i++; j--; }
  }
  if (lo < j) qsort(a, lo, j);
  if (i < hi) qsort(a, i, hi);
}

export const kernels = {
  mandelbrot(n) {
    let inside = 0;
    for (let py = 0; py < n; py++) for (let px = 0; px < n; px++) {
      const cr = 3.5 * px / n - 2.5, ci = 2.0 * py / n - 1.0;
      let zr = 0, zi = 0, i = 0;
      while (i < 200 && zr * zr + zi * zi <= 4.0) { const t = zr * zr - zi * zi + cr; zi = 2.0 * zr * zi + ci; zr = t; i++; }
      if (i === 200) inside++;
    }
    return inside;
  },

  nbody(steps) {
    const daysPerYear = 365.24, solarMass = 4.0 * Math.PI * Math.PI;
    const x = Float64Array.of(0.0, 4.84143144246472090e+00, 8.34336671824457987e+00, 1.28943695621391310e+01, 1.53796971148509165e+01);
    const y = Float64Array.of(0.0, -1.16032004402742839e+00, 4.12479856412430479e+00, -1.51111514016986312e+01, -2.59193146099879641e+01);
    const z = Float64Array.of(0.0, -1.03622044471123109e-01, -4.03523417114321381e-01, -2.23307578892655734e-01, 1.79258772950371181e-01);
    const vx = Float64Array.of(0.0, 1.66007664274403694e-03 * daysPerYear, -2.76742510726862411e-03 * daysPerYear, 2.96460137564761618e-03 * daysPerYear, 2.68067772490389322e-03 * daysPerYear);
    const vy = Float64Array.of(0.0, 7.69901118419740425e-03 * daysPerYear, 4.99852801234917238e-03 * daysPerYear, 2.37847173959480950e-03 * daysPerYear, 1.62824170038242295e-03 * daysPerYear);
    const vz = Float64Array.of(0.0, -6.90460016972063023e-05 * daysPerYear, 2.30417297573763929e-05 * daysPerYear, -2.96589568540237556e-05 * daysPerYear, -9.51592254519715870e-05 * daysPerYear);
    const m = Float64Array.of(solarMass, 9.54791938424326609e-04 * solarMass, 2.85885980666130812e-04 * solarMass, 4.36624404335156298e-05 * solarMass, 5.15138902046611451e-05 * solarMass);
    let px = 0, py = 0, pz = 0;
    for (let i = 0; i < 5; i++) { px += vx[i] * m[i]; py += vy[i] * m[i]; pz += vz[i] * m[i]; }
    vx[0] = -px / solarMass; vy[0] = -py / solarMass; vz[0] = -pz / solarMass;
    for (let s = 0; s < steps; s++) {
      for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) {
        const dx = x[i] - x[j], dy = y[i] - y[j], dz = z[i] - z[j];
        const d2 = dx * dx + dy * dy + dz * dz;
        const mag = 0.01 / (d2 * Math.sqrt(d2));
        vx[i] -= dx * m[j] * mag; vy[i] -= dy * m[j] * mag; vz[i] -= dz * m[j] * mag;
        vx[j] += dx * m[i] * mag; vy[j] += dy * m[i] * mag; vz[j] += dz * m[i] * mag;
      }
      for (let i = 0; i < 5; i++) { x[i] += 0.01 * vx[i]; y[i] += 0.01 * vy[i]; z[i] += 0.01 * vz[i]; }
    }
    let e = 0;
    for (let i = 0; i < 5; i++) {
      e += 0.5 * m[i] * (vx[i] * vx[i] + vy[i] * vy[i] + vz[i] * vz[i]);
      for (let j = i + 1; j < 5; j++) {
        const dx = x[i] - x[j], dy = y[i] - y[j], dz = z[i] - z[j];
        e -= m[i] * m[j] / Math.sqrt(dx * dx + dy * dy + dz * dz);
      }
    }
    return e;
  },

  spectralNorm(n) {
    const u = new Float64Array(n).fill(1), v = new Float64Array(n), tmp = new Float64Array(n);
    for (let k = 0; k < 10; k++) { mulAv(n, u, tmp); mulAtv(n, tmp, v); mulAv(n, v, tmp); mulAtv(n, tmp, u); }
    let vBv = 0, vv = 0;
    for (let i = 0; i < n; i++) { vBv += u[i] * v[i]; vv += v[i] * v[i]; }
    return Math.sqrt(vBv / vv);
  },

  matmul(n) {
    const a = new Float64Array(n * n), b = new Float64Array(n * n), c = new Float64Array(n * n);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { a[i * n + j] = ((i * 3 + j) % 11) * 0.25; b[i * n + j] = ((i + j * 5) % 13) * 0.5; }
    for (let i = 0; i < n; i++) for (let k = 0; k < n; k++) { const aik = a[i * n + k]; for (let j = 0; j < n; j++) c[i * n + j] += aik * b[k * n + j]; }
    let sum = 0;
    for (let i = 0; i < n * n; i++) sum += c[i];
    return Math.trunc(sum);
  },

  primes(n) {
    const composite = new Uint8Array(n + 1);
    let count = 0;
    for (let i = 2; i <= n; i++) if (!composite[i]) { count++; for (let j = i * 2; j <= n; j += i) composite[j] = 1; }
    return count;
  },

  fannkuch(n) {
    const perm = new Int32Array(n), perm1 = new Int32Array(n), count = new Int32Array(n);
    for (let i = 0; i < n; i++) perm1[i] = i;
    let maxFlips = 0, checksum = 0, permCount = 0, r = n, go = true;
    while (go) {
      while (r !== 1) { count[r - 1] = r; r--; }
      for (let i = 0; i < n; i++) perm[i] = perm1[i];
      let flips = 0, k = perm[0];
      while (k !== 0) {
        for (let i = 0, j = k; i < j; i++, j--) { const t = perm[i]; perm[i] = perm[j]; perm[j] = t; }
        flips++; k = perm[0];
      }
      if (flips > maxFlips) maxFlips = flips;
      checksum += permCount % 2 === 0 ? flips : -flips;
      for (let more = true; more;) {
        if (r === n) { go = false; more = false; }
        else {
          const first = perm1[0];
          for (let i = 0; i < r; i++) perm1[i] = perm1[i + 1];
          perm1[r] = first;
          if (--count[r] > 0) more = false; else r++;
        }
      }
      permCount++;
    }
    return checksum * 1000 + maxFlips;
  },

  crc32(n) {
    const table = new Int32Array(256);
    for (let i = 0; i < 256; i++) { let c = i; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; table[i] = c; }
    let crc = -1, x = 12345;
    for (let i = 0; i < n; i++) {
      x = (Math.imul(x, 1664525) + 1013904223) >>> 0;
      crc = table[(crc ^ (x >>> 24)) & 0xFF] ^ (crc >>> 8);
    }
    return crc ^ -1;
  },

  collatz(n) {
    let best = 0;
    for (let s = 1; s <= n; s++) { let x = s, steps = 0; while (x !== 1) { x = x % 2 === 0 ? x / 2 : 3 * x + 1; steps++; } if (steps > best) best = steps; }
    return best;
  },

  fib: (n) => fibRec(n),

  binaryTrees(maxDepth) {
    const minDepth = 4;
    let total = check(make(maxDepth + 1));
    const longLived = make(maxDepth);
    for (let d = minDepth; d <= maxDepth; d += 2) {
      const iterations = 1 << (maxDepth - d + minDepth);
      let c = 0;
      for (let i = 0; i < iterations; i++) c += check(make(d));
      total += c;
    }
    return total + check(longLived);
  },

  wordFreq(n) {
    const cap = 4096, keys = new Array(cap).fill(""), counts = new Int32Array(cap);
    let distinct = 0, best = 0, x = 1;
    for (let k = 0; k < n; k++) {
      x = (Math.imul(x, 1664525) + 1013904223) >>> 0;
      const len = 2 + (x >>> 28) % 3;
      let w = "", y = x;
      for (let c = 0; c < len; c++) { w += String.fromCharCode(97 + (y >>> 8) % 6); y = (Math.imul(y, 1664525) + 1013904223) >>> 0; }
      let h = 2166136261;
      for (let i = 0; i < w.length; i++) h = Math.imul(h ^ w.charCodeAt(i), 16777619) >>> 0;
      let slot = h & (cap - 1);
      while (keys[slot] !== "" && keys[slot] !== w) slot = (slot + 1) & (cap - 1);
      if (keys[slot] === "") { keys[slot] = w; distinct++; }
      if (++counts[slot] > best) best = counts[slot];
    }
    return distinct * 100000 + best;
  },

  quicksort(n) {
    const a = new Int32Array(n);
    let x = 42;
    for (let i = 0; i < n; i++) { x = (Math.imul(x, 1664525) + 1013904223) >>> 0; a[i] = x >>> 8; }
    qsort(a, 0, n - 1);
    let h = 0, ok = true;
    for (let i = 0; i < n; i++) { if (i > 0 && a[i - 1] > a[i]) ok = false; h = (Math.imul(h, 31) + a[i]) | 0; }
    return ok ? h : -1;
  },

  pipeline(n) {
    return Array.from({ length: n }, (_, i) => i + 1).map((v) => v * 3).filter((v) => v % 2 === 0).reduce((a, v) => (a + v % 1000) | 0, 0);
  },
};

/** The suite: id (the name of both functions), label, group, size of a full run, size of a quick run, what it stresses.
 *  `fused`: a compiler optimisation decides the row (it is left out of the VM-only mean). */
export const suite = [
  { id: 'mandelbrot',   label: 'Mandelbrot',      group: 'float',   size: 700,       quick: 300,       what: 'double arithmetic in a branchy inner loop' },
  { id: 'nbody',        label: 'N-body',          group: 'float',   size: 1_000_000, quick: 200_000,   what: 'double arithmetic on small arrays, sqrt' },
  { id: 'spectralNorm', label: 'Spectral norm',   group: 'float',   size: 700,       quick: 250,       what: 'nested loops, int→double, division' },
  { id: 'matmul',       label: 'Matrix product',  group: 'float',   size: 400,       quick: 150,       what: 'dense array reads and writes, memory bandwidth' },
  { id: 'primes',       label: 'Sieve',           group: 'integer', size: 5_000_000, quick: 1_000_000, what: 'byte array writes with a stride' },
  { id: 'fannkuch',     label: 'Fannkuch-redux',  group: 'integer', size: 9,         quick: 8,         what: 'int array shuffling, tight loops' },
  { id: 'crc32',        label: 'CRC-32',          group: 'integer', size: 16_000_000, quick: 3_000_000, what: '32-bit integer operations, table lookups' },
  { id: 'collatz',      label: 'Collatz',         group: 'integer', size: 300_000,   quick: 60_000,    what: '64-bit integers (doubles in JavaScript)' },
  { id: 'fib',          label: 'Fibonacci',       group: 'calls',   size: 35,        quick: 30,        what: 'function calls and recursion' },
  { id: 'binaryTrees',  label: 'Binary trees',    group: 'calls',   size: 15,        quick: 12,        what: 'allocation and garbage collection' },
  { id: 'wordFreq',     label: 'Word count',      group: 'data',    size: 1_200_000, quick: 250_000,   what: 'string building, hashing and comparison' },
  { id: 'quicksort',    label: 'Quicksort',       group: 'data',    size: 1_500_000, quick: 300_000,   what: 'int array partitioning, recursion' },
  { id: 'pipeline',     label: 'List pipeline',   group: 'data',    size: 3_000_000, quick: 1_200_000, what: 'map / filter / fold over a collection', fused: true,
    note: 'The F# compiler fuses the three list steps into one loop without allocating a list; JavaScript allocates three arrays. The row measures that optimisation, not the VM.' },
];
