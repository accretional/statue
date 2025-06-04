# Docker-Based Hermetic Testing for statue-ssg

## Overview

This document explains our Docker-based testing architecture that allows rapid, isolated testing of the `statue-ssg` npm package without rebuilding containers for every test cycle.

## File Organization

All testing-related files are organized in the `test/hermetic/` directory:

```
test/hermetic/
├── .dockerignore          # Docker ignore patterns
├── Dockerfile             # Container image definition
├── install_statue.sh      # Container setup script
├── test_local.sh          # Host testing script
└── docker-testing-guide.md # This documentation
```

## Architecture Concept

### Single-Build Container Approach
- **Docker Image**: Built once, contains all necessary tools and scripts
- **Docker Container**: Created fresh for each test, uses mounted package files
- **Hermetic Testing**: Each test runs in a clean, isolated environment

## Core Components

### 1. `test/hermetic/Dockerfile`
- Single-stage build with Node.js 18 Alpine
- Includes `install_statue.sh` script
- Pre-configured with all necessary dependencies
- **Built once, reused multiple times**

### 2. `test/hermetic/install_statue.sh` (Container Script)
- Creates fresh SvelteKit project
- Installs mounted `.tgz` package
- Runs `statue init` and builds project
- Starts preview server on port 4173

### 3. `test/hermetic/test_local.sh` (Host Script)
- Navigates to project root directory
- Cleans up previous `.tgz` files
- Creates new npm package with `npm pack`
- Runs Docker container with mounted package
- Tests server response with `curl`
- Automatically determines pass/fail status

## Commands

### One-Time Setup
```bash
# Build the Docker image (only needed once)
npm run docker:build
```

### Testing Workflow
```bash
# Run complete test cycle after code changes
npm run test:local
```

### Combined Setup + Test
```bash
# Build image and run test in one command
npm run docker:test
```

## Test Flow

1. **Package Creation**: Current codebase → `.tgz` file (in project root)
2. **Container Launch**: Fresh container with mounted package
3. **Environment Setup**: SvelteKit project + statue-ssg installation
4. **Build & Serve**: Project build + preview server startup
5. **Validation**: HTTP response test via `curl`
6. **Cleanup**: Container stop and removal

## Benefits

- **Speed**: No container rebuilds, only package mounting
- **Isolation**: Each test runs in pristine environment
- **Automation**: Pass/fail determination without manual intervention
- **Efficiency**: Reuses pre-built image across multiple test cycles
- **CI/CD Ready**: Mimics production deployment pipeline
- **Organization**: All test files contained in dedicated directory

## Test Results

- **✅ PASS**: Server responds within 60 seconds (30 attempts × 2s)
- **❌ FAIL**: Server unresponsive or container crashes
- **Auto-cleanup**: Containers automatically stopped and removed

## Usage for Engineers

After making code changes:

```bash
# Quick test (from project root)
npm run test:local

# View detailed output
npm run test:local 2>&1 | tee test-output.log

# Manual execution (from project root)
./test/hermetic/test_local.sh
```

## Technical Details

- **Port**: 4173 (SvelteKit preview default)
- **Timeout**: 60 seconds maximum wait time
- **Mount Point**: Package file mounted to `/test-project/`
- **Base Image**: `node:18-alpine`
- **Test Method**: HTTP GET request to root path
- **Working Directory**: Script automatically navigates to project root

This architecture provides rapid feedback loops for development while ensuring tests run in production-like conditions. 