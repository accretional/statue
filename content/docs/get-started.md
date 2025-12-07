---
title: Getting Started with Statue
description: Quick introduction to Statue SSG and key concepts
---

# Getting Started with Statue

Statue is a static site generator that transforms markdown files into a fast, modern website. It's built on SvelteKit and designed to be simple yet flexible.

## What is Statue?

Statue turns this:
```markdown
---
title: My Blog Post
---

# Hello World
This is my first post!
```

Into a fully-styled, static website with navigation, themes, and components.

## Key Concepts

### 📝 Content is Markdown

All your content lives in the `content/` directory as `.md` files. The folder structure becomes your site structure:

```
content/blog/my-post.md  →  yoursite.com/blog/my-post
content/docs/guide.md    →  yoursite.com/docs/guide
```

No database, no CMS - just files.

### 🎨 Themes Control Style

Change your entire site's look by switching one line in `src/lib/index.css`:

```css
@import "statue-ssg/themes/blue.css";
```

Eight built-in themes available. Create custom themes with CSS variables.

**[Learn more about themes →](./themes)**

### 🧩 Components Build Pages

Use pre-built components to construct your pages:

```svelte
<Hero />
<Stats />
<Categories {directories} />
```

Or create your own custom components.

**[See all components →](./components)**

### ⚙️ Config Sets Globals

One file (`site.config.js`) controls site-wide settings:

```javascript
export const siteConfig = {
  site: {
    name: "Your Site",
    url: "https://yoursite.com"
  },
  contact: {
    email: "hello@yoursite.com"
  },
  social: {
    twitter: "https://twitter.com/yourhandle"
  }
};
```

Use these values anywhere with template variables like `{{site.name}}`.

**[Configure your site →](./site-config)**

### 📐 Templates Provide Structure

Start with different layouts for different needs:

```bash
npx statue init --template blog    # Blog-focused layout
npx statue init                     # Default template
```

**[Learn about templates →](./templates)**

## Quick Start

### 1. Create a Project

```bash
npx sv create . --template minimal --types ts --no-add-ons --install npm
npm install statue-ssg
npx statue init
npm install
npm run dev
```

Your site is now running at `http://localhost:5173`

### 2. Follow the Checklist

New to Statue? Use our step-by-step checklist to customize your site:

**[New Site Checklist →](./new-site-checklist)**

### 3. Add Content

Create a markdown file in `content/`:

```markdown
---
title: My First Post
description: Getting started with Statue
date: 2025-01-15
---

# My First Post

This page is automatically rendered with navigation, styling, and more!
```

Save it as `content/blog/first-post.md` and visit `/blog/first-post`.

### 4. Build and Deploy

```bash
npm run build         # Creates static site in build/
npm run preview       # Preview the build locally
```

Deploy the `build/` directory to any static host (Cloudflare Pages, Netlify, Vercel, GitHub Pages).

**Quick deploy:**
```bash
npm run build
npx wrangler pages deploy build --project-name=my-site
```

## Project Structure

```
your-project/
├── content/              # Your markdown content
│   ├── blog/
│   └── docs/
├── src/
│   ├── lib/
│   │   └── index.css    # Theme imports
│   └── routes/
│       ├── +page.svelte           # Homepage
│       ├── [directory]/+page.svelte   # Directory pages
│       └── [...slug]/+page.svelte     # Content pages
├── static/               # Static assets (images, favicon)
└── site.config.js        # Site configuration
```

## Routing

Statue uses two types of routes:

1. **Content routes** - Automatic from `content/` folder structure
2. **Custom routes** - Manual pages in `src/routes/`

**[Understanding routing →](./routing)**

## Customizing Pages

Three main page types to customize:

- **Homepage** (`src/routes/+page.svelte`) - Landing page
- **Directory pages** (`src/routes/[directory]/+page.svelte`) - Lists content
- **Content pages** (`src/routes/[...slug]/+page.svelte`) - Renders markdown

Edit these files to change how pages look and work.

## Documentation

### Essential Guides
- **[New Site Checklist](./new-site-checklist)** - Step-by-step setup
- **[Site Configuration](./site-config)** - All config options
- **[Themes](./themes)** - Styling your site
- **[Components](./components)** - Component reference

### Reference
- **[Templates](./templates)** - Using templates
- **[Routing](./routing)** - How URLs work

### For Developers
- **[Components README](https://github.com/accretional/statue/blob/main/src/lib/components/COMPONENTS_README.md)** - Full component API
- **[Development Guide](../../DEVELOPMENT.md)** - Architecture
- **[Contributing](../../CONTRIBUTING.md)** - Contribute to Statue

## Common Tasks

### Change the theme
Edit `src/lib/index.css` and change the import line.

### Add a blog post
Create `content/blog/post-name.md` with frontmatter.

### Customize the homepage
Edit `src/routes/+page.svelte`.

### Add a custom page
Create `src/routes/pagename/+page.svelte`.

### Update site info
Edit `site.config.js`.

## Need Help?

- **[New Site Checklist](./new-site-checklist)** - Start here for new sites
- **[GitHub Issues](https://github.com/accretional/statue/issues)** - Report bugs
- **[Discord](https://discord.gg/accretional)** - Community chat

## Next Steps

1. **[Complete the checklist](./new-site-checklist)** to customize your site
2. **[Choose a theme](./themes)** that fits your style
3. **[Add your content](./new-site-checklist#-4-remove-or-update-example-content)** in markdown
4. **Deploy** to your favorite hosting provider

Happy building! 🗿
