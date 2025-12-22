---
title: Getting Started with Statue
description: Quick introduction to Statue SSG and key concepts
order: 1
icon: bolt
---

# Getting Started with Statue

Statue is a static site generator that transforms markdown files into a fast, modern website. It's built on SvelteKit and designed to be simple yet flexible.

> **Contribute to Statue!** Built a cool component, theme, or template? Share it with the community—it only takes a single command. **[Learn how →](https://github.com/accretional/statue/blob/main/CONTRIBUTING.md)**

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

Eight built-in themes available. **[Learn more →](./themes.md)**

### 🧩 Components Build Pages

Use pre-built components to construct your pages:

```svelte
<Hero />
<Stats />
<Categories {directories} />
```

Or create your own. **[See all components →](./components.md)**

### ⚙️ Config Sets Globals

One file (`site.config.js`) controls site-wide settings:

```javascript
export const siteConfig = {
  site: { name: "Your Site", url: "https://yoursite.com" },
  contact: { email: "hello@yoursite.com" },
  social: { twitter: "https://twitter.com/yourhandle" }
};
```

Use these values anywhere with `{{site.name}}`. **[Configure your site →](./site-config.md)**

### 📐 Templates Provide Structure

Start with different layouts:

```bash
npx statue init --template blog    # Blog-focused
npx statue init                     # Default
```

**[Learn about templates →](./templates.md)**

---

## Project Structure

```
your-project/
├── content/              # Markdown content
│   ├── blog/
│   └── docs/
├── src/
│   ├── lib/index.css    # Theme imports
│   └── routes/
│       ├── +page.svelte           # Homepage
│       ├── [directory]/+page.svelte   # Directory pages
│       └── [...slug]/+page.svelte     # Content pages
├── static/              # Images, favicon
└── site.config.js       # Site configuration
```

---

## Quick Actions

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

---

## Next Steps

**New to Statue?** Follow the checklist:
- **[New Site Checklist](./new-site-checklist.md)** - Step-by-step customization

**Want to learn more?**
- **[Site Configuration](./site-config.md)** - All config options
- **[Themes](./themes.md)** - Styling your site
- **[Components](./components.md)** - Component reference
- **[Templates](./templates.md)** - Using templates
- **[Routing](./routing.md)** - How URLs work

**Need help?**
- **[Statue.dev](https://statue.dev)** - Official documentation site
- **[GitHub Issues](https://github.com/accretional/statue/issues)** - Report bugs
- **[Discord](https://discord.gg/accretional)** - Community chat

Happy building! 🗿
