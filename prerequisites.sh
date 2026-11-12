#!/usr/bin/env bash
# prerequisites.sh — check that this repository can build its demos, and say what is missing.
#
# The demos are compiled by the fsharp-wasm compiler (tools/FSharp.Wasm.Cli of
# https://github.com/aiqs4/fsharp-wasm).  There is no prebuilt release of it yet: build.js finds a checkout
# (FSHARP_WASM_DIR, or the parent directory when this repository is its submodule) and runs its CLI.
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ok=1
say() { printf '%-44s %s\n' "$1" "$2"; }

command -v node >/dev/null && say "node" "$(node --version)" || { say "node" "MISSING (22+)"; ok=0; }
command -v dotnet >/dev/null && say "dotnet" "$(dotnet --version)" || { say "dotnet" "MISSING (.NET 10 SDK)"; ok=0; }

checkout=""
for d in "${FSHARP_WASM_DIR:-}" "$HERE/.." "$HERE/../.." "$HERE/../fsharp-wasm"; do
  [ -n "$d" ] && [ -f "$d/tools/FSharp.Wasm.Cli/FSharp.Wasm.Cli.fsproj" ] && { checkout="$(cd "$d" && pwd)"; break; }
done
if [ -n "${FSHARP_WASM_CLI:-}" ]; then
  say "compiler (FSHARP_WASM_CLI)" "$FSHARP_WASM_CLI"
elif [ -n "$checkout" ]; then
  say "compiler (checkout)" "$checkout"
else
  say "compiler" "NOT FOUND — export FSHARP_WASM_DIR=/path/to/fsharp-wasm"; ok=0
fi

fsc="${FSHARP_COMPILER:-${checkout:+$checkout/vendor/fsharp/artifacts/bin/fsc/Release/net10.0/fsc.dll}}"
if [ -n "$fsc" ] && [ -f "$fsc" ]; then say "patched F# compiler (FSHARP_COMPILER)" "$fsc"
else say "patched F# compiler" "NOT BUILT — in fsharp-wasm: cd vendor/fsharp && ./build/build.sh -c Release"; ok=0; fi

if command -v wasm-tools >/dev/null; then say "wasm-tools (optional)" "$(wasm-tools --version)"
else say "wasm-tools (optional)" "not found — the compiler falls back to its built-in encoder"; fi

[ "$ok" = 1 ] && echo "ready: npm run build" || { echo "not ready"; exit 1; }
