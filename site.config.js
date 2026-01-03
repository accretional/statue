// Site Configuration
// This file contains your site's general settings
// You can manage email addresses, social media links, and other contact information from here

export const siteConfig = {
  // Site general information
  site: {
    name: "Statue SSG",
    description: "A simple static site generator for markdown content with SvelteKit",
    url: "https://statuessg.com",
    author: "Statue Team"
  },

  // Contact information
  contact: {
    // Main contact email
    email: "your-email@example.com",
    
    // Privacy policy related email
    privacyEmail: "your-privacy@example.com",
    
    // Support email
    supportEmail: "your-support@example.com",
    
    // Phone number (optional)
    phone: "+1 (555) 123-4567",
    
    // Mailing address
    address: {
      street: "123 Statue Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94103",
      country: "United States"
    }
  },

  // Social media links
  social: {
    twitter: "https://twitter.com/statuessg",
    github: "https://github.com/accretional/statue",
    linkedin: "https://linkedin.com/company/statuessg",
    facebook: "https://facebook.com/statuessg",
    instagram: "https://instagram.com/statuessg",
    youtube: "https://youtube.com/@statuessg"
  },

  // Legal pages specific settings
  legal: {
    // Privacy policy last updated date
    privacyPolicyLastUpdated: "2024-01-15",
    
    // Terms of use last updated date
    termsLastUpdated: "2024-01-15",
    
    // CCPA/CPRA compliance for California state
    isCaliforniaCompliant: true,
    
    // Do Not Sell page additional information
    doNotSell: {
      processingTime: "15 business days",
      confirmationRequired: true
    }
  },

  // Search configuration
  search: {
    // Enable/disable search functionality
    enabled: true,

    // UI options
    placeholder: 'Search...',
    noResultsText: 'No results found',

    // Search behavior
    debounceMs: 300,
    minQueryLength: 2,
    maxResults: 10,

    // Result display options
    showCategories: true,
    showDates: true,
    showExcerpts: true,
    excerptLength: 30
  },

  // Theme configuration
  // Configure which themes are available and the default theme
  // Each theme needs a name (displayed in ThemeSelector) and path to CSS file
  // Path can be: 
  //   - Built-in (for consumers): 'statue-ssg/themes/blue.css'
  //   - Local (for development): './src/lib/themes/blue.css'
  theme: {
    // Default theme (required if multiple themes)
    default: 'Black & White',
    
    // Array of available themes
    // Using local paths since this is the library itself
    themes: [
      { name: 'Black & White', path: './src/lib/themes/black-white.css' },
      { name: 'Blue', path: './src/lib/themes/blue.css' },
      { name: 'Red', path: './src/lib/themes/red.css' },
      { name: 'Green', path: './src/lib/themes/green.css' },
      { name: 'Purple', path: './src/lib/themes/purple.css' },
      { name: 'Cyan', path: './src/lib/themes/cyan.css' },
      { name: 'Orange', path: './src/lib/themes/orange.css' },
      { name: 'Pink', path: './src/lib/themes/pink.css' },
      { name: 'Charcoal', path: './src/lib/themes/charcoal.css' }
    ]
  },

  // SEO and meta information
  seo: {
    defaultTitle: "Statue SSG - Static Site Generator",
    titleTemplate: "%s | Statue SSG",
    defaultDescription: "A simple static site generator for markdown content with SvelteKit",
    keywords: ["static site generator", "markdown", "sveltekit", "ssg"],
    ogImage: "/images/og-image.png",
    twitterCard: "summary_large_image"
  }
};

// Export configuration
export default siteConfig; 
