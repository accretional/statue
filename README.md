# Statue [![npm version](https://img.shields.io/npm/v/statue-ssg.svg)](https://www.npmjs.com/package/statue-ssg) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Statue is a blazingly-fast static site generator based on Markdown, SvelteKit, and a component library.

**One-line setup:**

```bash
yes | npx sv create . --template minimal --types ts --no-add-ons --install npm && npm install statue-ssg && npx statue init && npm install && npm run dev
```

Content like blogs and documentation can be added and modified directly through `.md` files, with pages and the site structure itself based on Svelte components. Statue sites are fully static, so **management is simple, development can be non-technical, and hosting is cheap or free. [Join us on Discord! 🗿](https://discord.gg/accretional)**

![area3-github](https://github.com/user-attachments/assets/9a53e186-60fd-443e-b87b-9907d217df20)

## Why Statue?

Statue is **Fast, Simple, and Flexible from start to finish**. It takes only one command to get started, builds and deployments are fast, hosting is simple, sites are extensible, and developing a Statue site is about building what you want rather than battling, learning, and conforming to the tool itself.

- **Markdown-first**: Build out your site content by writing `.md` files: no coding required.
- **Powered by SvelteKit**: Familiar Svelte features and ecosystem, based on an elegant declarative model ideal for static sites.
- **Tailwind + Components**: Customize the UI easily with Tailwind CSS, and a library of included components.
- **Easy to Use and Extend**: The Declarative Component Model is easy to use, and with LLMs, easy for even non-technical users to work with.
- **Ultra-cheap hosting**: Deploy static output to Netlify, Vercel, Cloudflare Pages, GitHub Pages, etc.
- **Low Maintenance**: Static sites are almost maintenance-free, and Statue itself is much less complex than other web tools.

![area4-github](https://github.com/user-attachments/assets/0026d024-9aa3-4ced-a71d-d99c2ee7e8f2)

## Getting Started

After running the setup command above, your site is live at `http://localhost:5173`.

**Next steps:**
1. **[Complete the New Site Checklist](./content/docs/new-site-checklist.md)** - Customize your site step-by-step
2. **[Read Getting Started](./content/docs/get-started.md)** - Learn key concepts
3. **Add content** - Create `.md` files in `content/` and they become pages automatically

## Documentation

### 📚 For Users

- **[Getting Started](./content/docs/get-started.md)** - Key concepts and quick start
- **[New Site Checklist](./content/docs/new-site-checklist.md)** - Step-by-step customization guide
- **[Site Configuration](./content/docs/site-config.md)** - Configure site.config.js
- **[Themes](./content/docs/themes.md)** - Built-in themes and customization
- **[Components](./content/docs/components.md)** - Component reference
- **[Templates](./content/docs/templates.md)** - Using templates
- **[Routing](./content/docs/routing.md)** - How URLs work

### 🔧 For Developers

- **[Development Guide](./DEVELOPMENT.md)** - Architecture and internals
- **[Contributing](./CONTRIBUTING.md)** - How to contribute
- **[Components API](https://github.com/accretional/statue/blob/main/src/lib/components/COMPONENTS_README.md)** - Full component reference
- **[Themes API](https://github.com/accretional/statue/blob/main/src/lib/themes/README.md)** - Creating custom themes

## Deploy

Build and deploy your static site:

```bash
npm run build
```

Deploy the `build/` directory to any static host. **[See deployment guide →](./content/docs/get-started.md#4-build-and-deploy)**

## Updating

After updating statue-ssg, sync new routes and features:

```bash
npm update statue-ssg
npx statue sync
```

This adds any new routes (like `/docs`) without overwriting your customizations. Use `--force` to overwrite existing files:

```bash
npx statue sync --force
```

## Community

- **[Discord](https://discord.gg/accretional)** - Chat with the community
- **[GitHub Issues](https://github.com/accretional/statue/issues)** - Report bugs or request features
- **[GitHub Discussions](https://github.com/accretional/statue/discussions)** - Ask questions

## License

MIT
