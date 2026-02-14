# AGENTS.md - Statue SSG One-Shot Customization Guide

## Purpose
This guide provides a systematic approach to transforming a statue-ssg installation into a fully customized website in a single pass. The project is already initialized with all dependencies, ESM support, and required files.

**This guide supports multiple approaches:**
- **Fully Custom Sites** - Complete control over design and layout
- **Blog/Docs Sites** - Keep default components and markdown content
- **Hybrid Sites** - Mix custom pages with content-driven sections

**Read the requirements carefully** to determine which approach fits the project, then follow the relevant "Option A/B/C" paths throughout this guide.

## Key Principles
1. **Choose the right approach** - Fully custom, content-driven, or hybrid
2. **Design system first** - Define styling patterns before building pages
3. **Component flexibility** - Mix statue-ssg components with custom components
4. **Global components** - Use layout-level components for site-wide elements
5. **Navigation consistency** - Either in layout OR identical on all pages
6. **Single footer location** - Only in layout, never in individual pages
7. **Build configuration** - Add `handleUnseenRoutes: 'ignore'` to avoid prerender errors
8. **Content flexibility** - Keep or delete markdown directories based on needs

## Project Structure (Pre-configured)
- `src/routes/+page.svelte` - Homepage
- `src/routes/+layout.svelte` - Global layout
- `src/routes/about/+page.svelte` - About page (exists)
- `src/lib/components/` - Custom components (create directory)
- `static/assets/` - Images and media (create directory)
- `site.config.json` - Site configuration
- `svelte.config.js` - Build configuration

---

## Phase 1: Static Assets

Place images and media files in `static/assets/`:
```bash
mkdir -p static/assets
# Download or copy images to static/assets/
```

Files in `static/` are served at the root and copied to build output.

---

## Phase 2: Creating Custom Components

### 2.0 Component Architecture
statue-ssg includes default components, but you can create custom components for complete design control.

**Location:** All custom components should be stored in `src/lib/components/`

**Best Practices for Custom Components:**
1. **Use Svelte 4 syntax** - statue-ssg is built on Svelte 4
2. **Make components flexible** - Export props for all configurable options
3. **Use theme variables** - Never hardcode colors; use CSS custom properties
4. **Support slots** - Use default and named slots where appropriate
5. **Include inline SVG** - For icons and simple graphics
6. **Add prop validation** - Set sensible defaults for all props

**Example Component Structure:**
```svelte
<script>
  // Export all configurable props with defaults
  export let backgroundColor = 'var(--theme-bg)';
  export let textColor = 'var(--theme-text)';
  export let padding = '2rem';
  export let showIcon = true;
  // ... more props
</script>

<div style="background-color: {backgroundColor}; color: {textColor}; padding: {padding};">
  {#if showIcon}
    <svg><!-- inline SVG --></svg>
  {/if}
  <slot />
</div>

<style>
  /* Component-scoped styles using theme variables */
</style>
```

**Component Types to Consider:**
- **Gallery** - Image grids with hover effects and captions
- **Footer** - Global footer with contact info and links
- **Navigation** - Custom nav bars with active states
- **Cards** - Content cards with flexible layouts
- **Buttons** - Reusable button components with variants

**Importing Custom Components:**
```svelte
import ComponentName from '$lib/components/ComponentName.svelte';
```

---

## Phase 3: Site Configuration

Update `site.config.json` with your site's information:

**Required sections to customize:**
- `site.*` - Site name, description, URL, author
- `contact.*` - All contact information and addresses
- `social.*` - Social media links (can be empty strings)
- `seo.*` - SEO defaults, title templates, keywords, OG images

**Example:**
```json
{
  "site": {
    "name": "Your Site Name",
    "description": "Your site description",
    "url": "https://yoursite.com",
    "author": "Your Name"
  },
  "seo": {
    "defaultTitle": "Your Site Title",
    "titleTemplate": "%s | Your Site",
    "defaultDescription": "Your site description",
    "keywords": ["keyword1", "keyword2"],
    "ogImage": "/assets/your-image.jpg",
    "twitterCard": "summary_large_image"
  }
}
```

