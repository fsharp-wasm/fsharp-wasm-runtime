/// Compute kernels the landing page runs against the same algorithms written in JavaScript.
module Bench

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

/// Longest Collatz chain below n.
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

/// A list pipeline: sum of v·3 over the even numbers of 1..n (one loop in WasmGC, three lists in JS arrays).
let pipeline (n: int) : int =
    [ 1 .. n ] |> List.map (fun v -> v * 3) |> List.filter (fun v -> v % 2 = 0) |> List.fold (fun a v -> a + v % 1000) 0
