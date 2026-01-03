# Statue [![npm version](https://img.shields.io/npm/v/statue-ssg.svg)](https://www.npmjs.com/package/statue-ssg) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Statue is a wicked-fast static site generator based on Markdown, Svelte, Tailwind, Pagefind, and reusable components.

**One-line setup! (requires npm):**
```bash
yes | npx sv create statue-site --template minimal --types ts --no-add-ons --install npm && cd statue-site && npm install statue-ssg && npx statue init && npm install && npm run build && npm run preview
```

<details>
<summary>setup via bun, pnpm, yarn, windows</summary>
  
**bun**:

```bash
yes | npx sv create statue-site --template minimal --types ts --no-add-ons --install bun && cd statue-site && bun add statue-ssg && npx statue init && bun install && bun run build && bun run preview
```

**pnpm**:

```bash
yes | npx sv create statue-site --template minimal --types ts --no-add-ons --install pnpm && cd statue-site && pnpm add statue-ssg && npx statue init && pnpm install && pnpm run build && pnpm run preview
```

**yarn**:

```bash
yes | npx sv create statue-site --template minimal --types ts --no-add-ons --install yarn && cd statue-site && yarn add statue-ssg && npx statue init && yarn install && yarn run build && yarn run preview
```

**Windows**: Support for Windows is provided on a best-effort basis. Statue's dev team lacks regular Windows users, so we cannot easily keep Statue working seemlessly for Windows: contact us if you'd like to help maintain Statue support for Windows! The above commands should work, but you may run into pathing issues and other incompatibilities during or after setup.

---
</details>

Content like blogs and docs are added and changed directly through `.md` files. Other parts of the Statue site are based on Svelte components and the site's config. Statue sites are fully static, so **development is straightforward, management is simple, and hosting is ~free!**

Need help? Want to collaborate, contribute, or engage with the Statue community? **[Join us on Discord! 🗿](https://discord.gg/accretional)**

![area3-github](https://github.com/user-attachments/assets/9a53e186-60fd-443e-b87b-9907d217df20)

## Why Statue?

Statue is **Fast, Simple, and Flexible from start to finish**. One-line setup, then fast builds, fast deploys, and a fast site.

- **Markdown-first**: Write your site's content in simple `.md` files: no coding required.
- **Zero Config, Zero Cost Search:** Start with your own full-site search index: no setup, totally free and yours.
- **Powered by Great Tools**: 0->1 setup with SvelteKit, Tailwind, Pagefind, and components fully integrated.
- **Simple yet Powerful**: Statue's Declarative Component Model makes customization easy, intuitive, and flexible.
- **Ultra-cheap hosting**: Deploy static sites to free and low-cost hosts like Netlify, Vercel, Cloudflare, and GitHub Pages.
- **Low Maintenance**: Static sites are ~maintenance-free; Statue keeps sites simple with less to break.

Statue helps you build the site you want, without battling the tools you use to build it.

![area4-github](https://github.com/user-attachments/assets/0026d024-9aa3-4ced-a71d-d99c2ee7e8f2)

## Getting Started

After running the setup command above, your site is live at `http://localhost:3000`.

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

## Modifying your Site

Make changes to your site's contents, config, and code, then run `npm run build` (or equivalent) to rebuild it.

To resolve new imports, handle the build, and view your new site all in one command, try:

```bash
npm i && npm run build && npm run preview
```

Once you're ready to publish your site, deploy the `build/` directory to any static host. **[See deployment guide →](./content/docs/get-started.md#4-build-and-deploy)**

## Community

- **[Discord](https://discord.gg/accretional)** - Chat with the community
- **[GitHub Issues](https://github.com/accretional/statue/issues)** - Report bugs or request features
- **[GitHub Discussions](https://github.com/accretional/statue/discussions)** - Ask questions

## License

MIT
