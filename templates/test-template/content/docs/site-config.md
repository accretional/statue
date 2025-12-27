---
title: Site Configuration
description: Configuring your Statue site with site.config.js
icon: settings
---

# Site Configuration

The `site.config.js` file is your site's central configuration. It stores information used throughout your site via template variables and component props.

> **Contribute to Statue!** Built a useful component, theme, or template? Share it with the community—it only takes a single command. **[Learn how →](https://github.com/accretional/statue/blob/main/CONTRIBUTING.md)**

## Location

`site.config.js` - in your project root

## Basic Structure

```javascript
export const siteConfig = {
  site: { /* Site info */ },
  contact: { /* Contact details */ },
  social: { /* Social media */ },
  legal: { /* Legal pages */ },
  seo: { /* SEO settings */ }
};

export default siteConfig;
```

## Site Information

Basic information about your site:

```javascript
site: {
  name: "Your Site Name",
  description: "Your site description",
  url: "https://yoursite.com",
  author: "Your Name or Organization"
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

```javascript
contact: {
  email: "hello@yoursite.com",
  privacyEmail: "privacy@yoursite.com",
  supportEmail: "support@yoursite.com",
  phone: "+1 (555) 123-4567"
}
```

**Usage:**
- `{{contact.email}}` in markdown
- Legal pages (privacy policy, terms)
- Contact forms
- Footer

**Tip:** Use the same email for all if you don't have separate addresses.

### Address

```javascript
contact: {
  address: {
    street: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94103",
    country: "United States"
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

```javascript
social: {
  twitter: "https://twitter.com/yourhandle",
  github: "https://github.com/yourorg",
  linkedin: "https://linkedin.com/company/yourcompany",
  facebook: "https://facebook.com/yourpage",
  instagram: "https://instagram.com/yourhandle",
  youtube: "https://youtube.com/@yourchannel",
  discord: "https://discord.gg/yourserver",
  reddit: "https://reddit.com/r/yourcommunity"
}
```

**Usage:**
- `{{social.twitter}}` in markdown
- Footer social links
- Share buttons

**Tip:** Remove or leave empty the ones you don't use.

---

## Legal Settings

Configuration for legal pages:

```javascript
legal: {
  privacyPolicyLastUpdated: "2025-01-15",
  termsLastUpdated: "2025-01-15",
  isCaliforniaCompliant: true,
  doNotSell: {
    processingTime: "15 business days",
    confirmationRequired: true
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

```javascript
seo: {
  defaultTitle: "Your Site - Tagline",
  titleTemplate: "%s | Your Site",
  defaultDescription: "Your site description for search results",
  keywords: ["your", "site", "keywords"],
  ogImage: "/images/og-image.png",
  twitterCard: "summary_large_image"
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
- Should be 1200×630px

**`twitterCard`**
- Twitter card type
- Options: `summary`, `summary_large_image`, `player`

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

© {{date.year}} {{site.name}}
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
© {{date.year}} {{site.name}}. All rights reserved.
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
  import siteConfig from '/site.config.js';

  const siteName = siteConfig.site.name;
  const email = siteConfig.contact.email;
</script>

<h1>Welcome to {siteName}</h1>
<a href="mailto:{email}">Contact us</a>
```

---

## Environment-Specific Configuration

### Dynamic URL Configuration

Handle different URLs for development and production:

```javascript
let siteUrl;

if (typeof import.meta !== 'undefined' && import.meta.env) {
  siteUrl = import.meta.env.VITE_SITEURL;
} else {
  siteUrl = process.env.VITE_SITEURL;
}

siteUrl = siteUrl ?? 'https://yoursite.com'; // Fallback

export const siteConfig = {
  site: {
    url: siteUrl,
    // ... other config
  }
};
```

Set via environment variable:
```bash
VITE_SITEURL=https://staging.yoursite.com npm run dev
```

---

## Configuration Best Practices

### 1. Update Immediately

Change placeholder values when you first set up:
```javascript
email: "your-email@example.com"  // ❌ Don't leave this
email: "hello@yoursite.com"      // ✅ Change to your email
```

### 2. Keep Legal Dates Current

```javascript
privacyPolicyLastUpdated: "2025-01-15"  // Update when you change policy
```

### 3. Remove Unused Socials

```javascript
// ❌ Don't leave fake links
facebook: "https://facebook.com/statuessg"

// ✅ Remove or use your actual link
facebook: "https://facebook.com/yourpage"
// Or remove the line entirely
```

### 4. Use Consistent Formatting

```javascript
// ✅ Good - consistent URL formats
twitter: "https://twitter.com/handle"
github: "https://github.com/user"

// ❌ Bad - inconsistent
twitter: "twitter.com/handle"  // Missing protocol
github: "https://github.com/user"
```

### 5. Validate Email Addresses

Ensure emails are valid:
```javascript
email: "hello@yoursite.com"      // ✅ Valid
email: "hello @ yoursite.com"    // ❌ Invalid (spaces)
email: "hello"                    // ❌ Invalid (no domain)
```

---

## Common Configuration Patterns

### Startup/SaaS Site

```javascript
export const siteConfig = {
  site: {
    name: "YourApp",
    description: "The best app for X",
    url: "https://yourapp.com",
    author: "YourApp Team"
  },
  contact: {
    email: "hello@yourapp.com",
    supportEmail: "support@yourapp.com"
  },
  social: {
    twitter: "https://twitter.com/yourapp",
    github: "https://github.com/yourorg"
  }
};
```

### Personal Blog

```javascript
export const siteConfig = {
  site: {
    name: "John's Blog",
    description: "Thoughts on code and life",
    url: "https://johnblog.com",
    author: "John Doe"
  },
  contact: {
    email: "john@johnblog.com"
  },
  social: {
    twitter: "https://twitter.com/johndoe",
    github: "https://github.com/johndoe"
  }
};
```

### Documentation Site

```javascript
export const siteConfig = {
  site: {
    name: "ProjectDocs",
    description: "Official documentation for Project",
    url: "https://docs.project.com",
    author: "Project Team"
  },
  contact: {
    email: "docs@project.com"
  },
  social: {
    github: "https://github.com/project/project",
    discord: "https://discord.gg/project"
  }
};
```

---

## Troubleshooting

### Variables not showing in markdown

**Check:**
1. Is the variable name correct?
2. Did you restart the dev server?
3. Is the value defined in `site.config.js`?

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

### TypeScript errors with config

Create a type definition file (optional):
```typescript
// site.config.d.ts
export interface SiteConfig {
  site: {
    name: string;
    description: string;
    url: string;
    author: string;
  };
  // ... other types
}
```

---

## Next Steps

- **[Statue.dev](https://statue.dev)** - Official documentation
- **[New Site Checklist](./new-site-checklist.md)** - Setup walkthrough
- **[Components](./components.md)** - Use config in components
- **[Themes](./themes.md)** - Style your site
