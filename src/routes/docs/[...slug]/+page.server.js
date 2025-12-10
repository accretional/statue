import { getContentByUrl, getContentDirectories, getSidebarTree } from '$lib/cms/content-processor';

// Make this page pre-rendered as a static page
export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export function load({ params }) {
  // Build the full URL: /docs/[slug]
  const url = `/docs/${params.slug}`;

  console.log('Docs slug params:', params.slug);
  console.log('Docs generated URL:', url);

  // Find content
  const content = getContentByUrl(url);

  // Get folders in content directory for navigation links
  const directories = getContentDirectories();

  // Get sidebar tree for docs
  const sidebarItems = getSidebarTree('docs');

  // If content is not found
  if (!content) {
    return { notFound: true, directories, sidebarItems };
  }

  // Return content
  return {
    content,
    directories,
    sidebarItems
  };
}
