// Component prop types for remote management
// These interfaces can be serialized

export interface BlogCardProps {
  title: string;
  description?: string;
  date?: string;
  author?: string;
  authorAvatar?: string;
  thumbnail?: string;
  url: string;
  enableScrollAnimation?: boolean;
  nextHasThumbnail?: boolean;
  isLast?: boolean;
}

export interface AuthorAvatarProps {
  author: string;
  avatar?: string;
  size?: number;
}

export interface BlogGridProps {
  posts?: Array<{
    metadata?: {
      title?: string;
      description?: string;
      date?: string;
      author?: string;
      authorAvatar?: string;
      thumbnail?: string;
    };
    url: string;
  }>;
  emptyMessage?: string;
}

export interface BlogHeaderProps {
  title: string;
  description?: string;
}

export interface BlogLayoutProps {
  title?: string;
  posts?: Array<any>;
}

export interface BlogPostHeaderProps {
  title: string;
  description?: string;
  date?: string | Date;
  author?: string;
  authorAvatar?: string;
  thumbnail?: string;
  backLink?: string;
  backLinkText?: string;
  tags?: string[];
  readingTime?: number;
}

export interface BlogPostContentProps {
  html?: string;
  content?: string;
}

export interface BlogPostLayoutProps {
  title?: string;
  description?: string;
  date?: string;
  author?: string;
  authorAvatar?: string;
  thumbnail?: string;
  content?: string;
  backLink?: string;
  backLinkText?: string;
}

