#!/bin/bash
# 将 assets/ 素材库同步到 public/works/，供 Next.js 引用
# 用法: npm run sync-assets

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ASSETS_DIR="$PROJECT_DIR/assets"
PUBLIC_DIR="$PROJECT_DIR/public/works"

rm -rf "$PUBLIC_DIR"
mkdir -p "$PUBLIC_DIR"

# 同步设计作品
if [ -d "$ASSETS_DIR/design" ]; then
  cp "$ASSETS_DIR/design/"* "$PUBLIC_DIR/" 2>/dev/null || true
fi

# 同步全景封面
if [ -d "$ASSETS_DIR/panorama" ]; then
  cp "$ASSETS_DIR/panorama/"* "$PUBLIC_DIR/" 2>/dev/null || true
fi

# 同步头像
if [ -d "$ASSETS_DIR/avatar" ] && [ "$(ls -A "$ASSETS_DIR/avatar")" ]; then
  cp "$ASSETS_DIR/avatar/"* "$PROJECT_DIR/public/" 2>/dev/null || true
fi

echo "✓ 素材同步完成 → public/works/"
ls "$PUBLIC_DIR" | wc -l | xargs -I{} echo "  共 {} 个文件"
