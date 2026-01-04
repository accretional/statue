---
title: Getting Started with Your Portfolio
description: A quick guide to customizing your developer portfolio
date: 2025-01-01
author: Portfolio Template
---

Welcome to your new developer portfolio! Here's how to make it yours.

## Quick Setup

### 1. Sync Your GitHub Profile

Run the sync script to automatically pull your GitHub data:

```bash
./scripts/github-sync.sh your-github-username
```

This will:
- Download your avatar to `static/avatar.jpg`
- Fetch your repositories to `static/repositories.json`
- Fetch your contribution graph to `static/contributions.json`
- Update `site.config.js` with your profile info

### 2. Customize Your Profile

Edit `site.config.js` to fine-tune your profile:

```javascript
profile: {
  name: 'Your Name',
  username: 'your-github-username',
  bio: 'Your custom bio',
  status: {
    emoji: "🚀",
    message: "Building something new"
  }
}
```

### 3. Add Blog Posts

Create markdown files in `content/blog/` with frontmatter:

```markdown
---
title: My First Post
description: A brief description
date: 2025-01-15
author: Your Name
---

Your content here...
```

### 4. Choose a Theme

The sync script randomly selects a theme. To change it manually, edit `src/lib/index.css`:

```css
@import "statue-ssg/themes/purple.css";
```

Available themes: `black-red`, `black-white`, `blue`, `charcoal`, `cyan`, `green`, `orange`, `pink`, `purple`, `red`.

## Features

- **Contribution Graph**: Shows your GitHub activity
- **Repository Cards**: Displays your top repositories
- **VS Code Preview**: Click "View Code" on any repo to preview it
- **Blog**: Share your thoughts and tutorials
- **Responsive**: Works great on all devices

## Need Help?

Visit [statue.dev](https://statue.dev) for documentation and support.

---

*Feel free to delete this post once you've set everything up!*
