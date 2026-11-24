# Processes: `Browser.Actors` and the actor orchestra

Erlang's idea for the browser: a program is a few **processes** that share nothing and talk by messages, and a **supervisor** that starts a process again when it dies.
The platform splits that in three, so that each part can be tested without the others:

| Part | Where | What it is |
|---|---|---|
| The rules | `FSharp.Wasm.Actors` of fsharp-wasm-core ([docs/actors.md](https://github.com/fsharp-wasm/fsharp-wasm-core/blob/develop/docs/actors.md)) | `Supervisor` and `Pool`: pure functions of an event and a state that give a new state and **commands** (start, stop, dispatch a job, give up). Nothing is started or waited for; tested with a deterministic simulation of crashes, under .NET and as WasmGC. |
| The processes | `Browser.Actors` (`runtime/actors.js`, `src/Browser/Actors.fs`) | Web Workers that run the same compiled module as the page. They carry out the commands and report what happened. |
| The loop | `Browser.Elmish.Core` | A message from a process is a message of the program; the commands of the pool become effects of the update. |

## `Browser.Actors`

```fsharp
let p = spawn "worker.js" onReady onReply onExit   // onReady/onExit: float -> unit, onReply: job -> value -> float -> unit (the last is performance.now())
send p job a b                                     // a job id and two numbers into its mailbox
crash p                                            // the process fails by itself: it says that it is exiting, and closes
kill p                                             // ended from outside; nothing more is heard of it (the program says so itself)
```

A job is two integers and the answer one integer: enough to hand a chunk (a seed and a size) to a kernel and get its count back, and no more than a boundary of this width
can carry without copying. The worker is a short script (`demos/actor-orchestra/worker.js`): it compiles the program's own `.wasm` (a worker has no DOM, so the
module's imports are stubs; the kernel does not call them), calls the exported kernel for each job, and posts `{ ready }`, `{ job, value }` or `{ exit }`.

## The demo

`demos/actor-orchestra` (`Demos.ActorOrchestra`): a Monte Carlo estimate of π in 48 chunks of 40 million points on four workers.

- **One kernel, two homes**: `piHits seed n` is a top-level function of the module, so it is an export; the page uses the module to orchestrate, each worker to compute.
- **Let it crash**: *kill* ends a worker from outside, *crash* lets it fail by itself. The supervisor (one-for-one, five restarts in ten seconds, then it gives up) starts it again, the jobs
  that were in its mailbox go back to the queue and to the others, and a late answer of a job that was already done is ignored.
- **Exactly once**: the total of the run is the same whatever dies when. `tests/e2e/orchestra.mjs` kills one worker and crashes another while the run is under way and compares the number of
  points inside the circle with that of the same 48 chunks computed in order, in Node, with the same kernel.

Measured on 2026-11-24 in headless Chromium on a container without a GPU: 48 chunks (1.92 billion points) in 2.9 s on four workers; one core does 40 million points in about 0.18 s.
These are times of this machine and of that run, not a benchmark.

## Where this goes

Data science needs the same shape with bigger payloads (columns, tensors): `FSharp.Wasm.Frame` and the tensors planned for fsharp-wasm-core are the values, `SharedArrayBuffer` (where the page is
cross-origin isolated) the way to hand them over without a copy. The pool stays as it is; what changes is what a job carries.
