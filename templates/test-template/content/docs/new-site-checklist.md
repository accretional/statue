---
title: New Site Checklist
description: Step-by-step checklist for customizing your new Statue site
icon: checklist
---

# New Site Checklist

Follow this checklist to replace placeholder content and make the site your own.

> **Want to contribute back?** Statue welcomes contributions of components, themes, and templates. It only takes a single command to submit a PR. **[Learn more →](https://github.com/accretional/statue/blob/main/CONTRIBUTING.md)**

## 🎯 Essential Setup

### ✅ 1. Update Site Configuration

**File:** `site.config.js`

- [ ] Change `site.name`, `site.description`, `site.url`, `site.author`
- [ ] Update all `contact` emails and address
- [ ] Update `social` media URLs (remove ones you don't use)
- [ ] Update `legal` dates

**Why:** Template variables like `{{site.name}}` will show your info throughout the site.

**[Full config guide →](./site-config.md)**

---

### ✅ 2. Update Homepage

**File:** `src/routes/+page.svelte`

- [ ] Update page title in `<svelte:head>`
- [ ] Modify or remove components (Hero, Stats, etc.)

---

### ✅ 3. Customize About Page

**File:** `src/routes/about/+page.svelte` (if exists)

- [ ] Update page content with your information
- [ ] Use Statue components (PageHero, Mission, Team, etc.) or write custom code
- [ ] Combine components with custom Svelte for unique layouts
- [ ] Or delete the page if you don't need it

**Tip:** You can mix Statue components with your own custom Svelte components for complete flexibility.

---

### ✅ 4. Update Footer

**File:** `src/routes/+layout.svelte`

- [ ] Update `copyrightText` with your name/company
- [ ] Update `legalLinks` (privacy policy, terms of service)
- [ ] Update `socialLinks` with your social media URLs

---

### ✅ 5. Update Assets

**Location:** `static/` directory

- [ ] Replace `static/favicon.png` with your favicon
- [ ] Add your logo and images
- [ ] Remove any placeholder assets you won't use

---

### ✅ 6. Remove Example Content

**Location:** `content/` directory

- [ ] Delete placeholder files (`content/example.md`, `content/blog/hello-world.md`)
- [ ] Update `content/docs/` with your docs
- [ ] Update legal pages in `content/legal/` with your policies

---

### ✅ 7. Add Your Content

**Location:** `content/` directory

- [ ] Create your first real blog post
- [ ] Add your documentation
- [ ] Create any additional content directories

Example structure:
```
content/
├── blog/my-first-post.md
├── docs/guide.md
└── projects/project-one.md
```

---

## 🎨 Customization (Optional)

### ✅ 8. Choose Your Theme

**File:** `src/lib/index.css`

- [ ] Change the `@import` line to your chosen theme:
  ```css
  @import "statue-ssg/themes/blue.css";
  ```

Available: `blue`, `red`, `orange`, `green`, `purple`, `cyan`, `pink`, `black-white`

**[See all themes →](./themes.md)**

---

### ✅ 9. Update SEO

**File:** `site.config.js`

- [ ] Set `seo.defaultTitle`, `seo.titleTemplate`
- [ ] Set `seo.defaultDescription`, `seo.keywords`
- [ ] Add `seo.ogImage` path

---

## 🚀 Before Going Live

### ✅ 10. Test Locally

```bash
npm run build
npm run preview
```

- [ ] Visit all pages, check for broken links
- [ ] Test on mobile and desktop
- [ ] Verify images load correctly

---

### ✅ 11. Deploy

```bash
npm run build
npx wrangler pages deploy build --project-name=your-project
```

- [ ] Choose hosting (Cloudflare Pages, Netlify, Vercel, etc.)
- [ ] Configure custom domain
- [ ] Enable HTTPS

---

## 📚 Post-Launch

- [ ] Set up analytics (optional)
- [ ] Submit sitemap to search engines
- [ ] Share on social media

---

## Need Help?

- **[Statue.dev](https://statue.dev)** - Official Statue documentation site
- **[Getting Started](./get-started.md)** - Overview of Statue basics
- **[Site Config](./site-config.md)** - Configuration details
- **[Themes](./themes.md)** - Styling guide
- **[Components](./components.md)** - Component reference

**Community:**
- [Statue.dev](https://statue.dev) - Official project site
- [GitHub Issues](https://github.com/accretional/statue/issues)
- [Discord](https://discord.gg/accretional)
