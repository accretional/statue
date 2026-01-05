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

- **SvelteKit** - Modern web framework
- **Tailwind CSS v4** - Utility-first styling
- **TypeScript** - Type safety built-in
- **Markdown support** - Write content in `.md` files
- **Themes** - Beautiful color schemes
- **Templates** - Multiple starter options
- **Static output** - Deploy anywhere

## Interactive Setup

When you run `npm create statue@latest`, you'll be asked:

1. **Project name** - Name of your project directory
2. **Template** - Choose from available templates
3. **Theme** - Choose from available themes

Templates and themes are loaded dynamically from the `statue-ssg` package.

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

`create-statue` runs the following steps:

1. Creates a minimal SvelteKit project using `sv create`
2. Installs `statue-ssg` as a dependency
3. Runs `npx statue init` to set up routes, content, and configuration
4. Applies your selected theme

Templates and themes come from the `statue-ssg` package and are detected automatically.

## Non-Interactive Mode

Use `--yes` to skip all prompts and use defaults:

```bash
npm create statue@latest my-site -- --yes
```

This creates a project with:

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

## Adding New Templates or Themes

Templates and themes are managed in the `statue-ssg` package:

- **Templates**: Add to `statue-ssg/templates/<name>/`
- **Themes**: Add to `statue-ssg/src/lib/themes/<name>.css`

They will be automatically detected by `create-statue`.

## Troubleshooting

### Command not found

Make sure you're using Node.js 18.0.0 or higher:

```bash
node --version
```

### Permission errors

On Linux/Mac, you may need to fix npm permissions:

```bash
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

## Documentation

- [Statue Documentation](https://github.com/accretional/statue)
- [Getting Started Guide](https://github.com/accretional/statue/blob/main/content/docs/get-started.md)
- [Site Configuration](https://github.com/accretional/statue/blob/main/content/docs/site-config.md)
- [Themes Guide](https://github.com/accretional/statue/blob/main/content/docs/themes.md)

## Contributing

Found a bug or have a feature request?

- [Open an issue](https://github.com/accretional/statue/issues)
- [Read contributing guide](https://github.com/accretional/statue/blob/main/CONTRIBUTING.md)

## Development

```bash
git clone https://github.com/accretional/statue.git
cd statue/packages/create-statue
npm install
npm run build

# Test locally
npm pack
npx ./create-statue-*.tgz my-test-site
```

## License

MIT
