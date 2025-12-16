// Safe config loader - provides fallback if /site.config.js is not available
// This prevents the app from crashing when config file can't be resolved

let _siteConfig = {
  search: {
    enabled: false,
    placeholder: 'Search...'
  }
};

try {
  // Dynamic import with top-level await
  const mod = await import('/site.config.js');
  _siteConfig = mod.siteConfig || mod.default || _siteConfig;
} catch {
  // Silently use fallback config
}

export const siteConfig = _siteConfig;
