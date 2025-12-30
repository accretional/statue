# 🎨 Statue SSG Themes

This folder contains different color themes. Statue is a **static site generator**, so themes are applied at **build time** - not runtime.

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
| **Black & Red** | `black-red.css` | #dc2626 | Black background, red accents |
| **Charcoal** | `charcoal.css` | #ffffff | Warm neutral grays |

## 🔧 How to Use

### Simple: Select Theme in Config (Recommended)

Edit `site.config.js`:

```js
export const siteConfig = {
  // ... other config

  theme: {
    selected: 'blue'  // Change to any theme name
  }
};
```

Available theme names: `'black-white'`, `'blue'`, `'red'`, `'green'`, `'orange'`, `'purple'`, `'cyan'`, `'pink'`, `'black-red'`, `'charcoal'`

Then build your site:
```bash
npm run build
```

The entire static site will use your selected theme. **Pure SSG - no JavaScript runtime overhead!**

---

### Advanced: Custom Theme

Create a new CSS file in `src/lib/themes/my-theme.css`:

```css
/* My Theme */
@theme {
  --color-background: #1a1600;
  --color-card: #2a2400;
  --color-border: #4a4200;
  --color-foreground: #fffef0;
  --color-muted: #fde047;

  --color-primary: #facc15;
  --color-secondary: #fde047;
  --color-accent: #eab308;

  --color-on-primary: #000000;
  --color-on-background: #2a2400;

  --color-hero-from: #1a1600;
  --color-hero-via: #2a2400;
  --color-hero-to: #1a1600;
}
```

Then in `site.config.js`:
```js
theme: {
  selected: 'my-theme'
}
```

**That's it!** The theme auto-loads from the themes directory.

---

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

## 💡 How It Works (Build-Time)

1. You select a theme in `site.config.js`
2. During build/dev, Statue reads the theme CSS file
3. Theme colors are injected as inline styles in the `<html>` tag
4. All pages use those CSS custom properties
5. Result: **Pure static HTML with zero JavaScript overhead**

This keeps Statue fast and true to static site generator principles!
