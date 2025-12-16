# AGENTS.md - Statue Complete Customization Guide

## Purpose
This document provides a comprehensive process for transforming a default statue-ssg installation into any fully customized website. This guide focuses on the technical process, common pitfalls, and critical patterns needed for successful customization - not specific content.

## When to Use This Guide
Use this guide when you need to:
- Transform a default statue-ssg installation into a custom website
- Ensure consistent theming across all pages
- Avoid common statue-ssg customization issues
- Create a site that works correctly in a single attempt

## Prerequisites
- Node.js and npm installed
- Empty project directory
- Internet connection for downloading dependencies
- Clear requirements for the final site (theme, content, purpose)

---

## Phase 1: Initial Setup and Configuration

### 1.1 Initialize Project
```bash
npm init -y
npm install statue-ssg
npx statue init
npm install
```

### 1.2 Fix ESM Compatibility
**Issue:** statue-ssg uses ESM modules which require proper package.json configuration.

**Solution:** Add `"type": "module"` to package.json:
```json
{
  "name": "your-project-name",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 1.3 Install Missing Dependencies
statue-ssg requires additional dependencies that aren't automatically installed:
```bash
npm install @sveltejs/kit svelte vite --save-dev
```

### 1.4 Copy Required Template File
**Issue:** Build will fail without app.html in the src directory.

**Solution:**
```bash
cp node_modules/statue-ssg/src/app.html src/app.html
```

### 1.5 Handle Static Assets
Place any images, fonts, or static files in:
- `static/` - For files that should be served at the root
- `static/assets/` - Recommended for images and media

Files in `static/` are copied directly to the build output.

---

## Phase 2: Site Configuration

### 2.1 Update site.config.js
This file controls site-wide settings. Update ALL sections:

**Required sections to customize:**
- `site.*` - Site name, description, URL, author
- `contact.*` - All contact information and addresses
- `social.*` - Social media links
- `legal.*` - Legal page dates and compliance settings
- `seo.*` - SEO defaults, title templates, keywords, OG images

**Template variables:**
These can be used in markdown content:
- `{{site.name}}`
- `{{contact.email}}`
- `{{legal.termsLastUpdated}}`
- etc.

---

## Phase 3: Content Strategy

### 3.1 Content Structure
statue-ssg organizes content by directory:
```
content/
├── blog/          # Blog posts (markdown files)
├── docs/          # Documentation (markdown files)
├── legal/         # Legal pages (privacy, terms, etc.)
└── [custom]/      # Any custom directories you create
```

### 3.2 Delete Default Content
Remove placeholder content that comes with statue-ssg:
```bash
rm content/blog/hello-world.md
rm content/docs/get-started.md
rm content/example.md
```

### 3.3 Markdown File Structure
All content files use frontmatter:
```markdown
---
title: Your Title
date: 2024-01-01
author: Author Name
description: Brief description for listings
---

# Content starts here

Your markdown content...
```

**Critical fields:**
- `title` - **Required** - Displays in listings and page headers
- `description` - **Recommended** - Shows in content cards
- `date` - **Optional** - For blog posts, chronological sorting
- `author` - **Optional** - Byline information

### 3.4 Content Organization
- **Blog:** Time-based content, personal stories, updates
- **Docs:** Reference material, guides, how-tos
- **Legal:** Required legal pages (privacy, terms, etc.)

Create as many markdown files as needed in each directory.

---

## Phase 4: Global Footer (Critical)

### 4.1 Create Footer Component
**Issue:** statue-ssg's default footer may not match your design, and managing footers per-page leads to duplicates.

**Solution:** Create a global footer component.

**File:** `src/lib/components/Footer.svelte`
```svelte
<footer class="site-footer">
  <div class="footer-content">
    <!-- Your footer content here -->
    <!-- Include contact info, links, copyright, etc. -->
  </div>
</footer>

<style>
  /* Your footer styles */
</style>
```

### 4.2 Update Layout
**File:** `src/routes/+layout.svelte`

Replace the statue-ssg Footer import with your custom footer:
```svelte
<script>
  import Footer from '$lib/components/Footer.svelte';
  import '$lib/index.css';

  export let data;
</script>

<main>
  <slot />
</main>

<Footer />

<style>
  /* Global styles */
