---
title: New Site Checklist
description: Step-by-step checklist for customizing your new Statue site
---

# New Site Checklist

Welcome to your new Statue site! Follow this checklist to replace placeholder content and make the site your own.

## 🎯 Essential Setup

### ✅ 1. Update Site Configuration

**File:** `site.config.js` (in your project root)

- [ ] Change `site.name` to your site's name
- [ ] Update `site.description` with your site description
- [ ] Set `site.url` to your actual domain (e.g., `https://yoursite.com`)
- [ ] Change `site.author` to your name or organization
- [ ] Update all `contact` email addresses (email, privacyEmail, supportEmail)
- [ ] Update `contact.phone` and `contact.address` with your information
- [ ] Update all `social` media URLs or remove ones you don't use
- [ ] Update `legal.privacyPolicyLastUpdated` and `legal.termsLastUpdated` dates

**Why:** This ensures all template variables throughout your site show correct information.

**Learn more:** [Site Configuration Guide](./site-config)

---

### ✅ 2. Choose Your Theme

**File:** `src/lib/index.css`

- [ ] Pick a theme color (blue, red, orange, green, purple, cyan, pink, or black-white)
- [ ] Change the `@import` line to your chosen theme:
  ```css
  @import "statue-ssg/themes/blue.css";
  ```
- [ ] Or create a custom theme if you have brand colors

**Why:** Sets the visual style for your entire site.

**Learn more:** [Themes Guide](./themes)

---

### ✅ 3. Replace Homepage Content

**File:** `src/routes/+page.svelte`

- [ ] Update the page title in `<svelte:head>`
- [ ] Modify or remove the `Hero` component
- [ ] Update or remove the `Stats` component
- [ ] Check if the `Categories` and `LatestContent` components show what you want

**Why:** The homepage is what visitors see first.

**Note:** You can remove components you don't need or reorder them.

---

### ✅ 4. Remove or Update Example Content

**Location:** `content/` directory

- [ ] Delete `content/example.md` (if it exists)
- [ ] Review `content/blog/hello-world.md` - delete or replace it
- [ ] Update or delete docs in `content/docs/`
- [ ] Update legal pages in `content/legal/` with your policies

**Why:** You don't want placeholder content live on your site.

---

### ✅ 5. Add Your Own Content

**Location:** `content/` directory

- [ ] Create your first blog post in `content/blog/`
- [ ] Add documentation pages in `content/docs/`
- [ ] Create any additional content directories you need

**Example structure:**
```
content/
├── blog/
│   └── my-first-post.md
├── docs/
│   └── guide.md
└── projects/
    └── project-one.md
```

**Learn more:** [Content Structure Guide](./content-structure)

---

## 🎨 Customization (Optional)

### ✅ 6. Customize the About Page (if you have one)

**File:** `src/routes/about/+page.svelte` (create if it doesn't exist)

- [ ] Update the `PageHero` title and description
- [ ] Modify the `Mission` component text
- [ ] Update `Team` members with your actual team
- [ ] Customize the `WhyChooseUs` features
- [ ] Update the `CTA` buttons and links

**Or:** Delete this page if you don't need it.

---

### ✅ 7. Update Navigation

The navigation automatically shows your content directories. If you want custom pages:

- [ ] Create new routes in `src/routes/` for pages like `/contact` or `/pricing`
- [ ] These will automatically appear in the navigation bar

---

### ✅ 8. Customize Footer

**File:** `src/routes/+layout.svelte`

- [ ] Update `copyrightText` with your copyright notice
- [ ] Modify `legalLinks` to point to your legal pages
- [ ] Update `socialLinks` with your social media accounts
- [ ] Or customize the entire Footer component

---

### ✅ 9. Add Static Assets

**Location:** `static/` directory

- [ ] Replace `static/favicon.png` with your favicon
- [ ] Add your logo to `static/` if needed
- [ ] Add any images you'll use in content

**Note:** Files in `static/` are served at the root URL.

---

### ✅ 10. Update SEO Settings

**File:** `site.config.js`

- [ ] Set `seo.defaultTitle`
- [ ] Set `seo.titleTemplate` (e.g., `"%s | Your Site"`)
- [ ] Set `seo.defaultDescription`
- [ ] Update `seo.keywords` array
- [ ] Add `seo.ogImage` path (for social sharing)

**Why:** Better SEO = more visibility.

---

## 🚀 Before Going Live

### ✅ 11. Test Your Site Locally

```bash
npm run build
npm run preview
```

- [ ] Visit all pages and check for broken links
- [ ] Test on mobile and desktop
- [ ] Verify images load correctly
- [ ] Check that forms work (if you have any)

---

### ✅ 12. Deploy Your Site

- [ ] Choose a hosting provider (Cloudflare Pages, Netlify, Vercel, etc.)
- [ ] Set up deployment from your git repository
- [ ] Configure your custom domain (if you have one)
- [ ] Enable HTTPS

**Quick deploy to Cloudflare Pages:**
```bash
npm run build
npx wrangler pages deploy build --project-name=your-project-name
```

**Learn more:** See deployment section in [README](../../README.md)

---

## 📚 Next Steps

Once your site is live:

- [ ] Set up analytics (if desired)
- [ ] Submit your sitemap to search engines
- [ ] Share your site on social media
- [ ] Keep adding content regularly

---

## Need Help?

- **[Getting Started Guide](./get-started)** - Overview of Statue basics
- **[Components Guide](./components)** - All available components
- **[Themes Guide](./themes)** - Styling your site
- **[Site Config Guide](./site-config)** - Configuration options

**Community:**
- [GitHub Issues](https://github.com/accretional/statue/issues)
- [Discord](https://discord.gg/accretional)
