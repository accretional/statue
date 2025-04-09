# Statue SSG

A lightning-fast static site generator that combines the power of Markdown content with SvelteKit. Create beautiful static websites in minutes, with or without SvelteKit integration.

[![npm version](https://img.shields.io/npm/v/statue-ssg.svg)](https://www.npmjs.com/package/statue-ssg)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- ✨ **Dual Mode**: Use with SvelteKit for a full-featured app or standalone for simple static sites
- 📝 **Markdown-Powered**: Write content in Markdown with frontmatter for metadata
- 🚀 **Zero Configuration**: Get started with zero configuration
- 📱 **Mobile-First**: Responsive templates out of the box
- 🔍 **SEO Friendly**: Optimized for search engines
- 🔄 **Fast Build Times**: Generate your site in seconds
- 📂 **Organized Content**: Automatically organizes content by directories
- 🎨 **Beautiful UI**: Includes a modern UI with Tailwind CSS

## Quick Start Guide

### Step 1: Create a SvelteKit Project

First, you need to create a SvelteKit project:

```bash
# Create a new SvelteKit project
npm create svelte@latest my-website

# Navigate to your project
cd my-website

# Install dependencies
npm install
```

### Step 2: Install Statue SSG

Add Statue SSG to your SvelteKit project:

```bash
npm install statue-ssg
```

### Step 3: Set Up Statue SSG

Run the setup command to copy all necessary files to your project:

```bash
npx statue-ssg setup
```

This command will:
- Copy template files to your project
- Set up the content directory structure
- Configure routes for your Markdown content
- Add necessary dependencies

### Step 4: Start Developing

Start the development server:

```bash
npm run dev -- --open
```

That's it! You now have a fully functional static site generator with your SvelteKit project.

## Creating Content

Add your Markdown content to the `content` directory:

```
content/
├── blog/           # Blog posts
│   └── post1.md    # Example: /blog/post1
├── docs/           # Documentation
│   └── guide.md    # Example: /docs/guide
└── static/         # Static pages
    └── about.md    # Example: /static/about
```

### Markdown Example

Create Markdown files with frontmatter metadata:

```markdown
---
title: My First Post
description: This is my first blog post
date: 2025-04-03
---

# Hello World

This is my first post using Statue SSG.

## Features

- Simple Markdown content
- Automatic routing
- Beautiful UI
```

## Alternative Setup Methods

If the automatic setup didn't work, you can run the postinstall script manually:

```bash
node node_modules/statue-ssg/postinstall.js
```

## CLI Commands

Statue SSG provides several useful commands:

```bash
# Set up Statue SSG in an existing SvelteKit project
npx statue-ssg setup

# Initialize a new project with SvelteKit integration
npx statue-ssg init -s

# Build the static site
npx statue-ssg build

# Display help
npx statue-ssg --help
```

## Build Options

```bash
# Specify input and output directories
npx statue-ssg build -i content -o build

# Enable verbose output
npx statue-ssg build -v
```

## License

MIT
