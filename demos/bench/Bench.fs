/// Compute kernels that the benchmark page (and the landing page) run against the same algorithms written in JavaScript
/// (`kernels.js`).  Each takes a size and returns a checksum, so both sides can be compared for equal results and the work cannot be
/// optimised away.  The order of the floating point operations is the same on both sides: the results must be bit for bit equal.
module Bench

// ── floating point ─────────────────────────────────────────────────────────

/// Mandelbrot: points of an n×n grid that stay bounded for 200 iterations.
let mandelbrot (n: int) : int =
    let mutable inside = 0
    for py in 0 .. n - 1 do
        for px in 0 .. n - 1 do
            let cr = 3.5 * float px / float n - 2.5
            let ci = 2.0 * float py / float n - 1.0
            let mutable zr = 0.0
            let mutable zi = 0.0
            let mutable i = 0
            while i < 200 && zr * zr + zi * zi <= 4.0 do
                let t = zr * zr - zi * zi + cr
                zi <- 2.0 * zr * zi + ci
                zr <- t
                i <- i + 1
            if i = 200 then inside <- inside + 1
    inside

/// N-body (the Computer Language Benchmarks Game): five bodies, `steps` advances of 0.01, and the total energy after them.
let nbody (steps: int) : float =
    let solarMass = 4.0 * 3.141592653589793 * 3.141592653589793
    let daysPerYear = 365.24
    let x = [| 0.0; 4.84143144246472090e+00; 8.34336671824457987e+00; 1.28943695621391310e+01; 1.53796971148509165e+01 |]
    let y = [| 0.0; -1.16032004402742839e+00; 4.12479856412430479e+00; -1.51111514016986312e+01; -2.59193146099879641e+01 |]
    let z = [| 0.0; -1.03622044471123109e-01; -4.03523417114321381e-01; -2.23307578892655734e-01; 1.79258772950371181e-01 |]
    let vx = [| 0.0; 1.66007664274403694e-03 * daysPerYear; -2.76742510726862411e-03 * daysPerYear; 2.96460137564761618e-03 * daysPerYear; 2.68067772490389322e-03 * daysPerYear |]
    let vy = [| 0.0; 7.69901118419740425e-03 * daysPerYear; 4.99852801234917238e-03 * daysPerYear; 2.37847173959480950e-03 * daysPerYear; 1.62824170038242295e-03 * daysPerYear |]
    let vz = [| 0.0; -6.90460016972063023e-05 * daysPerYear; 2.30417297573763929e-05 * daysPerYear; -2.96589568540237556e-05 * daysPerYear; -9.51592254519715870e-05 * daysPerYear |]
    let m = [| solarMass; 9.54791938424326609e-04 * solarMass; 2.85885980666130812e-04 * solarMass; 4.36624404335156298e-05 * solarMass; 5.15138902046611451e-05 * solarMass |]
    // the sun takes the opposite of the total momentum
    let mutable px = 0.0
    let mutable py = 0.0
    let mutable pz = 0.0
    for i in 0 .. 4 do
        px <- px + vx.[i] * m.[i]
        py <- py + vy.[i] * m.[i]
        pz <- pz + vz.[i] * m.[i]
    vx.[0] <- -px / solarMass
    vy.[0] <- -py / solarMass
    vz.[0] <- -pz / solarMass
    for _ in 1 .. steps do
        for i in 0 .. 4 do
            for j in i + 1 .. 4 do
                let dx = x.[i] - x.[j]
                let dy = y.[i] - y.[j]
                let dz = z.[i] - z.[j]
                let d2 = dx * dx + dy * dy + dz * dz
                let mag = 0.01 / (d2 * sqrt d2)
                vx.[i] <- vx.[i] - dx * m.[j] * mag
                vy.[i] <- vy.[i] - dy * m.[j] * mag
                vz.[i] <- vz.[i] - dz * m.[j] * mag
                vx.[j] <- vx.[j] + dx * m.[i] * mag
                vy.[j] <- vy.[j] + dy * m.[i] * mag
                vz.[j] <- vz.[j] + dz * m.[i] * mag
        for i in 0 .. 4 do
            x.[i] <- x.[i] + 0.01 * vx.[i]
            y.[i] <- y.[i] + 0.01 * vy.[i]
            z.[i] <- z.[i] + 0.01 * vz.[i]
    let mutable e = 0.0
    for i in 0 .. 4 do
        e <- e + 0.5 * m.[i] * (vx.[i] * vx.[i] + vy.[i] * vy.[i] + vz.[i] * vz.[i])
        for j in i + 1 .. 4 do
            let dx = x.[i] - x.[j]
            let dy = y.[i] - y.[j]
            let dz = z.[i] - z.[j]
            e <- e - m.[i] * m.[j] / sqrt (dx * dx + dy * dy + dz * dz)
    e

