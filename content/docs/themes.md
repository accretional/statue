---
title: Themes
description: Styling your Statue site with themes
---

# Themes

Themes control the visual appearance of your Statue site through CSS custom properties. Change your entire site's color scheme by switching a single import line.

## Quick Start

Change your theme in `src/lib/index.css`:

```css
@import "tailwindcss";
@import "statue-ssg/themes/blue.css";  /* Change this line */

@source "../";
@source "../../node_modules/statue-ssg/src/**/*.{svelte,js,ts}";
```

That's it! Your entire site now uses the new colors.

## Built-in Themes

Statue includes 8 professionally designed themes:

### Blue (Default)
```css
@import "statue-ssg/themes/blue.css";
```
Navy background with blue accents. Professional and trustworthy.

### Red
```css
@import "statue-ssg/themes/red.css";
```
Dark red background with red accents. Bold and energetic.

### Orange
```css
@import "statue-ssg/themes/orange.css";
```
Brown background with orange accents. Warm and inviting.

### Green
```css
@import "statue-ssg/themes/green.css";
```
Dark green background with emerald accents. Natural and calming.

### Purple
```css
@import "statue-ssg/themes/purple.css";
```
Dark purple background with purple accents. Creative and luxurious.

### Cyan
```css
@import "statue-ssg/themes/cyan.css";
```
Dark cyan background with cyan accents. Modern and tech-focused.

### Pink
```css
@import "statue-ssg/themes/pink.css";
```
Dark pink background with pink accents. Playful and distinctive.

### Black & White
```css
@import "statue-ssg/themes/black-white.css";
```
Minimalist monochrome theme. Clean and timeless.

## Creating a Custom Theme

Want to use your brand colors? Create a custom theme file.

### 1. Create Your Theme File

Create `src/lib/themes/my-theme.css` in your project:

```css
/* My Brand Theme */
@theme {
  /* Base colors */
  --color-background: #0a0e1a;      /* Dark blue-black */
  --color-card: #131824;             /* Slightly lighter */
  --color-border: #1e2535;           /* Border color */
  --color-foreground: #e8eaed;       /* Main text */
  --color-muted: #9ca3af;            /* Secondary text */

  /* Brand colors */
  --color-primary: #00d4ff;          /* Your primary color */
  --color-secondary: #00a8cc;        /* Secondary color */
  --color-accent: #0080a0;           /* Accent color */

  /* Text on colored backgrounds */
  --color-on-primary: #ffffff;       /* Text on primary color */
  --color-on-background: #ffffff;    /* High contrast text */

  /* Hero gradient */
  --color-hero-from: #0a0e1a;
  --color-hero-via: #131824;
  --color-hero-to: #0a0e1a;
}
```

### 2. Import Your Theme

Update `src/lib/index.css`:

```css
@import "tailwindcss";
@import "./themes/my-theme.css";  /* Your custom theme */

@source "../";
@source "../../node_modules/statue-ssg/src/**/*.{svelte,js,ts}";
```

### 3. Test Your Theme

Run your dev server and check all pages:

```bash
npm run dev
```

Visit different pages to ensure colors look good everywhere.

## CSS Variables Reference

### Base Palette

| Variable | Purpose | Example |
|----------|---------|---------|
| `--color-background` | Main background | `#1a1a2e` |
| `--color-card` | Cards, sections | `#16213e` |
| `--color-border` | Borders, dividers | `#0f3460` |
| `--color-foreground` | Main text | `#e8e8e8` |
| `--color-muted` | Secondary text | `#a8a8a8` |

### Brand Colors

| Variable | Purpose | Example |
|----------|---------|---------|
| `--color-primary` | Buttons, links | `#3b82f6` |
| `--color-secondary` | Secondary actions | `#60a5fa` |
| `--color-accent` | Highlights | `#2563eb` |

### Text on Backgrounds

| Variable | Purpose | Example |
|----------|---------|---------|
| `--color-on-primary` | Text on primary | `#ffffff` |
| `--color-on-background` | High contrast | `#ffffff` |

### Gradients

| Variable | Purpose | Example |
|----------|---------|---------|
| `--color-hero-from` | Gradient start | `#1e293b` |
| `--color-hero-via` | Gradient middle | `#334155` |
| `--color-hero-to` | Gradient end | `#1e293b` |

## Using Theme Variables

### In Svelte Components

Use CSS variables in your component styles:

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

### With Tailwind Classes

Use CSS variables with Tailwind:

```svelte
<div class="bg-[var(--color-card)] border-[var(--color-border)] p-6 rounded-lg">
  <h2 class="text-[var(--color-primary)] text-2xl mb-4">
    Title
  </h2>
  <p class="text-[var(--color-foreground)]">
    Content text
  </p>
</div>
```

### In Global CSS

Add custom styles to `src/lib/index.css`:

```css
@layer utilities {
  .glass-card {
    background: color-mix(in srgb, var(--color-card) 80%, transparent);
    border: 1px solid var(--color-border);
    backdrop-filter: blur(10px);
  }

  .gradient-text {
    background: linear-gradient(
      to right,
      var(--color-primary),
      var(--color-secondary)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
```

Then use these classes:
```svelte
<div class="glass-card">Glass effect card</div>
<h1 class="gradient-text">Gradient text</h1>
```

## Theme Design Tips

### 1. Maintain Contrast

Ensure text is readable on backgrounds:
- Light text on dark backgrounds
- Dark text on light backgrounds
- Test with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### 2. Limit Colors

Stick to:
- 1-2 main backgrounds
- 1 primary color
- 1-2 accent colors
- Text colors (main + muted)

Too many colors = visual chaos.

### 3. Test Everywhere

Check your theme on:
- Homepage
- Blog posts
- Directory pages
- Mobile devices

### 4. Consider Accessibility

- Maintain WCAG AA contrast ratios (4.5:1 for text)
- Don't rely on color alone to convey information
- Test with screen readers

### 5. Brand Consistency

Use your existing brand colors:
1. Export your brand colors from your design system
2. Convert to hex codes
3. Use them in your theme

## Advanced Theming

### Dark Mode Toggle

Statue themes are dark by default. For light/dark toggle:

1. Create two theme files
2. Use JavaScript to switch the import
3. Store preference in localStorage

(This requires custom implementation)

### Per-Page Themes

Override theme variables for specific pages:

```svelte
<div class="special-page">
  <h1>Different colors here</h1>
</div>

<style>
  .special-page {
    --color-primary: #ff0000;
  }

  h1 {
    color: var(--color-primary);  /* Now red */
  }
</style>
```

### Multiple Theme Support

Serve different themes based on user preference:

1. Create multiple theme files
2. Load theme based on URL param or cookie
3. Use CSS custom properties to switch

## Troubleshooting

### Theme not applying

**Check:**
- Is the import path correct?
- Did you restart the dev server?
- Are you using `statue-ssg/themes/` path?

**Fix:**
```bash
npm run dev  # Restart dev server
```

### Colors look wrong

**Check:**
- View browser console for CSS errors
- Inspect element to see which CSS variables are applied
- Verify theme file syntax

### Theme works in dev but not production

**Check:**
- Run `npm run build` to test production build
- Check that theme files are included in the build
- Verify import paths are correct

## More Theme Resources

- **[Themes README](https://github.com/accretional/statue/blob/main/src/lib/themes/README.md)** - Full theme development guide
- **[Site Config](./site-config)** - Configure site settings
- **[Components](./components)** - Ensure components work with your theme

## Contributing Themes

Have a great theme? Share it!

1. Create your theme file
2. Test with all pages and components
3. Submit a pull request to the Statue repository

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for details.
