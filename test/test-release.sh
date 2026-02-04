#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 Statue SSG - Release Simulation Test${NC}"

# 1. Pack the current project
echo -e "${BLUE}Step 1: Packing the library...${NC}"
npm pack
PACKAGE_NAME=$(ls statue-ssg-*.tgz | head -n 1)
PACKAGE_PATH=$(pwd)/$PACKAGE_NAME

if [ ! -f "$PACKAGE_PATH" ]; then
    echo -e "${RED}❌ Error: Package creation failed.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Packed as: $PACKAGE_NAME${NC}"

# Get absolute path
START_DIR=$(pwd)
TEST_ROOT="$START_DIR/statue_test_env"

# Clean start
rm -rf "$TEST_ROOT"
mkdir -p "$TEST_ROOT"
cd "$TEST_ROOT"

echo -e "${BLUE}Test Environment: $TEST_ROOT${NC}"

echo -e "\n${BLUE}Step 2: Initializing test environment...${NC}"
echo "Creating SvelteKit project..."
yes | npx sv create . --template minimal --types ts --no-add-ons --install npm > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error: SvelteKit project creation failed.${NC}"
    exit 1
fi

echo "Installing statue-ssg from local package..."
npm install "$PACKAGE_PATH" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error: statue-ssg installation failed.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Test environment setup complete.${NC}"

TEMPLATES=($(ls "$START_DIR/templates"))
TEST_COUNT=0

for TEMPLATE in "${TEMPLATES[@]}"; do
    TEST_COUNT=$((TEST_COUNT + 1))
    echo -e "\n${BLUE}Step $((TEST_COUNT + 2)): Testing '$TEMPLATE' Template...${NC}"
    
    # Clean build directories before each test
    rm -rf build .svelte-kit

    echo "Running statue init --template $TEMPLATE..."
    if ! npx statue init --template "$TEMPLATE"; then
        echo -e "${RED}❌ TEST $TEST_COUNT FAILED: '$TEMPLATE' template initialization failed.${NC}"
        exit 1
    fi

    echo "Installing template dependencies..."
    npm install > /dev/null 2>&1
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ TEST $TEST_COUNT FAILED: '$TEMPLATE' template dependency installation failed.${NC}"
        exit 1
    fi

    echo "Attempting to build..."
    if npm run build; then
        echo -e "${GREEN}✅ TEST $TEST_COUNT PASSED: '$TEMPLATE' template built successfully!${NC}"
    else
        echo -e "${RED}❌ TEST $TEST_COUNT FAILED: '$TEMPLATE' template build failed.${NC}"
        exit 1
    fi
done

# Cleanup
cd "$START_DIR"
rm -rf $TEST_ROOT
rm "$PACKAGE_NAME"

echo -e "\n${GREEN}🎉 All tests passed! All templates built successfully.${NC}"
# echo -e "Test artifacts are located in: $TEST_ROOT"