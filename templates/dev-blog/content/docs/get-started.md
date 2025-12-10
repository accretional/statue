---
title: Getting Started with Statue
description: A comprehensive guide to customizing your Statue Site
---

# Getting Started

**Congratulations!**

If you're reading this, you've successfully deployed your site with Statue and you're ready to start customizing!

This document provides a comprehensive overview of all the files in your Statue static site generator project that you can customize to tailor your site to your needs.

## Overview

Statue is a static site generator built on SvelteKit that converts markdown files into a beautiful, modern website. The project uses the `statue-ssg` package for core functionality and provides a flexible structure for customization.

## Site Configuration

### `site.config.js`

**Location:** Root directory

**Purpose:** Central configuration file for your entire site. This is the primary file you'll modify to customize site-wide settings.

**What to customize:**
- **Site Information:** Update `site.name`, `site.description`, `site.url`, and `site.author` to reflect your brand.
- **Contact Information:** Modify all email addresses (`email`, `privacyEmail`, `supportEmail`), phone number, and mailing address in the `contact` object.
- **Social Media Links:** Update all social media URLs in the `social` object (Twitter, GitHub, LinkedIn, Facebook, Instagram, YouTube).
- **Legal Pages:** Configure privacy policy and terms of service dates, California compliance settings, and "Do Not Sell" page options in the `legal` object.
- **SEO Settings:** Customize default title, title template, description, keywords, Open Graph image, and Twitter card settings in the `seo` object.

## Content Management

### Content Directory Structure

**Location:** `content/` directory

**Purpose:** All markdown content files are stored here. The directory structure determines your site's navigation and URL structure.

**What to customize:**
- **Add Content:** Create new markdown files in `content/` or subdirectories (e.g., `content/blog/`, `content/docs/`).
- **Directory Structure:** Each subdirectory becomes a navigation section. For example:
  - `content/blog/` → `/blog` route
  - `content/docs/` → `/docs` route
  - `content/legal/` → `/legal` route
- **Frontmatter:** Each markdown file can include frontmatter with metadata:

  ```
  ---
  title: Your Page Title
  description: Page description for SEO
  date: 2024-01-15
  author: Author Name
  warning: Optional warning message
  ---
  ```

### Example Content Files

- `content/blog/hello-world.md` - Blog post example
- `content/docs/get-started.md` - Documentation page example
- `content/legal/privacy-policy.md` - Legal page example

## Styling and Theming

### `src/lib/index.css`

**Location:** `src/lib/index.css`

**Purpose:** Main stylesheet that imports themes and configures Tailwind CSS.

**What to customize:**
- **Theme Selection:** Change the `@import` statement to use a different built-in theme:
  - `statue-ssg/themes/black-white.css` (default)
  - `statue-ssg/themes/red.css`
  - `statue-ssg/themes/orange.css`
  - `statue-ssg/themes/green.css`
  - `statue-ssg/themes/purple.css`
  - `statue-ssg/themes/cyan.css`
  - `statue-ssg/themes/pink.css`
- **Custom Theme:** Create your own theme file (e.g., `src/lib/themes/my-theme.css`) and import it. Use Tailwind v4's `@theme` directive with CSS variables.

### `postcss.config.js`

**Location:** Root directory

**Purpose:** PostCSS configuration for processing CSS (used by Tailwind CSS).

**What to customize:**
- Typically doesn't need modification unless you're adding custom PostCSS plugins.

## Page Components

### `src/routes/+page.svelte`

**Location:** `src/routes/+page.svelte`

**Purpose:** Homepage component that displays the hero section, stats, categories, and latest content.

**What to customize:**
- **Page Title and Meta:** Update the `<svelte:head>` section with your site's title and description
- **Components:** Modify or replace the imported components from `statue-ssg`:
  - `NavigationBar` - Site navigation
  - `Hero` - Hero section
  - `Stats` - Statistics section
  - `Categories` - Content categories
  - `LatestContent` - Recent content display
- **Layout:** Adjust the container structure, spacing, and background gradients.
- **Styling:** Add custom styles in the `<style>` section.

