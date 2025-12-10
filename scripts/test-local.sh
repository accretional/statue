#!/bin/bash

# Test local statue-ssg package in a fresh project
# Usage: ./scripts/test-local.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TEST_DIR="$PROJECT_ROOT/build/test-preview"
TARBALL_NAME="statue-ssg-local.tgz"

echo "🗿 Testing local statue-ssg package..."

# 1. Create tarball from current project
echo "📦 Creating tarball..."
cd "$PROJECT_ROOT"
npm pack --pack-destination "$PROJECT_ROOT"
TARBALL=$(ls -t statue-ssg-*.tgz | head -1)
mv "$TARBALL" "$TARBALL_NAME"
echo "✓ Created $TARBALL_NAME"

# 2. Remove old test directory if exists
if [ -d "$TEST_DIR" ]; then
  echo "🗑️  Removing old test-preview directory..."
  rm -rf "$TEST_DIR"
fi

# 3. Create fresh test directory
echo "📁 Creating test-preview directory..."
mkdir -p "$TEST_DIR"

# 4. Move tarball to test directory
mv "$TARBALL_NAME" "$TEST_DIR/"

# 5. Setup new SvelteKit project and install local package
echo "🚀 Setting up new SvelteKit project..."
cd "$TEST_DIR"
yes | npx sv create . --template minimal --types ts --no-add-ons --install npm

echo "📥 Installing local statue-ssg..."
npm install "./$TARBALL_NAME"

echo "⚙️  Running statue init..."
npx statue init

echo "📥 Installing dependencies..."
npm install

# 6. Clean up tarball
echo "🗑️  Cleaning up tarball..."
rm -f "$TARBALL_NAME"

echo ""
echo "✨ Setup complete!"
echo "📍 Test project location: $TEST_DIR"
echo ""
echo "🏃 Starting dev server..."
npm run dev