let private evalA (i: int) (j: int) : float = 1.0 / float ((i + j) * (i + j + 1) / 2 + i + 1)

let private mulAv (n: int) (v: float[]) (av: float[]) =
    for i in 0 .. n - 1 do
        let mutable s = 0.0
        for j in 0 .. n - 1 do
            s <- s + evalA i j * v.[j]
        av.[i] <- s

let private mulAtv (n: int) (v: float[]) (atv: float[]) =
    for i in 0 .. n - 1 do
        let mutable s = 0.0
        for j in 0 .. n - 1 do
            s <- s + evalA j i * v.[j]
        atv.[i] <- s

/// Spectral norm (the Benchmarks Game) of the n×n matrix A(i, j) = 1 / ((i+j)(i+j+1)/2 + i + 1).
let spectralNorm (n: int) : float =
    let u = Array.create n 1.0
    let v = Array.zeroCreate<float> n
    let tmp = Array.zeroCreate<float> n
    for _ in 1 .. 10 do
        mulAv n u tmp
        mulAtv n tmp v
        mulAv n v tmp
        mulAtv n tmp u
    let mutable vBv = 0.0
    let mutable vv = 0.0
    for i in 0 .. n - 1 do
        vBv <- vBv + u.[i] * v.[i]
        vv <- vv + v.[i] * v.[i]
    sqrt (vBv / vv)

/// Matrix product of two n×n matrices (flat arrays, i-k-j order); the sum of the result.
let matmul (n: int) : int =
    let a = Array.zeroCreate<float> (n * n)
    let b = Array.zeroCreate<float> (n * n)
    let c = Array.zeroCreate<float> (n * n)
    for i in 0 .. n - 1 do
        for j in 0 .. n - 1 do
            a.[i * n + j] <- float ((i * 3 + j) % 11) * 0.25
            b.[i * n + j] <- float ((i + j * 5) % 13) * 0.5
    for i in 0 .. n - 1 do
        for k in 0 .. n - 1 do
            let aik = a.[i * n + k]
            for j in 0 .. n - 1 do
                c.[i * n + j] <- c.[i * n + j] + aik * b.[k * n + j]
    let mutable sum = 0.0
    for i in 0 .. n * n - 1 do
        sum <- sum + c.[i]
    int sum

// ── integers and arrays ────────────────────────────────────────────────────

/// Sieve of Eratosthenes: how many primes are ≤ n.
let primes (n: int) : int =
    let composite = Array.zeroCreate<bool> (n + 1)
    let mutable count = 0
    for i in 2 .. n do
        if not composite.[i] then
            count <- count + 1
            let mutable j = i * 2
            while j <= n do
                composite.[j] <- true
                j <- j + i
    count

