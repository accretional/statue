---
title: Templates
description: Using and understanding Statue templates
icon: components
---

# Templates

Templates provide pre-configured starting points for different types of sites. They include specific layouts, example content, and configurations tailored to particular use cases.

> **Want to contribute a template?** Share your template with the Statue community! It only takes a single command to submit a PR. **[Learn how →](https://github.com/accretional/statue/blob/main/ADDING_TEMPLATES.md)**

## What Are Templates?

A template is a complete set of:
- Route files (`src/routes/`)
- Example content (`content/`)
- Site configuration (`site.config.js`)

When you run `npx statue init`, these files are copied into your project.

## Available Templates

### Default Template

The standard template with a homepage, blog, docs, and about page.

**Initialize:**
```bash
npx statue init
```

**Includes:**
- Full-featured homepage with hero, stats, and content categories
- Blog directory setup
- Documentation directory
- About page example
- Legal pages (privacy, terms)

**Best for:** General-purpose sites, marketing sites, documentation sites

### Blog Template

A simplified template focused on blogging.

**Initialize:**
```bash
npx statue init --template blog
```

**Includes:**
- Minimal homepage focused on latest posts
- Blog directory with example posts
- Streamlined navigation

**Best for:** Personal blogs, content-focused sites

## Choosing a Template

### When to use the default template:
- You want a full-featured site
- You need multiple content sections (blog + docs)
- You want an about page and company info
- You're building a business/product site

### When to use the blog template:
- You're primarily writing blog posts
- You want a simpler, focused structure
- You don't need multiple content categories

## Using a Template

### 1. During Initial Setup

Choose your template when first creating your Statue site:

```bash
# Create SvelteKit project
npx sv create . --template minimal --types ts --no-add-ons --install npm

# Install Statue
npm install statue-ssg

# Initialize with chosen template
npx statue init --template blog

# Install dependencies and start
npm install
npm run dev
```

### 2. What Gets Created

Templates copy these files to your project:

```
your-project/
├── src/routes/        # Page templates
├── content/           # Example content
└── site.config.js     # Initial configuration
```

**Note:** Templates only affect initial setup. After initialization, you customize these files directly.

## Switching Templates

**You can't switch templates after initialization.** Templates only run during `npx statue init`.

If you want to change templates:
1. Manually copy route files from another template
2. Update your content structure
3. Modify `site.config.js`

Or start a new project with a different template.

## Customizing Your Template

After initialization, the template files are yours to modify:

### Modify Routes
Edit files in `src/routes/` to change page layouts:
- `+page.svelte` - Homepage
- `[directory]/+page.svelte` - Directory listing pages
- `[...slug]/+page.svelte` - Content pages

### Update Content
Replace example content in `content/` with your own markdown files.

### Configure Settings
Edit `site.config.js` to set your site information.

## Creating Custom Templates

For Statue contributors, templates are stored in `templates/` in the repository.

To create a new template:

1. Create a directory: `templates/my-template/`
2. Add these subdirectories:
   - `src/routes/` - Route files
   - `content/` - Example content
3. Add `site.config.js` with appropriate defaults
4. Test with `npm run template:load my-template`

See [DEVELOPMENT.md](../../DEVELOPMENT.md) for details.

## Template vs Theme

**Templates** define structure and layout (which pages exist, how they're organized).

**Themes** define visual styling (colors, fonts, spacing).

You can use any theme with any template - they're independent!

## Need More Templates?

We're working on additional templates:

- Portfolio template (coming soon)
- Documentation-focused template (coming soon)
- Landing page template (coming soon)

**Want to contribute a template?** See **[ADDING_TEMPLATES.md](https://github.com/accretional/statue/blob/main/ADDING_TEMPLATES.md)** for a step-by-step guide.

## Next Steps

- **[Statue.dev](https://statue.dev)** - Official documentation
- **[New Site Checklist](./new-site-checklist.md)** - Customize your site after choosing a template
- **[Themes](./themes.md)** - Style your template with themes
- **[Components](./components.md)** - Use components in your template pages
