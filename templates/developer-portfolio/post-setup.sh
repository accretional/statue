#!/bin/bash

# Post-setup script for developer-portfolio template
# This runs after 'npx statue init --template developer-portfolio'
# It does NOT get copied to the user's project

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Developer Portfolio Setup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if github-sync.sh exists in user's project
GITHUB_SYNC="$PROJECT_DIR/scripts/github-sync.sh"

if [ -f "$GITHUB_SYNC" ]; then
    echo -e "${YELLOW}Syncing your GitHub profile data...${NC}"
    echo ""
    cd "$PROJECT_DIR"
    bash "$GITHUB_SYNC" || echo -e "${YELLOW}⚠ GitHub sync failed. Run manually: bash scripts/github-sync.sh${NC}"
else
    echo -e "${YELLOW}⚠ github-sync.sh not found in project.${NC}"
fi

echo ""
echo -e "${GREEN}✨ Setup complete! Run 'npm run dev' to start.${NC}"
echo ""