</style>
```

**Critical:** Once you add Footer to the layout, **do NOT** add footers to individual pages. The layout footer appears on every page automatically.

---

## Phase 5: Page Customization

### 5.1 Homepage (src/routes/+page.svelte)

**Approach:** Complete custom implementation.

**Key elements to include:**
1. Navigation bar (consistent across all pages)
2. Hero/header section with site title
3. Main content (gallery, featured posts, etc.)
4. **NO footer** (handled by layout)

**Data access:**
```svelte
<script>
  export let data;

  // Available data:
  // data.directories - All content directories
  // data.rootContent - Content in root directory
</script>
```

**Styling approach:**
- Use scoped `<style>` blocks
- Define color scheme and typography
- Ensure responsive design

### 5.2 About Page (src/routes/about/+page.svelte)

**Approach:** Complete custom implementation.

**Key elements:**
1. Same navigation as homepage
2. About content sections
3. **NO footer** (handled by layout)

**Pattern:**
```svelte
<script>
  export let data;
</script>

<div class="page-container">
  <nav class="nav-bar">
    <!-- Navigation links -->
  </nav>

  <div class="content">
    <!-- About content -->
  </div>
</div>

<style>
  /* Match homepage theme */
</style>
```

### 5.3 Content Listing Page (src/routes/[directory]/+page.svelte)

**Purpose:** Displays list of blog posts, docs, or other content in a directory.

**Critical Issue:** Content metadata access pattern.

**Data structure:**
```javascript
// Content items have nested metadata:
item = {
  url: "/blog/post-name",
  directory: "blog",
  metadata: {
    title: "Post Title",
    description: "Post description",
    date: "2024-01-01",
    author: "Author Name"
  }
}
```

**CRITICAL PATTERN - Always use dual access:**
```svelte
{#each currentDirContent as item}
  <a href={item.url}>
    <h2>{item.metadata?.title || item.title || 'Untitled'}</h2>

    {#if item.metadata?.description || item.description}
      <p>{item.metadata?.description || item.description}</p>
    {/if}

    {#if item.metadata?.date || item.date}
      <p>{new Date(item.metadata?.date || item.date).toLocaleDateString()}</p>
    {/if}
  </a>
{/each}
```

**Why dual access?** Content may have metadata nested or at the top level. The `?.` operator prevents errors, and the `||` fallback ensures data displays either way.

**Complete structure:**
```svelte
<script>
  export let data;

  $: directoryContent = data.directoryContent;
  $: currentDirectory = data.currentDirectory;

  // Filter to current directory only
  $: currentDirContent = directoryContent.filter(page => {
    return page.directory === currentDirectory.name;
  });
</script>

<div class="page-container">
  <nav class="nav-bar">
    <!-- Same navigation as homepage -->
  </nav>

  <header class="page-header">
    <h1>{currentDirectory.title}</h1>
  </header>

  <div class="content-list">
    {#if currentDirContent.length > 0}
      {#each currentDirContent as item}
        <a href={item.url} class="content-card">
          <h2>{item.metadata?.title || item.title || 'Untitled'}</h2>
          {#if item.metadata?.description || item.description}
            <p>{item.metadata?.description || item.description}</p>
          {/if}
          {#if item.metadata?.date || item.date}
            <p class="date">{new Date(item.metadata?.date || item.date).toLocaleDateString()}</p>
          {/if}
        </a>
      {/each}
    {:else}
      <p>No content available.</p>
    {/if}
  </div>
</div>

<style>
  /* Match site theme */
</style>
```

### 5.4 Individual Content Page (src/routes/[...slug]/+page.svelte)

**Purpose:** Displays individual blog posts, documentation pages, etc.

**Data access:**
```svelte
<script>
  import { page } from '$app/stores';

  export let data;

  $: content = data.content;

  // Metadata is nested:
  // content.metadata.title
  // content.metadata.date
  // content.metadata.author
  // content.metadata.description

  // Content HTML:
  // content.content
</script>
```

**Complete structure:**
```svelte
{#if content}
  <div class="article-page">
    <nav class="nav-bar">
      <!-- Same navigation as homepage -->
    </nav>

    <article class="article-container">
      <header class="article-header">
        <h1>{content.metadata.title}</h1>
        {#if content.metadata.date}
          <p class="date">{new Date(content.metadata.date).toLocaleDateString()}</p>
        {/if}
        {#if content.metadata.author}
          <p class="author">by {content.metadata.author}</p>
        {/if}
      </header>

      <div class="article-content">
        {@html content.content}
      </div>
    </article>
  </div>
{:else}
  <div class="error-page">
    <h1>404 - Content Not Found</h1>
    <a href="/">Return Home</a>
  </div>
{/if}

<style>
  /* Article typography and markdown styles */

  /* Style rendered markdown */
  .article-content :global(h1) { /* styles */ }
  .article-content :global(h2) { /* styles */ }
  .article-content :global(p) { /* styles */ }
  .article-content :global(a) { /* styles */ }
  .article-content :global(code) { /* styles */ }
  .article-content :global(pre) { /* styles */ }
  .article-content :global(table) { /* styles */ }
  .article-content :global(blockquote) { /* styles */ }
  /* ... etc */
</style>
```

**Important:** Use `:global()` to style rendered HTML content from markdown.

---

## Phase 6: Theme Consistency

### 6.1 Design System
Define and consistently use:

**Colors:**
- Primary color(s)
- Background colors
- Text colors (multiple shades)
- Accent/highlight colors

**Typography:**
- Font families
- Font sizes
- Font weights
- Line heights
- Letter spacing

**Spacing:**
- Padding values
- Margin values
- Gap values

**Components:**
- Navigation bar (exact same on every page)
- Buttons/links
- Cards
- Headers

### 6.2 Navigation Pattern
Your navigation should be **identical** on every page:

```svelte
<nav class="nav-bar">
  <a href="/" class="nav-link" class:active={condition}>Home</a>
  <a href="/about" class="nav-link" class:active={condition}>About</a>
  <a href="/blog" class="nav-link" class:active={condition}>Blog</a>
  <a href="/docs" class="nav-link" class:active={condition}>Docs</a>
</nav>
```

Copy this exact structure to:
- Homepage (+page.svelte)
- About page (about/+page.svelte)
- Directory listings ([directory]/+page.svelte)
- Individual posts ([...slug]/+page.svelte)

### 6.3 Style Reuse
For truly consistent styling across pages, consider:

1. **Shared CSS file** in `src/lib/`
2. **CSS custom properties** (CSS variables)
3. **Exact style block duplication** across pages

Example with CSS variables:
```css
:root {
  --color-primary: #your-color;
  --color-background: #your-color;
  --color-text: #your-color;
  --font-main: your-font;
}
```

---

## Phase 7: Build and Deploy

### 7.1 Test Build
```bash
npm run build
```

**Common build warnings you can ignore:**
- "Component has unused export property 'data'"
- CSS optimization warnings

**Errors you must fix:**
- Missing files
- Syntax errors
- Import errors

### 7.2 Test Locally
```bash
npm run preview
```

Navigate to the local URL and verify:
- All pages load
- Navigation works
- Content displays
- Images load
- Footer appears on all pages (once)
- No console errors

### 7.3 Package for Deployment
```bash
zip -r site-package.zip build/
```

The `build/` directory contains the complete static site ready for deployment to:
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Any static hosting service

---

## Critical Issues and Solutions

### Issue 1: Empty Content Cards
**Symptom:** Content listing pages show cards but no titles, descriptions, or dates.

**Cause:** Incorrect metadata access pattern.

**Solution:** Always use `item.metadata?.property || item.property` pattern:
```svelte
{item.metadata?.title || item.title || 'Untitled'}
```

### Issue 2: Duplicate Footers
**Symptom:** Footer appears twice on some pages.

**Cause:** Footer in layout AND in individual page files.

**Solution:**
1. Add Footer component to layout only
2. Remove ALL `<footer>` elements from individual page files
3. Rebuild

### Issue 3: ESM Import Errors
**Symptom:** "This package is ESM only" build error.

**Cause:** Missing `"type": "module"` in package.json.

**Solution:** Add to package.json root level:
```json
{
  "type": "module"
}
```

### Issue 4: Missing app.html
**Symptom:** Build fails with "src/app.html does not exist".

**Cause:** SvelteKit requires app.html template file.

**Solution:**
```bash
cp node_modules/statue-ssg/src/app.html src/app.html
```

### Issue 5: Inconsistent Styling
**Symptom:** Pages look different from each other.

**Cause:** Different styling on different pages.

**Solution:**
1. Define design system first
2. Copy exact same navigation structure to all pages
3. Use same color variables
4. Copy working styles between pages

### Issue 6: Navigation Not Highlighting
**Symptom:** Active page not indicated in navigation.

**Cause:** Missing or incorrect active state logic.

**Solution:** Use `class:active={condition}` directive:
```svelte
<a href="/blog" class:active={currentPath === '/blog'}>Blog</a>
```

---

## Verification Checklist

Before considering customization complete, verify:

### Content
- [ ] All default content deleted
- [ ] All custom content created with proper frontmatter
- [ ] Legal pages updated or removed
- [ ] site.config.js fully customized

### Structure
- [ ] Homepage displays correctly
- [ ] About page displays correctly
- [ ] Content listing pages show all items with titles
- [ ] Individual content pages display properly
- [ ] All internal links work

### Theme
- [ ] Navigation bar identical on all pages
- [ ] Colors consistent across site
- [ ] Typography consistent across site
- [ ] Footer appears exactly once on every page
- [ ] Mobile responsive design works

### Technical
- [ ] Site builds without errors (`npm run build`)
- [ ] Site previews correctly (`npm run preview`)
- [ ] No console errors in browser
- [ ] All images load
- [ ] All routes work (no 404s for valid content)

---

## Customization Workflow

### Recommended Order:
1. **Setup** - Initialize, install, configure (Phase 1)
2. **Config** - Update site.config.js (Phase 2)
3. **Design** - Define color scheme, typography (Phase 6.1)
4. **Footer** - Create global footer component (Phase 4)
5. **Homepage** - Build and style homepage (Phase 5.1)
6. **Content** - Create all content files (Phase 3)
7. **Pages** - Customize all page templates (Phase 5.2-5.4)
8. **Verify** - Check all items in verification checklist
9. **Build** - Build and package (Phase 7)

### Key Success Factors:
1. **Complete setup first** - Don't skip dependency installation
2. **Design system defined** - Know your colors and fonts before coding
3. **Single footer** - Only in layout, never in pages
4. **Consistent navigation** - Same structure everywhere
5. **Correct metadata access** - Use dual pattern: `item.metadata?.x || item.x`
6. **Test frequently** - Build and preview often
7. **Follow phases in order** - Each phase builds on previous

---

## Understanding statue-ssg Architecture

### File Structure:
```
project/
├── src/
│   ├── lib/
│   │   ├── components/     # Your custom components
│   │   └── index.css       # Global styles
│   ├── routes/
│   │   ├── +layout.svelte          # Global layout (footer here)
│   │   ├── +page.svelte            # Homepage
│   │   ├── about/+page.svelte      # About page
│   │   ├── [directory]/+page.svelte    # Content listings
│   │   └── [...slug]/+page.svelte      # Individual posts
│   └── app.html            # HTML template
├── static/
│   └── assets/             # Images, media
├── content/
│   ├── blog/               # Blog posts
│   ├── docs/               # Documentation
│   └── legal/              # Legal pages
├── site.config.js          # Site configuration
└── package.json            # Project config
```

### Data Flow:
1. Markdown files in `content/` → Processed by statue-ssg
2. Metadata extracted from frontmatter → Stored as `item.metadata`
3. Content rendered to HTML → Stored as `item.content`
4. Data passed to pages via `export let data`
5. Pages render using Svelte templates
6. Built to static HTML in `build/`

### When to Use statue-ssg:
- Content-driven sites
- Blogs and documentation
- Portfolio sites
- Marketing sites with frequent content updates

### When NOT to Use statue-ssg:
- Interactive web apps
- Sites requiring authentication
- Sites with real-time data
- E-commerce (without external services)

---

## Additional Resources

- **statue-ssg docs:** Check npm package README
- **SvelteKit docs:** https://kit.svelte.dev
- **Markdown guide:** https://www.markdownguide.org
- **Frontmatter spec:** https://jekyllrb.com/docs/front-matter/

---

## Summary

Successfully customizing statue-ssg requires:

1. **Proper initialization** with all dependencies
2. **Global footer** in layout only
3. **Consistent navigation** across all pages
4. **Correct metadata access** pattern in listings
5. **Complete content** replacement
6. **Unified theme** throughout

Follow this guide's phases in order, use the critical patterns described, avoid the common issues documented, and verify against the checklist. This approach ensures complete customization in a single pass.
