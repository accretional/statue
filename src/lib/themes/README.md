# 🎨 Statue SSG Themes

This folder contains different color themes. Each theme file uses the same CSS variables but with different color palettes.

## 📦 Available Themes

| Theme | File | Primary Color | Description |
|------|-------|----------|----------|
| **Black & White** | `black-white.css` | Monochrome | Minimalist black and white theme |
| **Blue** | `blue.css` | #3b82f6 | Navy background, blue accents |
| **Red** | `red.css` | #ef4444 | Dark red background, red accents |
| **Orange** | `orange.css` | #f97316 | Brown background, orange accents |
| **Green** | `green.css` | #10b981 | Dark green background, emerald accents |
| **Purple** | `purple.css` | #a855f7 | Dark purple background, purple accents |
| **Cyan** | `cyan.css` | #06b6d4 | Dark cyan background, cyan accents |
| **Pink** | `pink.css` | #ec4899 | Dark pink background, pink accents |

## 🔧 Theme Usage

### Method 1: Modify Main CSS File

Import your desired theme in the `src/lib/index.css` file:

```css
@import "tailwindcss";
@import "./themes/blue.css";  /* Select your desired theme */

/* Base element defaults using tokens */
:root {
  color-scheme: dark;
}

/* Optional utilities for smooth rendering */
@layer utilities {
  .bg-surface { background-color: var(--color-card); }
  .glass-bg { background-color: color-mix(in srgb, var(--color-card) 78%, transparent); }
  .glass-border { border-color: color-mix(in srgb, var(--color-border) 70%, transparent); }
}
```

### Method 2: Use @theme Directly

Copy the `@theme` block from the theme file and paste it into your `index.css` file.

## 🎨 Theme Variables

Each theme defines the following CSS variables:

### Base Palette
- `--color-background` - Main background color
- `--color-card` - Card/section background color
- `--color-border` - Border color
- `--color-foreground` - Main text color
- `--color-muted` - Secondary/muted text color

### Brand Colors
- `--color-primary` - Primary accent color (buttons, links)
- `--color-secondary` - Secondary accent color
- `--color-accent` - Tertiary accent color

### Text Colors
- `--color-on-primary` - Text on primary color
- `--color-on-background` - Contrast text on background

### Gradient Colors
- `--color-hero-from` - Hero gradient start
- `--color-hero-via` - Hero gradient middle
- `--color-hero-to` - Hero gradient end

## ✨ Creating a New Theme

To create a new theme:

1. Copy an existing theme file
2. Rename the file (e.g., `yellow.css`)
3. Customize the color values
4. Update the comments

Example:

```css
/* Yellow Theme */
@theme {
  --color-background: #1a1600;
  --color-card: #2a2400;
  --color-border: #4a4200;
  --color-foreground: #fffef0;
  --color-muted: #fde047;
  
  --color-primary: #facc15;
  --color-secondary: #fde047;
  --color-accent: #eab308;
  
  /* ... other variables */
}
```

## 💡 Tips

- Use `color-scheme: dark` for dark themes
- Use RGB values of the primary color for hover effects
- Test contrast ratio (WCAG AA standard)
- Maintain consistency across all pages

