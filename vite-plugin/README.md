# Statue SSG - Vite Plugin

This Vite plugin automatically handles theme management for Statue SSG projects.

## Usage

### Installation

The plugin is included when you install `statue-ssg`:

```bash
npm install statue-ssg
```

### Configuration

Import and use the plugin in your `vite.config.js`:

```js
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { statueThemesPlugin } from 'statue-ssg/vite-plugin';
import { siteConfig } from './site.config.js';

export default defineConfig({
  plugins: [
    statueThemesPlugin(siteConfig.theme || {}),
    sveltekit()
  ]
});
```

### Theme Configuration

Configure themes in your `site.config.js`:

```js
export const siteConfig = {
  theme: {
    // Default theme (required if you have multiple themes)
    default: 'Blue',
    
    // Array of available themes
    themes: [
      // Built-in themes from statue-ssg
      { name: 'Blue', path: 'statue-ssg/themes/blue.css' },
      { name: 'Red', path: 'statue-ssg/themes/red.css' },
      { name: 'Green', path: 'statue-ssg/themes/green.css' },
      
      // Or use custom themes
      { name: 'Custom', path: './src/lib/themes/custom.css' }
    ]
  }
};
```

## What It Does

The plugin:

1. **Parses theme CSS files** at build time
2. **Extracts CSS variables** (`--color-*`) from theme files
3. **Generates combined CSS** with `html[data-theme="..."]` selectors
4. **Provides virtual modules**:
   - `virtual:statue-themes` - Theme metadata for the ThemeSelector component
   - `virtual:statue-themes.css` - Combined theme CSS

## How Theme Switching Works

The plugin enables runtime theme switching by:

1. Generating CSS for all themes with `[data-theme]` attribute selectors
2. The `ThemeSelector` component changes the `data-theme` attribute on `<html>`
3. CSS cascades and applies the selected theme's colors
4. Theme preference is saved to localStorage

## Theme Paths

Theme paths can be:

- **Built-in themes**: `'statue-ssg/themes/blue.css'`
- **Custom local themes**: `'./src/lib/themes/my-theme.css'`
- **Relative paths**: Resolved from project root

## See Also

- [Statue SSG Documentation](https://github.com/accretional/statue)
- [Creating Custom Themes](https://github.com/accretional/statue/blob/main/ADDING_THEMES.md)
