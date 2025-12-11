#!/bin/bash

# Test statue sync on a real project using statue-ssg
# Usage: ./scripts/test-sync.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TEST_DIR="$PROJECT_ROOT/build/test-sync"
TARBALL_NAME="statue-ssg-local.tgz"
REPO_URL="https://github.com/accretional/statue-src.git"

echo "🗿 Testing statue sync on real project..."

# 1. Create tarball from current project
echo "📦 Creating tarball..."
cd "$PROJECT_ROOT"
npm pack --pack-destination "$PROJECT_ROOT"
TARBALL=$(ls -t statue-ssg-*.tgz | head -1)
mv "$TARBALL" "$TARBALL_NAME"
echo "✓ Created $TARBALL_NAME"

# 2. Remove old test directory if exists
if [ -d "$TEST_DIR" ]; then
  echo "🗑️  Removing old test-sync directory..."
  rm -rf "$TEST_DIR"
fi

# 3. Clone the repo (site-rework branch)
echo "📥 Cloning $REPO_URL (branch: site-rework)..."
git clone -b site-rework "$REPO_URL" "$TEST_DIR"

# 4. Move tarball to test directory
mv "$TARBALL_NAME" "$TEST_DIR/"

# 5. Install local statue-ssg
echo "📥 Installing local statue-ssg..."
cd "$TEST_DIR"
npm install "./$TARBALL_NAME"

# 6. Run statue sync-routes
echo "🔄 Running statue sync-routes..."
npx statue sync-routes

# 7. Install dependencies
echo "📥 Installing dependencies..."
npm install

# 8. Keep tarball in test directory for sharing
echo "📦 Tarball kept at: $TEST_DIR/$TARBALL_NAME"

echo ""
echo "✨ Setup complete!"
echo "📍 Test project location: $TEST_DIR"
echo ""
echo "💡 To share: zip the $TEST_DIR folder - tarball is included"
echo "💡 Recipient can run: npm install ./$TARBALL_NAME && npx statue sync-routes && npm install && npm run dev"
echo ""
echo "🏃 Starting dev server..."
npm run dev