/// Fannkuch-redux (the Benchmarks Game): all permutations of n numbers, the pancake flips of each; checksum * 1000 + the most flips.
let fannkuch (n: int) : int =
    let perm = Array.zeroCreate<int> n
    let perm1 = Array.zeroCreate<int> n
    let count = Array.zeroCreate<int> n
    for i in 0 .. n - 1 do
        perm1.[i] <- i
    let mutable maxFlips = 0
    let mutable checksum = 0
    let mutable permCount = 0
    let mutable r = n
    let mutable go = true
    while go do
        while r <> 1 do
            count.[r - 1] <- r
            r <- r - 1
        for i in 0 .. n - 1 do
            perm.[i] <- perm1.[i]
        let mutable flips = 0
        let mutable k = perm.[0]
        while k <> 0 do
            let mutable i = 0
            let mutable j = k
            while i < j do
                let t = perm.[i]
                perm.[i] <- perm.[j]
                perm.[j] <- t
                i <- i + 1
                j <- j - 1
            flips <- flips + 1
            k <- perm.[0]
        if flips > maxFlips then maxFlips <- flips
        checksum <- if permCount % 2 = 0 then checksum + flips else checksum - flips
        let mutable more = true
        while more do
            if r = n then
                go <- false
                more <- false
            else
                let first = perm1.[0]
                for i in 0 .. r - 1 do
                    perm1.[i] <- perm1.[i + 1]
                perm1.[r] <- first
                count.[r] <- count.[r] - 1
                if count.[r] > 0 then more <- false else r <- r + 1
        permCount <- permCount + 1
    checksum * 1000 + maxFlips

/// CRC-32 of n pseudo-random bytes (a linear congruential generator): table lookups and 32-bit integer operations.
let crc32 (n: int) : int =
    let table = Array.zeroCreate<int> 256
    for i in 0 .. 255 do
        let mutable c = uint32 i
        for _ in 0 .. 7 do
            c <- if c &&& 1u <> 0u then 0xEDB88320u ^^^ (c >>> 1) else c >>> 1
        table.[i] <- int c
    let mutable crc = 0xFFFFFFFFu
    let mutable x = 12345u
    for _ in 1 .. n do
        x <- x * 1664525u + 1013904223u
        let b = x >>> 24
        crc <- uint32 table.[int ((crc ^^^ b) &&& 0xFFu)] ^^^ (crc >>> 8)
    int (crc ^^^ 0xFFFFFFFFu)

/// Longest Collatz chain below n (64-bit integers in F#, doubles in JavaScript).
let collatz (n: int) : int =
    let mutable best = 0
    for start in 1 .. n do
        let mutable x = int64 start
        let mutable steps = 0
        while x <> 1L do
            x <- if x % 2L = 0L then x / 2L else 3L * x + 1L
            steps <- steps + 1
        if steps > best then best <- steps
    best

// ── calls and allocation ───────────────────────────────────────────────────

let rec private fibRec (n: int) : int = if n < 2 then n else fibRec (n - 1) + fibRec (n - 2)

/// The n-th Fibonacci number by double recursion: function calls.
let fib (n: int) : int = fibRec n

type Tree =
    | Leaf
    | Node of Tree * Tree

let rec private make (d: int) : Tree = if d = 0 then Node(Leaf, Leaf) else Node(make (d - 1), make (d - 1))
let rec private check (t: Tree) : int =
    match t with
    | Leaf -> 0
    | Node(l, r) -> 1 + check l + check r

/// Binary trees (the Benchmarks Game): a stretch tree, a long-lived tree, and many short-lived trees of depth 4, 6 … maxDepth —
/// allocation and garbage collection.  The number of nodes built and visited.
let binaryTrees (maxDepth: int) : int =
    let minDepth = 4
    let mutable total = check (make (maxDepth + 1))
    let longLived = make maxDepth
    let mutable d = minDepth
    while d <= maxDepth do
        let iterations = 1 <<< (maxDepth - d + minDepth)
        let mutable c = 0
        for _ in 1 .. iterations do
            c <- c + check (make d)
        total <- total + c
        d <- d + 2
    total + check longLived

