import { getContentByUrl, getContentDirectories, getSidebarTree } from 'statue-ssg/cms/content-processor.js';

// Make this page pre-rendered as a static page
export const prerender = true;

// Layout component mapping - maps metadata layout names to components
const LAYOUT_CONFIG = {
	docs: {
		component: 'DocsLayout',
		props: { sidebarTitle: 'Docs' }
	},
	blog: {
		component: 'BlogPostLayout',
		props: {}
	},
	default: {
		component: 'DefaultLayout',
		props: {}
	}
};

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  // Add slash to the beginning of the URL
  const url = `/${params.slug}`;

  // DEBUG: Log URL parameter and generated URL to console
  console.log('Params slug:', params.slug);
  console.log('Generated URL:', url);

  // Disable problematic routes
  if (url.includes('/blog/[slug]') || url.includes('/docs/[slug]')) {
    throw new Error('This route cannot be used');
  }

  // Find content (using mdsvex processor)
  const content = await getContentByUrl(url);

  // DEBUG: Log found content to console
  console.log('Found content:', content ? 'YES' : 'NO');
  if (content) {
    console.log('Content URL:', content.url);
    console.log('Content Directory:', content.directory);
  }

  // Get folders in content directory for navigation links
  const directories = getContentDirectories();

  // Infer layout type from metadata first, fallback to directory structure
  function inferLayoutType(metadata, directory) {
    // Check metadata for layout override
    if (metadata?.layout) {
      return metadata.layout;
    }

    // Fallback to directory convention
    if (!directory) return 'default';
    if (directory.startsWith('docs')) return 'docs';
    if (directory.startsWith('blog')) return 'blog';
    return 'default';
  }

  const layoutType = content ? inferLayoutType(content.metadata, content.directory) : 'default';
  const layoutConfig = LAYOUT_CONFIG[layoutType] || LAYOUT_CONFIG.default;

  // Get sidebar items for docs-style layouts
  const sidebarItems = layoutType === 'docs' ? await getSidebarTree('docs') : [];

  // If content is not found
  if (!content) {
    // Allow SvelteKit to handle routing
    // If a Svelte component exists, it will be shown, otherwise it will return 404
    return {
      notFound: true,
      directories,
      sidebarItems,
      layoutConfig: LAYOUT_CONFIG.default
    };
  }

  // Return content with layout configuration
  return {
    content,
    directories,
    sidebarItems,
    layoutConfig,
    layoutType
  };
}