export interface HeroProps {
  badgeText?: string;
  titleLine1?: string;
  titleLine2?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

export interface CTAProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

export interface CategoriesProps {
  directories?: Array<{
    title: string;
    url: string;
  }>;
  title?: string;
  viewContentText?: string;
}

export interface StatsProps {
  stats?: Array<{
    title: string;
    description: string;
    color?: string;
  }>;
}

export interface FooterProps {
  siteName?: string;
  description?: string;
  links?: Array<{
    title: string;
    items: Array<{
      label: string;
      url: string;
    }>;
  }>;
}

export interface NavigationBarProps {
  logo?: string;
  siteName: string;
  items: Array<{
    label: string;
    url: string;
    items?: Array<{
      label: string;
      url: string;
    }>;
  }>;
}

export interface SearchProps {
  placeholder?: string;
  searchEndpoint?: string;
  debounceMs?: number;
  minQueryLength?: number;
  maxResults?: number;
  showCategories?: boolean;
  showDates?: boolean;
  showExcerpts?: boolean;
  containerClass?: string;
  inputClass?: string;
  resultsClass?: string;
}

export interface SignupProps {
  nameLabel?: string;
  namePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  buttonText?: string;
  privacyText?: string;
  containerClass?: string;
  wrapperClass?: string;
  onSubmit?: (data: { name: string; email: string }) => Promise<void>;
}

export interface AccordionMenuProps {
  items: Array<{
    title: string;
    content: string;
    open?: boolean;
  }>;
}

export interface TableOfContentsProps {
  headings: Array<{
    id: string;
    text: string;
    level: number;
  }>;
}

export interface WarningProps {
  title?: string;
  message: string;
  type?: 'warning' | 'error' | 'info' | 'success';
}

export interface NotificationBannerProps {
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  dismissible?: boolean;
}

export interface ContentHeaderProps {
  title?: string;
  date?: string | null;
  author?: string | null;
  backLink?: string;
  backLinkText?: string;
}

export interface ContentBodyProps {
  content?: string;
}

export interface DocsLayoutProps {
  sidebarItems?: Array<{
    title: string;
    url?: string;
    children?: Array<{
      title: string;
      url?: string;
      children?: Array<{
        title: string;
        url: string;
      }>;
    }>;
  }>;
  headings?: Array<{
    id: string;
    text: string;
    level: number;
  }>;
  activePath?: string;
  sidebarTitle?: string;
  showSearch?: boolean;
  showToc?: boolean;
}

export interface DocsSidebarProps {
  items?: Array<{
    title: string;
    url?: string;
    children?: Array<{
      title: string;
      url?: string;
      children?: Array<{
        title: string;
        url: string;
      }>;
    }>;
  }>;
  activePath?: string;
  title?: string;
  showSearch?: boolean;
}

export interface DocsContentProps {
  html: string;
  content?: string;
  title?: string;
  description?: string;
  lastUpdated?: string;
  editUrl?: string;
  headings?: Array<{
    id: string;
    text: string;
    level: number;
  }>;
}

export interface DocsDirectoryListProps {
  title?: string;
  description?: string;
  content?: Array<{
    url: string;
    metadata?: {
      title?: string;
      description?: string;
      icon?: string;
      order?: number;
    };
    title?: string;
    slug?: string;
  }>;
  subDirectories?: Array<{
    name: string;
    url: string;
    description?: string;
  }>;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
}

export interface DirectoryHeaderProps {
  title?: string;
}

export interface DirectoryContentProps {
  content?: Array<{
    url: string;
    metadata?: {
      title?: string;
      description?: string;
      date?: string;
    };
    directory?: string;
  }>;
  showDirectory?: boolean;
  emptyMessage?: string;
}

export interface SubDirectoriesProps {
  directories: Array<{
    name: string;
    url: string;
    title: string;
    description?: string;
  }>;
  title?: string;
}

export interface LatestContentProps {
  rootContent?: Array<{
    url: string;
    metadata?: {
      title?: string;
      description?: string;
    };
  }>;
  title?: string;
  readMoreText?: string;
}

export interface CollapsibleTreeProps {
  items: Array<{
    id: string;
    label: string;
    name?: string;
    badge?: string;
    children?: Array<any>;
    url?: string;
  }>;
  title?: string;
}

export interface MissionProps {
  title?: string;
  paragraph1?: string;
  paragraph2?: string;
}

export interface WhyChooseUsProps {
  title?: string;
  features?: Array<{
    title: string;
    description: string;
  }>;
}

export interface ScrollingLogosProps {
  logos: Array<{
    src: string;
    alt: string;
    url?: string;
  }>;
  speed?: number;
}

export interface SlidingComparisonProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export interface SlidingTestimonialProps {
  testimonials: Array<{
    text: string;
    author: string;
    role?: string;
    avatar?: string;
    rating?: number;
  }>;
  autoplay?: boolean;
  interval?: number;
}

export interface BuiltByProps {
  builtByText?: string;
  builtByLinkText?: string;
  builtByLinkUrl?: string;
  builtByIcon?: string;
  builtInText?: string;
  builtInLinkText?: string;
  builtInLinkUrl?: string;
  builtInIcon?: string;
  builtForText?: string;
  communityLinkText?: string;
  communityLinkUrl?: string;
}

export interface CopyCommandProps {
  command: string;
  language?: string;
  maxWidth?: string;
  copiedText?: string;
  copiedDuration?: number;
  wrapperClass?: string;
  commandClass?: string;
}

export interface GitHubStatsProps {
  githubRepo?: string;
  repo?: string;
  showStars?: boolean;
  showForks?: boolean;
  showIssues?: boolean;
  title?: string;
  description?: string;
  contributions?: Array<{
    title: string;
    description: string;
  }>;
  ctaButtons?: Array<{
    text: string;
    href: string;
    primary?: boolean;
    target?: string;
    rel?: string;
  }>;
  customStats?: Array<{
    value: string;
    label: string;
  }>;
  showGitHubStats?: boolean;
  sectionClass?: string;
  containerClass?: string;
}

export interface ImageCarouselProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  autoplay?: boolean;
  interval?: number;
}

export interface PageHeroProps {
  title: string;
  description?: string;
  backgroundImage?: string;
}

export interface PdfViewerProps {
  src: string;
  height?: string;
  width?: string;
  showToolbar?: boolean;
  showDownload?: boolean;
  showFullscreen?: boolean;
}

export interface PricingSectionProps {
  plans: Array<{
    name: string;
    price: string | number;
    currency?: string;
    period?: string;
    features: string[];
    featured?: boolean;
    ctaText?: string;
    ctaUrl?: string;
  }>;
  title?: string;
}

export interface SitemapProps {
  directories?: Array<{
    name: string;
    path: string;
    title: string;
    url: string;
    subpages?: Array<{
      title: string;
      url: string;
    }>;
  }>;
  currentPath?: string;
}

export interface SwaggerUIProps {
  url?: string;
}

export interface TeamProps {
  title?: string;
  teamMembers?: Array<{
    name: string;
    role: string;
    initials?: string;
  }>;
}
