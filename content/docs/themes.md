---
title: Themes
description: Styling your Statue site with themes
icon: palette
---

# Themes

Statue's theme system allows you to configure multiple themes and switch between them at runtime. Themes are defined using CSS custom properties (`--color-*` variables) and loaded at build time through a Vite plugin.

> **Created a custom theme?** Share it with the Statue community! Contributing themes takes just one command. **[Contribute a theme →](https://github.com/accretional/statue/blob/main/ADDING_THEMES.md)**

## Quick Start

### 1. Configure the Vite Plugin

**Add to `vite.config.js`:**

```js
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { statueThemesPlugin } from 'statue-ssg/vite-plugin';

export default defineConfig({
  plugins: [
    statueThemesPlugin(), // Auto-detects site.config.js
    sveltekit()
  ]
});
```

### 2. Configure Your Themes

**Add to `site.config.js`:**

```js
export const siteConfig = {
  // ... other config
  
  theme: {
    default: 'Blue',
    themes: [
      { name: 'Blue', path: 'statue-ssg/themes/blue.css' },
      { name: 'Red', path: 'statue-ssg/themes/red.css' },
      { name: 'Green', path: 'statue-ssg/themes/green.css' },
      // Add more themes...
    ]
  }
};
```

### 3. Import Theme CSS

**Add to `src/routes/+layout.svelte`:**

```svelte
<script>
  import { NavigationBar, Footer } from 'statue-ssg';
  import 'virtual:statue-themes.css';
  
  export let data;
</script>

<NavigationBar />
<slot />
<Footer />
```

### 4. Add Theme Selector (Optional)

**Add the ThemeSelector component to allow users to switch themes:**

```svelte
<script>
  import { NavigationBar, Footer, ThemeSelector } from 'statue-ssg';
  import 'virtual:statue-themes.css';
  
  export let data;
</script>

<NavigationBar />
<ThemeSelector />

<slot />

<Footer />
```

That's it! Your site now supports multiple themes with runtime switching.

---

## Built-in Themes

Statue comes with 9 built-in themes:

```js
{ name: 'Black & White', path: 'statue-ssg/themes/black-white.css' }  // Monochrome
{ name: 'Blue', path: 'statue-ssg/themes/blue.css' }                  // Navy + blue
{ name: 'Red', path: 'statue-ssg/themes/red.css' }                    // Dark red + red
{ name: 'Green', path: 'statue-ssg/themes/green.css' }                // Dark green + emerald
{ name: 'Purple', path: 'statue-ssg/themes/purple.css' }              // Dark purple + purple
{ name: 'Cyan', path: 'statue-ssg/themes/cyan.css' }                  // Dark cyan + cyan
{ name: 'Orange', path: 'statue-ssg/themes/orange.css' }              // Brown + orange
{ name: 'Pink', path: 'statue-ssg/themes/pink.css' }                  // Dark pink + pink
{ name: 'Charcoal', path: 'statue-ssg/themes/charcoal.css' }          // Warm neutral grays
```

---

## How It Works

### Build Time

The Vite plugin:
1. Reads `site.config.js` and finds your theme configuration
2. Parses each theme CSS file
3. Extracts `--color-*` variables from `@theme {}` or `:root {}` blocks
4. Generates combined CSS with:
   - `:root { ... }` - Default theme variables (fallback)
   - `html[data-theme="blue"] { ... }` - Blue theme variables
   - `html[data-theme="red"] { ... }` - Red theme variables
   - etc.

### Runtime

When a user selects a theme:
1. The `ThemeSelector` component sets `data-theme` attribute on `<html>`
2. CSS automatically cascades and applies the selected theme's variables
3. Selection is saved to `localStorage` for persistence

No page reload needed - theme switching is instant!

---

## Create a Custom Theme

### 1. Create Your Theme File

**Create `src/lib/themes/my-theme.css`:**

```css
@theme {
  /* Base colors - backgrounds and text */
  --color-background: #0a0e1a;
  --color-card: #131824;
  --color-border: #1e2535;
  --color-foreground: #e8eaed;
  --color-muted: #9ca3af;

  /* Brand colors - your brand colors go here */
  --color-primary: #00d4ff;
  --color-secondary: #00a8cc;
  --color-accent: #0080a0;

  /* Text on colored backgrounds */
  --color-on-primary: #ffffff;
  --color-on-background: #ffffff;

  /* Hero gradient colors */
  --color-hero-from: #0a0e1a;
  --color-hero-via: #131824;
  --color-hero-to: #0a0e1a;
}
```

### 2. Add to Config

**Update `site.config.js`:**

```js
export const siteConfig = {
  theme: {
    default: 'My Theme',
    themes: [
      { name: 'My Theme', path: './src/lib/themes/my-theme.css' },
      { name: 'Blue', path: 'statue-ssg/themes/blue.css' },
      // ... other themes
    ]
  }
};
```

### 3. Test It

```bash
npm run dev
```

Visit http://localhost:3000 and use the ThemeSelector to preview your theme!

---

## Required Variables

**Your theme must define these CSS variables:**

| Variable | Used For |
|----------|----------|
| `--color-background` | Main page background |
| `--color-card` | Card/section backgrounds |
| `--color-border` | Borders and dividers |
| `--color-foreground` | Main text color |
| `--color-muted` | Secondary text |
| `--color-primary` | Buttons, links |
| `--color-secondary` | Secondary buttons |
| `--color-accent` | Highlights |
| `--color-on-primary` | Text on primary color |
| `--color-on-background` | High contrast text |
| `--color-hero-from` | Hero gradient start |
| `--color-hero-via` | Hero gradient middle |
| `--color-hero-to` | Hero gradient end |

**Why:** Statue components use these variables for styling. Missing variables = broken styling.

**Optional variables** (some themes define these):
- `--color-prose-link` - Link color in markdown content
- `--color-prose-code-bg` - Inline code background
- `--color-prose-pre-bg` - Code block background

---

## Using Theme Variables in Custom Components

**When creating custom components, use theme variables:**

```svelte
<div class="my-card">
  <h2>Hello</h2>
</div>

<style>
  .my-card {
    background: var(--color-card);
    border: 1px solid var(--color-border);
    color: var(--color-foreground);
  }

  h2 {
    color: var(--color-primary);
  }
</style>
```

**Why:** Your components will automatically adapt when users change themes.

### With Tailwind Classes

Use theme variables in Tailwind's arbitrary values:

```svelte
<div class="bg-[var(--color-card)] border-[var(--color-border)] p-6 rounded-lg">
  <h2 class="text-[var(--color-primary)] text-2xl mb-4">Title</h2>
  <p class="text-[var(--color-foreground)]">Content</p>
</div>
```

---

## Single Theme Setup

If you only want one theme (no switching), you can simplify:

**In `site.config.js`:**

```js
theme: {
  themes: [
    { name: 'Blue', path: 'statue-ssg/themes/blue.css' }
  ]
  // No 'default' needed for single theme
}
```

The `ThemeSelector` component will automatically hide when only one theme is configured.

---

## Advanced: Programmatic Theme Access

Build custom theme UI using the virtual module:

```svelte
<script>
  import { themes, defaultTheme, showSelector } from 'virtual:statue-themes';
  
  function changeTheme(themeId) {
    document.documentElement.dataset.theme = themeId;
    localStorage.setItem('statue-theme', themeId);
  }
</script>

{#if showSelector}
  <div>
    <h3>Choose a theme:</h3>
    {#each themes as theme}
      <button 
        onclick={() => changeTheme(theme.id)}
        class:active={theme.id === defaultTheme}
      >
        {theme.name}
      </button>
    {/each}
  </div>
{/if}
```

---

## Adding Custom Utilities

**Add reusable styles to `src/lib/index.css`:**

```css
@layer utilities {
  .glass-card {
    background: color-mix(in srgb, var(--color-card) 80%, transparent);
    border: 1px solid var(--color-border);
    backdrop-filter: blur(10px);
  }
}
```

**Then use them:**
```svelte
<div class="glass-card">Glass effect card</div>
```

---

## Common Issues

### Theme not applying

1. Check the Vite plugin is added to `vite.config.js`
2. Verify theme config in `site.config.js` is correct
3. Ensure you imported `virtual:statue-themes.css` in your layout
4. Restart dev server: `npm run dev`
5. Clear cache: `rm -rf .svelte-kit build && npm run dev`

### Multiple themes configured but no default specified

**Error:** `Multiple themes configured but no default specified`

**Fix:** Add `default` to your theme config:

```js
theme: {
  default: 'Blue',  // Add this
  themes: [ /* ... */ ]
}
```

### Theme works in dev but not build

Run `npm run build` to test. If it fails, check:
- Theme file syntax is valid (valid `@theme {}` or `:root {}` block)
- Import path is correct
- All required CSS variables are defined
- No console errors

### Virtual module not found

**Error:** `Cannot find module 'virtual:statue-themes.css'`

**Fix:** Make sure `statueThemesPlugin()` is added to `vite.config.js` **before** `sveltekit()`:

```js
plugins: [
  statueThemesPlugin(), // Must come first
  sveltekit()
]
```

---

## Migration from Old CSS Import Approach

If you're upgrading from the old `@import` approach in `src/lib/index.css`:

### Before (old approach):
```css
@import "tailwindcss";
@import "statue-ssg/themes/blue.css";
```

### After (new approach):

1. **Remove the theme import from `src/lib/index.css`:**
```css
@import "tailwindcss";
/* Remove: @import "statue-ssg/themes/blue.css"; */
```

2. **Add plugin to `vite.config.js`** (see Quick Start above)

3. **Configure themes in `site.config.js`** (see Quick Start above)

4. **Import virtual CSS in layout** (see Quick Start above)

---

## Next Steps

- **[Site Config](./site-config.md)** - Configure site settings
- **[Components](./components.md)** - Ensure components work with your theme
- **[Get Started](./get-started.md)** - Build your site

**Resources:**
- **[Statue.dev](https://statue.dev)** - Official documentation
- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
