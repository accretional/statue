---
title: Using Components in Markdown
description: Learn how to use Svelte components directly inside your markdown files
order: 10
---

<script>
  import { CopyCommand, Warning, Stats } from 'statue-ssg';
</script>

# Using Svelte Components in Markdown

With mdsvex, you can import and use Svelte components directly in your markdown files. This opens up powerful possibilities for interactive documentation and rich content.

## How It Works

Add a `<script>` tag at the top of your markdown file (after the frontmatter) to import components:

```markdown
---
title: My Page
---

<script>
  import { Button, Card } from 'statue-ssg';
</script>

# My Content

<Button href="/docs">Go to Docs</Button>
```

## Live Examples

Here are some statue-ssg components in action:

### CopyCommand Component

Use `CopyCommand` to show copyable terminal commands:

<CopyCommand command="npx statue init" />

<CopyCommand command="npm run dev" />

### Warning Component

Display important notices with the `Warning` component:

<Warning warning="This is an important warning message that users should pay attention to!" />

### Stats Component

Show statistics in a visually appealing way:

<Stats />

## Available Components

All components from `statue-ssg` are available for use:

| Component | Description |
|-----------|-------------|
| `Button` | Styled button/link |
| `Card` | Content card |
| `CopyCommand` | Copyable command |
| `Warning` | Warning message |
| `Stats` | Statistics display |
| `Hero` | Hero section |
| `Footer` | Page footer |

## Best Practices

1. **Import only what you need** - Keep imports minimal for better performance
2. **Use semantic markdown** - Components enhance, not replace, good markdown
3. **Test interactivity** - Make sure components work with SSG

## Template Variables Still Work

You can still use template variables like `{{site.name}}` alongside components. They get replaced at build time.

---

Happy building with mdsvex!
