// Site Configuration
// This file contains your site's general settings
// You can manage email addresses, social media links, and other contact information from here

export const siteConfig = {
  // Developer profile (main identity for portfolio)
  profile: {
    name: 'Fred Weitendorf',
    username: 'fredxfred',
    avatarUrl: "/avatar.jpg",
    bio: 'founder @accretional, formerly @Google and @Microsoft',
    followers: 17,
    following: 4,
    location: 'San Francisco',
    website: 'accretional.com',
    linkedin: "in/myname",
    company: 'accretional.com',
    email: '',
    status: {
      emoji: "🚀",
      message: "Building something new"
    }
  },

  // Portfolio features toggle
  features: {
    showExperience: false,
    showMacScreen: false
  },

  // Site general information
  site: {
    name: 'Fred Weitendorf',
    description: "Developer portfolio",
    url: "https://example.com",
    author: "My Name"
  },

  // Contact information
  contact: {
    // Main contact email
    email: '',
    
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
    twitter: '',
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