You can access config values in pages with:
```svelte
import siteConfig from '../../site.config.json';
// Use: {siteConfig.site.name}
```

---

## Phase 4: Content Strategy

**Decide your content approach:**

### Option A: Fully Custom Static Site (No Markdown Content)
If building a portfolio, landing page, or fully custom site:
```bash
rm content/example.md
rm -rf content/docs
rm -rf content/blog
rm -rf content/legal
```

### Option B: Blog or Documentation Site (Keep Markdown Content)
If building a blog, docs site, or content-driven site:
- **Keep** `content/blog/` or `content/docs/` directories
- **Delete** placeholder files: `rm content/blog/*.md` or `rm content/docs/*.md`
- **Create** your own markdown files with proper frontmatter
- **Keep** the dynamic routes `[directory]` and `[...slug]` pages (they handle markdown rendering)

### Option C: Hybrid Approach
Mix custom pages with markdown content:
- Keep directories you need (e.g., `content/blog/` for blog posts)
- Delete directories you don't need (e.g., `content/docs/` if no documentation)
- Create custom pages for marketing/landing content
- Use markdown for blog posts or documentation

---

## Phase 5: Global Footer

### 5.1 Create Footer Component
Create a custom footer component for consistent site-wide branding.

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

### 5.2 Update Layout
**File:** `src/routes/+layout.svelte`

**Choose your navigation and footer approach:**

#### Option A: Custom Footer + Custom Navigation (Per-Page)
Best for fully custom designs where navigation differs per page:
```svelte
<script>
  import Footer from '$lib/components/Footer.svelte';
  import { page } from '$app/stores';
  import { onNavigate } from '$app/navigation';
  import '$lib/index.css';

  export let data;
  // Keep existing onNavigate logic if present
</script>

<main>
  <slot />
</main>

<Footer />

<style>
  :global(body) {
    /* Your global styles */
  }
</style>
```
- **Remove** the NavigationBar import and component from layout
- **Add** navigation to each individual page
- **Add** custom footer to layout only

#### Option B: Default NavigationBar + Custom Footer
Best for blog/docs sites where default navbar works well:
```svelte
<script>
  import NavigationBar from 'statue-ssg/components/NavigationBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { page } from '$app/stores';
  import { onNavigate } from '$app/navigation';
  import '$lib/index.css';

  export let data;

  $: globalDirectories = data.globalDirectories;
  $: searchConfig = data.searchConfig;
  $: currentPath = $page.url.pathname;
</script>

<NavigationBar
  navbarItems={globalDirectories}
  showSearch={searchConfig?.enabled ?? false}
  searchPlaceholder={searchConfig?.placeholder ?? "Search..."}
/>

<main>
  <slot />
</main>

<Footer />
```
- **Keep** the default NavigationBar component
- **Replace** only the Footer import with your custom footer

#### Option C: All Default Components
Keep both default NavigationBar and Footer:
```svelte
<script>
  import NavigationBar from 'statue-ssg/components/NavigationBar.svelte';
import Footer from 'statue-ssg/components/Footer.svelte';
  // ... keep existing setup
</script>

<NavigationBar ... />
<main><slot /></main>
<Footer ... />
```
- Use when the default components meet your needs
- Customize through their props and CSS

**Critical:** Footer should only be in layout, never in individual pages.

---

## Phase 6: Page Customization

**Choose your approach based on layout decision from Phase 5:**

### 6.1 Homepage (src/routes/+page.svelte)

#### Option A: Fully Custom Homepage
Best for portfolios, landing pages, and unique designs:

