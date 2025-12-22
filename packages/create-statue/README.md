# create-statue

Scaffolding tool for [statue-ssg](https://github.com/accretional/statue) projects.

## Quick Start

```bash
npm create statue@latest my-site
```

Or with defaults (skips prompts):

```bash
npm create statue@latest my-site -- --yes
```

That's it! Your statue-ssg project is ready.

## What You Get

A fully configured statue-ssg project with:

- ✅ **SvelteKit** - Modern web framework
- ✅ **Tailwind CSS v4** - Utility-first styling
- ✅ **TypeScript** - Type safety (optional)
- ✅ **Markdown support** - Write content in `.md` files
- ✅ **10 beautiful themes** - Choose your favorite
- ✅ **Templates** - Default or Blog starter
- ✅ **Static output** - Deploy anywhere

## Interactive Setup

When you run `npm create statue@latest`, you'll be asked:

1. **Project name** - Name of your project directory
2. **TypeScript?** - Yes (recommended) or No
3. **Template** - Default (minimal) or Blog (content-driven)
4. **Theme** - Choose from 10 built-in themes

## Available Templates

### Default (recommended)

Minimal starting point with basic pages. Perfect for:

- Marketing sites
- Portfolios
- Landing pages
- Custom projects

### Blog

Content-driven template with blog structure. Perfect for:

- Personal blogs
- Company blogs
- News sites
- Content publications

## Available Themes

- **Black & White** (recommended) - Clean monochrome
- **Black & Red** - Bold red accents
- **Blue** - Navy blue tones
- **Charcoal** - Warm neutral grays
- **Cyan** - Bright cyan highlights
- **Green** - Emerald green
- **Orange** - Vibrant orange
- **Pink** - Bright pink accents
- **Purple** - Rich purple
- **Red** - Bold red theme

Themes can be changed later by editing `src/lib/index.css`.

## Next Steps

After creating your project:

```bash
cd my-site
npm run dev
```

Visit `http://localhost:5173` to see your site.

### Development

```bash
npm run dev     # Start dev server
npm run build   # Build for production
npm run preview # Preview production build
```

### Customization

1. **Update site info** - Edit `site.config.js`
2. **Add content** - Create `.md` files in `content/`
3. **Change theme** - Edit `src/lib/index.css`
4. **Customize pages** - Edit files in `src/routes/`

## How It Works

`create-statue` sets up a minimal SvelteKit project, then uses `statue-ssg` to add:

1. **Routes** - Page structure and navigation
2. **Content** - Markdown processing
3. **Components** - Pre-built UI components
4. **Themes** - Beautiful color schemes
5. **Scripts** - Build and SEO tools

Templates come from the `statue-ssg` package, not bundled in `create-statue`.

## Non-Interactive Mode

Use `--yes` to skip all prompts and use defaults:

```bash
npm create statue@latest my-site -- --yes
```

This creates a project with:

- TypeScript enabled
- Default template
- Black & White theme

## Command Reference

```bash
# Interactive mode
npm create statue@latest my-site

# Non-interactive mode
npm create statue@latest my-site -- --yes

# Help
npm create statue@latest -- --help
```

## System Requirements

- **Node.js** 18.0.0 or higher
- **npm** (comes with Node.js)

Also works with pnpm, yarn, and bun (detected automatically).

## Adding New Templates

Want to add a custom template?

1. Create `templates/<name>/` in the **statue-ssg** package
2. Add routes, content, and configuration
3. Update the `TEMPLATES` array in `create-statue/src/index.ts`
4. Rebuild and publish

Templates live in the main `statue-ssg` package for easier maintenance.

## Troubleshooting

### Command not found

Make sure you're using Node.js 18.0.0 or higher:

```bash
node --version
```

### Permission errors

On Linux/Mac, you may need to use `sudo` or fix npm permissions:

```bash
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

### Windows issues

Ensure you're using PowerShell or cmd (not Git Bash) and have the latest Node.js installed.

## Documentation

- [Statue Documentation](https://github.com/accretional/statue)
- [Getting Started Guide](https://github.com/accretional/statue/blob/main/content/docs/get-started.md)
- [Site Configuration](https://github.com/accretional/statue/blob/main/content/docs/site-config.md)
- [Themes Guide](https://github.com/accretional/statue/blob/main/content/docs/themes.md)
- [Components Reference](https://github.com/accretional/statue/blob/main/content/docs/components.md)

## Contributing

Found a bug or have a feature request?

- [Open an issue](https://github.com/accretional/statue/issues)
- [Join Discord](https://discord.gg/accretional)
- [Read contributing guide](https://github.com/accretional/statue/blob/main/CONTRIBUTING.md)

## Development

Want to contribute to `create-statue`?

```bash
git clone https://github.com/accretional/statue.git
cd statue/packages/create-statue
npm install
npm run build

# Test locally
node index.js test-site
```

## License

MIT © Accretional

---

**Made with 🗿 by the Statue team**