// ── strings and collections ────────────────────────────────────────────────

/// Word frequencies: n pseudo-random words of 2–4 letters out of six, counted in an open-addressing hash table (FNV-1a over the
/// characters, linear probing, string keys); distinct words * 100000 + the highest count.  The table is written out so that both
/// sides run the same algorithm — and so that the module needs no collection library.
let wordFreq (n: int) : int =
    let cap = 4096
    let keys = Array.create cap ""
    let counts = Array.zeroCreate<int> cap
    let mutable distinct = 0
    let mutable best = 0
    let mutable x = 1u
    for _ in 1 .. n do
        x <- x * 1664525u + 1013904223u
        let len = 2 + int ((x >>> 28) % 3u)
        let mutable w = ""
        let mutable y = x
        for _ in 1 .. len do
            w <- w + string (char (97 + int ((y >>> 8) % 6u)))
            y <- y * 1664525u + 1013904223u
        let mutable h = 2166136261u
        for i in 0 .. w.Length - 1 do
            h <- (h ^^^ uint32 w.[i]) * 16777619u
        let mutable slot = int (h &&& uint32 (cap - 1))
        while keys.[slot] <> "" && keys.[slot] <> w do
            slot <- (slot + 1) &&& (cap - 1)
        if keys.[slot] = "" then
            keys.[slot] <- w
            distinct <- distinct + 1
        counts.[slot] <- counts.[slot] + 1
        if counts.[slot] > best then best <- counts.[slot]
    distinct * 100000 + best

let rec private qsort (a: int[]) (lo: int) (hi: int) : unit =
    if hi - lo < 16 then
        for i in lo + 1 .. hi do
            let v = a.[i]
            let mutable j = i - 1
            while j >= lo && a.[j] > v do
                a.[j + 1] <- a.[j]
                j <- j - 1
            a.[j + 1] <- v
    else
        let mid = lo + (hi - lo) / 2
        if a.[mid] < a.[lo] then
            let t = a.[mid]
            a.[mid] <- a.[lo]
            a.[lo] <- t
        if a.[hi] < a.[lo] then
            let t = a.[hi]
            a.[hi] <- a.[lo]
            a.[lo] <- t
        if a.[hi] < a.[mid] then
            let t = a.[hi]
            a.[hi] <- a.[mid]
            a.[mid] <- t
        let pivot = a.[mid]
        let mutable i = lo
        let mutable j = hi
        while i <= j do
            while a.[i] < pivot do
                i <- i + 1
            while a.[j] > pivot do
                j <- j - 1
            if i <= j then
                let t = a.[i]
                a.[i] <- a.[j]
                a.[j] <- t
                i <- i + 1
                j <- j - 1
        if lo < j then qsort a lo j
        if i < hi then qsort a i hi

/// Quicksort (median of three, insertion sort below 16 elements) of n pseudo-random 24-bit integers; a hash of the sorted array,
/// or -1 if it is not sorted.  Written out on both sides: it measures the code generated for the same algorithm.
let quicksort (n: int) : int =
    let a = Array.zeroCreate<int> n
    let mutable x = 42u
    for i in 0 .. n - 1 do
        x <- x * 1664525u + 1013904223u
        a.[i] <- int (x >>> 8)
    qsort a 0 (n - 1)
    let mutable h = 0
    let mutable ok = true
    for i in 0 .. n - 1 do
        if i > 0 && a.[i - 1] > a.[i] then ok <- false
        h <- h * 31 + a.[i]
    if ok then h else -1

/// A list pipeline: map, filter and fold over the list 1..n (JavaScript: the same three steps on arrays).
let pipeline (n: int) : int =
    [ 1 .. n ] |> List.map (fun v -> v * 3) |> List.filter (fun v -> v % 2 = 0) |> List.fold (fun a v -> a + v % 1000) 0
