---
title: Routing
description: Understanding how Statue routes work
---

# Routing

Statue uses SvelteKit's file-based routing combined with automatic content routing. Understanding how routes work helps you customize your site's structure.

## Two Types of Routes

### 1. Content Routes (Automatic)

Markdown files in `content/` become pages automatically:

```
content/blog/my-post.md    →  /blog/my-post
content/docs/guide.md      →  /docs/guide
content/about.md           →  /about
```

No route files needed - Statue handles this.

### 2. Custom Routes (Manual)

Svelte files in `src/routes/` create custom pages:

```
src/routes/pricing/+page.svelte    →  /pricing
src/routes/contact/+page.svelte    →  /contact
```

Full control over the page structure.

---

## How Content Routing Works

### The Routes

Statue uses two special SvelteKit routes:

**`src/routes/[...slug]/+page.svelte`**
- Catches all content pages
- Example: `/blog/my-post`, `/docs/guide`, `/about`

**`src/routes/[directory]/+page.svelte`**
- Catches directory listing pages
- Example: `/blog`, `/docs`

### The Flow

1. User visits `/blog/hello-world`
2. SvelteKit matches `[...slug]` route
3. Route's server file (`+page.server.js`) runs
4. Server looks up `content/blog/hello-world.md`
5. Markdown is parsed and processed
6. Page component renders the content

### Directory Listings

1. User visits `/blog`
2. SvelteKit matches `[directory]` route
3. Server finds all files in `content/blog/`
4. Page component shows list of blog posts

---

## Route Patterns

### Catch-All Route: `[...slug]`

The `[...slug]` pattern captures everything:

```
/blog/hello               → slug = "blog/hello"
/docs/guides/intro        → slug = "docs/guides/intro"
/about                    → slug = "about"
```

Used in `src/routes/[...slug]/+page.server.js`:

```javascript
export function load({ params }) {
  const url = `/${params.slug}`;
  const content = getContentByUrl(url);
  return { content };
}
```

### Directory Route: `[directory]`

The `[directory]` pattern captures top-level folders:

```
/blog     → directory = "blog"
/docs     → directory = "docs"
```

Used in `src/routes/[directory]/+page.server.js`:

```javascript
export function load({ params }) {
  const directory = params.directory;
  const content = getContentByDirectory(directory);
  return { directoryContent: content };
}
```

---

## Route Priority

When multiple routes match, SvelteKit uses this priority:

1. **Static routes** (`/about/+page.svelte`)
2. **Dynamic routes** (`[directory]/+page.svelte`)
3. **Catch-all routes** (`[...slug]/+page.svelte`)

### Example

If you have:
- `src/routes/about/+page.svelte` (static)
- `content/about.md` (would match `[...slug]`)

The static route wins. The Svelte component is shown, not the markdown.

---

## Creating Custom Routes

### Simple Custom Page

Create a folder in `src/routes/`:

```
src/routes/pricing/
├── +page.svelte
└── +page.server.js (optional)
```

**`+page.svelte`:**
```svelte
<script>
  import { PageHero, CTA } from 'statue-ssg';
</script>

<PageHero title="Pricing" description="Choose your plan" />

<div class="container mx-auto px-4 py-16">
  <h2>Our Plans</h2>
  <!-- Your pricing content -->
</div>

<CTA
  title="Ready to start?"
  primaryButtonText="Sign Up"
  primaryButtonLink="/signup"
/>
```

Visit `/pricing` to see your page.

### Custom Page with Data Loading

**`+page.server.js`:**
```javascript
export const prerender = true;

export function load() {
  const plans = [
    { name: 'Free', price: 0 },
    { name: 'Pro', price: 29 }
  ];

  return { plans };
}
```

**`+page.svelte`:**
```svelte
<script>
  export let data;
  $: plans = data.plans;
</script>

{#each plans as plan}
  <div>{plan.name}: ${plan.price}/mo</div>
{/each}
```

---

## Customizing Route Behavior

### Customizing Content Pages

Edit `src/routes/[...slug]/+page.svelte`:

```svelte
<script>
  import { ContentHeader, ContentBody } from 'statue-ssg';

  export let data;
  $: content = data.content;
</script>

<!-- Add a table of contents -->
<aside class="toc">
  <h3>On this page</h3>
  <!-- TOC component -->
</aside>

<ContentHeader title={content.metadata.title} />
<ContentBody content={content.content} />

<!-- Add related posts -->
<section class="related-posts">
  <h3>Related Posts</h3>
  <!-- Related posts logic -->
</section>
```

