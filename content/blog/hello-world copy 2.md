---
title: Hello World
date: 2025-11-21
author: Statue User
description: Your first blog post
thumbnail: /thumbnails/blog_thumbnail1.jpg
---

# Hello World

Welcome to your first blog post!

The page contents can be changed by modifying the markdown file located at content/blog/hello-world.md that Statue builds into the HTML displayed on your site.

## Adding New Content

To create new Statue blog entries, simply add new markdown fikes to content/blog/ and rebuild!

```bash
echo -e "---\ntitle: Second Post\ndate: 2025-11-21\nauthor: Statue User\ndescription: My Second Post\n---\n\n# Hello Again\n\nHello from the other side" > content/blog/second-post.md
# Or, try creating and editing content/blog/second-post.md in a text editor
# Or use an IDE like brilliant.mplode.dev
# To view the new content, stop any active local Statue server with ctl+C, then run
npm run build && npm run dev
```

To modify the styling or format for all content/ entries, you can edit the formatting at src/routes/\[...slug\]/+page.svelte

```bash
vim src/routes/\[...slug\]/+page.svelte
# If npm run dev is running, it should automatically update the site.
# Otherwise, run
npm run dev
```

For more fine-grained configuration, check out [SvelteKit's Docs](https://svelte.dev/docs/kit/routing) to build whatever custom functionality your heart desires!

## Markdown Features

Markdown is a lightweight markup language that allows you to write using an easy-to-read, easy-to-write plain text format, which then converts to valid HTML for viewing on a website.

### Some examples:

Markdown supports most basic text formatting:

- **Bold text** is created using double asterisks
- *Italic text* is created using single asterisks
- [Links](https://accretional.com) are created using square brackets and parentheses

```markdown
This is **bold** text.
This is *italicized* text.
Here's a [link to Statue's Github](https://github.com/accretional/statue)
```
This is **bold** text.

This is *italicized* text.

Here's a [link to Statue's Github](https://github.com/accretional/statue)

### Code blocks

Code blocks are useful when you need to disable markdown formatting for a piece of text.

````markdown
This is how you wrap some markdown in a code block
```markdown
My code block text
```
````

Or, sometimes you just want to format something like code.

```javascript
// This is a code block
function helloWorld() {
  console.log("Hello, world!");
}
```

### Headers

You can separate out different sections of your markdown text with headers, like

```markdown
### Headers

This is my text under the Headers section.
````

## Next Steps

Check out the rest of your Statue site to continue customizing it!

More detailed customization instructions can be found under your sites docs.
