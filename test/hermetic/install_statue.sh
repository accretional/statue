#!/bin/bash
set -e

echo "Starting statue-ssg installation and test..."

# Check if .tgz file exists in mounted directory
if [ ! -f *.tgz ]; then
    echo "No .tgz file found in mounted directory"
    exit 1
fi

PACKAGE_FILE=$(ls *.tgz | head -n 1)
echo "Found package: $PACKAGE_FILE"

# Create SvelteKit project
echo "Creating SvelteKit project..."
npx sv create . --template minimal --types ts --no-add-ons --install npm

# Install statue-ssg from mounted package
echo "Installing statue-ssg from package..."
npm install $PACKAGE_FILE

# Initialize statue-ssg
echo "Initializing statue-ssg..."
npx statue init

# Build the project
echo "Building static site..."
npm run build

# Start preview server
echo "Starting preview server on port 4173..."
echo "Server will be available at http://localhost:4173"
npm run preview -- --host 0.0.0.0 