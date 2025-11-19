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

echo -e "${BLUE}Test Environment: $TEST_ROOT${NC}"

# ==========================================
# TEST 1: DEFAULT TEMPLATE
# ==========================================
echo -e "\n${BLUE}Step 2: Testing DEFAULT Template...${NC}"
cd "$TEST_ROOT"
mkdir test-default
cd test-default

# Command the user will run (sv create)
echo "Creating SvelteKit project..."
# yes command answers interactive questions with 'yes'
yes | npx sv create . --template minimal --types ts --no-add-ons --install npm > /dev/null 2>&1

# Install our package (instead of npm install statue-ssg)
echo "Installing statue-ssg from local pack..."
npm install "$PACKAGE_PATH" > /dev/null 2>&1

# Statue Init (Default)
echo "Running statue init..."
npx statue init

# Install dependencies (ones added after postinstall)
echo "Installing dependencies..."
npm install > /dev/null 2>&1

# Build test
echo "Attempting to build..."
if npm run build; then
    echo -e "${GREEN}✅ TEST 1 PASSED: Default template built successfully!${NC}"
else
    echo -e "${RED}❌ TEST 1 FAILED: Default template build failed.${NC}"
    exit 1
fi

# ==========================================
# TEST 2: BLOG TEMPLATE
# ==========================================
echo -e "\n${BLUE}Step 3: Testing BLOG Template...${NC}"
cd "$TEST_ROOT"
mkdir test-blog
cd test-blog

echo "Creating SvelteKit project..."
yes | npx sv create . --template minimal --types ts --no-add-ons --install npm > /dev/null 2>&1

echo "Installing statue-ssg from local pack..."
npm install "$PACKAGE_PATH" > /dev/null 2>&1

# Statue Init (Blog)
echo "Running statue init --template blog..."
npx statue init --template blog

echo "Installing dependencies..."
npm install > /dev/null 2>&1

echo "Attempting to build..."
if npm run build; then
    echo -e "${GREEN}✅ TEST 2 PASSED: Blog template built successfully!${NC}"
else
    echo -e "${RED}❌ TEST 2 FAILED: Blog template build failed.${NC}"
    exit 1
fi

# Cleanup
cd ../..
# rm -rf $TEST_ROOT # If you want to examine the test folder, you can comment this out
# rm $PACKAGE_NAME # delete tgz file

echo -e "\n${GREEN}🎉 All tests passed! The package is ready for users.${NC}"
echo -e "Test artifacts are located in: $TEST_ROOT"

