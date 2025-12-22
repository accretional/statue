# Adding Components to Statue

This guide shows you how to add a new component to the Statue component library.

## Before You Start

- Read [CONTRIBUTING.md](./CONTRIBUTING.md) for general contribution guidelines
- Understand Svelte component basics
- Know how Statue's theming system works (see [src/lib/themes/README.md](./src/lib/themes/README.md))

---

## Step-by-Step: Adding a New Component

### 1. Create the Component File

**Create `src/lib/components/YourComponent.svelte`:**

```svelte
<script lang="ts">
  // Export all props
  export let title: string;
  export let description: string = '';  // Optional prop with default
  export let items: Array<{ name: string; value: string }> = [];
</script>

<div class="your-component">
  <h2 class="text-[var(--color-primary)] text-2xl font-bold mb-4">
    {title}
  </h2>

  {#if description}
    <p class="text-[var(--color-foreground)] mb-6">
      {description}
    </p>
  {/if}

  <div class="grid gap-4">
    {#each items as item}
      <div class="bg-[var(--color-card)] border border-[var(--color-border)] p-4 rounded-lg">
        <h3 class="text-[var(--color-foreground)] font-medium">{item.name}</h3>
        <p class="text-[var(--color-muted)]">{item.value}</p>
      </div>
    {/each}
  </div>
</div>

<style>
  /* Scoped styles if needed */
  .your-component {
    /* Use theme variables */
    background: var(--color-background);
  }
</style>
```

**Required:**
- Use TypeScript for props
- Use theme CSS variables (e.g., `var(--color-primary)`)
- Support optional props with sensible defaults
- Make it responsive

---

### 2. Export the Component

**Add to `src/lib/index.ts`:**

```typescript
// ... existing exports
export { default as YourComponent } from './components/YourComponent.svelte';
```

**Keep alphabetical order.**

---

### 3. Document the Component

**Add to `src/lib/components/COMPONENTS_README.md`:**

```markdown
### YourComponent

Brief description of what it does.

```svelte
<script>
  import { YourComponent } from 'statue-ssg';

  const items = [
    { name: 'Item 1', value: 'Value 1' }
  ];
</script>

<YourComponent
  title="My Title"
  description="Optional description"
  {items}
/>
```

**Props:**
- `title` (string, required) - The title
- `description` (string, optional) - Optional description
- `items` (array, optional) - Array of items to display
  - `name` (string) - Item name
  - `value` (string) - Item value
```

---

### 4. Test Your Component

**Create a test page in `src/routes/`:**

```svelte
<!-- src/routes/test-component/+page.svelte -->
<script>
  import { YourComponent } from '$lib';

  const items = [
    { name: 'Test 1', value: 'Value 1' },
    { name: 'Test 2', value: 'Value 2' }
  ];
</script>

<YourComponent
  title="Test Component"
  description="Testing the new component"
  {items}
/>
```

**Test:**
```bash
npm run dev
```

Visit `/test-component` and verify:
- [ ] Component renders correctly
- [ ] All props work as expected
- [ ] Responsive on mobile, tablet, desktop
- [ ] Works with all 8 built-in themes
- [ ] Keyboard navigation works (if interactive)
- [ ] Screen reader accessible (if applicable)

**Delete the test page before committing.**

---

### 5. Add to User Documentation

**Add to `content/docs/components.md`:**

Add your component to the appropriate section with a brief example:

```markdown
### YourComponent

Description.

```svelte
<script>
  import { YourComponent } from 'statue-ssg';
</script>

<YourComponent title="Hello" />
```

**Props:**
- `title` (string, required) - The title
```

---

### 6. Submit Your PR

**Before submitting:**
- [ ] Component uses theme variables
- [ ] Documented in COMPONENTS_README.md
- [ ] Documented in content/docs/components.md
- [ ] Exported in src/lib/index.ts
- [ ] Tested with all themes
- [ ] Responsive design
- [ ] Accessible
- [ ] No console errors/warnings

