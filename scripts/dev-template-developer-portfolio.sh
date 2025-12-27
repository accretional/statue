#!/bin/bash

# Sandbox dev env for the developer-portfolio template with live symlinks.
# Usage:
#   ./scripts/dev-template-developer-portfolio.sh        # reuse/create sandbox
#   ./scripts/dev-template-developer-portfolio.sh --reset  # rebuild sandbox

set -e

TEMPLATE_NAME="developer-portfolio"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TEMPLATE_DIR="$PROJECT_ROOT/templates/$TEMPLATE_NAME"
SANDBOX_ROOT="$PROJECT_ROOT/build/template-dev"
SANDBOX_DIR="$SANDBOX_ROOT/$TEMPLATE_NAME"

RESET=false
if [ "$1" = "--reset" ]; then
  RESET=true
fi

if [ ! -d "$TEMPLATE_DIR" ]; then
  echo "Template folder not found: $TEMPLATE_DIR"
  exit 1
fi

if [ "$RESET" = true ] && [ -d "$SANDBOX_DIR" ]; then
  echo "Removing existing sandbox..."
  rm -rf "$SANDBOX_DIR"
fi

if [ ! -d "$SANDBOX_DIR" ]; then
  echo "Creating sandbox at $SANDBOX_DIR"
  mkdir -p "$SANDBOX_DIR"

  echo "Creating SvelteKit project..."
  cd "$SANDBOX_DIR"
  yes | npx sv create . --template minimal --types ts --no-add-ons --install npm

  echo "Packing local statue-ssg..."
  cd "$PROJECT_ROOT"
  npm pack --pack-destination "$SANDBOX_DIR"
  TARBALL=$(ls -t "$SANDBOX_DIR"/statue-ssg-*.tgz | head -1)

  echo "Installing local statue-ssg..."
  cd "$SANDBOX_DIR"
  npm install "./$(basename "$TARBALL")"

  echo "Initializing with template..."
  npx statue init --template "$TEMPLATE_NAME"

  echo "Installing dependencies..."
  npm install

  echo "Cleaning up tarball..."
  rm -f "$TARBALL"
fi

link_item() {
  local src="$1"
  local dest="$2"
  if [ -e "$dest" ] || [ -L "$dest" ]; then
    rm -rf "$dest"
  fi
  ln -s "$src" "$dest"
}

echo "Linking template files into sandbox..."
link_item "$TEMPLATE_DIR/src" "$SANDBOX_DIR/src"
link_item "$TEMPLATE_DIR/static" "$SANDBOX_DIR/static"
link_item "$TEMPLATE_DIR/content" "$SANDBOX_DIR/content"
link_item "$TEMPLATE_DIR/site.config.js" "$SANDBOX_DIR/site.config.js"

echo ""
echo "Sandbox ready: $SANDBOX_DIR"
echo "Edit template files in: $TEMPLATE_DIR"
echo "Run dev server:"
echo "  cd \"$SANDBOX_DIR\" && npm run dev"
