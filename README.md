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
- 🎨 **Beautiful UI**: Includes a modern UI with Tailwind CSS

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

#### SvelteKit Integration (Recommended)

```bash
# 1. Create a new SvelteKit project
npm create svelte@latest my-statue-site
cd my-statue-site
npm install

# 2. Install statue-ssg
npm install statue-ssg

# 3. Run the setup command to copy all necessary files
npx statue-ssg setup

# 4. Start the development server
npm run dev
```

> **Note:** If the automatic setup didn't work after installation, you can manually run the setup command `npx statue-ssg setup` which will copy all necessary files to your project.

Statue SSG will copy all necessary files to your project, including:

- Dynamic route handlers for Markdown content
- Content processor utilities
- Example content structure
- Beautiful UI components
- Tailwind CSS integration

You can also use the CLI to initialize a project:

```bash
# If you already have a SvelteKit project
cd your-sveltekit-project
npx statue-ssg init -s
```

#### Standard Static Site (Without SvelteKit)

```bash
# Create a new project
mkdir my-statue-site
cd my-statue-site

# Initialize a new statue project
npx statue-ssg init

# Install dependencies
npm install

# Build the site
npm run build

# Start a development server
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
│   │   ├── cms/         # Content management code
│   │   └── components/  # Reusable components
│   └── routes/          # SvelteKit routes
│       ├── [...slug]/   # Dynamic routes for content pages
│       ├── [directory]/ # Dynamic routes for content folders
│       └── +page.svelte # Home page
├── static/              # Static assets
└── package.json         # Project dependencies and scripts
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

## How Content is Processed

Statue SSG automatically scans your content directory and processes all markdown files:

1. **Root directory**: Files in the root of the content folder (e.g., `content/example.md`) are accessible at `/example`
2. **Subdirectories**: Files in subdirectories (e.g., `content/blog/post.md`) are accessible at `/blog/post`
3. **Directory index**: A home page will show all available content directories
4. **Directory pages**: Each directory (like `/blog`) will show a list of all content in that directory

With SvelteKit integration, dynamic routes are automatically set up to render your content with beautiful UI components.

## CLI Commands

Statue SSG provides several CLI commands:

```bash
# Initialize a new project
statue-ssg init     # Standard static site
statue-ssg init -s  # With SvelteKit integration

# Set up Statue SSG in an existing SvelteKit project
statue-ssg setup

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

Additionally, you can use the content processing functions directly in your server-side code:

```javascript
import { 
  getAllContent, 
  getContentByUrl, 
  getContentDirectories 
} from 'statue-ssg';

// Get all markdown content
const allContent = getAllContent();

// Get content for a specific URL
const pageContent = getContentByUrl('/blog/post-1');

// Get all content directories
const directories = getContentDirectories();
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
- Creates beautiful, responsive UI with Tailwind CSS

### Dynamic Routes

Statue SSG sets up two types of dynamic routes in your SvelteKit project:

1. **[...slug]**: Handles individual content pages (e.g., `/blog/post-1`)
2. **[directory]**: Displays content listings for directories (e.g., `/blog`)

These routes automatically find and render the appropriate content based on the URL.

## Troubleshooting

### Files Not Copying During Installation

If the required files don't automatically copy during installation, you can run the setup command manually:

```bash
npx statue-ssg setup
```

This will copy all necessary files from the package to your project.

### Manual Setup

In rare cases where the setup command doesn't work, you can run the postinstall script directly:

```bash
node node_modules/statue-ssg/postinstall.js
```

## Customization

### Templates

When used standalone, Statue SSG uses a default template for HTML generation. You can customize this by providing your own template directory.

When used with SvelteKit, you can customize the design by modifying the Svelte components in the `src/routes` directory.

### Styling

The default templates include styling with Tailwind CSS for a clean, modern look. You can customize the design by:

1. Modifying the Tailwind configuration in `tailwind.config.js`
2. Editing the component styles in the route files
3. Adding your own CSS in `src/app.html` or component-specific `<style>` tags

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
