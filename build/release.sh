#!/usr/bin/env bash
set -euo pipefail

echo "═══════════════════════════════════════"
echo "  fsharp-wasm-runtime — Release Build"
echo "═══════════════════════════════════════"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$ROOT/dist"
NUPKG="$ROOT/nupkg"
VERSION="${1:-${GITHUB_REF_NAME:-0.1.0-dev}}"

# Clean
rm -rf "$DIST" "$NUPKG"
mkdir -p "$DIST" "$NUPKG"

# Build all demos
echo "▸ Compiling demos..."
node "$ROOT/build/build.js"

# Validate compiled WASM files (if wasm-tools present)
echo "▸ Validating WASM outputs..."
for wasm in "$DIST"/demos/*/*.wasm; do
    if [ -f "$wasm" ]; then
        if command -v wasm-tools &>/dev/null; then
            wasm-tools validate "$wasm" && echo "  ✔ $wasm"
        else
            echo "  ⚠ wasm-tools not found, skipping validation"
            break
        fi
    fi
done

# Pack NuGet
echo "▸ Packing NuGet: FSharpWasmRuntime $VERSION..."
dotnet pack "$ROOT/src/FSharpWasmRuntime.fsproj" \
    -o "$NUPKG/" \
    /p:Version="$VERSION"

# Push NuGet (if key provided)
if [ -n "${NUGET_API_KEY:-}" ]; then
    echo "▸ Publishing to NuGet.org..."
    dotnet nuget push "$NUPKG"/*.nupkg \
        --api-key "$NUGET_API_KEY" \
        --source https://api.nuget.org/v3/index.json \
        --skip-duplicate
fi

echo ""
echo "✔ Release build complete"
echo "  NuGet packages: $NUPKG/"
echo "  Demo pages:     $DIST/"