**Remove all statue-ssg component imports:**
```svelte
<script>
  import siteConfig from '../../site.config.json';
  export let data;
</script>

<svelte:head>
  <title>{siteConfig.seo.defaultTitle}</title>
  <meta name="description" content={siteConfig.seo.defaultDescription} />
</svelte:head>

<div class="page-container">
  <!-- Add custom navigation if not in layout -->
  <nav class="nav-bar">
    <div class="nav-content">
      <a href="/" class="nav-logo">{siteConfig.site.name}</a>
      <div class="nav-links">
        <a href="/" class="nav-link active">Home</a>
        <a href="/about" class="nav-link">About</a>
      </div>
    </div>
  </nav>

  <section class="hero">
    <!-- Your hero content -->
  </section>

  <section class="main-content">
    <!-- Your content sections -->
  </section>
</div>

<style>
  /* Your custom styles */
</style>
```

#### Option B: Use Default Components with Custom Content
Best for blogs, docs, and content-driven sites:

**Keep or modify statue-ssg components:**
```svelte
<script>
  import Hero from 'statue-ssg/components/Hero.svelte';
import Stats from 'statue-ssg/components/Stats.svelte';
import Categories from 'statue-ssg/components/Categories.svelte';
import LatestContent from 'statue-ssg/components/LatestContent.svelte';
  import siteConfig from '../../site.config.json';

  export let data;
  $: directories = data.directories;
  $: rootContent = data.rootContent;
</script>

<svelte:head>
  <title>{siteConfig.seo.defaultTitle}</title>
  <meta name="description" content={siteConfig.seo.defaultDescription} />
</svelte:head>

<div class="page-container">
  <!-- Keep default components or replace with custom -->
  <Hero />
  <Stats />
  <Categories {directories} />
  <LatestContent {rootContent} />
</div>
```

#### Option C: Mix Default and Custom Components
Combine statue-ssg components with your own:
```svelte
<script>
  import Hero from 'statue-ssg/components/Hero.svelte';
  import CustomGallery from '$lib/components/CustomGallery.svelte';
  import siteConfig from '../../site.config.json';

  export let data;
</script>

<!-- Use Hero from statue-ssg -->
<Hero />

<!-- Add your custom components -->
<CustomGallery images={yourImages} />

<!-- Add custom sections -->
<section class="custom-section">
  <!-- Your content -->
</section>
```

### 6.2 About Page (src/routes/about/+page.svelte)

#### Option A: Fully Custom About Page
```svelte
<script>
  import siteConfig from '../../../site.config.json';
  export let data;
</script>

<div class="page-container">
  <!-- Add navigation if not in layout -->
  <nav class="nav-bar">
    <!-- Copy same structure from homepage -->
  </nav>

  <section class="content">
    <!-- Your about content -->
  </section>
</div>

<style>
  /* Match homepage theme */
</style>
```

#### Option B: Use Default Components
```svelte
<script>
  import PageHero from 'statue-ssg/components/PageHero.svelte';
import Mission from 'statue-ssg/components/Mission.svelte';
import Team from 'statue-ssg/components/Team.svelte';
  export let data;
</script>

<PageHero
  title="About Us"
  description="Your description"
/>
<Mission />
<Team />
```

**Navigation Consistency:**
- If using **custom navigation per-page**: Copy exact same structure to all pages
- If using **NavigationBar in layout**: No navigation needed on individual pages
- If using **default components**: They handle their own navigation context

### 6.3 Additional Custom Pages

To create new pages like `/history` or `/contact`:

1. Create directory: `src/routes/pagename/`
2. Create `+page.server.js`:
```javascript
export async function load({ parent }) {
  const parentData = await parent();
  return { ...parentData };
}
```
3. Create `+page.svelte` matching your chosen approach (fully custom, default components, or hybrid)
4. Add route to `svelte.config.js` prerender entries (see Phase 8)

### 6.4 Working with Markdown Content (Optional)

**If you kept `content/blog/` or `content/docs/` directories:**

The dynamic routes `[directory]/+page.svelte` and `[...slug]/+page.svelte` already exist to handle markdown content.

**Options:**
1. **Keep default rendering** - The existing pages handle markdown automatically
2. **Customize listing page** - Edit `src/routes/[directory]/+page.svelte` to change how content lists appear
3. **Customize article page** - Edit `src/routes/[...slug]/+page.svelte` to change how individual posts render

