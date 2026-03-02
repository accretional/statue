import { getContentDirectories, getPostsByTag, getAllTags } from 'statue-ssg/cms/content-processor.js';
import { getTagRoutes } from '../../../../scripts/get-tag-routes.js';

// Only prerender if tags exist in content
const hasTags = getTagRoutes().length > 0;
export const prerender = hasTags;

// Only prerender tag pages that actually exist
export const entries = async () => {
  const tags = await getAllTags();
  // Return tag slugs as entries, or empty array if no tags
  return tags.map(tag => ({ tag: tag.toLowerCase().replace(/\s+/g, '-') }));
};

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const tagSlug = params.tag;

  try {
    let posts = await getPostsByTag(tagSlug);

    if (posts.length === 0) {
      const tagWithSpaces = tagSlug.replace(/-/g, ' ');
      posts = await getPostsByTag(tagWithSpaces);
    }

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

    const displayTagName = posts[0]?.metadata?.tags?.find(tag =>
      tag.toLowerCase().replace(/\s+/g, '-') === tagSlug
    ) || tagSlug;

    const sortedPosts = posts.sort((a, b) => {
      const dateA = new Date(a.metadata.date || 0);
      const dateB = new Date(b.metadata.date || 0);
      return dateB - dateA;
    });

    return {
      tag: displayTagName,
      posts: sortedPosts,
      pageTitle: `Posts tagged "${displayTagName}"`,
      directories: getContentDirectories()
    };
  } catch (err) {
    console.error('Tag not found:', err);
    throw new Error(`Tag "${tagSlug}" not found`);
  }
}