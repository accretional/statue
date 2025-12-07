---
title: New Site Checklist
description: Step-by-step checklist for customizing your new Statue site
---

# New Site Checklist

Follow this checklist to replace placeholder content and make the site your own.

## 🎯 Essential Setup

### ✅ 1. Update Site Configuration

**File:** `site.config.js`

- [ ] Change `site.name`, `site.description`, `site.url`, `site.author`
- [ ] Update all `contact` emails and address
- [ ] Update `social` media URLs (remove ones you don't use)
- [ ] Update `legal` dates

**Why:** Template variables like `{{site.name}}` will show your info throughout the site.

**[Full config guide →](./site-config)**

---

### ✅ 2. Choose Your Theme

**File:** `src/lib/index.css`

- [ ] Change the `@import` line to your chosen theme:
  ```css
  @import "statue-ssg/themes/blue.css";
  ```

Available: `blue`, `red`, `orange`, `green`, `purple`, `cyan`, `pink`, `black-white`

**[See all themes →](./themes)**

---

### ✅ 3. Update Homepage

**File:** `src/routes/+page.svelte`

- [ ] Update page title in `<svelte:head>`
- [ ] Modify or remove components (Hero, Stats, etc.)

---

### ✅ 4. Remove Example Content

**Location:** `content/` directory

- [ ] Delete placeholder files (`content/example.md`, `content/blog/hello-world.md`)
- [ ] Update `content/docs/` with your docs
- [ ] Update legal pages in `content/legal/` with your policies

---

### ✅ 5. Add Your Content

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

### ✅ 6. Customize About Page

**File:** `src/routes/about/+page.svelte` (if exists)

- [ ] Update PageHero, Mission, Team, WhyChooseUs components
- [ ] Or delete the page if you don't need it

---

### ✅ 7. Update Footer

**File:** `src/routes/+layout.svelte`

- [ ] Update `copyrightText`, `legalLinks`, `socialLinks`

---

### ✅ 8. Add Your Assets

**Location:** `static/` directory

- [ ] Replace `static/favicon.png` with your favicon
- [ ] Add your logo and images

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

- **[Getting Started](./get-started)** - Overview of Statue basics
- **[Site Config](./site-config)** - Configuration details
- **[Themes](./themes)** - Styling guide
- **[Components](./components)** - Component reference

**Community:**
- [GitHub Issues](https://github.com/accretional/statue/issues)
- [Discord](https://discord.gg/accretional)
