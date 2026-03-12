---
title: XCard (Tweet Embeds)
description: Embed rich Twitter/X tweet cards in your content
order: 9
icon: social
---

# XCard (Tweet Embeds)

Statue can automatically render rich tweet cards when you paste X/Twitter URLs into your markdown content. No API keys required.

## Automatic Embeds in Markdown

Paste a bare X/Twitter URL on its own line in any markdown file:

```markdown
Check out this announcement:

https://x.com/elonmusk/status/1585341984679469056

Pretty cool, right?
```

The URL is automatically replaced with a styled tweet card at build time showing the author, tweet text, media, date, and engagement metrics.

### Detection Rules

- **Standalone URLs become cards** - A paragraph containing ONLY an X/Twitter URL (on its own line) is rendered as a card
- **Inline URLs stay as links** - URLs mixed with other text remain regular clickable links
- **Markdown links stay as links** - `[click here](https://x.com/...)` remains a normal link

```markdown
<!-- This becomes a card -->

https://x.com/username/status/1234567890

<!-- These stay as regular links -->

Check out https://x.com/username/status/1234567890 for details.
[View tweet](https://x.com/username/status/1234567890)
```

### Supported URL Formats

Both `x.com` and `twitter.com` URLs are supported:

```
https://x.com/username/status/1234567890
https://twitter.com/username/status/1234567890
```

## XCard Svelte Component

You can also use the `XCard` component directly in your Svelte pages for more control:

```svelte
<script>
	import { XCard } from 'statue-ssg';
</script>

<!-- Pass a URL -->
<XCard url="https://x.com/username/status/1234567890" />

<!-- Or pass a tweet ID directly -->
<XCard id="1234567890" />
```

### Props

| Prop  | Type     | Default | Description                   |
| ----- | -------- | ------- | ----------------------------- |
| `url` | `string` | `''`    | X/Twitter status URL          |
| `id`  | `string` | `''`    | Tweet ID (alternative to url) |

You must provide either `url` or `id`. If both are given, `id` takes priority.

### Component States

The XCard component handles three states:

1. **Loading** - Shows an animated skeleton placeholder while fetching tweet data
2. **Loaded** - Displays the full tweet card with author info, text, media, and metrics
3. **Error** - Shows a fallback with a "View on X" link if the tweet can't be loaded

## Styling

Tweet cards automatically use your site's theme variables:

| CSS Variable         | Used For        | Fallback  |
| -------------------- | --------------- | --------- |
| `--color-card`       | Card background | `#16181c` |
| `--color-foreground` | Text color      | `#e7e9ea` |
| `--color-muted`      | Secondary text  | `#71767b` |
| `--color-border`     | Borders         | `#2f3336` |
| `--color-primary`    | Links & accents | `#1d9bf0` |

Cards are responsive and adapt to mobile screens automatically.

## How It Works

- **In markdown**: The `remark-x-card` plugin runs at build time, fetches tweet data from Twitter's public syndication API, and injects the rendered HTML directly into your content. No client-side JavaScript needed.
- **As a component**: The `XCard` Svelte component fetches tweet data client-side when the component mounts, using the same syndication API.

Both approaches use Twitter's public `cdn.syndication.twimg.com` endpoint which requires no API key or authentication.

## Card Features

Each tweet card displays:

- Author avatar, name, handle, and verified badge
- Full tweet text with clickable links, @mentions, and #hashtags
- Attached images (single, double, or grid layout)
- Video thumbnails
- Quoted tweets (nested)
- Post date
- Engagement metrics (replies, reposts, likes)
- X logo linking to the original tweet

## Next Steps

- **[Components](./components.md)** - Browse all available components
- **[Themes](./themes.md)** - Customize your site's theme colors
- **[Get Started](./get-started.md)** - Build your first Statue site
