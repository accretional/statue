import { getAllContent, getContentDirectories } from '$lib/cms/content-processor';
import { generateThemeScript } from '$lib/themes/generator.js';
import { siteConfig } from '../site.config.js';

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

  // Normal route processing with conditional theme script injection
  const response = await resolve(event, {
    transformPageChunk: ({ html }) => {
      // Only inject theme script if theme switching is enabled
      if (siteConfig.theme?.enableSwitcher) {
        return html.replace(
          '%sveltekit.head%',
          `%sveltekit.head%\n\t\t${generateThemeScript()}`
        );
      }
      return html;
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