---

### `src/routes/+layout.svelte`

**Location:** `src/routes/+layout.svelte`

**Purpose:** Root layout component that wraps all pages. Includes the footer.

**What to customize:**
- **Footer:** Modify the `Footer` component props or replace it with a custom footer
- **Global Styles:** Update the global CSS in the `<style>` section (body font, colors, etc.)
- **Layout Structure:** Adjust the main container and slot placement

---

### `src/routes/about/+page.svelte`

**Location:** `src/routes/about/+page.svelte`

**Purpose:** About page template. You can create similar pages for other static routes.

**What to customize:**
- **Page Content:** Update the title, description, and all component content
- **Components:** Modify or replace:
  - `PageHero` - Page hero section
  - `Mission` - Mission statement
  - `Team` - Team members
  - `WhyChooseUs` - Features/benefits
  - `CTA` - Call-to-action section
- **Meta Tags:** Update SEO meta tags in `<svelte:head>`

---

### `src/routes/[...slug]/+page.svelte`

**Location:** `src/routes/[...slug]/+page.svelte`

**Purpose:** Dynamic route component that renders markdown content pages.

**What to customize:**
- **Content Display:** Modify how markdown content is rendered
- **Components:** Customize the `ContentHeader`, `ContentBody`, and `Warning` components
- **Layout:** Adjust the container width, padding, and styling
- **Back Link Logic:** Modify the `getBackLink()` and `getBackLinkText()` functions to change navigation behavior

---

### `src/routes/[directory]/+page.svelte`

**Location:** `src/routes/[directory]/+page.svelte`

**Purpose:** Directory listing page that shows all content in a specific directory (e.g., `/blog`, `/docs`).

**What to customize:**
- **Directory Display:** Modify how directories and their content are displayed
- **Components:** Customize `DirectoryHeader`, `SubDirectories`, and `DirectoryContent` components
- **Filtering Logic:** Adjust the content filtering logic for current directory vs. subdirectories
- **Empty State:** Customize the message shown when a directory has no content

## Create Page Component

**Location:** `src/routes/<your-page>/`

**Purpose:** Add a new static page to your site by creating a dedicated route with its own Svelte components.

**How to create:**
1. **Create a Directory:** Add a new folder under `src/routes/`, for example: `src/routes/products/`
2. **Add Page Files:** Inside the new directory, create both:
- `+page.svelte` — The Svelte component that renders your page’s UI.
- `+page.server.js` — (Optional) A server load function for fetching data, prerendering, or handling form actions.

**Example Directory Structure:**

```
src/routes/products/
├── +page.svelte
└── +page.server.js
```

**Use Cases:**
- Create new static pages like `/contact`, `/team`, `/faq`.
- Add marketing or product pages not driven by markdown content.
- Build pages requiring server-side logic or dynamic data loading.

**What to customize:**
- **Page Structure:** Build your UI with any components you like, including your own or those from `statue-ssg`.
- **Content:** Add headings, sections, forms, or any static content your page needs.
- **SEO Meta Tags:** Update the `<svelte:head>` section in `+page.svelte` to define the page’s title and description.
- **Server Logic:** In `+page.server.js`, configure `load()` functions, prerendering (`export const prerender = true`), or form handlers as needed.

## Customization Workflow

1. **Start with Site Configuration:** Begin by updating `site.config.js` with your site's information.
2. **Add Your Content:** Create markdown files in the `content/` directory.
3. **Customize Theme:** Choose or create a theme in `src/lib/index.css`.
4. **Modify Pages:** Update page components in `src/routes/` to match your design.
5. **Adjust Layout:** Customize the layout components for consistent styling.
6. **Update Assets:** Replace favicon and add any static assets.
7. **Configure Build:** Adjust build settings if deploying to a specific platform.

## Additional Notes

- All components from `statue-ssg` can be customized by creating your own versions.
- Markdown files support frontmatter for metadata.
- The site uses Tailwind CSS v4 for styling.
- Static site generation is enabled via `prerender = true` in server load functions.
- Content is automatically processed from the `content/` directory structure.
