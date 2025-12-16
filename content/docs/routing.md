---
title: Routing
description: How Statue handles routing for markdown content
icon: map
---

# Routing

Statue extends SvelteKit's routing to automatically create pages from markdown files. This guide covers Statue-specific routing behavior.

> **Contribute to Statue!** Built a useful component, theme, or template? Share it with the community—it only takes a single command. **[Learn how →](https://github.com/accretional/statue/blob/main/CONTRIBUTING.md)**

> **New to SvelteKit routing?** Read the [SvelteKit Routing docs](https://svelte.dev/docs/kit/routing) first for the basics.

---

## Two Types of Routes

### 1. Content Routes (Automatic)

Markdown files in `content/` become pages automatically:

```
content/blog/my-post.md    →  /blog/my-post
content/docs/guide.md      →  /docs/guide
content/about.md           →  /about
```

Statue handles this automatically - no route files needed.

### 2. Custom Routes (Manual)

Standard SvelteKit routes in `src/routes/`:

```
src/routes/pricing/+page.svelte    →  /pricing
src/routes/contact/+page.svelte    →  /contact
```

Full control over the page. **[Learn more →](https://svelte.dev/docs/kit/routing)**

---

## How Content Routing Works

Statue uses two special catch-all routes to handle markdown content:

### `[...slug]/+page.svelte`
Renders individual markdown pages.

**Matches:**
- `/blog/hello-world` → `content/blog/hello-world.md`
- `/docs/guide` → `content/docs/guide.md`
- `/about` → `content/about.md`

**How it works:**
1. User visits `/blog/hello-world`
2. SvelteKit matches the `[...slug]` route
3. `+page.server.js` looks up `content/blog/hello-world.md`
4. Markdown is parsed and rendered

### `[directory]/+page.svelte`
Lists all content in a directory.

**Matches:**
- `/blog` → Lists all files in `content/blog/`
- `/docs` → Lists all files in `content/docs/`

**How it works:**
1. User visits `/blog`
2. SvelteKit matches the `[directory]` route
3. `+page.server.js` finds all `*.md` files in `content/blog/`
4. Renders as a list of posts

---

## Route Priority

When routes conflict, SvelteKit follows this priority:

1. **Static routes** (e.g., `src/routes/about/+page.svelte`)
2. **Dynamic routes** (e.g., `src/routes/[directory]/+page.svelte`)
3. **Catch-all routes** (e.g., `src/routes/[...slug]/+page.svelte`)

### Example Conflict

If you have both:
- `src/routes/about/+page.svelte` (custom Svelte page)
- `content/about.md` (markdown content)

The Svelte page wins - the markdown won't be shown.

**Fix:** Either remove the Svelte file or rename the markdown file.

---

## Customizing Content Pages

You can customize how markdown content is displayed by editing Statue's route templates.

### Content Pages Template
**File:** `src/routes/[...slug]/+page.svelte`

**What you must include:**
```svelte
<script>
  export let data;  // Statue passes content here
</script>
```

**Typical customization:**
```svelte
<script>
  import { ContentHeader, ContentBody } from 'statue-ssg';
  export let data;

  $: content = data.content;  // Access the markdown content
</script>

<!-- Add your customizations here -->
<aside class="table-of-contents">
  <!-- Your TOC component -->
</aside>

<ContentHeader title={content.metadata.title} />
<ContentBody content={content.content} />
```

**Available in `data.content`:**
- `metadata.title` - From frontmatter
- `metadata.description` - From frontmatter
- `metadata.date` - From frontmatter
- `content` - Rendered HTML

### Directory Pages Template
**File:** `src/routes/[directory]/+page.svelte`

**What you must include:**
```svelte
<script>
  export let data;  // Statue passes directory content here
</script>
```

**Typical customization:**
```svelte
<script>
  import { DirectoryHeader, DirectoryContent } from 'statue-ssg';
  export let data;

  // Add search/filter functionality
  let searchTerm = '';
  $: filtered = data.directoryContent.filter(post =>
    post.metadata.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
</script>

<DirectoryHeader title={data.currentDirectory.title} />

<!-- Add your customizations -->
<input bind:value={searchTerm} placeholder="Search..." />

<DirectoryContent content={filtered} />
```

**Available in `data`:**
- `currentDirectory` - Info about this directory
- `directoryContent` - Array of content items
- `subDirectories` - Subdirectories in this directory

**Don't modify `+page.server.js` files unless you know what you're doing** - they contain the logic that loads markdown content.

---

## URL Structure

### Content → URL Mapping

```
content/blog/hello.md               →  /blog/hello
content/docs/guides/intro.md        →  /docs/guides/intro
content/projects/2024/project.md    →  /projects/2024/project
```

The folder structure becomes the URL structure.

### Best Practices

**Use descriptive URLs:**
```
✅ /blog/getting-started-with-statue
❌ /blog/post1
```

**Use hyphens, not underscores:**
```
✅ my-blog-post.md
❌ my_blog_post.md
```

**Keep it simple:**
```
✅ /docs/routing
❌ /documentation/advanced-concepts/routing-system
```

---

## Creating Custom Routes

When creating custom pages for your Statue site, follow these patterns:

### Required: Enable Prerendering

**In every `+page.server.js`, you must include:**

```javascript
export const prerender = true;
```

**Why:** Statue generates static sites. Without this, SvelteKit won't generate the HTML files at build time.

### Typical Data Loading Pattern

**For custom pages that need data, use this pattern:**

```javascript
// src/routes/pricing/+page.server.js
export const prerender = true;

export function load() {
  // Load your data here
  const plans = [
    { name: 'Free', price: 0 },
    { name: 'Pro', price: 29 }
  ];

  return { plans };
}
```

**Why:** The `load` function runs at build time and passes data to your page component.

### Page Component

```svelte
<!-- src/routes/pricing/+page.svelte -->
<script>
  export let data;  // Data from +page.server.js
</script>

<h1>Pricing</h1>
{#each data.plans as plan}
  <div>{plan.name}: ${plan.price}/mo</div>
{/each}
```

**Want to do something different?** Check [SvelteKit's routing docs](https://svelte.dev/docs/kit/routing) for other patterns, but note that Statue requires static prerendering to work.

---

## Common Issues

### 404 on existing markdown file

**Check:**
1. File is in `content/` directory?
2. Has `.md` extension?
3. Restarted dev server? (`npm run dev`)

### Custom route not working

See [SvelteKit routing docs](https://svelte.dev/docs/kit/routing) for route setup.

### Changes not appearing

Clear SvelteKit cache:
```bash
rm -rf .svelte-kit build
npm run dev
```

---

## Learn More

### Statue Docs
- **[Statue.dev](https://statue.dev)** - Official documentation
- **[Get Started](./get-started.md)** - Overview
- **[Site Config](./site-config.md)** - Configuration
- **[Components](./components.md)** - Build pages

### SvelteKit Docs
- **[Routing](https://svelte.dev/docs/kit/routing)** - File-based routing basics
- **[Loading Data](https://svelte.dev/docs/kit/load)** - Server data loading
- **[Advanced Routing](https://svelte.dev/docs/kit/advanced-routing)** - Layouts, groups, matchers