**Data access patterns:**
```svelte
<!-- In [directory]/+page.svelte for listings -->
<script>
  export let data;
  $: directoryContent = data.directoryContent;
  $: currentDirectory = data.currentDirectory;
</script>

{#each directoryContent as item}
  <a href={item.url}>
    <h2>{item.metadata?.title || item.title || 'Untitled'}</h2>
    {#if item.metadata?.description || item.description}
      <p>{item.metadata?.description || item.description}</p>
    {/if}
  </a>
{/each}
```

```svelte
<!-- In [...slug]/+page.svelte for individual posts -->
<script>
  export let data;
  $: content = data.content;
</script>

{#if content}
  <article>
    <h1>{content.metadata.title}</h1>
    <div class="content">{@html content.content}</div>
  </article>
{/if}
```

---

## Phase 7: Theme Consistency

Define your design system in the layout's `<style>` block and duplicate styles across pages.

**Key Design Elements:**
- **Colors:** Primary, background, text, accent (use specific hex values)
- **Typography:** Font families, sizes, weights, line heights, letter spacing
- **Spacing:** Consistent padding, margins, and gaps
- **Components:** Navigation bar (exact same on every page)

**Navigation Pattern - Use IDENTICAL structure on ALL pages:**
```svelte
<nav class="nav-bar">
  <div class="nav-content">
    <a href="/" class="nav-logo">{siteConfig.site.name}</a>
    <div class="nav-links">
      <a href="/" class="nav-link active">Home</a>
      <a href="/about" class="nav-link">About</a>
    </div>
  </div>
</nav>
```

Copy the entire navigation block and its styles to every page. Maintain consistent class names.

---

## Phase 8: Build Configuration

**CRITICAL:** Update `svelte.config.js` to add your custom routes and prevent build errors:

```javascript
prerender: {
  crawl: true,
  entries: [
    '/',
    '/about',
    '/history',  // Add all your custom pages here
    // Add more routes as needed
  ],
  handleHttpError: 'warn',
  handleUnseenRoutes: 'ignore'  // CRITICAL: Prevents errors for dynamic routes
}
```

**Why this matters:** Without `handleUnseenRoutes: 'ignore'`, the build will fail if you have dynamic routes like `[directory]` or `[...slug]` that don't have corresponding markdown content.

---

## Phase 9: Build and Deploy

### Build the Site
```bash
npm run build
```

Build warnings about unused export properties (`export let data`) or CSS optimization can be ignored. Address errors related to missing files or syntax issues.

### Preview Locally
```bash
npm run preview
```

