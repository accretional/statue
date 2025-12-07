# Adding Themes to Statue

This guide shows you how to add a new built-in theme to the Statue component library.

## Before You Start

- Read [CONTRIBUTING.md](./CONTRIBUTING.md) for general contribution guidelines
- Understand CSS custom properties (CSS variables)
- Know basic color theory and contrast requirements
- Review existing themes in `src/lib/themes/`

---

## What is a Theme?

A theme is a CSS file that defines color values for all required CSS variables. Themes control:
- Background and text colors
- Brand/accent colors
- Border and card colors
- Hero gradient colors

**All Statue components use these variables** - so changing the theme changes the entire site's appearance.

---

## Step-by-Step: Adding a New Theme

### 1. Choose Your Theme Concept

**Decide on your theme:**

- **Color palette**: What's the primary color? (e.g., teal, yellow, brown)
- **Mood**: Professional, playful, minimalist, vibrant?
- **Background**: Dark, light, or mixed?
- **Target use case**: Corporate sites, creative portfolios, technical docs?

**Examples of good theme concepts:**
- "Midnight Blue" - Deep blue backgrounds for professional sites
- "Forest Green" - Nature-inspired green tones
- "Sunset Orange" - Warm orange and yellow tones

---

### 2. Create the Theme File

**Create `src/lib/themes/your-theme.css`:**

```css
/* Your Theme Name */
@theme {
  /* Core palette - Base colors */
  --color-background: #0a0e1a;  /* Main background */
  --color-card: #131824;        /* Card/section background */
  --color-border: #1e2535;      /* Border color */
  --color-foreground: #e8eaed;  /* Main text */
  --color-muted: #9ca3af;       /* Secondary text */

  /* Brand colors - Your theme's accent colors */
  --color-primary: #00d4ff;     /* Primary accent (buttons, links) */
  --color-secondary: #00a8cc;   /* Secondary accent */
  --color-accent: #0080a0;      /* Tertiary accent */

  /* Text colors for different surfaces */
  --color-on-primary: #ffffff;    /* Text on primary buttons */
  --color-on-background: #ffffff; /* High contrast text */

  /* Hero gradients - Used in hero sections */
  --color-hero-from: #0a0e1a;   /* Gradient start */
  --color-hero-via: #131824;    /* Gradient middle */
  --color-hero-to: #0a0e1a;     /* Gradient end */
}
```

**Required: All variables must be defined.** Missing variables will break components.

**Naming convention:**
- Use lowercase names
- Use hyphens, not underscores
- Name should describe the primary color (e.g., `teal.css`, `brown.css`)

---

### 3. Choose Accessible Colors

**Check color contrast:**

Your theme must meet WCAG AA standards for accessibility:

- **Normal text**: Contrast ratio ≥ 4.5:1
- **Large text**: Contrast ratio ≥ 3:1
- **Interactive elements**: Easily distinguishable