### Customizing Directory Pages

Edit `src/routes/[directory]/+page.svelte`:

```svelte
<script>
  import { DirectoryHeader, DirectoryContent } from 'statue-ssg';

  export let data;
  $: content = data.directoryContent;

  // Add filtering
  let searchTerm = '';
  $: filtered = content.filter(post =>
    post.metadata.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
</script>

<DirectoryHeader title={data.currentDirectory.title} />

<!-- Add search -->
<input bind:value={searchTerm} placeholder="Search..." />

<DirectoryContent content={filtered} />
```

---

## Advanced Routing

### Nested Dynamic Routes

Create subdirectory routes:

```
src/routes/blog/[slug]/+page.svelte
```

This creates `/blog/*` routes separate from the general `[...slug]` route.

### Layout Routes

Add layouts for specific sections:

```
src/routes/blog/+layout.svelte
```

This layout wraps all `/blog/*` pages.

**Example:**
```svelte
<!-- src/routes/blog/+layout.svelte -->
<div class="blog-layout">
  <aside class="sidebar">
    <h3>Categories</h3>
    <!-- Category list -->
  </aside>

  <main>
    <slot />  <!-- Page content goes here -->
  </main>
</div>
```

### Route Groups

Organize routes without affecting URLs:

```
src/routes/(marketing)/pricing/+page.svelte
src/routes/(marketing)/about/+page.svelte
```

Both pages are at `/pricing` and `/about` (no `/marketing/` in URL).

**Use case:** Share layouts without adding URL segments.

---

## Prerendering

Statue sites are static, so all routes are prerendered at build time.

### Enabling Prerendering

In `+page.server.js`:
```javascript
export const prerender = true;
```

This is required for static site generation.

### Prerendering Content

Statue automatically prerenders:
- All markdown files in `content/`
- All directory pages
- All custom routes with `prerender = true`

### Build Process

```bash
npm run build
```

1. SvelteKit discovers all routes
2. Prerenders each route to HTML
3. Outputs static files to `build/`
4. Ready to deploy

---

## URL Structure Best Practices

### Use Descriptive URLs

```
✅ /blog/getting-started-with-statue
❌ /blog/post1
```

### Keep URLs Simple

```
✅ /docs/routing
❌ /documentation/advanced-concepts/routing-system
```

### Use Hyphens, Not Underscores

```
✅ my-blog-post.md
❌ my_blog_post.md
```

### Match Content Structure to URLs

```
content/
├── blog/
│   └── hello-world.md    →  /blog/hello-world  ✅
├── docs/
│   └── routing.md        →  /docs/routing  ✅
```

---

## Troubleshooting

### Page shows 404 but file exists

**Check:**
1. Is the file in `content/`?
2. Does it have `.md` extension?
3. Did you restart dev server?

**Fix:**
```bash
npm run dev  # Restart server
```

### Custom route not working

**Check:**
1. Is there a `+page.svelte` file?
2. Is it in the right location?
3. Check browser console for errors

### Route conflict

If both exist:
- `src/routes/about/+page.svelte`
- `content/about.md`

The Svelte route takes priority. Remove one or rename.

### Changes not reflecting

Clear cache:
```bash
rm -rf .svelte-kit build
npm run dev
```

---

## Route Files Reference

### +page.svelte

Page component - renders the UI.

```svelte
<script>
  export let data;
</script>

<h1>{data.title}</h1>
```

### +page.server.js

Server load function - fetches data.

```javascript
export const prerender = true;

export function load() {
  return { title: 'My Page' };
}
```

### +layout.svelte

Layout wrapper - wraps child pages.

```svelte
<header>Header</header>
<slot />  <!-- Page content -->
<footer>Footer</footer>
```

### +layout.server.js

Server load for layouts - data available to all child pages.

```javascript
export function load() {
  return { siteConfig: { /* ... */ } };
}
```

---

## Next Steps

- **[Get Started](./get-started)** - Create your first pages
- **[Site Config](./site-config)** - Configure site-wide settings
- **[Components](./components)** - Build custom route pages

## Learn More

- **[SvelteKit Routing](https://kit.svelte.dev/docs/routing)** - Official SvelteKit docs
- **[SvelteKit Advanced Routing](https://kit.svelte.dev/docs/advanced-routing)** - Advanced patterns
