# Validation Troubleshooting Guide

This guide helps you fix common validation errors when contributing to Statue SSG.

## Table of Contents

- [Component Validation Errors](#component-validation-errors)
- [Theme Validation Errors](#theme-validation-errors)
- [Template Validation Errors](#template-validation-errors)
- [General Tips](#general-tips)

---

## Component Validation Errors

### Error: "Component does not use CSS variables"

**Problem:** Your component uses hardcoded colors instead of theme variables.

**Solution:**

Replace hardcoded colors with CSS variables:

```svelte
<!-- ❌ Bad -->
<div style="background: #1a1a1a; color: white;">

<!-- ✅ Good -->
<div class="bg-[var(--color-card)] text-[var(--color-foreground)]">
```

**Available CSS variables:**
- `--color-background` - Page background
- `--color-card` - Card backgrounds
- `--color-border` - Borders
- `--color-foreground` - Primary text
- `--color-muted` - Secondary text
- `--color-primary` - Brand primary color
- `--color-secondary` - Brand secondary color
- `--color-accent` - Accent color
- `--color-on-primary` - Text on primary buttons
- `--color-on-background` - High contrast text
- `--color-hero-from`, `--color-hero-via`, `--color-hero-to` - Hero gradient colors

---

### Error: "Component not exported in src/lib/index.ts"

**Problem:** You created the component but didn't export it.

**Solution:**

Add to `src/lib/index.ts`:

```typescript
export { default as YourComponent } from './components/YourComponent.svelte';
```

Keep alphabetical order within component groups.

**Example:**

```typescript
// Export all components
export { default as Hero } from './components/Hero.svelte';
export { default as Stats } from './components/Stats.svelte';
export { default as YourComponent } from './components/YourComponent.svelte'; // Add yours here
```

---

### Warning: "Component not documented in COMPONENTS_README.md"

**Problem:** Missing documentation.

**Note:** This is a warning, not an error. Your contribution will not be blocked, but documentation is recommended.

**Solution:**

Add to `src/lib/components/COMPONENTS_README.md`:

```markdown
### YourComponent

Brief description of what this component does.

\`\`\`svelte
<script>
  import { YourComponent } from 'statue-ssg';
</script>

<YourComponent
  title="Example"
  description="Example description"
/>
\`\`\`

**Props:**
- `title` (string, required) - The title text
- `description` (string, optional) - Optional description text
```

**Key points:**
- Start with `### ComponentName` heading
- Include a brief description
- Show import and usage example
- Document all props with types and whether they're required

---

### Warning: "Component does not use TypeScript"

**Problem:** Component uses plain JavaScript instead of TypeScript.

**Solution (Recommended):**

Add `lang="ts"` to the script tag and type your props:

```svelte
<!-- Before -->
<script>
  export let title;
  export let description = '';
</script>

<!-- After -->
<script lang="ts">
  export let title: string;
  export let description: string = '';
</script>
```

**Note:** This is a warning, not an error. TypeScript is recommended but not required.

---

### Warning: "Component may contain hardcoded colors"

**Problem:** Component has hex colors, RGB values, or other hardcoded colors.

**Solution:**

Use CSS variables for all colors:

```svelte
<!-- ❌ Bad -->
<style>
  .card {
    background: #1a1a1a;
    border: 1px solid #333;
    color: white;
  }
</style>

<!-- ✅ Good -->
<style>
  .card {
    background: var(--color-card);
    border: 1px solid var(--color-border);
    color: var(--color-foreground);
  }
</style>
```

Or use Tailwind with CSS variables:

```svelte
<div class="bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-foreground)]">
```

---

## Theme Validation Errors

### Error: "Theme missing @theme block"

**Problem:** Theme doesn't use the `@theme` directive.

**Solution:**

Wrap all CSS variables in an `@theme` block:

```css
/* ❌ Bad */
:root {
  --color-background: #000000;
  --color-card: #1a1a1a;
}

/* ✅ Good */
@theme {
  --color-background: #000000;
  --color-card: #1a1a1a;
  /* ... other variables */
}
```

---

### Error: "Missing required variable: --color-*"

**Problem:** Theme is missing one or more of the 13 required CSS variables.

**Solution:**

Ensure your theme has ALL of these variables:

```css
@theme {
  /* Core palette (5 variables) */
  --color-background: #000000;
  --color-card: #1a1a1a;
  --color-border: #333333;
  --color-foreground: #ffffff;
  --color-muted: #999999;

  /* Brand colors (3 variables) */
  --color-primary: #ffffff;
  --color-secondary: #cccccc;
  --color-accent: #666666;

  /* Surface colors (2 variables) */
  --color-on-primary: #000000;
  --color-on-background: #ffffff;

  /* Hero gradients (3 variables) */
  --color-hero-from: #000000;
  --color-hero-via: #1a1a1a;
  --color-hero-to: #000000;
}
```

**Total:** 13 required variables (5 + 3 + 2 + 3 = 13)

---

### Error: "Theme name must be lowercase-with-hyphens.css"

**Problem:** Theme filename doesn't follow naming convention.

**Solution:**

Rename your theme file to use lowercase with hyphens:

```bash
# ❌ Bad filenames
MyTheme.css
my_theme.css
myTheme.css
DARKBLUE.css

# ✅ Good filenames
my-theme.css
dark-blue.css
sunset-orange.css
```

---

## Template Validation Errors

### Error: "Missing required route: [...slug]/+page.svelte"

**Problem:** Template is missing the catch-all content route.

**Solution:**

Create the `[...slug]` route files:

**File:** `src/routes/[...slug]/+page.svelte`

```svelte
<script>
  import { ContentHeader, ContentBody } from '$lib';
  export let data;
  $: content = data.content;
</script>

<svelte:head>
  <title>{content.metadata.title}</title>
</svelte:head>

<ContentHeader
  title={content.metadata.title}
  description={content.metadata.description}
/>
<ContentBody content={content.content} />
```

**File:** `src/routes/[...slug]/+page.server.js`

```javascript
import { getContentBySlug } from '$lib/cms/content-processor';

export const prerender = true;

export async function load({ params }) {
  const slug = params.slug || 'index';
  const content = await getContentBySlug(slug);
  return { content };
}
```

---

### Error: "Missing required route: [directory]/+page.svelte"

**Problem:** Template is missing the directory listing route.

**Solution:**

Create the `[directory]` route files:

**File:** `src/routes/[directory]/+page.svelte`

```svelte
<script>
  import { DirectoryHeader, DirectoryContent } from '$lib';
  export let data;
</script>

<svelte:head>
  <title>{data.currentDirectory.title}</title>
</svelte:head>

<DirectoryHeader
  title={data.currentDirectory.title}
  description={data.currentDirectory.description}
/>
<DirectoryContent content={data.directoryContent} />
```

**File:** `src/routes/[directory]/+page.server.js`

```javascript
import { getDirectoryContent } from '$lib/cms/content-processor';

export const prerender = true;

export async function load({ params }) {
  const directory = params.directory;
  const content = await getDirectoryContent(directory);
  return content;
}
```

---

### Error: "+page.server.js missing: export const prerender = true"

**Problem:** Server file doesn't enable static prerendering.

**Solution:**

Add to ALL `+page.server.js` files:

```javascript
export const prerender = true;
```

**Important:** This must be at the top level (not inside a function).

**Example:**

```javascript
import { getContentBySlug } from '$lib/cms/content-processor';

// ✅ Correct: top-level export
export const prerender = true;

export async function load({ params }) {
  // ... load logic
}
```

---

### Error: "File uses 'statue-ssg' import instead of '$lib'"

**Problem:** Template imports from 'statue-ssg' instead of '$lib'.

**Solution:**

Change all imports in your template files:

```svelte
<!-- ❌ Bad -->
<script>
  import { Hero, Footer } from 'statue-ssg';
</script>

<!-- ✅ Good -->
<script>
  import { Hero, Footer } from '$lib';
</script>
```

**Why:** Templates use `$lib` during development. The init script automatically transforms these to `statue-ssg` when users initialize the template.

---

## General Tips

### Running Tests Locally

Before submitting, run these commands:

```bash
# Run all tests
npm test

# Run build
npm run build

# Run validation
./scripts/validate-contribution.sh <type> <path>
```

### Using the Automated PR Script

The validation runs automatically when you use `autopr.sh`:

```bash
# The script will validate before creating PR
./scripts/autopr.sh component MyComponent.svelte
./scripts/autopr.sh theme my-theme.css
./scripts/autopr.sh template my-template
```

If validation fails, the script will exit and show you the errors.

### Getting Help

If you're stuck:

1. Check existing components/themes/templates for patterns
2. Read [ADDING_COMPONENTS.md](./ADDING_COMPONENTS.md), [ADDING_THEMES.md](./ADDING_THEMES.md), or [ADDING_TEMPLATES.md](./ADDING_TEMPLATES.md)
3. Look at similar existing contributions
4. Ask in [GitHub Discussions](https://github.com/accretional/statue/discussions)
5. Join the [Discord community](https://discord.gg/accretional)

---

## Validation is Failing But I Think It's Wrong

If you believe the validation is incorrectly flagging your contribution:

1. Double-check this guide for solutions
2. Review the relevant ADDING_*.md guide
3. Look at similar existing contributions that pass validation
4. If still stuck, open a GitHub Discussion explaining why you think the validation is incorrect

The validation rules exist to ensure consistency and quality. Most errors indicate actual issues that should be fixed before submission.

---

## Common Questions

### Q: Can I skip validation?

**A:** No. Validation is required to maintain code quality and consistency across contributions.

### Q: Why are TypeScript warnings not blocking?

**A:** TypeScript is recommended but not required. We want to encourage it without forcing it.

### Q: Can I add extra CSS variables to my theme?

**A:** Yes! The 13 variables are the minimum required. You can add additional variables if needed.

### Q: What if my component doesn't need props?

**A:** That's fine! The "no exported props" check is just a warning, not an error.

### Q: How do I test my contribution before submitting?

**A:** Run `./scripts/validate-contribution.sh <type> <file>` to validate before using autopr.sh.

---

Thank you for contributing to Statue SSG!