**Use a contrast checker:**
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Coolors Contrast Checker](https://coolors.co/contrast-checker)

**Check these combinations:**
- `--color-foreground` on `--color-background`
- `--color-on-primary` on `--color-primary`
- `--color-muted` on `--color-background`

**Example:**
```
Foreground: #e8eaed on Background: #0a0e1a
Contrast ratio: 13.5:1 ✅ (passes WCAG AA)
```

---

### 4. Test Your Theme

**Import your theme in `src/lib/index.css`:**

```css
@import "tailwindcss";
@import "./themes/your-theme.css";  /* Your new theme */

@source "../";
@source "../../node_modules/statue-ssg/src/**/*.{svelte,js,ts}";
```

**Start the dev server:**

```bash
npm run dev
```

**Test checklist:**
- [ ] Homepage displays correctly
- [ ] All text is readable (good contrast)
- [ ] Buttons and links are clearly visible
- [ ] Cards and borders are distinguishable
- [ ] Hero section gradient looks good
- [ ] Content pages render properly
- [ ] Directory listing pages work
- [ ] Navigation is visible
- [ ] Footer displays correctly
- [ ] No visual glitches or inconsistencies

**Test on multiple pages:**
- Homepage (`/`)
- Blog post (`/blog/hello-world`)
- Blog listing (`/blog`)
- Docs page (`/docs/get-started`)
- About page (`/about`)

**Test responsive design:**
- Mobile (375px width)
- Tablet (768px width)
- Desktop (1920px width)

---

### 5. Document Your Theme

**Update `src/lib/themes/README.md`:**

Add your theme to the "Available Themes" table:

```markdown
| **Your Theme** | `your-theme.css` | #00d4ff | Description of theme |
```

**Update `content/docs/themes.md`:**

Add your theme to the "Built-in Themes" list:

```markdown
@import "statue-ssg/themes/your-theme.css";  /* Description */
```

---

### 6. Create Example Screenshots (Optional)

**If you want to showcase your theme:**

1. Take screenshots of key pages with your theme
2. Save them in a PR comment or docs
3. Shows maintainers and users what the theme looks like

---

### 7. Submit Your PR

**Before submitting:**
- [ ] All required CSS variables defined
- [ ] Passes WCAG AA contrast requirements
- [ ] Tested on all major pages
- [ ] Tested responsive design
- [ ] No console errors or warnings
- [ ] Documented in README.md
- [ ] Documented in content/docs/themes.md
- [ ] Tested with `npm run build`

**PR Title:**
```
feat: add [theme-name] theme
```

**PR Description:**
```markdown
## New Theme: Your Theme Name

Brief description of the theme's color palette and intended use case.

### Color Palette
- Primary: #00d4ff (Bright cyan)
- Background: #0a0e1a (Dark navy)
- Foreground: #e8eaed (Light gray)

### Contrast Ratios
- Foreground/Background: 13.5:1 ✅
- Primary/Background: 8.2:1 ✅
- Muted/Background: 4.8:1 ✅

### Testing Done
- [x] Tested on all pages
- [x] Responsive design verified
- [x] Accessibility checked
- [x] Build process successful
- [x] Documentation updated

### Screenshots
[Add screenshots if available]
```

---

## Theme Guidelines

### Required Variables

**Every theme must define these CSS variables:**

| Variable | Purpose |
|----------|---------|
| `--color-background` | Main page background |
| `--color-card` | Card/section backgrounds |
| `--color-border` | Borders and dividers |
| `--color-foreground` | Main text color |
| `--color-muted` | Secondary/muted text |
| `--color-primary` | Primary accent (buttons, links) |
| `--color-secondary` | Secondary accent |
| `--color-accent` | Tertiary accent |
| `--color-on-primary` | Text on primary buttons |
| `--color-on-background` | High contrast text |
| `--color-hero-from` | Hero gradient start |
| `--color-hero-via` | Hero gradient middle |
| `--color-hero-to` | Hero gradient end |

**Missing variables = broken styling.**

---

### Color Selection Tips

**1. Start with a primary color**

Choose your main brand color first:

```css
--color-primary: #3b82f6;  /* Bright blue */
```

**2. Create variations**

Generate lighter and darker versions:

```css
--color-secondary: #60a5fa;  /* Lighter blue */
--color-accent: #2563eb;     /* Darker blue */
```

**3. Choose complementary backgrounds**

Dark themes need dark backgrounds:

```css
--color-background: #0b1220;  /* Very dark navy */
--color-card: #0f172a;        /* Slightly lighter */
--color-border: #1e3a5f;      /* Visible but subtle */
```

**4. Ensure readability**

Text must be clearly readable:

```css
--color-foreground: #e5e7eb;  /* Light gray, not pure white */
--color-muted: #94a3b8;       /* Dimmer but still readable */
```

**5. Create smooth gradients**

Hero gradients should be subtle:

```css
--color-hero-from: #0b1220;   /* Same as background */
--color-hero-via: #0f172a;    /* Card color */
--color-hero-to: #0b1220;     /* Back to background */
```

---

### Best Practices

**Use hex colors:**

```css
/* ✅ Good */
--color-primary: #3b82f6;

/* ❌ Bad */
--color-primary: rgb(59, 130, 246);
--color-primary: blue;
```

**Why:** Hex values are consistent and work with color-mix functions.

---

**Keep consistent color temperature:**

```css
/* ✅ Good - all cool tones */
--color-background: #0b1220;  /* Cool blue-navy */
--color-primary: #3b82f6;     /* Cool blue */

/* ❌ Bad - mixed temperatures */
--color-background: #0b1220;  /* Cool blue-navy */
--color-primary: #f97316;     /* Warm orange */
```

**Why:** Consistent temperature creates visual harmony.

---

**Test in different lighting:**

View your theme in:
- Bright daylight
- Dim indoor lighting
- Dark room

**Why:** Colors look different in different lighting conditions.

---

**Consider color blindness:**

Test with color blindness simulators:
- [Coblis](https://www.color-blindness.com/coblis-color-blindness-simulator/)
- [Chrome DevTools](https://developer.chrome.com/blog/cvd/)

**Why:** ~8% of men and ~0.5% of women have color vision deficiency.

---

### Optional Variables

Some themes define additional variables:

```css
@theme {
  /* Standard variables above... */

  /* Optional: Prose overrides for better code blocks */
  --color-prose-link: #8DA2C8;
  --color-prose-code-bg: #333333;
  --color-prose-pre-bg: #333333;
}
```

**When to use:**
- Black & white themes need distinct code block colors
- Special link colors for better visibility
- Custom styling for markdown content

---

## Common Pitfalls

### ❌ Don't: Use RGB/HSL

```css
--color-primary: rgb(59, 130, 246);
```

### ✅ Do: Use Hex

```css
--color-primary: #3b82f6;
```

---

### ❌ Don't: Low Contrast

```css
--color-foreground: #555555;  /* On dark background */
--color-background: #000000;
/* Contrast: 2.8:1 - Fails WCAG AA */
```

### ✅ Do: High Contrast

```css
--color-foreground: #e5e7eb;  /* On dark background */
--color-background: #0b1220;
/* Contrast: 13.2:1 - Passes WCAG AA */
```

---

### ❌ Don't: Inconsistent Naming

```css
/* my-teal-theme.css */
--color-primary: #ec4899;  /* This is pink, not teal! */
```

### ✅ Do: Accurate Naming

```css
/* teal.css */
--color-primary: #14b8a6;  /* Actually teal */
```

---

### ❌ Don't: Harsh Gradients

```css
--color-hero-from: #000000;
--color-hero-via: #ff0000;  /* Jarring transition */
--color-hero-to: #000000;
```

### ✅ Do: Subtle Gradients

```css
--color-hero-from: #0a0e1a;
--color-hero-via: #131824;  /* Smooth transition */
--color-hero-to: #0a0e1a;
```

---

## Theme Variations

### Dark Themes (Most Common)

```css
--color-background: #0a0e1a;  /* Very dark */
--color-foreground: #e8eaed;  /* Very light */
```

**Best for:** Technical content, modern designs, reducing eye strain

---

### Light Themes

```css
--color-background: #ffffff;  /* White */
--color-foreground: #1a1a1a;  /* Near black */
```

**Best for:** Traditional content, print-friendly, high-brightness environments

**Note:** Statue currently focuses on dark themes. Light themes are welcome contributions!

---

### Monochrome Themes

```css
--color-primary: #ffffff;
--color-secondary: #cccccc;
--color-accent: #666666;
```

**Best for:** Minimalist designs, focusing on content, professional sites

---

## Testing Checklist

Use this checklist before submitting:

**Visual Testing:**
- [ ] Text is readable everywhere
- [ ] Buttons are clearly visible
- [ ] Links are distinguishable
- [ ] Borders are visible but subtle
- [ ] Cards stand out from background
- [ ] Hero gradients are smooth
- [ ] No jarring color combinations

**Technical Testing:**
- [ ] All variables defined
- [ ] No CSS errors in console
- [ ] Works with all components
- [ ] Responsive on all screen sizes
- [ ] Build succeeds (`npm run build`)

**Accessibility Testing:**
- [ ] WCAG AA contrast ratios met
- [ ] Color blindness simulation checked
- [ ] Text remains readable at different zoom levels

**Documentation:**
- [ ] Added to README.md table
- [ ] Added to themes.md list
- [ ] PR description complete

---

## Questions?

- Check existing themes in `src/lib/themes/` for patterns
- Read [CONTRIBUTING.md](./CONTRIBUTING.md) for PR process
- Ask in [GitHub Discussions](https://github.com/accretional/statue/discussions)
