# Statue Themes Vite Plugin

`statueThemesPlugin` reads your theme configuration at build time, parses each theme CSS file, and exposes:

- `virtual:statue-themes` (JS module): theme metadata for UI (e.g. `ThemeSelector`)
- `virtual:statue-themes.css` (CSS module): combined theme CSS with `:root` + `html[data-theme="..."]`

This avoids any runtime file system access and works in both dev and production builds.

## Installation

```bash
npm install statue-ssg
```

## Setup (Recommended: zero-config)

Add the plugin to `vite.config.js`:

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

When called with no options, the plugin auto-detects `site.config.js` from your project root and reads `siteConfig.theme`.

## Configure Themes (`site.config.js`)

```js
export const siteConfig = {
  theme: {
    default: 'Black & White',
    themes: [
      { name: 'Black & White', path: 'statue-ssg/themes/black-white.css' },
      { name: 'Blue', path: 'statue-ssg/themes/blue.css' },
      { name: 'Custom', path: './src/lib/themes/custom.css' }
    ]
  }
};
```

Rules:
- If `themes.length > 1`, `default` is required.
- Paths can point to built-in themes (`statue-ssg/themes/...`) or to local files (`./...`).

## Load the Generated Theme CSS

Make sure your app imports the virtual CSS once (typically in `+layout.svelte`):

```svelte
<script>
  import 'virtual:statue-themes.css';
</script>

<slot />
```

## What the Plugin Does

At build time, the plugin:

1. **Parses theme CSS files** - Reads each theme file from the configured paths
2. **Extracts CSS variables** - Finds all `--color-*` variables from `@theme {}` or `:root {}` blocks
3. **Generates combined CSS** - Creates a single CSS module with:
   - `:root { ... }` containing the default theme variables (fallback)
   - `html[data-theme="blue"] { ... }` for each configured theme
   - `html[data-theme="red"] { ... }` for each configured theme
   - etc.
4. **Provides virtual modules**:
   - `virtual:statue-themes` - Theme metadata (JS)
   - `virtual:statue-themes.css` - Combined theme CSS

## How Theme Switching Works

The plugin enables runtime theme switching by:

1. Generating CSS for all themes with `[data-theme]` attribute selectors
2. The `ThemeSelector` component changes the `data-theme` attribute on `<html>`
3. CSS cascades and applies the selected theme's colors instantly
4. Theme preference is saved to localStorage for persistence

## Theme Paths

Theme paths can be:

- **Built-in themes**: `'statue-ssg/themes/blue.css'` - Resolves to installed package
- **Custom local themes**: `'./src/lib/themes/my-theme.css'` - Relative to project root
- **Absolute paths**: Resolved from project root

The plugin uses Node's module resolution (including package `exports`), so npm package paths work correctly.

## Manual Configuration (Optional)

If you don't want auto-detection, you can pass options directly:

```js
statueThemesPlugin({
  default: 'Blue',
  themes: [
    { name: 'Blue', path: 'statue-ssg/themes/blue.css' },
    { name: 'Red', path: 'statue-ssg/themes/red.css' }
  ]
})
```

## Theme Data Module

You can import theme metadata for building custom UI:

```js
import { themes, defaultTheme, showSelector } from 'virtual:statue-themes';
```

Exported values:
- `themes`: `Array<{ id: string, name: string, colors: object }>`
- `defaultTheme`: `string` - Kebab-case id (e.g. `"black-white"`)
- `showSelector`: `boolean` - `true` if `themes.length > 1`

Example:
```svelte
<script>
  import { themes, defaultTheme } from 'virtual:statue-themes';
  
  console.log(themes);
  // [
  //   { id: 'blue', name: 'Blue', colors: { background: '#1e3a8a', ... } },
  //   { id: 'red', name: 'Red', colors: { background: '#7f1d1d', ... } }
  // ]
  
  console.log(defaultTheme); // 'blue'
</script>
```

## TypeScript Support

Add type declarations to `src/app.d.ts` or `src/declarations.d.ts`:

```ts
declare module 'virtual:statue-themes' {
  export const themes: Array<{
    id: string;
    name: string;
    colors: Record<string, string>;
  }>;
  export const defaultTheme: string;
  export const showSelector: boolean;
}

declare module 'virtual:statue-themes.css' {
  const css: string;
  export default css;
}
```

## See Also

- [Statue SSG Documentation](https://github.com/accretional/statue)
- [Creating Custom Themes](https://github.com/accretional/statue/blob/main/src/lib/themes/README.md)
