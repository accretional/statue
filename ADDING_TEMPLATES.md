# Adding Templates to Statue

This guide shows you how to add a new template to the Statue static site generator.

## Before You Start

- Read [CONTRIBUTING.md](./CONTRIBUTING.md) for general contribution guidelines
- Understand [SvelteKit routing basics](https://svelte.dev/docs/kit/routing)
- Review existing templates in `templates/` directory
- Know how Statue's content system works (see [content/docs/routing.md](./content/docs/routing.md))

---

## Step-by-Step: Adding a New Template

### 1. Plan Your Template

**Decide what makes your template unique:**

- **Purpose**: What type of site is this for? (portfolio, documentation, landing page, etc.)
- **Structure**: What pages/routes will it include?
- **Content**: What example content will demonstrate the template?
- **Audience**: Who is this template for?

**Examples:**
- Blog template: Minimal, content-focused, for writers
- Portfolio template: Project showcase, for designers/developers
- Docs template: Documentation-focused, for technical writers

---

### 2. Create the Template Directory

**Create the directory structure:**

```bash
mkdir -p templates/your-template/src/routes
mkdir -p templates/your-template/content
```

**Your template must have:**
- `src/routes/` - Route files that define page layouts
- `content/` - Example markdown content
- `site.config.js` - Default configuration for this template

**Optional:**
- `static/` - Custom assets (favicon, images)

---

### 3. Create Route Files

**Create the essential routes:**

#### Required: Content Page Route

**Create `templates/your-template/src/routes/[...slug]/+page.svelte`:**

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

**Create `templates/your-template/src/routes/[...slug]/+page.server.js`:**

```javascript
import { getContentBySlug } from '$lib/cms/content-processor';

export const prerender = true;

export async function load({ params }) {
  const slug = params.slug || 'index';
  const content = await getContentBySlug(slug);
  return { content };
}
```

#### Required: Directory Listing Route

**Create `templates/your-template/src/routes/[directory]/+page.svelte`:**

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

**Create `templates/your-template/src/routes/[directory]/+page.server.js`:**

```javascript
import { getDirectoryContent } from '$lib/cms/content-processor';

export const prerender = true;

export async function load({ params }) {
  const directory = params.directory;
  const content = await getDirectoryContent(directory);
  return content;
}
```

#### Required: Homepage

**Create `templates/your-template/src/routes/+page.svelte`:**

```svelte
<script>
  // Your homepage design
  import { Hero, Categories } from '$lib';
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<!-- Customize your homepage layout -->
<Hero
  title="Your Template Title"
  subtitle="Brief description of what this template is for"
/>

<!-- Add other components as needed -->
```

#### Optional: Layout File

**Create `templates/your-template/src/routes/+layout.svelte`:**

```svelte
<script>
  import { NavigationBar, Footer } from '$lib';
  import '$lib/index.css';
</script>

<div class="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
  <NavigationBar />

  <main class="max-w-6xl mx-auto px-4 py-8">
    <slot />
  </main>

  <Footer
    copyrightText="Your Template © 2024"
  />
</div>
```

**Why:** +layout.svelte wraps all pages with common elements like navigation and footer.

**Important:** Use `$lib` imports in your template files - they will be automatically transformed to `statue-ssg` imports when users initialize the template.

---

### 4. Add Example Content

**Create example markdown files that showcase your template:**

**Create `templates/your-template/content/blog/example-post.md`:**

```markdown
---
title: Example Blog Post
description: This is an example post for your template
date: 2024-01-01
---

# Welcome to Your Template

This is example content that shows users how the template works.

Add more example content to demonstrate features.
```

**Best practices:**
- Create 2-3 example posts per content directory
- Use realistic content that demonstrates the template's strengths
- Include all frontmatter fields the template supports
- Show different content types (if applicable)

---

### 5. Create Template Configuration

**Create `templates/your-template/site.config.js`:**

```javascript
export default {
  site: {
    name: 'My Template Site',
    description: 'A brief description for this template',
    url: 'https://example.com',
    author: 'Template Author'
  },
  contact: {
    email: 'hello@example.com',
    address: {}
  },
  social: {
    github: 'https://github.com/username',
    twitter: 'https://twitter.com/username'
  },
  legal: {
    doNotSell: {}
  }
};
```

**Why:** This provides sensible defaults for users who initialize with your template. They'll customize it later.

---

### 6. Test Your Template Locally

**Load your template into the workspace:**

```bash
npm run template:load your-template --force
```

**Start the dev server:**

```bash
npm run dev
```

**Test checklist:**
- [ ] Homepage renders correctly
- [ ] Individual content pages work (`/blog/example-post`)
- [ ] Directory listing pages work (`/blog`)
- [ ] Navigation works correctly
- [ ] All components render properly
- [ ] Responsive on mobile, tablet, desktop
- [ ] Works with different themes
- [ ] No console errors or warnings

**When done testing, restore the default template:**

```bash
git checkout src/routes content site.config.js
```

---

### 7. Document Your Template

**Update `content/docs/templates.md`:**

Add a section describing your template:

```markdown
### Your Template Name

Brief description of what this template is for and who should use it.

**Initialize:**
\`\`\`bash
npx statue init --template your-template
\`\`\`

**Includes:**
- List key features
- Notable pages or layouts
- Special functionality

**Best for:** Target audience and use cases
```

**Update this guide's "Examples" section** if your template demonstrates a new pattern.

---

### 8. Create Additional Files (Optional)

#### README.md

**Create `templates/your-template/README.md`:**

```markdown
# Your Template Name

Description of the template, its purpose, and key features.

## Features

- Feature 1
- Feature 2
- Feature 3

## Customization

Brief notes on how users might customize this template.

## Example Sites

List any example sites using this template (if available).
```

---

#### post-setup.sh (Template-Specific Setup)

Some templates need additional setup steps after initialization. For example:
- Fetching data from external APIs (GitHub profile, RSS feeds)
- Running database migrations or seed scripts
- Generating initial configuration from user input
- Setting up third-party integrations

**How it works:**

When a user runs `npx statue init --template your-template`, the CLI automatically:
1. Copies template files to the user's project
2. Looks for `templates/your-template/post-setup.sh`
3. If found, executes it with `PROJECT_DIR` environment variable set to user's project directory
4. The script does NOT get copied to the user's project—it runs once during initialization

**Create `templates/your-template/post-setup.sh`:**

```bash
#!/bin/bash

# Post-setup script for your-template
# This runs after 'npx statue init --template your-template'
# It does NOT get copied to the user's project

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Your Template Setup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# $PROJECT_DIR contains the path to user's newly created project
cd "$PROJECT_DIR"

# Example: Run a setup script that exists in the user's project
if [ -f "$PROJECT_DIR/scripts/setup.sh" ]; then
    echo -e "${YELLOW}Running initial setup...${NC}"
    bash "$PROJECT_DIR/scripts/setup.sh" || echo -e "${YELLOW}⚠ Setup failed. Run manually later.${NC}"
fi

# Example: Fetch data from an API
# curl -s "https://api.example.com/data" > "$PROJECT_DIR/content/data.json"

echo ""
echo -e "${GREEN}✨ Setup complete! Run 'npm run dev' to start.${NC}"
echo ""
```

**Environment Variables Available:**

| Variable | Description |
|----------|-------------|
| `PROJECT_DIR` | Absolute path to the user's newly created project |

**Real-world example: developer-portfolio template**

The developer-portfolio template uses `post-setup.sh` to automatically fetch the user's GitHub profile data:

```bash
#!/bin/bash
# Automatically runs github-sync.sh after template initialization
GITHUB_SYNC="$PROJECT_DIR/scripts/github-sync.sh"

if [ -f "$GITHUB_SYNC" ]; then
    echo "Syncing your GitHub profile data..."
    cd "$PROJECT_DIR"
    bash "$GITHUB_SYNC"
fi
```

This way, users just run `npx statue init --template developer-portfolio` and their GitHub data is fetched automatically—no need to manually run `github-sync.sh`.

**Best practices for post-setup.sh:**

1. **Keep it optional** - The script should enhance setup, not break it if it fails
2. **Handle errors gracefully** - Use `|| echo "warning message"` for non-critical commands
3. **Provide clear output** - Tell users what's happening
4. **Don't require user input** - Keep it non-interactive (no `read` prompts)
5. **Document manual fallback** - If the script fetches external data, include the manual command in your template's README

---

### 9. Submit Your PR

**Before submitting:**
- [ ] Template loads without errors
- [ ] All routes use `export const prerender = true`
- [ ] Example content is meaningful and realistic
- [ ] Documented in content/docs/templates.md
- [ ] Works with all built-in themes
- [ ] No hardcoded colors (uses theme variables)
- [ ] Responsive design
- [ ] No console errors/warnings
- [ ] Tested with `npm run build`

**PR Title:**
```
feat: add [template-name] template
```

**PR Description:**
```markdown
## New Template: Your Template Name

Brief description of what this template is for and who will use it.

### Key Features
- Feature 1
- Feature 2
- Feature 3

### Example Usage
\`\`\`bash
npx statue init --template your-template
\`\`\`

### Testing Done
- [x] Tested locally with dev server
- [x] Tested build process
- [x] Tested with multiple themes
- [x] Responsive design verified
- [x] Documentation updated
```

---

## Template Guidelines

### Required Patterns

**1. Use Prerendering**

Every `+page.server.js` must include:

```javascript
export const prerender = true;
```

**Why:** Statue generates static sites. Without this, the template won't work.

---

**2. Use Theme Variables**

Never hardcode colors:

```svelte
<!-- ✅ Good -->
<div class="bg-[var(--color-card)] text-[var(--color-foreground)]">

<!-- ❌ Bad -->
<div class="bg-gray-900 text-white">
```

**Why:** Templates must work with all themes.

---

**3. Use $lib Imports**

Import components from `$lib`, not `statue-ssg`:

```svelte
<!-- ✅ Good (in template files) -->
import { Hero, Categories } from '$lib';

<!-- ❌ Bad -->
import { Hero, Categories } from 'statue-ssg';
```

**Why:** The init script automatically transforms `$lib` to `statue-ssg` when users initialize.

---

**4. Responsive Design**

All templates must be responsive:

```svelte
<!-- ✅ Good -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

<!-- ❌ Bad -->
<div style="width: 1200px;">
```

---

**5. Meaningful Example Content**

Provide realistic example content:

```markdown
<!-- ✅ Good -->
# Getting Started with Web Development
Learn the fundamentals of building modern websites...

<!-- ❌ Bad -->
# Test Post
Lorem ipsum dolor sit amet...
```

**Why:** Example content helps users understand how to use the template.

---

### Template Structure Best Practices

**Keep it simple:**
- Don't over-engineer
- Focus on the template's core purpose
- Fewer routes are better than too many

**Make it flexible:**
- Use Statue components where possible
- Allow easy customization
- Don't lock users into specific content structures

**Show, don't tell:**
- Demonstrate features with example content
- Include comments in route files
- Make patterns obvious

---

## Common Pitfalls

### ❌ Don't: Complex Custom Components

Templates should use Statue's built-in components. If you need custom components, consider contributing them to the main component library instead.

### ✅ Do: Use Built-in Components

```svelte
import { Hero, Categories, ContentBody } from '$lib';
```

---

### ❌ Don't: Template-Specific Configuration

Don't add new configuration fields that only your template uses.

### ✅ Do: Use Standard Config

Use fields from the standard `site.config.js` schema.

---

### ❌ Don't: Hardcoded Content

Don't hardcode site name, URLs, etc. in templates.

### ✅ Do: Use Template Variables

```svelte
<h1>{{site.name}}</h1>
<a href="{{site.url}}">Visit Site</a>
```

---

## Template Management Commands

**For template development:**

```bash
# List available templates
npm run template:list

# Load a template into workspace for testing
npm run template:load blog --force

# Save current workspace as a template
npm run template:save my-template

# Restore default template
git checkout src/routes content site.config.js
```

**Why these exist:** Templates are tested by loading them into the main project workspace.

---

## Automated PR Script

**Want to skip the manual PR process?**

Use the automated PR script from the root of your Statue site:

```bash
# From your Statue site's root directory

# Just the template (routes, content, config, static)
./path/to/statue/scripts/autopr.sh template portfolio

# Template + ALL custom components and themes (complete bundle)
./path/to/statue/scripts/autopr.sh all portfolio
```

### Template Mode

**What it does:**
1. Looks for `src/routes/`, `content/`, `site.config.js`, `static/` in current directory
2. Forks the statue repository (if needed)
3. Creates a new branch
4. Copies all template files to `templates/portfolio/`
5. Commits and pushes the changes
6. Opens a pull request automatically

### All Mode (Template + Custom Components + Themes)

**What it does:**
1. Everything from template mode, PLUS:
2. Bundles `src/lib/index.ts` (component exports) → `templates/portfolio/src/lib/index.ts`
3. Bundles `src/lib/index.css` (styles/theme imports) → `templates/portfolio/src/lib/index.css`
4. Bundles all custom components from `src/lib/components/` → `templates/portfolio/src/lib/components/`
5. Bundles all custom themes from `src/lib/themes/` → `templates/portfolio/src/lib/themes/`
6. Preserves directory structure (e.g., `src/lib/components/forms/Input.svelte` keeps its path)

**When to use `all` mode:**
- You've built a complete Statue site with custom components and themes
- You want to contribute the entire package as a template
- Your custom components/themes are specific to this template

**When to use `template` mode:**
- Your site only uses built-in Statue components
- Your custom components should be contributed separately (not template-specific)

**Requirements:**
- GitHub CLI (`gh`) installed and authenticated
- Run from the root of your Statue site
- Must have `src/routes/` directory (required)
- Optionally includes `content/`, `site.config.js`, `static/`
- For `all` mode: Automatically includes any `src/lib/components/` and `src/lib/themes/`

**Note:** You'll still need to add documentation manually after the PR is created. The script just handles the git workflow.

---

## Converting Existing Sites to Templates

**Have a Statue site you want to contribute as a template?**

The process is straightforward:

1. **Identify the key files:**
   - `src/routes/` - Your route files
   - `content/` - Your example content
   - `site.config.js` - Your config (sanitize personal info first!)

2. **Copy to template directory:**
   ```bash
   mkdir -p templates/your-template/src
   cp -r src/routes templates/your-template/src/
   cp -r content templates/your-template/
   cp site.config.js templates/your-template/
   ```

3. **Clean up the content:**
   - Replace personal info with placeholders
   - Use generic example content
   - Ensure all imports use `$lib` (not `statue-ssg`)

4. **Test it:**
   ```bash
   npm run template:load your-template --force
   npm run dev
   ```

5. **Submit a PR** following the guidelines above

---

## Questions?

- Check existing templates in `templates/` for patterns
- Read [CONTRIBUTING.md](./CONTRIBUTING.md) for PR process
- Ask in [GitHub Discussions](https://github.com/accretional/statue/discussions)
