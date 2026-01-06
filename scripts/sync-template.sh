#!/bin/bash

# Sync Development Script for Templates
# Syncs changes from template source to installed build directory
# Usage: sync-template.sh <template-name>

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Base paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"
TEMPLATES_DIR="$BASE_DIR/templates"
BUILD_DIR="$BASE_DIR/build"

# Check if template name is provided
if [ -z "$1" ]; then
    echo -e "${BLUE}Usage: $0 <template-name>${NC}"
    echo ""
    echo -e "${YELLOW}Available templates:${NC}"
    for dir in "$TEMPLATES_DIR"/*/; do
        if [ -d "$dir" ]; then
            template_name=$(basename "$dir")
            echo -e "  - ${GREEN}$template_name${NC}"
        fi
    done
    exit 1
fi

TEMPLATE_NAME="$1"
SOURCE="$TEMPLATES_DIR/$TEMPLATE_NAME"
DEST="$BUILD_DIR/test-$TEMPLATE_NAME"

echo -e "${BLUE}Syncing $TEMPLATE_NAME template...${NC}"
echo -e "  Source: ${YELLOW}$SOURCE${NC}"
echo -e "  Dest:   ${YELLOW}$DEST${NC}"
echo ""

# Check if directories exist
if [ ! -d "$SOURCE" ]; then
    echo -e "${RED}Error: Template '$TEMPLATE_NAME' not found${NC}"
    echo ""
    echo -e "${YELLOW}Available templates:${NC}"
    for dir in "$TEMPLATES_DIR"/*/; do
        if [ -d "$dir" ]; then
            template_name=$(basename "$dir")
            echo -e "  - ${GREEN}$template_name${NC}"
        fi
    done
    exit 1
fi

if [ ! -d "$DEST" ]; then
    echo -e "${RED}Error: Destination directory not found${NC}"
    echo "Run the full install first: statue install $TEMPLATE_NAME"
    exit 1
fi

# Sync directories (overlay - keeps existing files, overwrites matching ones)
echo -e "${YELLOW}Syncing src/...${NC}"
rsync -av "$SOURCE/src/" "$DEST/src/"

#echo -e "${YELLOW}Syncing static/...${NC}"
#rsync -av "$SOURCE/static/" "$DEST/static/"

echo -e "${YELLOW}Syncing content/...${NC}"
rsync -av "$SOURCE/content/" "$DEST/content/" 2>/dev/null || mkdir -p "$DEST/content"

echo -e "${YELLOW}Syncing scripts/...${NC}"
rsync -av "$SOURCE/scripts/" "$DEST/scripts/"

#echo -e "${YELLOW}Syncing config files...${NC}"
#cp "$SOURCE/site.config.js" "$DEST/site.config.js"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Sync Complete! ($TEMPLATE_NAME)${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Now run: ${BLUE}cd $DEST && npm run dev${NC}"
