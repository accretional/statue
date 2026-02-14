import { getContentByUrl, getContentDirectories, getSidebarTree, getPostsByTag } from 'statue-ssg/cms/content-processor';

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

  // Check if this is a tag page (e.g., /tags/javascript)
  if (params.slug.startsWith('tags/')) {
    const tagSlug = params.slug.replace('tags/', '').replace(/\/$/, ''); // Remove trailing slash

    try {
      // First try to find posts with the slug as-is (for single-word tags)
      let posts = await getPostsByTag(tagSlug);

      // If no posts found, try converting hyphenated slug back to spaced tag name
      if (posts.length === 0) {
        const tagWithSpaces = tagSlug.replace(/-/g, ' ');
        posts = await getPostsByTag(tagWithSpaces);
      }

      // If still no posts, try finding any tag that matches when both are slugified
      if (posts.length === 0) {
        const allTags = await import('statue-ssg/cms/content-processor').then(m => m.getAllTags());
        const matchingTag = (await allTags).find(tag =>
          tag.toLowerCase().replace(/\s+/g, '-') === tagSlug
        );
        if (matchingTag) {
          posts = await getPostsByTag(matchingTag);
        }
      }

      if (posts.length === 0) {
        throw new Error(`No posts found for tag "${tagSlug}"`);
      }

      // Use the original tag name for display (find it from the posts)
      const displayTagName = posts[0]?.metadata?.tags?.find(tag =>
        tag.toLowerCase().replace(/\s+/g, '-') === tagSlug
      ) || tagSlug;

      // Sort posts by date (newest first)
      const sortedPosts = posts.sort((a, b) => {
        const dateA = new Date(a.metadata.date || 0);
        const dateB = new Date(b.metadata.date || 0);
        return dateB - dateA;
      });

      return {
        isTagPage: true,
        tag: displayTagName,
        posts: sortedPosts,
        pageTitle: `Posts tagged "${displayTagName}"`,
        directories: getContentDirectories(),
        sidebarItems: [],
        layoutConfig: LAYOUT_CONFIG.default,
        layoutType: 'tag'
      };
    } catch (err) {
      console.error('Tag not found:', err);
      throw new Error(`Tag "${tagSlug}" not found`);
    }
  }

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
      layoutConfig: LAYOUT_CONFIG.default,
      isTagPage: false
    };
  }

  // Return content with layout configuration
  return {
    content,
    directories,
    sidebarItems,
    layoutConfig,
    layoutType,
    isTagPage: false
  };
}
