export default {
  site: 'build',
  glob: '**/*.{html}',
  // Exclude common non-content sections from indexing
  exclude_selectors: [
    'header',
    'footer',
    'nav',
    '.no-search'
  ],
  force_language: 'en',
  verbose: false
};
