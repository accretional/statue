# Template Variables Documentation

This documentation explains how to use template variables in Statue SSG.

## Overview

Statue SSG provides a template variable system that allows you to create dynamic content in your markdown files. With this system, you can manage email addresses, contact information, social media links, and other site settings from a central location.

## Configuration File

All site settings are defined in the `site.config.js` file. You can update your site's information by editing this file.

```javascript
// site.config.js
export const siteConfig = {
  site: {
    name: "Your Site Name",
    description: "Your site description",
    url: "https://yoursite.com",
    author: "Your Name"
  },
  contact: {
    email: "info@yoursite.com",
    privacyEmail: "privacy@yoursite.com",
    supportEmail: "support@yoursite.com",
    // ... other settings
  }
  // ... other configurations
};
```

## Template Variable Formats

### 1. Simple Template Variables

Use the `{{variable.name}}` format in your markdown files:

```markdown
Email: {{contact.email}}
Site Name: {{site.name}}
```

### 2. JavaScript Expressions (Limited)

You can use the `{expression}` format for date functions:

```markdown
Last updated: {new Date().toLocaleDateString('en-US')}
```

## Available Variables

### Site Information
- `{{site.name}}` - Site name
- `{{site.description}}` - Site description
- `{{site.url}}` - Site URL
- `{{site.author}}` - Site author

### Contact Information
- `{{contact.email}}` - Main email address
- `{{contact.privacyEmail}}` - Privacy email address
- `{{contact.supportEmail}}` - Support email address
- `{{contact.phone}}` - Phone number
- `{{contact.address.street}}` - Street address
- `{{contact.address.city}}` - City
- `{{contact.address.state}}` - State
- `{{contact.address.zipCode}}` - ZIP code
- `{{contact.address.country}}` - Country
- `{{contact.address.full}}` - Full address (automatically combined)

### Social Media
- `{{social.twitter}}` - Twitter URL
- `{{social.github}}` - GitHub URL
- `{{social.linkedin}}` - LinkedIn URL
- `{{social.facebook}}` - Facebook URL
- `{{social.instagram}}` - Instagram URL
- `{{social.youtube}}` - YouTube URL

### Legal Information
- `{{legal.privacyPolicyLastUpdated}}` - Privacy policy last updated date
- `{{legal.termsLastUpdated}}` - Terms of use last updated date
- `{{legal.doNotSell.processingTime}}` - Do Not Sell processing time

### Date Variables
- `{{date.now}}` - Today's date
- `{{date.year}}` - Current year
- `{{date.month}}` - Current month (long format)
- `{{date.day}}` - Current day

## Usage Examples

### Email Links
```markdown
Contact us: [{{contact.email}}](mailto:{{contact.email}})
Privacy questions: [{{contact.privacyEmail}}](mailto:{{contact.privacyEmail}})
```

### Address Information
```markdown
Our Office Address: {{contact.address.full}}
```

### Usage in Frontmatter
```yaml
---
title: Privacy Policy
description: Privacy Policy for {{site.name}}
---
```

### Social Media Links
```markdown
Follow us:
- [Twitter]({{social.twitter}})
- [GitHub]({{social.github}})
```

## Adding New Variables

To add new template variables:

1. Add the new value to the `site.config.js` file
2. Define the new variable in the `processTemplateVariables` function in `src/lib/cms/content-processor.js`

```javascript
// Adding to site.config.js
export const siteConfig = {
  // ... existing settings
  newSection: {
    newValue: "Your new value"
  }
};

// Adding to content-processor.js
const variables = {
  // ... existing variables
  'newSection.newValue': siteConfig.newSection.newValue,
};
```

## Debugging

- If a template variable is not found, a warning message is printed to the console
- When a variable is not found, the original `{{variable}}` text remains unchanged
- If there's an error in JavaScript expressions, the original `{expression}` text is preserved

## Security Notes

- JavaScript expressions are limited and only date functions are allowed
- User input is not directly evaluated
- Template variables are processed at build time, not runtime

## Example Files

You can see how this system is used by looking at these files:
- `content/legal/privacy-policy.md`
- `content/legal/do-not-sell.md`
- `content/legal/terms.md` 