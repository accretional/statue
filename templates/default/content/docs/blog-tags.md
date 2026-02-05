---
title: Blog Tags
description: How to use tags to organize and categorize your blog posts
order: 8
icon: tag
---

# Blog Tags

Blog tags help readers discover related content by categorizing your posts into topics. When enabled, readers can click on a tag to see all posts with that tag.

> **Note:** Tag functionality is currently only supported in the **default template**. Other templates (blog, developer-portfolio, etc.) do not support tags at this time.

## Enabling Tags

Tags are disabled by default. To enable them, update your `site.config.json`:

```json
{
  "blog": {
    "blogTag": {
      "enabled": true
    }
  }
}
```

Once enabled, tags will automatically appear:
- On blog post cards in the blog listing page
- In the blog post header on individual post pages
- On dedicated tag pages showing all posts with a specific tag

## Adding Tags to Posts

Add tags to any blog post by including a `tags` array in the frontmatter:

```markdown
---
title: Getting Started with Statue SSG
description: A quick guide to setting up your first Statue static site
date: 2025-12-05
author: Accretional Team
thumbnail: /blog_thumbnail1.jpg
tags: [guide, tutorial, beginner]
---

Your post content here...
```

### Tag Guidelines

- **Use lowercase**: Tags are case-sensitive in the URL
- **Use hyphens for spaces**: `machine-learning` instead of `machine learning`
- **Be consistent**: Reuse the same tag names across posts
- **Keep it simple**: 3-5 tags per post is ideal
- **Be specific**: Use tags that describe the content accurately

## How Tags Work

When you add tags to your posts:

1. **Tag links are generated** - Each unique tag gets its own page at `/tags/tag-name`
2. **Automatic grouping** - Posts with the same tag are automatically grouped together
3. **Click to filter** - Readers can click any tag to see all posts with that tag
4. **No configuration needed** - Tag pages are created automatically during the build

## Disabling Tags

To disable tags, set `enabled` to `false` in your `site.config.json`:

```json
{
  "blog": {
    "blogTag": {
      "enabled": false
    }
  }
}
```

Or remove the `blogTag` configuration entirely—tags are disabled by default.

## Common Questions

**Q: Can I use tags in other directories like `/docs`?**
A: Currently, tags only work for blog posts in the `content/blog/` directory.

**Q: Can I customize tag styling?**
A: Yes! The TagList component uses CSS custom properties from your theme. You can override the styles in your custom CSS.

**Q: What if I misspell a tag?**
A: Tags are created based on the exact spelling in your frontmatter. Fix the typo in the markdown file and rebuild your site.

**Q: Can I have tags without blog posts?**
A: No, tag pages are only generated when there are blog posts with those tags.

**Q: Do I need to manually create tag pages?**
A: No, tag pages are automatically generated during the build process based on the tags in your blog posts.

## Next Steps

- **[Site Configuration](./site-config.md)** - Learn about all configuration options
- **[Components](./components.md)** - Understand how the TagList component works
- **[Themes](./themes.md)** - Customize the appearance of tags

---

*Need help? Join our **[Discord community](https://discord.gg/accretional)** or check the **[GitHub Issues](https://github.com/accretional/statue/issues)**.*