**PR Description:**
```markdown
## New Component: YourComponent

Brief description of what it does and why it's useful.

### Example Usage
[code example]

### Testing Checklist
- [x] Works with all themes
- [x] Responsive
- [x] Accessible
- [x] Documented
```

---

## Component Guidelines

### Required Patterns

**1. Use Theme Variables**

```css
/* ✅ Good */
background: var(--color-card);
color: var(--color-foreground);

/* ❌ Bad */
background: #1a1a1a;
color: white;
```

**2. TypeScript Props**

```typescript
// ✅ Good
export let title: string;
export let optional: string = 'default';

// ❌ Bad
export let title;
export let optional;
```

**3. Responsive Design**

```svelte
<!-- ✅ Good -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

<!-- ❌ Bad -->
<div style="width: 800px;">
```

**4. Accessible Markup**

```svelte
<!-- ✅ Good -->
<button aria-label="Close menu">
  <svg>...</svg>
</button>

<!-- ❌ Bad -->
<div onclick={close}>
  <svg>...</svg>
</div>
```

---

### Optional Props Pattern

```typescript
export let title: string;                    // Required
export let description: string | undefined = undefined;  // Optional, explicitly undefined
export let items: Array<Item> = [];          // Optional, default empty array
export let showIcons: boolean = true;        // Optional, default true
```

---

### Conditional Rendering

```svelte
{#if description}
  <p>{description}</p>
{/if}

{#if items.length > 0}
  <ul>
    {#each items as item}
      <li>{item.name}</li>
    {/each}
  </ul>
{:else}
  <p>No items found.</p>
{/if}
```

---

### Slots (Advanced)

For flexible content injection:

```svelte
<script>
  export let title: string;
</script>

<div class="component">
  <h2>{title}</h2>

  <!-- Allow custom content -->
  <slot />

  <!-- Named slots -->
  <div class="footer">
    <slot name="footer">
      <!-- Default footer content -->
    </slot>
  </div>
</div>
```

Usage:
```svelte
<YourComponent title="Hello">
  <p>Custom content</p>

  <svelte:fragment slot="footer">
    <button>Custom Footer</button>
  </svelte:fragment>
</YourComponent>
```

---

## Common Pitfalls

### ❌ Don't: Hardcode Colors

```svelte
<div style="background: #000; color: #fff;">
```

### ✅ Do: Use Theme Variables

```svelte
<div class="bg-[var(--color-background)] text-[var(--color-foreground)]">
```

---

### ❌ Don't: Fixed Widths

```svelte
<div style="width: 600px;">
```

### ✅ Do: Responsive Layout

```svelte
<div class="max-w-4xl w-full">
```

---

### ❌ Don't: Missing Props Documentation

Just creating the component without docs.

### ✅ Do: Full Documentation

Document all props, provide examples, show common use cases.

---

## Automated PR Script

**Want to skip the manual PR process?**

Use the automated PR script:

```bash
# Basic usage (component in current directory or subdirectories)
./scripts/autopr.sh component YourComponent

# Extension is optional
./scripts/autopr.sh component YourComponent.svelte

# With subdirectory (e.g., forms/YourComponent.svelte)
./scripts/autopr.sh component YourComponent forms
```

**What it does:**
1. Looks for `YourComponent.svelte` in current directory, then searches subdirectories
2. Forks the statue repository (if needed)
3. Creates a new branch
4. Copies your component to `src/lib/components/[subdir/]YourComponent.svelte`
5. Commits and pushes the changes
6. Opens a pull request automatically

**Requirements:**
- GitHub CLI (`gh`) installed and authenticated
- Your component file (e.g., `YourComponent.svelte`) in current directory or subdirectories
- Extension (`.svelte`) is optional in the command

**Note:** You'll still need to add documentation and examples manually after the PR is created. The script just handles the git workflow.

---

## Questions?

- Check existing components in `src/lib/components/` for patterns
- Read [CONTRIBUTING.md](./CONTRIBUTING.md) for PR process
- Ask in [GitHub Discussions](https://github.com/accretional/statue/discussions)
