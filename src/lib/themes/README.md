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
| **Black & Red** | `black-red.css` | #dc2626 | Black background, red accents |
| **Charcoal** | `charcoal.css` | #ffffff | Warm neutral grays |

## 🔧 Theme Usage

### Option 1: Static Theme (Default - Backward Compatible)

Use a single theme defined at build time. No runtime switching.

**In `src/lib/index.css`:**
```css
@import "tailwindcss";
@import "statue-ssg/themes/black-white.css";
```

**In `site.config.js`:**
```js
theme: {
  enableSwitcher: false  // Default
}
```

That's it! Your site uses the selected theme.

---

### Option 2: Runtime Theme Switching (NEW)

Allow users to switch themes dynamically with a dropdown component.

**Step 1:** Enable theme switching in `site.config.js`:
```js
theme: {
  enableSwitcher: true
}
```

**Step 2:** Add the ThemeSwitcher component where you want it:
```svelte
<script>
  import { ThemeSwitcher } from 'statue-ssg';
</script>

<ThemeSwitcher />
```

**Features:**
- Auto-detects all themes in `src/lib/themes/` directory
- User preference saved to localStorage
- Zero FOUC (flash of unstyled content)
- Minimal dropdown UI

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

## ✨ Creating a New Theme

To create a new theme:

1. **Use the template**: Copy `custom-theme.template.css` from this folder to your project's `src/lib/themes/` directory
2. **Rename the file**: Give it a meaningful name (e.g., `my-brand.css`, `yellow.css`)
3. **Customize the colors**: Update all color values to match your brand
4. **Import it**: Add `@import "./themes/your-theme.css";` in your `src/lib/index.css`

Quick example:

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

  --color-on-primary: #000000;
  --color-on-background: #2a2400;

  --color-hero-from: #1a1600;
  --color-hero-via: #2a2400;
  --color-hero-to: #1a1600;
}
```

## 💡 Tips

- Use `color-scheme: dark` for dark themes
- Use RGB values of the primary color for hover effects
- Test contrast ratio (WCAG AA standard)
- Maintain consistency across all pages

