# Statue SSG

A lightning-fast static site generator that combines the power of Markdown content with SvelteKit. Create beautiful static websites in minutes, with SvelteKit integration.

[![npm version](https://img.shields.io/npm/v/statue-ssg.svg)](https://www.npmjs.com/package/statue-ssg)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- 📝 **Markdown-Powered**: Write content in Markdown with frontmatter for metadata
- 🚀 **Zero Configuration**: Get started with zero configuration
- 🔍 **SEO Friendly**: Optimized for search engines
- 🔄 **Fast Build Times**: Generate your site in seconds
- 📂 **Organized Content**: Automatically organizes content by directories
- 🎨 **Beautiful UI**: Includes a modern UI with Tailwind CSS

## Quick Start Guide

### Step 1: Create a SvelteKit Project

First, you need to create a SvelteKit project:

```bash
npx sv create .

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
npx statue init
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

## 🗣️ Troubleshooting

If you encounter any issues during installation:

1. Make sure the `--ignore-scripts` setting is not enabled in your NPM configuration

## Developer Notes

During the setup and build processes, the following occurs:

- **Project Setup:**  
  The SvelteKit project is initialized using `npx sv create` followed by installing dependencies.

- **Library Installation:**  
  Running `npm install statue-ssg` integrates the Statue SSG library into your project.

- **Initialization:**  
  Executing `npx statue init` triggers a post-install script. This script copies the template folder from within the library to your project, and updates configuration files (e.g., `svelte.config.js` and others) accordingly.

- **Content Management:**  
  Once set up, you can rapidly create a site by editing the Markdown files in the `content` folder. Group your content by simply creating new folders and adding Markdown files to them. If you want to modify the homepage, edit the `page.svelte` file under the `routes` folder. Additionally, you can extend your site by creating your own Svelte files within the `routes` folder.

- **Static Site Generation:**  
  When you run `npm run build`, the build process executes `hooks/server.js`. This file uses an `entries` method to scan all your project’s root routes and converts them into static pages.

  The rest of the rendering process relies on SvelteKit’s default behavior, where `+page.svelte` and `+page.server.js` files are rendered.

- **Preview:**  
  Finally, use `npm run preview` to view the generated static site.

These additional notes provide insight into the inner workings of Statue SSG, helping you understand and troubleshoot the setup and build processes when needed.

### Updating the Project

If you want to update the project:
- Increase the version in your `package.json`.
- Commit your changes.
- Run `npm run release` to release the update.

### Local Testing

If you want to test your changes locally before publishing:
- Run `npm pack` to compile your project into a local package.
- Then, use `npm install <path-to-compiled-folder>` to install and test the compiled version locally.
This allows you to verify all your changes in a local environment.

## License

MIT
