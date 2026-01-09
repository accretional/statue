---
title: Themes
description: Styling your Statue site with themes
icon: palette
---

# Themes

> **Created a custom theme?** Share it with the Statue community! Contributing themes takes just one command. **[Contribute a theme →](https://github.com/accretional/statue/blob/main/ADDING_THEMES.md)**

## Change Your Theme

**Edit `src/lib/index.css` and change one line:**

```css
@import "tailwindcss";
@import "statue-ssg/themes/blue.css";  /* Change this line */

@source "../";
@source "../../node_modules/statue-ssg/src/**/*.{svelte,js,ts}";
```

Your entire site now uses the new theme.

---

## Built-in Themes

Pick one:

```css
@import "statue-ssg/themes/blue.css";        /* Navy + blue (default) */
@import "statue-ssg/themes/red.css";         /* Dark red + red */
@import "statue-ssg/themes/orange.css";      /* Brown + orange */
@import "statue-ssg/themes/green.css";       /* Dark green + emerald */
@import "statue-ssg/themes/purple.css";      /* Dark purple + purple */
@import "statue-ssg/themes/cyan.css";        /* Dark cyan + cyan */
@import "statue-ssg/themes/pink.css";        /* Dark pink + pink */
@import "statue-ssg/themes/black-white.css"; /* Monochrome */
```

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

### 2. Import It

**Update `src/lib/index.css`:**

```css
@import "tailwindcss";
@import "./themes/my-theme.css";  /* Your custom theme */

@source "../";
@source "../../node_modules/statue-ssg/src/**/*.{svelte,js,ts}";
```

### 3. Test It

```bash
npm run dev
```

Visit your pages to check the colors.

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

1. Check the import path is correct
2. Restart dev server: `npm run dev`
3. Clear cache: `rm -rf .svelte-kit build && npm run dev`

### Theme works in dev but not build

Run `npm run build` to test. If it fails, check:
- Theme file syntax is valid
- Import path is correct
- No console errors

### Want dark/light mode toggle?

This requires custom JavaScript. See [Tailwind dark mode docs](https://tailwindcss.com/docs/dark-mode) for patterns you can adapt.

---

## Next Steps

- **[Site Config](./site-config.md)** - Configure site settings
- **[Components](./components.md)** - Ensure components work with your theme
- **[Get Started](./get-started.md)** - Build your site

**Resources:**
- **[Statue.dev](https://statue.dev)** - Official documentation
- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
