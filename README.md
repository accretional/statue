# statue
Statue: Svelte Static Site Generator with CMS features, launch your SaaS website in seconds

[![npm version](https://img.shields.io/npm/v/statue-ssg.svg)](https://www.npmjs.com/package/statue-ssg)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A lightning-fast static site generator that combines the power of Markdown content with SvelteKit. Create beautiful static websites in minutes, with or without SvelteKit integration.

## Features

- ✨ **Dual Mode**: Use with SvelteKit for a full-featured app or standalone for simple static sites
- 📝 **Markdown-Powered**: Write content in Markdown with frontmatter for metadata
- 🚀 **Zero Configuration**: Get started with zero configuration
- 📱 **Mobile-First**: Responsive templates out of the box
- 🔍 **SEO Friendly**: Optimized for search engines
- 🔄 **Fast Build Times**: Generate your site in seconds
- 📂 **Organized Content**: Automatically organizes content by directories

## Installation

### Global Installation

```bash
npm install -g statue-ssg
```

### Local Project Installation

```bash
npm install statue-ssg
```

## Quick Start

### Creating a New Project

#### Standard Static Site (Without SvelteKit)

```bash
# Create a new project
mkdir my-statue-site
cd my-statue-site

# Initialize a new statue project
statue-ssg init

# Install dependencies
npm install

# Build the site
npm run build

# Start a development server
npm run dev
```

#### SvelteKit Integration (Recommended)

```bash
# Create a new project
mkdir my-sveltekit-site
cd my-sveltekit-site

# Initialize a new SvelteKit project with statue integration
statue-ssg init -s

# The interactive SvelteKit setup will start
# Once complete, you can start the development server
npm run dev
```

## Project Structure

```
my-statue-site/
├── content/             # All your Markdown content goes here
│   ├── blog/            # Blog posts
│   ├── docs/            # Documentation
│   └── static/          # Static assets
├── build/               # Generated static site (after running build)
└── package.json         # Project dependencies and scripts
```

With SvelteKit integration, you'll also get:

```
my-sveltekit-site/
├── content/             # All your Markdown content goes here
├── src/                 # SvelteKit source files
│   ├── lib/             # Library code
│   │   └── cms/         # Content management code
│   └── routes/          # SvelteKit routes
│       ├── [...slug]/   # Dynamic routes for content
│       └── +page.svelte # Home page
└── static/              # Static assets
```

## Writing Content

Create Markdown files in the `content` directory with frontmatter metadata:

```markdown
---
title: My First Post
description: This is my first post using Statue SSG
date: 2025-04-02
author: Your Name
---

# Hello World

This is my first post using Statue SSG.

## Features

- Simple Markdown syntax
- Frontmatter for metadata
- Automatic HTML generation
```

## CLI Commands

Statue SSG provides several CLI commands:

```bash
# Initialize a new project
statue-ssg init     # Standard static site
statue-ssg init -s  # With SvelteKit integration

# Build the static site
statue-ssg build

# Start a development server
statue-ssg dev
```

### Build Options

```bash
# Specify input and output directories
statue-ssg build -i custom-content -o public

# Enable verbose output
statue-ssg build -v

# Use a custom template
statue-ssg build -t ./my-template
```

## Programmatic Usage

You can also use Statue SSG programmatically in your Node.js scripts:

```javascript
import { generateStaticSite } from 'statue-ssg';

await generateStaticSite({
  inputDir: 'content',    // default: 'content'
  outputDir: 'build',     // default: 'build'
  template: './template', // optional
  verbose: true           // default: false
});
```

## SvelteKit Integration

When using Statue SSG with SvelteKit, you get the best of both worlds:

1. All the power of SvelteKit for interactive components
2. The simplicity of Markdown for content
3. Static site generation for fast loading times
4. Automatic routing based on your content structure

The integration automatically:

- Sets up SvelteKit routes for your content
- Parses Markdown into HTML for rendering
- Handles metadata and frontmatter
- Provides navigation components

## Customization

### Templates

When used standalone, Statue SSG uses a default template for HTML generation. You can customize this by providing your own template directory.

When used with SvelteKit, you can customize the design by modifying the Svelte components in the `src/routes` directory.

### Styling

The default templates include minimal styling for a clean look. You can add your own CSS or use a framework like Tailwind CSS (already included when using SvelteKit integration).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
