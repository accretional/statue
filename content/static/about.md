---
title: About Us
description: This contains information about the Statue SSG project
date: 2024-05-01
author: Statue Team
---

# About Statue SSG

Statue SSG is a tool designed to quickly and easily create static websites from Markdown content. It is built on the SvelteKit framework and supports both Markdown content and Svelte components.

## Features

- **Markdown Support**: You can write your content in markdown format
- **Folder Structure**: You can organize your content in folders
- **Svelte Integration**: You can create pages with Svelte components as well as Markdown content
- **Automatic Route Generation**: Automatically converts your content folder structure into URLs
- **Fast Compilation**: Creates your site in seconds with SvelteKit's fast compilation features

## How to Use

To create a site with Statue SSG:

1. Add your Markdown files to the `content` folder
2. Optionally create Svelte pages under `src/routes`
3. Compile your static site with the `npm run build` command
4. Upload the generated `build` folder to any static server

## Example Structure

```
content/
  blog/
    post1.md
    post2.md
  docs/
    guide.md
  about.md  <-- This file

src/routes/
  +page.svelte   <-- Home page
  contact/
    +page.svelte <-- Contact page
```

In this structure, both Markdown content and Svelte pages can exist together.

---

The Statue SSG project is open-source and distributed under the MIT license. 