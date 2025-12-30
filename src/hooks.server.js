import { getAllContent, getContentDirectories } from '$lib/cms/content-processor';
import { siteConfig } from '../site.config.js';
import { themes } from '$lib/themes/index.js';

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

  // Inject selected theme CSS variables at build time
  const selectedTheme = themes.find(t => t.id === siteConfig.theme?.selected) || themes[0];

  const response = await resolve(event, {
    transformPageChunk: ({ html }) => {
      // Inject theme CSS variables as inline style in <html> tag
      const themeStyles = Object.entries(selectedTheme.colors)
        .map(([key, value]) => `--color-${key}:${value}`)
        .join(';');

      return html.replace(
        '<html lang="en">',
        `<html lang="en" style="${themeStyles}">`
      );
    }
  });

  return response;
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