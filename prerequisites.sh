#!/usr/bin/env bash
# prerequisites.sh — check that this repository can build its demos, and say what is missing.
#
# The demos are compiled by the fsharp-wasm compiler (https://github.com/fsharp-wasm/fsharp-wasm).  build.js takes it
# from a release (FSHARP_WASM_VERSION / .fsharp-wasm-version / FSHARP_WASM_BIN: a self-contained binary, no patched F#
# compiler needed) or, for compiler work, from a checkout of the repository (which needs its patched F# compiler).
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ok=1
say() { printf '%-44s %s\n' "$1" "$2"; }

command -v node >/dev/null && say "node" "$(node --version)" || { say "node" "MISSING (22+)"; ok=0; }
command -v dotnet >/dev/null && say "dotnet" "$(dotnet --version)" || { say "dotnet" "MISSING (.NET 10 SDK; the compiler cracks projects through it)"; ok=0; }

version="${FSHARP_WASM_VERSION:-$(cat "$HERE/.fsharp-wasm-version" 2>/dev/null | tr -d '[:space:]')}"
checkout=""
for d in "${FSHARP_WASM_DIR:-}" "$HERE/../fsharp-wasm"; do
  [ -n "$d" ] && [ -f "$d/tools/FSharp.Wasm.Cli/FSharp.Wasm.Cli.fsproj" ] && { checkout="$(cd "$d" && pwd)"; break; }
done

if [ -n "${FSHARP_WASM_BIN:-}" ]; then
  [ -x "$FSHARP_WASM_BIN" ] && say "compiler (FSHARP_WASM_BIN)" "$FSHARP_WASM_BIN" || { say "compiler (FSHARP_WASM_BIN)" "not executable: $FSHARP_WASM_BIN"; ok=0; }
elif [ -n "$version" ]; then
  say "compiler (release)" "$version — downloaded on first build into ~/.cache/fsharp-wasm"
elif [ -n "${FSHARP_WASM_CLI:-}" ]; then
  say "compiler (FSHARP_WASM_CLI)" "$FSHARP_WASM_CLI"
elif [ -n "$checkout" ]; then
  say "compiler (checkout)" "$checkout"
  fsc="${FSHARP_COMPILER:-$checkout/vendor/fsharp/artifacts/bin/fsc/Release/net10.0/fsc.dll}"
  if [ -f "$fsc" ]; then say "patched F# compiler" "$fsc"
  else say "patched F# compiler" "NOT BUILT — a checkout needs it: cd vendor/fsharp && ./build/build.sh -c Release (or use a release)"; ok=0; fi
else
  say "compiler" "NOT FOUND — export FSHARP_WASM_VERSION=<release tag>  (or FSHARP_WASM_BIN / FSHARP_WASM_DIR)"; ok=0
fi

if command -v wasm-tools >/dev/null; then say "wasm-tools (optional)" "$(wasm-tools --version)"
else say "wasm-tools (optional)" "not found — the compiler falls back to its built-in encoder"; fi

[ "$ok" = 1 ] && echo "ready: npm run build" || { echo "not ready"; exit 1; }
