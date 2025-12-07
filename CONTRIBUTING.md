# Contributing to Statue SSG

Thank you for your interest in contributing to Statue SSG! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Testing Your Changes](#testing-your-changes)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Code Style Guidelines](#code-style-guidelines)
- [Development Scripts](#development-scripts)
- [Release Process](#release-process)

---

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please be respectful and considerate in all interactions. Key principles:

- Be respectful and professional
- Welcome newcomers and help them get started
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other contributors

---

## Getting Started

Before contributing, please:

1. **Check existing issues** - See if someone else is already working on it
2. **Open an issue first** - For major changes, discuss your approach before implementing
3. **Read the docs** - Familiarize yourself with [DEVELOPMENT.md](./DEVELOPMENT.md) and [USER_GUIDE.md](./USER_GUIDE.md)

### Types of Contributions

We welcome:

- **Bug fixes** - Fixing issues or unexpected behavior
- **Features** - New components, templates, or functionality
- **Documentation** - Improvements to guides, examples, or README
- **Themes** - New color themes for the theme system
- **Templates** - New starter templates (blog, portfolio, docs, etc.)
- **Examples** - Sample projects demonstrating Statue features
- **Testing** - Additional test coverage or test improvements

---

## Development Setup

### Prerequisites

- **Node.js** 18+ and npm
- **Git**
- Basic knowledge of SvelteKit and Svelte

### Clone and Install

```bash
# Fork the repository on GitHub first, then clone your fork
git clone https://github.com/YOUR-USERNAME/statue.git
cd statue

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The dev server will start at `http://localhost:5173`

### Repository Structure

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed architecture information. Key directories:

```
statue/
├── src/
│   ├── lib/
│   │   ├── components/    # Reusable UI components
│   │   ├── cms/           # Content processing logic
│   │   ├── themes/        # CSS theme files
│   │   └── index.ts       # Package exports
│   └── routes/            # Default template routes
├── content/               # Default template content
├── templates/             # Additional templates (blog, etc.)
├── scripts/               # Build and CLI scripts
├── test/                  # Test files
└── docs/                  # Documentation
```

---

## Project Structure

### Core Components

- **CMS System** (`src/lib/cms/`) - Parses markdown, processes template variables, manages content
- **Components** (`src/lib/components/`) - Reusable Svelte components
- **Themes** (`src/lib/themes/`) - CSS theme files with color schemes
- **Templates** (`templates/`) - Starter templates for different use cases

### How It Works

1. User creates markdown files in `content/`
2. `content-processor.js` scans and parses markdown files
3. SvelteKit routes (`[...slug]`, `[directory]`) render content using components
4. Static site is generated during build

---

## Making Changes

### Branching Strategy

- Create a new branch from `main` for your changes
- Use descriptive branch names: `fix/navigation-mobile-menu`, `feature/dark-mode-toggle`, `docs/improve-readme`

```bash
git checkout -b feature/my-new-feature
```

### Development Workflow

1. **Make your changes**
   - Edit files in `src/lib/` for core functionality
   - Edit files in `src/routes/` for the default template
   - Edit files in `templates/` for specific templates

2. **Test locally**
   ```bash
   npm run dev    # Start dev server
   npm run build  # Test production build
   ```

3. **Check your code**
   - Ensure no console errors or warnings
   - Test in multiple browsers if UI changes
   - Verify markdown content renders correctly

4. **Document your changes**
   - Update relevant documentation files
   - Add JSDoc comments to new functions
   - Update CHANGELOG.md if applicable

---

## Testing Your Changes

### Manual Testing

1. **Test the dev server**
   ```bash
   npm run dev
   ```
   Browse your changes at `http://localhost:5173`

2. **Test the production build**
   ```bash
   npm run build
   npm run preview
   ```
   Verify the static build works correctly

3. **Test with a fresh project**
   ```bash
   # Run the release test script
   ./scripts/test-release.sh
   ```
   This creates a test environment and verifies the package installs correctly

### Template Testing

If you modified templates:

```bash
# List available templates
npm run template:list

# Load a specific template
npm run template:load blog

# Test the template
npm run dev

# Save changes back to the template
npm run template:save blog
```

### Component Testing

If you added or modified components:

- Test component with different props
- Verify responsive behavior (mobile, tablet, desktop)
- Check accessibility (keyboard navigation, screen readers)
- Test with different themes

### Content Testing

If you modified content processing:

- Test with various markdown syntax (headings, lists, code blocks, links)
- Test template variables substitution
- Test with nested directories
- Test edge cases (empty files, missing frontmatter, special characters)

---

## Submitting a Pull Request

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] Changes have been tested locally
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] Commit messages are clear and descriptive
- [ ] Branch is up to date with main

### PR Process

1. **Push your branch**
   ```bash
   git push origin feature/my-new-feature
   ```

2. **Create a pull request** on GitHub
   - Provide a clear title and description
   - Reference any related issues (`Fixes #123`)
   - Describe what changes were made and why
   - Include screenshots for UI changes

3. **Respond to feedback**
   - Address review comments
   - Make requested changes
   - Push updates to the same branch

4. **PR Review**
   - Maintainers will review your code
   - Automated checks will run
   - May request changes or ask questions

5. **Merge**
   - Once approved, a maintainer will merge your PR
   - Your changes will be included in the next release

### PR Title Format

Use conventional commit format:

- `feat: Add dark mode toggle component`
- `fix: Resolve mobile navigation overflow`
- `docs: Improve template variables documentation`
- `refactor: Simplify content processor logic`
- `test: Add tests for Hero component`
- `chore: Update dependencies`

---

## Code Style Guidelines

### General Principles

- **Keep it simple** - Avoid over-engineering
- **Be consistent** - Follow existing patterns
- **Write clear code** - Code should be self-documenting
- **Comment when necessary** - Explain "why", not "what"

### JavaScript/TypeScript

```javascript
// Use descriptive variable names
const contentEntries = scanContentDirectory();

// Prefer const over let
const directories = getContentDirectories();

// Use arrow functions for callbacks
items.map(item => item.title);

// Add JSDoc comments for exported functions
/**
 * Processes template variables in markdown content
 * @param {string} content - The markdown content
 * @returns {string} - Processed content with variables replaced
 */
export function processTemplateVariables(content) {
  // ...
}
```

### Svelte Components

```svelte
<script>
  // Props first
  export let title;
  export let description = ''; // Optional props with defaults

  // Reactive declarations
  $: formattedTitle = title.toUpperCase();

  // Functions
  function handleClick() {
    // ...
  }
</script>

<!-- Clear, semantic HTML -->
<div class="component-name">
  <h2>{title}</h2>
  {#if description}
    <p>{description}</p>
  {/if}
</div>

<style>
  /* Scoped styles using theme variables */
  .component-name {
    color: var(--color-foreground);
    background: var(--color-card);
  }
</style>
```

### CSS and Styling

- Use CSS variables for colors: `var(--color-primary)`
- Use Tailwind utilities for spacing and layout
- Keep custom CSS minimal and scoped
- Support theming through CSS variables

```css
/* Good - uses theme variables */
.card {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  color: var(--color-foreground);
}

/* Avoid - hardcoded colors */
.card {
  background: #1a1a1a;
  border: 1px solid #333;
  color: #fff;
}
```

### File Naming

- Components: `PascalCase.svelte` (e.g., `Hero.svelte`, `NavigationBar.svelte`)
- Utilities: `kebab-case.js` (e.g., `content-processor.js`)
- Routes: SvelteKit conventions (`+page.svelte`, `+layout.svelte`)
- Themes: `kebab-case.css` (e.g., `black-white.css`, `dark-blue.css`)

---

## Development Scripts

### Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Package for npm (creates .tgz file)
npm pack

# Run release tests
./scripts/test-release.sh
```

### Template Management

For working on different templates:

```bash
# List available templates
npm run template:list

# Load a template into the main workspace
npm run template:load blog

# Save changes back to the template folder
npm run template:save blog
```

**Warning**: `template:load` overwrites `src/routes`, `content`, and `site.config.js` in the root directory. Commit your changes first!

### Testing a Package Build

Test that your changes work when installed as a package:

```bash
# Build and test the package
./scripts/test-release.sh
```

This script:
1. Packs the library into a `.tgz` file
2. Creates a fresh SvelteKit project
3. Installs Statue SSG from the package
4. Verifies the build succeeds

---

## Release Process

**Note**: Only maintainers can publish releases. Contributors should not bump version numbers.

### For Maintainers

1. **Ensure all tests pass**
   ```bash
   ./scripts/test-release.sh
   ```

2. **Update version** in `package.json`
   ```json
   {
     "version": "1.2.3"
   }
   ```

3. **Update CHANGELOG.md** with release notes

4. **Commit version bump**
   ```bash
   git add package.json CHANGELOG.md
   git commit -m "chore: bump version to 1.2.3"
   git push
   ```

5. **Publish to npm**
   ```bash
   npm publish
   ```

6. **Create GitHub release**
   - Tag the commit
   - Add release notes from CHANGELOG.md

---

## Getting Help

### Documentation

- **[USER_GUIDE.md](./USER_GUIDE.md)** - Comprehensive user documentation
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Architecture and internal workings
- **[README.md](./README.md)** - Quick start and overview

### Community

- **GitHub Issues** - Report bugs or request features
- **GitHub Discussions** - Ask questions or discuss ideas
- **Discord** - Join the community at [https://discord.gg/accretional](https://discord.gg/accretional)

### Contact

For security issues, email: hello@accretional.com

---

## Development Best Practices

### Component Development

- Keep components small and focused
- Accept props for customization
- Use CSS variables for theme support
- Document all props in COMPONENTS_README.md
- Test with different prop combinations

### Content Processing

- Handle edge cases gracefully (missing files, invalid frontmatter)
- Log warnings for invalid data, don't throw errors
- Cache in production, refresh in development
- Process template variables consistently

#### Adding New Template Variables

To add new template variables that users can use in markdown:

1. Add the value to `site.config.js`:
```javascript
export const siteConfig = {
  // ... existing config
  newSection: {
    newValue: "Your new value"
  }
};
```

2. Register it in `src/lib/cms/content-processor.js`:
```javascript
const variables = {
  // ... existing variables
  'newSection.newValue': siteConfig.newSection.newValue,
};
```

3. Document it in `content/docs/site-config.md`

4. Add example usage in documentation

### Theme Development

- Use the full range of CSS variables
- Test contrast ratios for accessibility
- Provide both light and dark variants if appropriate
- Document your theme in themes/README.md

### Template Development

- Keep templates minimal and focused
- Include example content
- Document template-specific features
- Use components from the library, not custom forks

---

## Development Principles

### 1. Simplicity First

Statue is designed to be simple. When adding features:
- Is it necessary for most users?
- Does it add complexity?
- Can it be done with existing features?

### 2. User-Centric

Always consider the end user:
- Is it easy to understand?
- Is it well-documented?
- Does it work for non-technical users?

### 3. Static-First

Statue generates static sites:
- No runtime JavaScript for content
- Build-time processing
- Prerendered pages

### 4. Framework Leverage

Use SvelteKit's capabilities:
- File-based routing
- Server-side data loading
- Static site generation
- Component model

---

## Questions?

If you have questions about contributing:

1. Check existing issues and discussions
2. Read the documentation (USER_GUIDE.md, DEVELOPMENT.md)
3. Ask in GitHub Discussions
4. Join the Discord community

Thank you for contributing to Statue SSG!

---

**Important**: Do not increment the npm package version before merging your changes. Version bumps are handled by maintainers during the release process.
