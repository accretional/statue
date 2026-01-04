import { getAllContent, getContentDirectories } from '$lib/cms/content-processor';
import { siteConfig } from '../site.config.js';

/**
 * Convert theme name to kebab-case ID (must match vite-plugin logic)
 */
function toKebabCase(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')        // Collapse multiple dashes
    .replace(/^-|-$/g, '');     // Trim leading/trailing dashes
}

/**
 * Get the default theme ID from site config
 */
function getDefaultThemeId() {
  const themeConfig = siteConfig?.theme;
  if (!themeConfig?.themes?.length) return 'default';

  const defaultName = themeConfig.default || themeConfig.themes[0]?.name || 'default';
  return toKebabCase(defaultName);
}

const DEFAULT_THEME_ID = getDefaultThemeId();
const THEME_STORAGE_KEY = 'statue-theme';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // Collect content paths for static site generation
  if (event.url.pathname === '/api/content-paths') {
    // Scan all content in the Content folder
    const allContent = getAllContent();
    const directories = getContentDirectories();
    
    // Combine all content URLs and directory URLs
    let contentPaths = allContent.map(content => content.url);
    const directoryPaths = directories.map(dir => dir.url);
    
    // Filter problematic URLs (remove those containing [slug])
    contentPaths = contentPaths.filter(path => !path.includes('[slug]'));
    
    // Create a list of all possible paths
    const allPaths = [
      ...contentPaths,
      ...directoryPaths,
      '/' // Home page
    ];
    
    return new Response(JSON.stringify(allPaths), {
      headers: {
        'content-type': 'application/json'
      }
    });
  }
  
  // Normal route processing - inject theme script to prevent FOUC
  return await resolve(event, {
    transformPageChunk: ({ html }) => {
      // Inject inline script that sets data-theme before any rendering
      // This runs synchronously before CSS loads, preventing flash of wrong theme
      // We also sanitize the stored value to match our kebab-case logic (collapsing dashes)
      const themeScript = `<script>(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t){t=t.toLowerCase().replace(/\\s+/g,'-').replace(/[^a-z0-9-]/g,'').replace(/-+/g,'-').replace(/^-|-$/g,'');}document.documentElement.dataset.theme=t||'${DEFAULT_THEME_ID}';}catch(e){document.documentElement.dataset.theme='${DEFAULT_THEME_ID}';}})()</script>`;

      // Insert right after <head> opening tag for earliest possible execution
      return html.replace('<head>', '<head>' + themeScript);
    }
  });
}

/** @type {import('@sveltejs/kit').HandleServerError} */
export function handleError({ error }) {
  console.error('Server error occurred:', error);

  return {
    message: 'Server error occurred, see logs for details'
  };
}

// Create a list of all pages to be statically generated
/** @type {import('@sveltejs/kit').PrerenderExtendEntries} */
export async function entries() {
  const allContent = getAllContent();
  
  // Filter problematic URLs
  const contentPaths = allContent
    .map(content => content.url)
    .filter(url => !url.includes('[slug]'));
  
  // Return content URLs
  return contentPaths;
} 