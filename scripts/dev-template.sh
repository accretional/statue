#!/bin/bash

# Development mode for templates with symlinks
# Allows editing template files directly while running dev server
# Usage: ./scripts/dev-template.sh [template-name]

set -e

TEMPLATE="${1:-developer-portfolio}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DEV_DIR="$PROJECT_ROOT/build/dev-$TEMPLATE"
TARBALL_NAME="statue-ssg-local.tgz"

echo "🗿 Setting up dev environment for template: $TEMPLATE..."

# 1. Create tarball from current project
echo "📦 Creating tarball..."
cd "$PROJECT_ROOT"
npm pack --pack-destination "$PROJECT_ROOT"
TARBALL=$(ls -t statue-ssg-*.tgz | head -1)
mv "$TARBALL" "$TARBALL_NAME"
echo "✓ Created $TARBALL_NAME"

# 2. Remove old dev directory if exists
if [ -d "$DEV_DIR" ]; then
  echo "🗑️  Removing old dev directory..."
  rm -rf "$DEV_DIR"
fi

# 3. Create fresh dev directory
echo "📁 Creating dev directory..."
mkdir -p "$DEV_DIR"

# 4. Move tarball to dev directory
mv "$TARBALL_NAME" "$DEV_DIR/"

# 5. Setup new SvelteKit project and install local package
echo "🚀 Setting up new SvelteKit project..."
cd "$DEV_DIR"
yes | npx sv create . --template minimal --types ts --no-add-ons --install npm

echo "📥 Installing local statue-ssg..."
npm install "./$TARBALL_NAME"

echo "⚙️  Running statue init --template $TEMPLATE..."
npx statue init --template "$TEMPLATE"

echo "📥 Installing dependencies..."
npm install

# 6. Clean up tarball
rm -f "$TARBALL_NAME"

# 7. Replace copied files with symlinks to template source
echo "🔗 Creating symlinks to template source..."

TEMPLATE_DIR="$PROJECT_ROOT/templates/$TEMPLATE"
RESOURCES_DIR="$PROJECT_ROOT/resources/$TEMPLATE"
SHARED_DIR="$PROJECT_ROOT/resources/shared"

# Remove copied routes and link to template
if [ -d "$DEV_DIR/src/routes" ]; then
  rm -rf "$DEV_DIR/src/routes"
  ln -s "$TEMPLATE_DIR/src/routes" "$DEV_DIR/src/routes"
  echo "  ✓ src/routes → templates/$TEMPLATE/src/routes"
fi

# Remove copied lib and link to template (if template has lib)
if [ -d "$TEMPLATE_DIR/src/lib" ]; then
  rm -rf "$DEV_DIR/src/lib"
  ln -s "$TEMPLATE_DIR/src/lib" "$DEV_DIR/src/lib"
  echo "  ✓ src/lib → templates/$TEMPLATE/src/lib"
fi

# Remove copied static and link to resources
if [ -d "$RESOURCES_DIR/static" ]; then
  rm -rf "$DEV_DIR/static"
  ln -s "$RESOURCES_DIR/static" "$DEV_DIR/static"
  echo "  ✓ static → resources/$TEMPLATE/static"
fi

# Link site.config.js
if [ -f "$TEMPLATE_DIR/site.config.js" ]; then
  rm -f "$DEV_DIR/site.config.js"
  ln -s "$TEMPLATE_DIR/site.config.js" "$DEV_DIR/site.config.js"
  echo "  ✓ site.config.js → templates/$TEMPLATE/site.config.js"
fi

echo ""
echo "✨ Dev environment ready!"
echo "📍 Dev project location: $DEV_DIR"
echo ""
echo "📝 Edit files in:"
echo "   - templates/$TEMPLATE/src/routes/"
echo "   - templates/$TEMPLATE/src/lib/"
echo "   - resources/$TEMPLATE/static/"
echo ""
echo "🏃 Starting dev server..."
npm run dev
