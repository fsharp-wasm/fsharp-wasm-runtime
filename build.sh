#!/usr/bin/env bash
# Compile every demo with fsharp-wasm and assemble the static site in ./site (what GitHub Pages serves).
#   FSHARP_WASM=<checkout of aiqs4/fsharp-wasm>  (default ../fsharp-wasm)   FSHARP_COMPILER=<patched fsc.dll>
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
export FSHARP_WASM="${FSHARP_WASM:-$HERE/../fsharp-wasm}"
mkdir -p "$HERE/site/wasm" "$HERE/site/runtime"
for demo in Counter Todo Life Bench; do
  dir="$HERE/demos/$demo"
  rm -rf "$dir/out"
  dotnet run --project "$FSHARP_WASM/tools/FSharp.Wasm.Cli" -- "$dir" --outDir "$dir/out" --noCache > "$dir/build.log" 2>&1 \
    || { tail -30 "$dir/build.log"; echo "✗ $demo"; exit 1; }
  wasm-tools validate "$dir/out/$demo.wasm" --features gc
  cp "$dir/out/$demo.wasm" "$HERE/site/wasm/$demo.wasm"
  printf '✓ %-8s %6d bytes\n' "$demo" "$(stat -c %s "$HERE/site/wasm/$demo.wasm")"
done
cp "$HERE/runtime/browser.js" "$HERE/site/runtime/browser.js"
