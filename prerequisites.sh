#!/usr/bin/env bash
# prerequisites.sh — Install the fsharp-wasm compiler (fable) on your PATH.
#
# Downloads the self-contained binary for your platform from GitHub Releases
# and installs it to ~/.local/bin (created if missing).
#
# Usage:
#   bash prerequisites.sh           — install latest release
#   bash prerequisites.sh v0.1-experimental  — install a specific tag
#
# After running, open a new shell (or run: export PATH="$HOME/.local/bin:$PATH")
# then verify with: fable --version

set -euo pipefail

REPO="fsharp-wasm/fsharp-wasm"
TAG="${1:-latest}"
INSTALL_DIR="${FSHARP_WASM_INSTALL_DIR:-$HOME/.local/bin}"

# ── resolve release URL ───────────────────────────────────────────────────────

OS="$(uname -s)"
ARCH="$(uname -m)"

case "${OS}-${ARCH}" in
    Linux-x86_64)   ASSET="fsharp-wasm-linux-x64.tar.gz" ;;
    Darwin-x86_64)  ASSET="fsharp-wasm-osx-x64.tar.gz" ;;
    Darwin-arm64)   ASSET="fsharp-wasm-osx-arm64.tar.gz" ;;
    *)
        echo "✗ Unsupported platform: ${OS}-${ARCH}"
        echo "  Build the compiler from source: https://github.com/${REPO}"
        exit 1
        ;;
esac

if [ "$TAG" = "latest" ]; then
    API_URL="https://api.github.com/repos/${REPO}/releases/latest"
else
    API_URL="https://api.github.com/repos/${REPO}/releases/tags/${TAG}"
fi

echo "▸ Fetching release info (${TAG})..."
DOWNLOAD_URL=$(curl -sSf "$API_URL" \
    | grep '"browser_download_url"' \
    | grep "${ASSET}" \
    | head -1 \
    | sed 's/.*"browser_download_url": "\(.*\)".*/\1/')

if [ -z "$DOWNLOAD_URL" ]; then
    echo "✗ Could not find asset '${ASSET}' in release '${TAG}'."
    echo "  Check: https://github.com/${REPO}/releases"
    exit 1
fi

# ── download & install ────────────────────────────────────────────────────────

mkdir -p "$INSTALL_DIR"

echo "▸ Downloading ${ASSET}..."
curl -L --progress-bar "$DOWNLOAD_URL" | tar xz -C "$INSTALL_DIR"
chmod +x "$INSTALL_DIR/fable"

# ── verify ────────────────────────────────────────────────────────────────────

echo ""
echo "✔ Installed to ${INSTALL_DIR}/fable"
echo ""

if ! echo "$PATH" | grep -q "$INSTALL_DIR"; then
    echo "  ⚠  ${INSTALL_DIR} is not in your PATH."
    echo "  Add this line to your shell profile (~/.bashrc, ~/.zshrc, etc.):"
    echo ""
    echo "    export PATH=\"${INSTALL_DIR}:\$PATH\""
    echo ""
fi

"$INSTALL_DIR/fable" --version && echo "  fable is ready."
