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