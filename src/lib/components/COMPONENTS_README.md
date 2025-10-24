### Components Overview and Usage

This folder contains ready-to-use UI components for Statue SSG (built with Svelte/SvelteKit). They are designed to be composable, accessible, and easily themeable via CSS variables.

### How to import

- From a local project consuming the package:
  - Import directly from the package entry (recommended):

```svelte
<script>
  import { Hero, Categories, LatestContent, PageHero, Mission, Team, WhyChooseUs, CTA, DirectoryHeader, SubDirectories, DirectoryContent, ContentHeader, ContentBody, NavigationBar, Footer, Sitemap, Warning } from 'statue-ssg';
</script>
```

- Inside this repository (during development):

```svelte
<script>
  import { Hero, Categories } from '$lib';
  // or import single files
  import CTA from '$components/CTA.svelte';
</script>
```

### Theming

Components use CSS variables like `--color-primary`, `--color-secondary`, `--color-foreground`, `--color-card`, `--color-border`. Ensure your theme or global styles define them.

### Components

- **NavigationBar**: Top navigation with responsive mobile menu.
  - Props: `navbarItems: { name: string; title: string; url: string; }[]`, `activePath: string`.
  - Example:
```svelte
<script>
  import { NavigationBar } from 'statue-ssg';
  const navbarItems = [
    { name: 'about', title: 'About', url: '/about' }
  ];
  const activePath = '/';
</script>

<NavigationBar {navbarItems} {activePath} />
```

- **Hero**: Landing hero section.
  - Example:
```svelte
<script>
  import { Hero } from 'statue-ssg';
</script>

<Hero />
```

- **Stats**: Three-card stats display.
  - Example:
```svelte
<script>
  import { Stats } from 'statue-ssg';
</script>

<Stats />
```

- **Categories**: Lists top-level content directories.
  - Props: `directories: { title: string; url: string; name?: string; subpages?: { title: string; url: string }[] }[]`.
  - Example:
```svelte
<script>
  import { Categories } from 'statue-ssg';
  const directories = [
    { title: 'Blog', url: '/blog' },
    { title: 'Docs', url: '/docs' }
  ];
  
  // optional: add id="directories" anchor target for in-page links
</script>

<Categories {directories} />
```

- **LatestContent**: Shows recent content cards.
  - Props: `rootContent: { url: string; directory?: string; metadata: { title: string; description?: string; date?: string } }[]`.
  - Example:
```svelte
<script>
  import { LatestContent } from 'statue-ssg';
  const rootContent = [
    { url: '/blog/hello-world', metadata: { title: 'Hello World', description: 'Intro post' } }
  ];
</script>

<LatestContent {rootContent} />
```

- **PageHero**: Page title and subtitle section for docs/about pages.
  - Props: `title: string`, `description?: string`.
  - Example:
```svelte
<script>
  import { PageHero } from 'statue-ssg';
</script>

<PageHero title="Documentation" description="Everything you need to build with Statue SSG" />
```

- **Mission**: Static mission copy block.
  - Example: `<Mission />`

- **Team**: Team members grid.
  - Props: `teamMembers: { name: string; role: string; initials: string }[]`.
  - Example:
```svelte
<script>
  import { Team } from 'statue-ssg';
  const teamMembers = [
    { name: 'John Doe', role: 'Founder', initials: 'JD' }
  ];
</script>

<Team {teamMembers} />
```

- **WhyChooseUs**: Feature highlights grid.
  - Props: `features: { title: string; description: string }[]`
  - Example:
```svelte
<script>
  import { WhyChooseUs } from 'statue-ssg';
  const features = [
    { title: 'Fast', description: 'Generate optimized static sites' }
  ];
</script>

<WhyChooseUs {features} />
```

- **CTA**: Call-to-action with primary and secondary buttons.
  - Props: `title: string`, `description: string`, `primaryButtonText: string`, `primaryButtonLink: string`, `secondaryButtonText: string`, `secondaryButtonLink: string`.
  - Example:
```svelte
<script>
  import { CTA } from 'statue-ssg';
</script>

<CTA 
  title="Ready to get started?"
  description="Join the growing community of creators using Statue SSG"
  primaryButtonText="Explore Features"
  primaryButtonLink="/"
  secondaryButtonText="Read Documentation"
  secondaryButtonLink="/docs"
/> 
```

- **DirectoryHeader**: Directory title header.
  - Props: `title: string`.
  - Example: `<DirectoryHeader title="Docs" />`

- **SubDirectories**: Grid of subdirectories.
  - Props: `subDirectories: { title: string; url: string }[]`.
  - Example: `<SubDirectories subDirectories={[{ title: 'Guides', url: '/docs/guides' }]} />`

- **DirectoryContent**: Cards for directory content.
  - Props: `content: { url: string; directory?: string; metadata: { title: string; description?: string; date?: string } }[]`, `showDirectory?: boolean`, `emptyMessage?: string`.
  - Example:
```svelte
<script>
  import { DirectoryContent } from 'statue-ssg';
  const content = [
    { url: '/docs/getting-started', metadata: { title: 'Getting Started', description: 'Installation and setup' } }
  ];
</script>

<DirectoryContent {content} showDirectory={false} />
```

- **ContentHeader**: Title, date and author block for a content page.
  - Props: `title: string`, `date?: string | Date`, `author?: string`, `backLink?: string`, `backLinkText?: string`.
  - Example:
```svelte
<script>
  import { ContentHeader } from 'statue-ssg';
</script>

<ContentHeader title="Hello World" date={'2024-01-01'} author="Jane Doe" backLink="/blog" backLinkText="Blog" />
```

- **ContentBody**: Renders preprocessed HTML content.
  - Props: `content: string` (HTML string).
  - Example: `<ContentBody content={html} />`

- **Footer**: Footer with sitemap and links.
  - Props: `directories: Directory[]`, `currentPath: string`.
  - Example:
```svelte
<script lang="ts">
  import { Footer } from 'statue-ssg';
  type Directory = { name: string; path: string; title: string; url: string; subpages?: { title: string; url: string }[] };
  const directories: Directory[] = [
    { name: 'docs', path: 'docs', title: 'Docs', url: '/docs', subpages: [{ title: 'Getting Started', url: '/docs/getting-started' }] }
  ];
  const currentPath = '/docs';
</script>

<Footer {directories} {currentPath} />
```

- **Sitemap**: Compact sitemap component similar to Footer categories.
  - Props: `directories: Directory[]`, `currentPath: string`.

- **Warning**: Inline callout for info/warning/error/success.
  - Props: `warning: { type?: 'info' | 'warning' | 'error' | 'success'; title?: string; message?: string }`.
  - Example:
```svelte
<script>
  import { Warning } from 'statue-ssg';
  const warning = { type: 'info', title: 'Heads up', message: 'This is important.' };
</script>

<Warning {warning} />
```

### Notes

- All components are SSR-friendly and work in SvelteKit routes and layouts.
- Prefer package-level imports (`import { ... } from 'statue-ssg'`) for app code.
- If you tree-shake, modern bundlers will drop unused components automatically.


