import { getContentByUrl } from '$lib/cms/content-processor';
import { getContentDirectories } from '$lib/cms/content-processor';

// Make this page prerendered as a static page
export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export function load({ params }) {
  // Add slash to the beginning of the URL
  const url = `/${params.slug}`;
  
  // DEBUG: Log URL parameter and generated URL to console
  console.log('Params slug:', params.slug);
  console.log('Generated URL:', url);
  
  // Disable problematic routes
  if (url.includes('/blog/[slug]') || url.includes('/docs/[slug]')) {
    throw new Error('This route is unavailable');
  }
  
  // Find content
  const content = getContentByUrl(url);
  
  // DEBUG: Log the found content to console
  console.log('Found content:', content ? 'YES' : 'NO');
  if (content) {
    console.log('Content URL:', content.url);
    console.log('Content Directory:', content.directory);
  }
  
  // Get folders in the content directory for navigation links
  const directories = getContentDirectories();
  
  // If content is not found
  if (!content) {
    // Allow SvelteKit to redirect to a route
    // If there's a Svelte component it will be shown, otherwise it will return 404
    return { notFound: true, directories };
  }
  
  // Return content
  return {
    content,
    directories
  };
} 