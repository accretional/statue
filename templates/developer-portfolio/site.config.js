// Site Configuration
// This file contains your site's general settings
// Run `./scripts/github-sync.sh your-username` to auto-populate from GitHub

export const siteConfig = {
  // Developer profile (main identity for portfolio)
  profile: {
    name: 'Your Name',
    username: 'your-github-username',
    avatarUrl: "/avatar.jpg",
    bio: 'Software Developer',
    followers: 0,
    following: 0,
    location: 'Your City',
    website: '',
    linkedin: "",
    company: '',
    email: ''
  },

  // Default avatar for blog posts (uses GitHub avatar by default)
  // This path is also used when authorAvatar is not specified in blog post frontmatter
  // Note: Avatar file is located at static/avatar.jpg (synced from GitHub by github-sync.sh)
  blog: {
    defaultAuthorAvatar: "/avatar.jpg"
  },

  // Portfolio features toggle
  features: {
    showExperience: false,
    showMacScreen: false
  },

  // Site general information
  site: {
    name: 'My Portfolio',
    description: "Developer portfolio",
    url: "https://example.com",
    author: "Your Name"
  },

  // Navigation bar configuration
  navbar: {
    // Site title displayed in the navbar (null to hide)
    siteTitle: "My Portfolio",

    // Logo image URL (null for default SVG icon)
    logo: null,

    // Default navigation items (add cta: true for CTA button style)
    defaultNavItems: [
      { title: 'Home', url: '/' },
      { title: 'About', url: '/about' }
    ]
  },

  // Contact information
  contact: {
    // Main contact email
    email: '',

    // Privacy policy related email
    privacyEmail: "privacy@example.com",

    // Support email
    supportEmail: "support@example.com",

    // Phone number (optional)
    phone: "",

    // Mailing address
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: ""
    }
  },

  // Social media links
  social: {
    twitter: '',
    github: "",
    linkedin: "",
    facebook: "",
    instagram: "",
    youtube: "",
    // Social links imported from GitHub profile (populated by github-sync.sh)
    // Each item has: { provider: "linkedin" | "generic" | etc., url: "https://..." }
    socialLinks: []
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
    defaultTitle: "Developer Portfolio",
    titleTemplate: "%s | Portfolio",
    defaultDescription: "My developer portfolio",
    keywords: ["developer", "portfolio", "software engineer"],
    ogImage: "/images/og-image.png",
    twitterCard: "summary_large_image"
  }
};

// Export configuration
export default siteConfig;
