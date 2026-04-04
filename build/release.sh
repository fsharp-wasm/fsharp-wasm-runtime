#!/usr/bin/env bash
set -euo pipefail

echo "═══════════════════════════════════════"
echo "  fsharp-wasm-runtime — Release Build"
echo "═══════════════════════════════════════"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$ROOT/dist"
RELEASE="$ROOT/release"

# Clean
rm -rf "$DIST" "$RELEASE"
mkdir -p "$DIST" "$RELEASE"

# Build
echo "▸ Running build..."
node "$ROOT/build/build.js"

# Validate WASM (if present)
if [ -f "$DIST/wasm/app.wasm" ]; then
    echo "▸ Validating WASM..."
    if command -v wasm-tools &> /dev/null; then
        wasm-tools validate "$DIST/wasm/app.wasm"
        echo "✔ WASM validation passed"
    else
        echo "⚠ wasm-tools not found, skipping validation"
    fi
fi

# Package
VERSION="${GITHUB_REF_NAME:-dev}"
ARCHIVE="fsharp-wasm-runtime-${VERSION}.zip"
echo "▸ Packaging release: $ARCHIVE"
cd "$DIST"
zip -r "$RELEASE/$ARCHIVE" .
cd "$ROOT"

echo ""
echo "✔ Release ready → release/$ARCHIVE"
