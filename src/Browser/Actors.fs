/// Processes in Web Workers (runtime/actors.js): numbers go in, a callback gets the answer with the time it came.
module Browser.Actors

open Fable.Core
open Browser.Core

[<Import("spawn", "runtime/actors.js")>]
let private jsSpawn (url: string) (onReady: float -> unit) (onReply: int -> int -> float -> unit) (onExit: float -> unit) : Handle = nativeOnly
[<Import("send", "runtime/actors.js")>]
let private jsSend (id: Handle) (job: int) (a: int) (b: int) : unit = nativeOnly
[<Import("crash", "runtime/actors.js")>]
let private jsCrash (id: Handle) : unit = nativeOnly
[<Import("kill", "runtime/actors.js")>]
let private jsKill (id: Handle) : unit = nativeOnly
[<Import("now", "runtime/actors.js")>]
let private jsNow () : float = nativeOnly

/// A process: a module worker started from this URL.
type Process = private Proc of Handle

/// Start a process.  `onReady` when it is up, `onReply job value` when it answers a job, `onExit` when it is gone without being killed; each gets `performance.now()` as its last argument.
let spawn (url: string) (onReady: float -> unit) (onReply: int -> int -> float -> unit) (onExit: float -> unit) : Process = Proc(jsSpawn url onReady onReply onExit)
/// Put a job (its id and two numbers) in the mailbox of a process.
let send (Proc id) (job: int) (a: int) (b: int) : unit = jsSend id job a b
/// Ask a process to fail by itself: it says that it is exiting and closes.
let crash (Proc id) : unit = jsCrash id
/// End a process from outside; nothing more is heard of it.
let kill (Proc id) : unit = jsKill id
/// The clock of the callbacks (`performance.now()`, in milliseconds).
let now () : float = jsNow ()
