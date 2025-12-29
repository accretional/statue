---
title: Drag, Drop, Done
description: How publishing a blog post became as easy as saving a text file
date: 2025-12-11
author: Accretional Team
category: tutorial
thumbnail: /blog_thumbnail1.jpg
order: 1
---

In 1440, Johannes Gutenberg looked at a wine press and thought, "What if books?" Four hundred years of monks hand-copying manuscripts, and suddenly any literate person could own a Bible. The gatekeepers didn't disappear overnight, but the gate got a whole lot wider.

Publishing on the web was supposed to be that revolution's sequel. And yet, here we are—decades into the internet age—watching people wrestle with WordPress dashboards, fight with CMS permissions, and sacrifice weekends to "just update the blog."

What if it didn't have to be this way?

---

## The Folder Is the CMS

Here's a radical idea that somehow became radical again: your file system is already a content management system. A brilliant one, actually. You've been using it your whole life. You know how to create folders. You know how to drag files. You know how to hit save.

Statue leans into this. Hard.

Want to publish a blog post? Create a file called `my-thoughts.md` and drop it into the `content/blog/` folder. That's it. No login screens. No "save as draft" buttons. No WYSIWYG editor fighting your formatting choices. Just you, a text file, and the folder where it belongs.

When you run your site, Statue finds that file and says, "Ah, you want this to be a blog post at `/blog/my-thoughts`. Got it." And it just... works.

---

## The Anatomy of a Blog Post

Every Statue blog post starts with a tiny block of metadata called frontmatter. It lives between two sets of triple dashes at the very top of your file, like a name tag at a conference:

```markdown
---
title: My First Post
description: A short summary that appears in previews
date: 2025-12-11
author: Your Name
---

Your actual content starts here. Write whatever you want.
```

That's the minimum. Four lines of metadata, and you're publishing.

But let's say you want to get fancy. Maybe you've got a nice thumbnail image, or you want your face next to your name. Statue handles that too:

```markdown
---
title: My First Post
description: A short summary that appears in previews
date: 2025-12-11
author: Your Name
authorAvatar: /images/me.jpg
thumbnail: /thumbnails/cool-header.jpg
---
```

The `thumbnail` shows up as a big beautiful header image on your blog listing and post pages. The `authorAvatar` puts your face (or your cat's face, we don't judge) right next to your name.

Don't have images yet? Skip those lines entirely. Statue won't break. Posts without thumbnails get a clean, minimal text-based design that looks intentional, not broken.

---

## Where Do Images Actually Go?

Here's where people usually panic: "But where do I put my images? Do I need to configure an asset pipeline? What's a CDN?"

Breathe.

The `static/` folder at the root of your project is your friend. Anything you drop in there becomes available at the root of your website. Put an image at `static/thumbnails/sunset.jpg`, and you can reference it as `/thumbnails/sunset.jpg` in your markdown.

So the full workflow is:

1. Save your image to `static/thumbnails/sunset.jpg`
2. Add `thumbnail: /thumbnails/sunset.jpg` to your post's frontmatter
3. There is no step 3

For author avatars, same deal. `static/avatars/your-face.jpg` becomes `/avatars/your-face.jpg`. Or use a URL if your photo already lives somewhere online—Statue doesn't care where the image comes from, just that it exists.

---

## Writing the Actual Post

Below the frontmatter, you're just writing Markdown. If you've ever written a GitHub README or a Discord message with formatting, you already know this:

```markdown
## This is a heading

This is a paragraph. It has **bold text** and *italic text*.

Here's a list:
- First item
- Second item
- Third item

And here's some code:

\`\`\`javascript
console.log("Hello, blog readers!");
\`\`\`
```

Links work how you'd expect: `[click here](https://example.com)` becomes a clickable link. Images too: `![alt text](/path/to/image.jpg)` embeds right in your content.

The best part? You can preview your changes instantly. With `npm run dev` running, save your file and watch your browser update. No rebuild commands. No deploy cycles. Just write, save, see.

---

## Publishing Multiple Posts

Once you've got one post working, scaling up is just more of the same. Your `content/blog/` folder might eventually look like this:

```
content/
  blog/
    my-first-post.md
    thoughts-on-coffee.md
    why-static-sites-rule.md
    announcing-version-2.md
```

Each file becomes a page. The blog listing page automatically shows all of them, sorted by date (newest first, because that's what people expect). No configuration. No "register this post in the sidebar" nonsense.

---

## Quick Reference

Here's everything you can put in your frontmatter:

| Field | Required | What It Does |
|-------|----------|--------------|
| `title` | Yes | The post title (appears everywhere) |
| `description` | No | Short preview text for listings |
| `date` | Yes | Publication date (YYYY-MM-DD) |
| `author` | No | Who wrote this |
| `authorAvatar` | No | Path or URL to author's image |
| `thumbnail` | No | Path or URL to header image |

That's genuinely the whole system. No plugins to install. No taxonomies to configure. No content types to define. Just files in folders with a few lines of metadata.

---

## The Gutenberg Thing Again

We started with a printing press metaphor, so let's close the loop.

The printing press didn't just make books cheaper. It made *authorship* accessible. Suddenly, having something to say mattered more than having access to a scriptorium.

Statue is trying to do something similar for the web. Not by inventing new technology, but by removing the technology that got in the way. Your ideas shouldn't need a computer science degree to reach the internet. They shouldn't require a monthly subscription or a login portal.

They should require a folder and a text file.

Drag, drop, done.
