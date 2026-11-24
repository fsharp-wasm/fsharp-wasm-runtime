/// An orchestra of processes, the Erlang way, for a computation that data scientists know: Monte Carlo estimate of pi in chunks.
///
/// - The **orchestrator** is a pure state machine (FSharp.Wasm.Actors.Pool under a supervisor): an event and a state give a new state and commands.  It does not start or wait for anything.
/// - The **processes** are Web Workers, and each runs the same compiled module as this page: `piHits` below is the kernel, in the page's module and in every worker's.
/// - The **GUI loop** is the Elmish loop of the runtime: a message from a worker is a message of the program, the commands the pool gives become effects.
/// - **Let it crash**: kill a worker (the host ends it) or let it crash (it fails by itself) and watch the supervisor start it again and the jobs of its mailbox go to the others.
module Demos.ActorOrchestra

open FSharp.Wasm.Actors
open Browser.Actors
open Browser.Html
open Browser.Elmish.Core

/// One chunk of the computation: the seed of its generator and how many random points it throws.
type Chunk = { Seed: int; Samples: int }

/// The kernel: how many of `n` random points of the unit square lie inside the quarter circle.  A worker calls this export; so does nothing in the page (it only orchestrates).
let piHits (seed: int) (n: int) : int =
    let mutable s = uint32 seed * 2654435761u + 1u
    let mutable hits = 0
    for _ in 1 .. n do
        s <- s * 1664525u + 1013904223u
        let x = float (s >>> 8) / 16777216.0
        s <- s * 1664525u + 1013904223u
        let y = float (s >>> 8) / 16777216.0
        if x * x + y * y <= 1.0 then hits <- hits + 1
    hits

let workerCount = 4
let chunkCount = 48
let samplesPerChunk = 40000000

type Model =
    { Pool: Pool<Chunk, int>
      Procs: (int * Process) list
      StartedAt: float
      FinishedAt: float
      /// the newest first
      Log: string list }

type Msg =
    /// when it was pressed (ms)
    | Run of float
    | Spawned of int * Process
    | Up of int
    | Answer of int * int * int * float
    | Died of int * float
    | Kill of int
    | Crash of int

/// Chunks are out and not all answered.
let private running (p: Pool<Chunk, int>) : bool = p.Total > 0 && not (Pool.isDone p) && not p.Failed

let private say (line: string) (m: Model) : Model =
    let log = line :: m.Log
    { m with Log = (if List.length log > 12 then List.take 12 log else log) }

let private procOf (w: int) (m: Model) : Process option =
    m.Procs |> List.tryFind (fun (i, _) -> i = w) |> Option.map snd

/// What the pool asks for, as effects of the program: a process started, a job put in a mailbox, a process ended.
let private effects (cmds: PoolCommand<Chunk> list) (m: Model) : Cmd<Msg> =
    let onProc (w: int) (act: Process -> unit) : Cmd<Msg> =
        procOf w m |> Option.map (fun p -> fun (_: Dispatch<Msg>) -> act p) |> Option.toList
    cmds
    |> List.collect (fun c ->
        match c with
        | StartWorker w ->
            [ fun dispatch ->
                let p = spawn "worker.js" (fun _ -> dispatch (Up w)) (fun job hits at -> dispatch (Answer(w, job, hits, at))) (fun at -> dispatch (Died(w, at)))
                dispatch (Spawned(w, p)) ]
        | StopWorker w -> onProc w kill
        | Dispatch(w, job, chunk) -> onProc w (fun p -> send p job chunk.Seed chunk.Samples)
        | GaveUp -> [])

/// The pool takes the event; its commands become effects.
let private step (event: PoolEvent<Chunk, int>) (m: Model) : Model * Cmd<Msg> =
    let pool, cmds = Pool.update event m.Pool
    { m with Pool = pool }, effects cmds m

let init () =
    let pool, cmds = Pool.create OneForOne 5 10000L 2 workerCount
    let m = { Pool = pool; Procs = []; StartedAt = 0.0; FinishedAt = 0.0; Log = [ "supervisor: starting " + string workerCount + " workers" ] }
    m, effects cmds m

