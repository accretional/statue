---
title: Site Configuration
description: Configuring your Statue site with site.config.json
icon: settings
---

# Site Configuration

The `site.config.json` file is your site's central configuration. It stores information used throughout your site via template variables and component props.

> **Contribute to Statue!** Built a useful component, theme, or template? Share it with the community—it only takes a single command. **[Learn how →](https://github.com/accretional/statue/blob/main/CONTRIBUTING.md)**

## Location

`site.config.json` - in your project root

## Basic Structure

```json
{
  "$schema": "./node_modules/statue-ssg/site.config.schema.json",
  "site": { /* Site info */ },
  "contact": { /* Contact details */ },
  "social": { /* Social media */ },
  "legal": { /* Legal pages */ },
  "seo": { /* SEO settings */ }
}
```

The `$schema` property enables IDE autocompletion and validation. Your editor will suggest available properties and validate your configuration as you type.

## Site Information

Basic information about your site:

```json
{
  "site": {
    "name": "Your Site Name",
    "description": "Your site description",
    "url": "https://yoursite.com",
    "author": "Your Name or Organization"
  }
}
```

**Usage:**
- `{{site.name}}` in markdown
- `{data.siteConfig.site.name}` in components
- SEO meta tags

**When to update:**
- When you first set up your site
- When you rebrand
- When you change domains

---

## Contact Information

### Basic Contact

```json
{
  "contact": {
    "email": "hello@yoursite.com",
    "privacyEmail": "privacy@yoursite.com",
    "supportEmail": "support@yoursite.com",
    "phone": "+1 (555) 123-4567"
  }
}
```

**Usage:**
- `{{contact.email}}` in markdown
- Legal pages (privacy policy, terms)
- Contact forms
- Footer

**Tip:** Use the same email for all if you don't have separate addresses.

### Address

```json
{
  "contact": {
    "address": {
      "street": "123 Main Street",
      "city": "San Francisco",
      "state": "CA",
      "zipCode": "94103",
      "country": "United States"
    }
  }
}
```

**Usage:**
- `{{contact.address.street}}` - Individual fields
- `{{contact.address.full}}` - Auto-formatted full address
- Legal pages (business address requirements)
- Contact page

**Tip:** Required for some legal pages and business sites.

---

## Social Media

Links to your social media profiles:

```json
{
  "social": {
    "twitter": "https://twitter.com/yourhandle",
    "github": "https://github.com/yourorg",
    "linkedin": "https://linkedin.com/company/yourcompany",
    "facebook": "https://facebook.com/yourpage",
    "instagram": "https://instagram.com/yourhandle",
    "youtube": "https://youtube.com/@yourchannel",
    "discord": "https://discord.gg/yourserver",
    "reddit": "https://reddit.com/r/yourcommunity"
  }
}
```

**Usage:**
- `{{social.twitter}}` in markdown
- Footer social links
- Share buttons

**Tip:** Remove or leave out the ones you don't use.

---

## Legal Settings

Configuration for legal pages:

```json
{
  "legal": {
    "privacyPolicyLastUpdated": "2025-01-15",
    "termsLastUpdated": "2025-01-15",
    "isCaliforniaCompliant": true,
    "doNotSell": {
      "processingTime": "15 business days",
      "confirmationRequired": true
    }
  }
}
```

**Usage:**
- `{{legal.privacyPolicyLastUpdated}}` - Shows update date
- Privacy policy requirements
- CCPA/CPRA compliance

**When to update:**
- When you modify your privacy policy
- When you modify your terms of service
- When you update data handling practices

**Important:** Keep dates accurate for legal compliance.

---

## SEO Settings

Search engine optimization configuration:

```json
{
  "seo": {
    "defaultTitle": "Your Site - Tagline",
    "titleTemplate": "%s | Your Site",
    "defaultDescription": "Your site description for search results",
    "keywords": ["your", "site", "keywords"],
    "ogImage": "/images/og-image.png",
    "twitterCard": "summary_large_image"
  }
}
```

### SEO Fields

**`defaultTitle`**
- Fallback title when no title is specified
- Used on homepage if no custom title set

**`titleTemplate`**
- Template for page titles
- `%s` is replaced with the page title
- Example: "Blog Post | Your Site"

**`defaultDescription`**
- Fallback meta description
- Used when pages don't specify description
- Shows in search results

**`keywords`**
- Array of site-wide keywords
- Less important for modern SEO but still useful

**`ogImage`**
- Image URL for social sharing (Open Graph)
- Shows when links are shared on social media
- Should be 1200x630px

**`twitterCard`**
- Twitter card type
- Options: `summary`, `summary_large_image`, `player`

---

## RSS Feed Configuration

Automatic RSS feed generation for your blog and content:

```json
{
  "rss": {
    "enabled": true,
    "title": "Your Site Blog & Updates",
    "description": "Latest posts and announcements",
    "language": "en-us",
    "copyright": null,
    "includeDirectories": ["blog"],
    "excludeDirectories": [],
    "maxItems": 50,
    "contentMode": "summary",
    "summaryLength": 280,
    "includeAuthor": true,
    "includeThumbnail": true,
    "includeCategories": true,
    "pubDateField": "date",
    "itemGuidUsesUrl": true
  }
}
```

### RSS Fields

**`enabled`** (boolean, default: `true`)
- Master switch to enable/disable RSS feed generation
- Set to `false` to skip RSS generation entirely

**`title`** (string, default: `site.name`)
- Feed title shown in RSS readers
- Defaults to your site name if not specified

**`description`** (string, default: `site.description`)
- Feed description shown in RSS readers
- Defaults to your site description if not specified

**`language`** (string, default: `'en-us'`)
- RSS language code (e.g., 'en-us', 'en-gb', 'es', 'fr')
- Helps RSS readers display content correctly

**`copyright`** (string, default: `"Copyright {year} {site.author}"`)
- Copyright notice for the feed
- Auto-generated if not specified

**`includeDirectories`** (array, default: `['blog']`)
- Which content directories to include in the feed
- Examples: `['blog']`, `['blog', 'news']`, `['*']` for all
- Only content with both `title` and `date` will be included

**`excludeDirectories`** (array, default: `[]`)
- Content directories to explicitly exclude
- Useful when using `['*']` for includeDirectories

**`maxItems`** (number, default: `50`)
- Maximum number of items in the feed
- Older items beyond this limit are not included

**`contentMode`** (string, default: `'summary'`)
- How to include content in feed items
- Options:
  - `'summary'` - Include excerpt/summary (encourages clicks)
  - `'full'` - Include complete HTML content
  - `'none'` - Only include title and description

**`summaryLength`** (number, default: `280`)
- Character limit for summaries when `contentMode: 'summary'`
- Truncates at word boundary

**`includeAuthor`** (boolean, default: `true`)
- Include author metadata from frontmatter in feed items

**`includeThumbnail`** (boolean, default: `true`)
- Include thumbnail images from frontmatter as media enclosures
- Converts relative URLs to absolute

**`includeCategories`** (boolean, default: `true`)
- Include category tags from frontmatter in feed items

**`pubDateField`** (string, default: `'date'`)
- Which frontmatter field to use for publication date
- Items without this field are skipped

**`itemGuidUsesUrl`** (boolean, default: `true`)
- Use item URL as GUID (globally unique identifier)
- Set to `false` to generate a GUID from URL + date

### Feed Location

The RSS feed is generated at:
- **Build output:** `build/rss.xml`
- **Website URL:** `https://yoursite.com/rss.xml`

### RSS Feed Requirements

For content to appear in the RSS feed:
1. Must be in an included directory (e.g., `content/blog/`)
2. Must have `title` in frontmatter
3. Must have `date` in frontmatter (or whatever `pubDateField` specifies)
4. Date must be valid and parseable

Example valid blog post:
```markdown
---
title: "My Blog Post"
description: "Post description"
date: "2025-01-20"
author: "Your Name"
category: "Technology"
thumbnail: "/images/post-thumbnail.jpg"
---

Your blog post content here.
```

### RSS Configuration Examples

**Minimal (Use Defaults):**
```json
{
  "rss": {
    "enabled": true
  }
}
```
Result: Blog-only feed with summaries, 50 items max

**Personal Blog (Full Content):**
```json
{
  "rss": {
    "enabled": true,
    "contentMode": "full",
    "maxItems": 100
  }
}
```
Result: Full post content in feed, 100 items max

**Multi-Section Site:**
```json
{
  "rss": {
    "enabled": true,
    "includeDirectories": ["blog", "news", "updates"],
    "maxItems": 75
  }
}
```
Result: Combined feed from multiple directories

**Custom Feed Metadata:**
```json
{
  "rss": {
    "enabled": true,
    "title": "My Custom Feed Title",
    "description": "Custom description for feed readers",
    "copyright": "© 2025 My Company. All rights reserved.",
    "language": "en-gb"
  }
}
```
Result: Overrides default feed metadata

**Disable RSS:**
```json
{
  "rss": {
    "enabled": false
  }
}
```
Result: No RSS feed generated

### Using Your RSS Feed

After building your site, the RSS feed will be available at `https://yoursite.com/rss.xml`.

**Add to your site:**
```html
<link rel="alternate" type="application/rss+xml"
      title="Your Site RSS Feed"
      href="/rss.xml" />
```

**Validate your feed:**
- https://validator.w3.org/feed/

**Test in feed readers:**
- Feedly: https://feedly.com
- NewsBlur: https://newsblur.com
- Inoreader: https://inoreader.com

---

## Using Configuration in Markdown

### Template Variables

Statue lets you use config values and dynamic variables in your markdown using the `{{variable}}` syntax.

#### Basic Usage

Access config values in any markdown file:

```markdown
---
title: Contact Us
description: Get in touch with {{site.name}}
---

# Contact Us

Email: [{{contact.email}}](mailto:{{contact.email}})
Phone: {{contact.phone}}

Our office: {{contact.address.full}}

Follow us on [Twitter]({{social.twitter}})

(c) {{date.year}} {{site.name}}
```

#### Available Variables

**Site Information:**
- `{{site.name}}` - Site name
- `{{site.description}}` - Site description
- `{{site.url}}` - Site URL
- `{{site.author}}` - Site author

**Contact Information:**
- `{{contact.email}}` - Main email
- `{{contact.privacyEmail}}` - Privacy email
- `{{contact.supportEmail}}` - Support email
- `{{contact.phone}}` - Phone number
- `{{contact.address.street}}` - Street address
- `{{contact.address.city}}` - City
- `{{contact.address.state}}` - State
- `{{contact.address.zipCode}}` - ZIP code
- `{{contact.address.country}}` - Country
- `{{contact.address.full}}` - Full formatted address

**Social Media:**
- `{{social.twitter}}` - Twitter URL
- `{{social.github}}` - GitHub URL
- `{{social.linkedin}}` - LinkedIn URL
- `{{social.facebook}}` - Facebook URL
- `{{social.instagram}}` - Instagram URL
- `{{social.youtube}}` - YouTube URL
- `{{social.discord}}` - Discord URL
- `{{social.reddit}}` - Reddit URL

**Legal:**
- `{{legal.privacyPolicyLastUpdated}}` - Privacy policy date
- `{{legal.termsLastUpdated}}` - Terms of service date
- `{{legal.doNotSell.processingTime}}` - Processing time

**Date Variables:**
- `{{date.now}}` - Today's date (e.g., "12/7/2025")
- `{{date.year}}` - Current year (e.g., "2025")
- `{{date.month}}` - Current month name (e.g., "December")
- `{{date.day}}` - Current day (e.g., "7")

#### Using in Frontmatter

Variables work in frontmatter too:

```markdown
---
title: Privacy Policy for {{site.name}}
description: {{site.name}}'s privacy policy, last updated {{legal.privacyPolicyLastUpdated}}
---
```

#### Template Variable Examples

**Email links:**
```markdown
Contact us: [{{contact.email}}](mailto:{{contact.email}})
Privacy: [{{contact.privacyEmail}}](mailto:{{contact.privacyEmail}})
```

**Social media:**
```markdown
Follow us:
- [Twitter]({{social.twitter}})
- [GitHub]({{social.github}})
- [Discord]({{social.discord}})
```

**Copyright notices:**
```markdown
(c) {{date.year}} {{site.name}}. All rights reserved.
```

**Dynamic dates:**
```markdown
Last updated: {{date.now}}
```

#### How Variables Work

- Variables are processed at **build time**, not runtime
- If a variable isn't found, the `{{variable}}` text stays unchanged
- A warning is logged to console for missing variables
- Variables are safe - no user input is evaluated

---

## Using Configuration in Components

Access config in Svelte components:

```svelte
<script>
  import siteConfig from '/site.config.json';

  const siteName = siteConfig.site.name;
  const email = siteConfig.contact.email;
</script>

<h1>Welcome to {siteName}</h1>
<a href="mailto:{email}">Contact us</a>
```

---

## Configuration Best Practices

### 1. Update Immediately

Change placeholder values when you first set up:
```json
"email": "your-email@example.com"  // Don't leave this
"email": "hello@yoursite.com"      // Change to your email
```

### 2. Keep Legal Dates Current

```json
"privacyPolicyLastUpdated": "2025-01-15"  // Update when you change policy
```

### 3. Remove Unused Socials

```json
// Don't leave fake links
"facebook": "https://facebook.com/statuessg"

// Use your actual link or remove the property entirely
"facebook": "https://facebook.com/yourpage"
```

### 4. Use Consistent Formatting

```json
// Good - consistent URL formats
"twitter": "https://twitter.com/handle",
"github": "https://github.com/user"

// Bad - inconsistent
"twitter": "twitter.com/handle",   // Missing protocol
"github": "https://github.com/user"
```

### 5. Validate Email Addresses

Ensure emails are valid:
```json
"email": "hello@yoursite.com"      // Valid
"email": "hello @ yoursite.com"    // Invalid (spaces)
"email": "hello"                   // Invalid (no domain)
```

---

## Common Configuration Patterns

### Startup/SaaS Site

```json
{
  "site": {
    "name": "YourApp",
    "description": "The best app for X",
    "url": "https://yourapp.com",
    "author": "YourApp Team"
  },
  "contact": {
    "email": "hello@yourapp.com",
    "supportEmail": "support@yourapp.com"
  },
  "social": {
    "twitter": "https://twitter.com/yourapp",
    "github": "https://github.com/yourorg"
  }
}
```

### Personal Blog

```json
{
  "site": {
    "name": "John's Blog",
    "description": "Thoughts on code and life",
    "url": "https://johnblog.com",
    "author": "John Doe"
  },
  "contact": {
    "email": "john@johnblog.com"
  },
  "social": {
    "twitter": "https://twitter.com/johndoe",
    "github": "https://github.com/johndoe"
  }
}
```

### Documentation Site

```json
{
  "site": {
    "name": "ProjectDocs",
    "description": "Official documentation for Project",
    "url": "https://docs.project.com",
    "author": "Project Team"
  },
  "contact": {
    "email": "docs@project.com"
  },
  "social": {
    "github": "https://github.com/project/project",
    "discord": "https://discord.gg/project"
  }
}
```

---

## Troubleshooting

### Variables not showing in markdown

**Check:**
1. Is the variable name correct?
2. Did you restart the dev server?
3. Is the value defined in `site.config.json`?

**Fix:**
```bash
# Restart dev server
npm run dev
```

### Config changes not applying

**Build cache issue.** Clear build artifacts:
```bash
rm -rf .svelte-kit build
npm run dev
```

### JSON Syntax Errors

JSON is stricter than JavaScript. Common issues:

- **Trailing commas:** JSON does not allow trailing commas
- **Comments:** JSON does not support comments
- **Quotes:** Property names must be in double quotes

Use your IDE's JSON validation (enabled by the `$schema` property) to catch errors.

---

## Next Steps

- **[Statue.dev](https://statue.dev)** - Official documentation
- **[New Site Checklist](./new-site-checklist.md)** - Setup walkthrough
- **[Components](./components.md)** - Use config in components
- **[Themes](./themes.md)** - Style your site
