#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ASSETS_DIR="$PROJECT_DIR/assets"
PUBLIC_DIR="$PROJECT_DIR/public/works"

mkdir -p "$PUBLIC_DIR"

if [ -d "$ASSETS_DIR/design" ]; then
  cp -n "$ASSETS_DIR/design/"* "$PUBLIC_DIR/" 2>/dev/null || true
fi

if [ -d "$ASSETS_DIR/panorama" ]; then
  cp -n "$ASSETS_DIR/panorama/"* "$PUBLIC_DIR/" 2>/dev/null || true
fi

if [ -d "$ASSETS_DIR/avatar" ] && [ "$(ls -A "$ASSETS_DIR/avatar")" ]; then
  cp -n "$ASSETS_DIR/avatar/"* "$PROJECT_DIR/public/" 2>/dev/null || true
fi

echo "✓ 素材同步完成 → public/works/"
ls "$PUBLIC_DIR" | wc -l | xargs -I{} echo "  共 {} 个文件"
