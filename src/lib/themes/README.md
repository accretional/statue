# Statue Themes

Statue themes are plain CSS files that define the site's design tokens using CSS custom properties (e.g. `--color-background`, `--color-primary`). Statue's theme system works by loading all configured theme variables at build time and switching between them at runtime by setting `data-theme` on the `<html>` element.

## Built-in Themes

These are shipped with the package under `statue-ssg/themes/*`:

| Theme | File | Primary Color | Description |
|-------|------|---------------|-------------|
| **Black & White** | `black-white.css` | Monochrome | Minimalist black and white theme |
| **Blue** | `blue.css` | #3b82f6 | Navy background, blue accents |
| **Red** | `red.css` | #ef4444 | Dark red background, red accents |
| **Green** | `green.css` | #10b981 | Dark green background, emerald accents |
| **Purple** | `purple.css` | #a855f7 | Dark purple background, purple accents |
| **Cyan** | `cyan.css` | #06b6d4 | Dark cyan background, cyan accents |
| **Orange** | `orange.css` | #f97316 | Brown background, orange accents |
| **Pink** | `pink.css` | #ec4899 | Dark pink background, pink accents |
| **Charcoal** | `charcoal.css` | #ffffff | Warm neutral grays |

Use them in your theme config as:

```js
{ name: 'Blue', path: 'statue-ssg/themes/blue.css' }
```

## How Theme Switching Works

At build time, the Vite plugin generates CSS like:

- `:root { ... }` using the configured default theme (fallback)
- `html[data-theme="blue"] { ... }` per theme
- `html[data-theme="red"] { ... }` per theme
- etc.

At runtime, switching theme is just:

```js
document.documentElement.dataset.theme = 'blue';
```

The `ThemeSelector` component does this automatically and persists the selection in `localStorage`.

## Configuring Themes

Themes are configured in `site.config.js`:

```js
export const siteConfig = {
  theme: {
    default: 'Black & White',
    themes: [
      { name: 'Black & White', path: 'statue-ssg/themes/black-white.css' },
      { name: 'Blue', path: 'statue-ssg/themes/blue.css' },
      { name: 'Charcoal', path: 'statue-ssg/themes/charcoal.css' },

      // Custom theme from your repo:
      { name: 'My Brand', path: './src/lib/themes/my-brand.css' }
    ]
  }
};
```

Notes:
- If you configure more than one theme, `theme.default` is required.
- Theme `name` is user-facing; internally it's converted to an id (kebab-case) for `data-theme`.

## Using the ThemeSelector Component

Add the `ThemeSelector` component to your layout to allow users to switch themes:

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { ThemeSelector } from 'statue-ssg';
  import 'virtual:statue-themes.css';
</script>

<ThemeSelector />
<slot />
```

The component will:
- Display a dropdown with all configured themes
- Apply the selected theme instantly by changing `data-theme` attribute
- Persist the selection in `localStorage`
- Auto-hide if only one theme is configured

## Creating a Custom Theme

Create a CSS file that defines `--color-*` variables in either an `@theme {}` block (Tailwind v4 style) or a `:root {}` block:

```css
@theme {
  --color-background: #0b1020;
  --color-card: #121a33;
  --color-border: #223057;

  --color-foreground: #eaeefc;
  --color-muted: #aab4d6;

  --color-primary: #7aa2ff;
  --color-secondary: #9db7ff;
  --color-accent: #4e7dff;

  --color-on-primary: #0b1020;
  --color-on-background: #eaeefc;

  --color-hero-from: #0b1020;
  --color-hero-via: #121a33;
  --color-hero-to: #0b1020;
}
```

Then add it to `site.config.js` as shown above.

## Required Variables

A theme is expected to provide the set of `--color-*` tokens used by the built-in components. At minimum, you should define:

- `--color-background`, `--color-card`, `--color-border`
- `--color-foreground`, `--color-muted`
- `--color-primary`, `--color-secondary`, `--color-accent`
- `--color-on-primary`, `--color-on-background`
- `--color-hero-from`, `--color-hero-via`, `--color-hero-to`

Some themes also define:
- `--color-prose-link`, `--color-prose-code-bg`, `--color-prose-pre-bg`

If you omit tokens used by a component, that component may render with unexpected colors.

## Advanced: Programmatic Theme Access

You can import theme metadata for building custom UI:

```svelte
<script>
  import { themes, defaultTheme, showSelector } from 'virtual:statue-themes';

  console.log(themes);
  // [{ id: 'blue', name: 'Blue', colors: {...} }, ...]
  
  console.log(defaultTheme); // 'black-white'
  console.log(showSelector); // true if multiple themes configured
</script>
```

This allows you to build your own theme selector UI if needed.
