# Statue SSG

A lightning-fast static site generator that combines the power of Markdown content with SvelteKit. Create beautiful static websites in minutes, with or without SvelteKit integration.

[![npm version](https://img.shields.io/npm/v/statue-ssg.svg)](https://www.npmjs.com/package/statue-ssg)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

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
npx sv create .

# Install dependencies
npm install
```

### Step 2: Install Statue SSG

Add Statue SSG to your SvelteKit project:

```bash
npm install statue-ssg
```

### Step 3: Set Up Statue SSG

After installation, the setup process will automatically run. If it doesn't, you can manually run:

```bash
node node_modules/statue-ssg/postinstall.js
```

This will:
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

Use the standard SvelteKit build process:

```bash
npm run build
```

This will prerender all your content pages using SvelteKit's static adapter.

## 📥 Installation and Usage

There are several methods for installing Statue SSG:

### Automatic Installation (Recommended)

```bash
# Add the package to your project
npm install statue-ssg

# Complete installation (postinstall runs automatically with npm 7+)
npx statue init
```

### Alternative Methods

If automatic installation doesn't work, you can try these alternative methods:

```bash
# Using the setup script directly
npm run setup

# or using the alternative command
npx statue-setup
```

### Manual Installation

```bash
# Traditional method
node node_modules/statue-ssg/postinstall.js
```

## 🗣️ Troubleshooting

If you encounter any issues during installation:

1. Make sure the `--ignore-scripts` setting is not enabled in your NPM configuration
2. Ensure the `fs-extra` package is added as a dependency in your project
3. Examine error messages to identify problems

## License

MIT
