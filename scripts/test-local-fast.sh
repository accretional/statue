#!/bin/bash

# Fast incremental test for template changes
# Usage: ./scripts/test-local-fast.sh [template-name]
# Only updates changed files, doesn't rebuild SvelteKit from scratch

set -e

TEMPLATE="${1:-luxury-real-estate}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TEST_DIR="$PROJECT_ROOT/build/test-$TEMPLATE"
TEMPLATE_DIR="$PROJECT_ROOT/templates/real-estate"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Fast incremental update for template: $TEMPLATE${NC}"

# Check if test directory exists
if [ ! -d "$TEST_DIR" ]; then
  echo -e "${RED}❌ Test directory doesn't exist: $TEST_DIR${NC}"
  echo -e "${YELLOW}Run ./scripts/test-local.sh $TEMPLATE first to create initial build${NC}"
  exit 1
fi

# Check if template directory exists
if [ ! -d "$TEMPLATE_DIR" ]; then
  echo -e "${RED}❌ Template directory doesn't exist: $TEMPLATE_DIR${NC}"
  exit 1
fi

echo -e "${YELLOW}📂 Syncing template files...${NC}"

# Only sync specific directories that are part of the template
# Don't use --delete to preserve SvelteKit base files
if [ -f "$TEMPLATE_DIR/site.config.json" ]; then
  echo -e "  ${BLUE}→${NC} Copying site.config.json"
  cp "$TEMPLATE_DIR/site.config.json" "$TEST_DIR/"
fi

if [ -d "$TEMPLATE_DIR/src" ]; then
  echo -e "  ${BLUE}→${NC} Syncing src/"
  rsync -av --delete --exclude='.svelte-kit/' --exclude='app.html' "$TEMPLATE_DIR/src/" "$TEST_DIR/src/"
fi

if [ -d "$TEMPLATE_DIR/static" ]; then
  echo -e "  ${BLUE}→${NC} Syncing static/"
  rsync -av --exclude='.svelte-kit/' --exclude='_app/' "$TEMPLATE_DIR/static/" "$TEST_DIR/static/"
fi

if [ -d "$TEMPLATE_DIR/content" ]; then
  echo -e "  ${BLUE}→${NC} Syncing content/"
  rsync -av --delete "$TEMPLATE_DIR/content/" "$TEST_DIR/content/"
fi

if [ -d "$TEMPLATE_DIR/scripts" ]; then
  echo -e "  ${BLUE}→${NC} Syncing scripts/"
  rsync -av --delete "$TEMPLATE_DIR/scripts/" "$TEST_DIR/scripts/"
fi

echo -e "${GREEN}✓ Files synced${NC}"

# Navigate to test directory
cd "$TEST_DIR"

# Check if dependencies need to be installed
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}📥 Installing dependencies...${NC}"
  npm install
fi

# Build and preview
echo -e "${YELLOW}🔨 Building project...${NC}"
npm run build

echo ""
echo -e "${GREEN}✨ Build complete!${NC}"
echo -e "${BLUE}📍 Test project: $TEST_DIR${NC}"
echo ""
echo -e "${YELLOW}🏃 Starting preview server...${NC}"
npm run preview
