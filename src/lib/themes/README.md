# 🎨 Statue SSG Themes

Statue is a **static site generator** with a hybrid theme system: preview themes at runtime in dev, bundle at build time for production.

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

---

## 🚀 Quick Start

### Option 1: ThemeSelector Component (Recommended)

Add the dropdown component to preview and select themes:

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { ThemeSelector } from 'statue-ssg';
</script>

<ThemeSelector />
<slot />
```

**How it works:**
1. **Dev mode** (`npm run dev`): Click dropdown → preview themes instantly
2. **Selection persisted**: Your choice saved to `.statue-theme` file
3. **Build time** (`npm run build`): Selected theme bundled into static HTML
4. **Production**: Pure static site, zero JavaScript overhead

---

### Option 2: Config-Based (Simple)

Set theme in `site.config.js`:

```js
export const siteConfig = {
  theme: {
    selected: 'blue'  // Any theme name
  }
};
```

Then build:
```bash
npm run build
```

---

### Option 3: CSS Import (Backward Compatible)

Traditional approach - import theme in `src/lib/index.css`:

```css
@import "tailwindcss";
@import "statue-ssg/themes/purple.css";
```

Works exactly like before - no code changes needed.

---

## 🔄 How The Hybrid System Works

### Theme Resolution Priority

When building your site, Statue checks in this order:

1. **`site.config.js`** - Explicit config (highest priority)
   ```js
   theme: { selected: 'red' }
   ```

2. **`.statue-theme` file** - From ThemeSelector component
   ```
   cyan
   ```

3. **`src/lib/index.css`** - @import statement (backward compatible)
   ```css
   @import "statue-ssg/themes/green.css";
   ```

4. **Default fallback** - `black-white` theme

### Development Workflow

```bash
# Start dev server
npm run dev

# Click ThemeSelector dropdown → preview themes
# Selection auto-saved to .statue-theme

# Build with selected theme
npm run build

# Result: Static HTML with theme CSS variables inline
```

---

## 🎨 Custom Themes

Create a new theme file in `src/lib/themes/my-brand.css`:

```css
/* My Brand Theme */
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

**Auto-detection**: Custom themes automatically appear in ThemeSelector dropdown!

Or select it in config:
```js
theme: { selected: 'my-brand' }
```

---

## 🎨 Theme Variables

Each theme defines 13 CSS custom properties:

### Base Palette
- `--color-background` - Main background
- `--color-card` - Card/section backgrounds
- `--color-border` - Borders
- `--color-foreground` - Main text
- `--color-muted` - Secondary text

### Brand Colors
- `--color-primary` - Primary accent (buttons, links)
- `--color-secondary` - Secondary accent
- `--color-accent` - Tertiary accent

### Text on Surfaces
- `--color-on-primary` - Text on primary buttons
- `--color-on-background` - High contrast text

### Hero Gradients
- `--color-hero-from` - Gradient start
- `--color-hero-via` - Gradient middle
- `--color-hero-to` - Gradient end

---

## 💡 Why This Approach?

### ✅ Best of Both Worlds

**Development:**
- Live theme preview in browser
- No build/rebuild cycle
- Visual theme selection

**Production:**
- Pure static HTML
- Zero JavaScript runtime overhead
- Fast, SEO-friendly
- True SSG principles

### ✅ Flexibility

- **Designers**: Use ThemeSelector for visual workflow
- **Developers**: Use config or CSS import
- **Both**: All methods work, choose what fits your flow

### ✅ Backward Compatible

Existing projects using `@import` in `index.css` continue working without changes.

---

## 📁 Files

```
.statue-theme              # Git-ignored, stores selection
site.config.js             # Optional theme.selected config
src/lib/index.css          # Optional @import (backward compat)
src/lib/themes/            # All theme CSS files
  ├── blue.css
  ├── red.css
  └── ...
```

---

## 🔧 Advanced: Programmatic Theme Access

```svelte
<script>
  import { themes } from 'statue-ssg';

  console.log(themes);
  // [{ id: 'blue', name: 'Blue', colors: {...} }, ...]
</script>
```

Build your own theme UI if needed!
