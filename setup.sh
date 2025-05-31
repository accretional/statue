#!/bin/bash

# Statue SSG Setup Script
# This script creates a new SvelteKit project and installs Statue SSG

echo "🚀 Starting Statue SSG Setup Script..."
echo ""

# Get project name from user
read -p "Enter project name (default: my-statue-site): " PROJECT_NAME
PROJECT_NAME=${PROJECT_NAME:-my-statue-site}

echo "📁 Creating project directory: $PROJECT_NAME"
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME"

echo "🔧 Creating SvelteKit project..."
npx sv create . --template minimal --types typescript --no-add-ons --no-install

echo "📦 Installing dependencies..."
npm install

echo "🎨 Adding Tailwind CSS..."
npx svelte-add@latest tailwindcss --typography --forms --container-queries
npm install

echo "⚡ Installing Statue SSG..."
npm install statue-ssg

echo "🛠️ Initializing Statue SSG..."
npx statue init

echo ""
echo "✅ Setup completed!"
echo ""
echo "🎉 To start your project:"
echo "   cd $PROJECT_NAME"
echo "   npm run dev"
echo ""
echo "📝 Add content to the 'content' folder"
echo "🌐 Open http://localhost:5173 in your browser" 