The preview server will output a URL (typically http://localhost:XXXX). Verify:
- All pages load correctly
- Navigation works
- Images display
- Footer appears on all pages
- No console errors

### Deploy
The `build/` directory contains your complete static site. Deploy to any static host:
- GitHub Pages
- Netlify
- Vercel
- AWS S3

---

## Quick Reference

### Decision Tree

**1. What type of site are you building?**
- **Portfolio/Landing Page/Gallery** → Fully custom approach (Option A everywhere)
- **Blog/Documentation** → Keep markdown content and default components (Option B/C)
- **Mixed** → Hybrid approach (custom pages + markdown content)

**2. Navigation approach?**
- **Unique per page** → Custom navigation on each page (no NavigationBar in layout)
- **Site-wide navigation** → Keep NavigationBar in layout OR use custom nav in layout
- **Using default components** → Keep NavigationBar in layout

**3. Content approach?**
- **No markdown content** → Delete all `content/` directories
- **Blog only** → Keep `content/blog/`, delete others
- **Docs only** → Keep `content/docs/`, delete others
- **Both** → Keep both directories

### Essential Workflow (Fully Custom Site):
1. **Assets** - Download images to `static/assets/`
2. **Config** - Update `site.config.json` and `svelte.config.js`
3. **Content** - Delete unwanted content directories
4. **Components** - Create custom components in `src/lib/components/`
5. **Layout** - Update layout with custom footer (remove or keep NavigationBar)
6. **Design** - Define color scheme and typography in layout
7. **Homepage** - Build custom homepage
8. **Pages** - Create additional pages matching homepage style
9. **Build** - Run `npm run build` and fix any errors
10. **Preview** - Test with `npm run preview`

### Essential Workflow (Blog/Docs Site):
1. **Assets** - Add images to `static/assets/`
2. **Config** - Update `site.config.json` with your info
3. **Content** - Delete placeholder markdown, add your own content
4. **Components** - Create custom footer (optional: keep NavigationBar)
5. **Layout** - Update layout with custom footer
6. **Design** - Customize theme colors in layout
7. **Homepage** - Keep or customize default homepage
8. **Markdown** - Optionally customize `[directory]` and `[...slug]` pages
9. **Build** - Run `npm run build`
10. **Preview** - Test with `npm run preview`

### Critical Patterns:
- **Footer:** Only in `+layout.svelte`, never in individual pages
- **Navigation (custom):** Exact same structure on all pages if not in layout
- **Navigation (default):** Keep NavigationBar in layout, don't add nav to individual pages
- **Config:** Add `handleUnseenRoutes: 'ignore'` to `svelte.config.js`
- **Routes:** Add all custom pages to `prerender.entries` array
- **Components:** Import custom with `$lib/components/ComponentName.svelte`
- **Site Config:** Import with `import siteConfig from '../../site.config.json'`
- **Markdown Content:** Use dual access pattern: `item.metadata?.title || item.title`

### Common Issues:
- **Build fails with "handleUnseenRoutes" error:** Add `handleUnseenRoutes: 'ignore'` to `svelte.config.js`
- **Page not found after build:** Add route to `prerender.entries` in `svelte.config.js`
- **Footer appears multiple times:** Remove footer from individual pages, keep only in layout
- **Navigation inconsistent (custom):** Copy exact same nav structure to all pages
- **Navigation breaks (default):** Ensure NavigationBar has access to `globalDirectories` data
- **Images not loading:** Ensure images are in `static/assets/` and referenced as `/assets/filename.jpg`
- **Markdown content not showing:** Ensure you kept the `content/` directory and `[directory]`/`[...slug]` routes

---

## Summary

A successful statue-ssg customization requires understanding your project type and choosing the right approach:

### For Fully Custom Sites (Portfolio/Landing/Gallery):
1. **Assets first** - Place images in `static/assets/`
2. **Config early** - Update `site.config.json` and add `handleUnseenRoutes: 'ignore'` to `svelte.config.js`
3. **Delete content** - Remove unwanted `content/` directories
4. **Custom components** - Create footer and other components in `src/lib/components/`
5. **Layout setup** - Remove NavigationBar, add custom footer to layout
6. **Design system** - Define colors and typography in layout
7. **Custom pages** - Build each page with consistent navigation structure
8. **Build config** - Add all routes to `prerender.entries` array

### For Blog/Docs Sites (Content-Driven):
1. **Assets** - Add images to `static/assets/`
2. **Config** - Update `site.config.json` with your info
3. **Content** - Replace placeholder markdown with your content
4. **Components** - Create custom footer (keep or customize other components)
5. **Layout** - Update layout with custom footer, keep NavigationBar
6. **Theme** - Customize colors and styles
7. **Optional customization** - Modify homepage, listing, or article pages as needed
8. **Build** - Run `npm run build`

### Universal Principles:
- **Footer location:** Only in `+layout.svelte`, never in individual pages
- **Navigation consistency:** Either in layout (default) or identical on all pages (custom)
- **Build config:** Always add `handleUnseenRoutes: 'ignore'` to `svelte.config.js`
- **Route registration:** Add all custom pages to `prerender.entries` array
- **Component flexibility:** Mix statue-ssg components with custom components as needed
- **Content flexibility:** Keep or delete markdown directories based on project needs

The key to success is choosing the right approach for your project type and maintaining consistency throughout.