let update (msg: Msg) (m: Model) : Model * Cmd<Msg> =
    match msg with
    | Run _ when running m.Pool -> m, Cmd.none
    | Run at ->
        let m = { m with Pool = { m.Pool with Queue = []; Results = []; Total = 0 } }
        let jobs = [ for i in 1 .. chunkCount -> i, { Seed = i * 7919; Samples = samplesPerChunk } ]
        let m', cmds = step (Submit jobs) { m with StartedAt = at; FinishedAt = 0.0 }
        say ("orchestrator: " + string chunkCount + " chunks of " + string samplesPerChunk + " points submitted") m', cmds
    | Spawned(w, p) ->
        { m with Procs = (w, p) :: (m.Procs |> List.filter (fun (i, _) -> i <> w)) }, Cmd.none
    | Up w ->
        let m', cmds = step (Started w) m
        say ("worker " + string w + " is up") m', cmds
    | Answer(w, job, hits, at) ->
        let m', cmds = step (Replied(w, job, hits)) m
        (if Pool.isDone m'.Pool && m'.FinishedAt = 0.0 then say "orchestrator: every chunk has its result" { m' with FinishedAt = at } else m'), cmds
    | Died(w, at) ->
        let m', cmds = step (Exited(w, int64 at)) m
        let n = List.length m'.Pool.Supervisor.Restarts
        let line =
            if m'.Pool.Failed then "supervisor: worker " + string w + " exited, too many restarts: giving up"
            else "supervisor: worker " + string w + " exited, started again (restart " + string n + " of 5 in 10 s)"
        say line m', cmds
    | Kill w ->
        match procOf w m with
        | Some p -> m, [ fun dispatch -> kill p; dispatch (Died(w, now ())) ]
        | None -> m, Cmd.none
    | Crash w ->
        match procOf w m with
        | Some p -> m, [ fun _ -> crash p ]
        | None -> m, Cmd.none

let private statusWord (s: WorkerStatus) : string =
    match s with
    | Starting -> "starting"
    | Ready -> "ready"
    | Down -> "down"

let private cell (text: string) = td { text }
let private head (text: string) = th { text }

/// `x` with `digits` decimals as text (F#'s `string` of a small float is `5E-05`).
let private fixedPoint (digits: int) (x: float) : string =
    let k = List.fold (fun acc _ -> acc * 10L) 1L [ 1 .. digits ]
    let n = int64 (x * float k + 0.5)
    let frac = string (n % k)
    string (n / k) + "." + String.replicate (digits - frac.Length) "0" + frac

let private row (dispatch: Dispatch<Msg>) (w: Worker<Chunk>) =
    tr {
        class' ("worker " + statusWord w.Status)
        key' (string w.Id)
        cell (string w.Id)
        cell (statusWord w.Status)
        cell (string (List.length w.InFlight))
        cell (string w.Done)
        cell (string w.Restarts)
        td {
            button {
                class' "kill"
                onClick (fun () -> dispatch (Kill w.Id))
                "kill"
            }
            button {
                class' "crash"
                onClick (fun () -> dispatch (Crash w.Id))
                "crash"
            }
        }
    }

let view (m: Model) (dispatch: Dispatch<Msg>) =
    let results = List.length m.Pool.Results
    let total = m.Pool.Total
    let hits = m.Pool.Results |> List.sumBy (fun (_, h) -> float h)
    let pi = if results = 0 then 0.0 else 4.0 * hits / (float results * float samplesPerChunk)
    let seconds = if m.FinishedAt > 0.0 then fixedPoint 2 ((m.FinishedAt - m.StartedAt) / 1000.0) else ""
    let summary =
        if m.Pool.Failed then "The supervisor gave up: " + string results + " of " + string total + " chunks are done."
        elif total = 0 then "Press Run."
        elif Pool.isDone m.Pool then "All " + string total + " chunks are done in " + seconds + " s."
        else string results + " of " + string total + " chunks are done."
    let estimate =
        if results = 0 then ""
        else
            "pi is about " + fixedPoint 5 pi + " (off by " + fixedPoint 5 (abs (pi - 3.141592653589793)) + "): "
            + string (int64 hits) + " of " + string (int64 results * int64 samplesPerChunk) + " points inside the circle"
    let percent = if total = 0 then 0 else results * 100 / total
    article {
        class' "orchestra"
        header { h2 "Orchestrator" }
        section {
            p summary
            div {
                class' "bar"
                div {
                    class' "bar-fill"
                    style' "width" (string percent + "%")
                }
            }
            p estimate
            button {
                class' "run"
                disabled (running m.Pool)
                onClick (fun () -> dispatch (Run(now ())))
                "Run"
            }
        }
        section {
            h2 "Processes"
            table {
                thead {
                    tr {
                        head "worker"
                        head "state"
                        head "mailbox"
                        head "done"
                        head "restarts"
                        head ""
                    }
                }
                tbody {
                    for w in m.Pool.Workers do
                        row dispatch w
                }
            }
        }
        section {
            h2 "Log"
            ul {
                class' "log"
                for line in m.Log do
                    li { line }
            }
        }
    }

let start () =
    run "orchestra-root" { Init = init; Update = update; View = view }
