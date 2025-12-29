---
title: Components
description: Using Statue's pre-built components
order: 2
icon: components
---

# Components

Statue includes a library of pre-built Svelte components for building your pages quickly. All components are themeable and responsive.

> **Built a useful component?** Contribute it back to Statue and help the community! It only takes one command. **[Contribute a component →](https://github.com/accretional/statue/blob/main/ADDING_COMPONENTS.md)**

## Importing Components

Import components from the `statue-ssg` package:

```svelte
<script>
  import { Hero, Categories, Footer, NavigationBar } from 'statue-ssg';
</script>
```

## Essential Components

### NavigationBar

Top navigation with logo, links, and mobile menu.

```svelte
<script>
  import { NavigationBar } from 'statue-ssg';

  const navbarItems = [
    { name: 'blog', title: 'Blog', url: '/blog' },
    { name: 'docs', title: 'Docs', url: '/docs' }
  ];
</script>

<NavigationBar navbarItems={navbarItems} activePath="/blog" />
```

**Props:**
- `navbarItems` (array) - Navigation links
  - `name` (string) - Unique identifier
  - `title` (string) - Display text
  - `url` (string) - Link URL
- `activePath` (string) - Current page path (for highlighting)

---

### Hero

Landing page hero section with title and description.

```svelte
<script>
  import { Hero } from 'statue-ssg';
</script>

<Hero />
```

**Props:** None (content is built-in, customize by forking the component)

---

### Categories

Display content directories as cards.

```svelte
<script>
  import { Categories } from 'statue-ssg';

  const directories = [
    { title: 'Blog', url: '/blog', name: 'blog' },
    { title: 'Docs', url: '/docs', name: 'docs' }
  ];
</script>

<Categories {directories} />
```

**Props:**
- `directories` (array) - Directory list
  - `title` (string) - Display name
  - `url` (string) - Directory URL
  - `name` (string) - Directory identifier

---

### LatestContent

Shows recent content as cards.

```svelte
<script>
  import { LatestContent } from 'statue-ssg';

  const content = [
    {
      url: '/blog/my-post',
      metadata: {
        title: 'My Post',
        description: 'Post description',
        date: '2025-01-15'
      }
    }
  ];
</script>

<LatestContent rootContent={content} />
```

**Props:**
- `rootContent` (array) - Content items
  - `url` (string) - Content URL
  - `metadata` (object)
    - `title` (string) - Content title
    - `description` (string, optional) - Description
    - `date` (string, optional) - Publication date

---

### Footer

Site footer with sitemap and social links.

```svelte
<script>
  import { Footer } from 'statue-ssg';

  const directories = [
    { name: 'docs', title: 'Docs', url: '/docs' }
  ];
</script>

<Footer
  {directories}
  currentPath="/docs"
  copyrightText="© 2025 Your Site"
/>
```

**Props (all optional):**
- `directories` (array) - Site directories for sitemap
- `currentPath` (string) - Current page path
- `copyrightText` (string) - Copyright notice
- `legalLinks` (array) - Legal page links
- `socialLinks` (array) - Social media links

---

## Page Components

### PageHero

Page title section for internal pages.

```svelte
<script>
  import { PageHero } from 'statue-ssg';
</script>

<PageHero
  title="Documentation"
  description="Everything you need to know"
/>
```

**Props:**
- `title` (string, required) - Page title
- `description` (string, optional) - Subtitle

---

### ContentHeader

Title and metadata for content pages.

```svelte
<script>
  import { ContentHeader } from 'statue-ssg';
</script>

<ContentHeader
  title="My Blog Post"
  date="2025-01-15"
  author="John Doe"
  backLink="/blog"
  backLinkText="Blog"
/>
```

**Props:**
- `title` (string, required) - Page title
- `date` (string, optional) - Publication date
- `author` (string, optional) - Author name
- `backLink` (string, optional) - Back button URL
- `backLinkText` (string, optional) - Back button text

---

### ContentBody

Renders HTML content from markdown.

```svelte
<script>
  import { ContentBody } from 'statue-ssg';

  const html = '<h1>Title</h1><p>Content</p>';
</script>

<ContentBody content={html} />
```

**Props:**
- `content` (string, required) - HTML string to render

---

## Directory Components

### DirectoryHeader

Header for directory listing pages.

```svelte
<script>
  import { DirectoryHeader } from 'statue-ssg';
</script>

<DirectoryHeader title="Blog Posts" />
```

**Props:**
- `title` (string, required) - Directory name

---

### SubDirectories

Grid of subdirectory cards.

```svelte
<script>
  import { SubDirectories } from 'statue-ssg';

  const subdirs = [
    { title: 'Tutorials', url: '/docs/tutorials' }
  ];
</script>

<SubDirectories subDirectories={subdirs} />
```

**Props:**
- `subDirectories` (array) - Subdirectory list
  - `title` (string) - Display name
  - `url` (string) - Subdirectory URL

---

### DirectoryContent

Content cards for directory pages.

```svelte
<script>
  import { DirectoryContent } from 'statue-ssg';

  const content = [
    {
      url: '/docs/guide',
      metadata: { title: 'Guide', description: 'Getting started' }
    }
  ];
</script>

<DirectoryContent {content} />
```

**Props:**
- `content` (array) - Content items
- `showDirectory` (boolean, optional) - Show directory badges
- `emptyMessage` (string, optional) - Message when no content

---

## Utility Components

### Warning

Info/warning/error callout box.

```svelte
<script>
  import { Warning } from 'statue-ssg';

  const warning = {
    type: 'info',
    title: 'Note',
    message: 'This is important information.'
  };
</script>

<Warning {warning} />
```

**Props:**
- `warning` (object)
  - `type` (string) - `'info'`, `'warning'`, `'error'`, or `'success'`
  - `title` (string, optional) - Heading
  - `message` (string, optional) - Message text

---

### Stats

Three-column statistics display.

```svelte
<script>
  import { Stats } from 'statue-ssg';
</script>

<Stats />
```

**Props:** None (customize by forking)

---

### CTA

Call-to-action section with buttons.

```svelte
<script>
  import { CTA } from 'statue-ssg';
</script>

<CTA
  title="Ready to start?"
  description="Join us today"
  primaryButtonText="Get Started"
  primaryButtonLink="/docs"
  secondaryButtonText="View on GitHub"
  secondaryButtonLink="https://github.com/accretional/statue"
/>
```

**Props:**
- `title` (string) - CTA heading
- `description` (string) - CTA text
- `primaryButtonText` (string) - Primary button label
- `primaryButtonLink` (string) - Primary button URL
- `secondaryButtonText` (string) - Secondary button label
- `secondaryButtonLink` (string) - Secondary button URL

---

## About Page Components

### Mission

Mission statement section.

```svelte
<script>
  import { Mission } from 'statue-ssg';
</script>

<Mission />
```

**Props:** None (customize by forking)

---

### Team

Team members grid.

```svelte
<script>
  import { Team } from 'statue-ssg';

  const team = [
    { name: 'John Doe', role: 'Founder', initials: 'JD' }
  ];
</script>

<Team teamMembers={team} />
```

**Props:**
- `teamMembers` (array)
  - `name` (string) - Person's name
  - `role` (string) - Job title
  - `initials` (string) - Avatar initials

---

### WhyChooseUs

Features/benefits grid.

```svelte
<script>
  import { WhyChooseUs } from 'statue-ssg';

  const features = [
    { title: 'Fast', description: 'Lightning quick sites' }
  ];
</script>

<WhyChooseUs {features} />
```

**Props:**
- `features` (array)
  - `title` (string) - Feature name
  - `description` (string) - Feature description

---

## Advanced Components

### BuiltBy

"Built by" credit component.

```svelte
<script>
  import { BuiltBy } from 'statue-ssg';
</script>

<BuiltBy />
```

**Props (all optional):**
- `builtByText`, `builtByLinkText`, `builtByLinkUrl`
- `builtInText`, `builtInLinkText`, `builtInLinkUrl`
- `builtForText`, `communityLinkText`, `communityLinkUrl`

---

### CollapsibleTree

Recursive tree view for nested data.

```svelte
<script>
  import { CollapsibleTree } from 'statue-ssg';

  const items = [
    {
      id: '1',
      label: 'Parent',
      badge: 'completed',
      children: [
        { id: '1.1', label: 'Child' }
      ]
    }
  ];
</script>

<CollapsibleTree {items} title="Structure" />
```

**Props:**
- `items` (array) - Tree structure
  - `id` (string) - Unique identifier
  - `label` (string) - Display text
  - `badge` (string, optional) - Badge text
  - `children` (array, optional) - Nested items
- `title` (string, optional) - Tree title

---

## Creating Custom Components

Create your own components in `src/lib/components/`:

```svelte
<!-- src/lib/components/MyComponent.svelte -->
<script>
  export let title;
  export let content = '';
</script>

<div class="my-component">
  <h2 class="text-[var(--color-primary)]">{title}</h2>
  {#if content}
    <p class="text-[var(--color-foreground)]">{content}</p>
  {/if}
</div>

<style>
  .my-component {
    padding: 2rem;
    background: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
  }
</style>
```

Then use it:

```svelte
<script>
  import MyComponent from '$lib/components/MyComponent.svelte';
</script>

<MyComponent title="Hello" content="World" />
```

## Component Best Practices

### 1. Use Theme Variables

Always use CSS custom properties for colors:

```svelte
<style>
  .my-element {
    color: var(--color-foreground);  /* Good */
    background: #ffffff;              /* Bad - won't adapt to theme */
  }
</style>
```

### 2. Make Components Responsive

Test on mobile, tablet, and desktop:

```svelte
<style>
  .container {
    padding: 1rem;
  }

  @media (min-width: 768px) {
    .container {
      padding: 2rem;
    }
  }
</style>
```

### 3. Provide Sensible Defaults

Make optional props have good defaults:

```svelte
<script>
  export let title = 'Untitled';
  export let showImage = true;
</script>
```

### 4. Document Your Props

Add JSDoc comments for custom components:

```svelte
<script>
  /**
   * The title text
   * @type {string}
   */
  export let title;

  /**
   * Optional description text
   * @type {string}
   */
  export let description = '';
</script>
```

## Full Component Reference

For complete component documentation with all props and examples:

**[Components README →](https://github.com/accretional/statue/blob/main/src/lib/components/COMPONENTS_README.md)**

## Next Steps

- **[Themes](./themes.md)** - Style components with themes
- **[Get Started](./get-started.md)** - Build pages with components
- **[Site Config](./site-config.md)** - Configure component data sources

**Resources:**
- **[Statue.dev](https://statue.dev)** - Official documentation
