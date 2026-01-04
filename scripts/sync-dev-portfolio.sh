#!/bin/bash

# Sync Development Script for Developer Portfolio Template
# Syncs changes from template source to installed build directory

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Paths
SOURCE="/Users/service/Documents/AI/Junk/statue-1/templates/developer-portfolio"
DEST="/Users/service/Documents/AI/Junk/statue-1/build/test-developer-portfolio"

echo -e "${BLUE}Syncing developer-portfolio template...${NC}"
echo -e "  Source: ${YELLOW}$SOURCE${NC}"
echo -e "  Dest:   ${YELLOW}$DEST${NC}"
echo ""

# Check if directories exist
if [ ! -d "$SOURCE" ]; then
    echo -e "${RED}Error: Source directory not found${NC}"
    exit 1
fi

if [ ! -d "$DEST" ]; then
    echo -e "${RED}Error: Destination directory not found${NC}"
    echo "Run the full install first."
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
echo -e "${GREEN}  Sync Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Now run: ${BLUE}cd $DEST && npm run dev${NC}"
