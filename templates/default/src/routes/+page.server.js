import { getContentDirectories, getContentByDirectory } from 'statue-ssg/cms/content-processor.js';

// Ensure this page is pre-rendered as a static page
export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  // Get content directories
  const directories = getContentDirectories();

  // Enhance directories with subpages data
  const enhancedDirectories = await Promise.all(
    directories.map(async (directory) => {
      // Get content from this directory
      const directoryContent = await getContentByDirectory(directory.name);

      // Extract pages as subpages
      const subpages = directoryContent.map((content) => ({
        title: content.metadata.title,
        url: content.url
      }));

      // Return enhanced directory object
      return {
        ...directory,
        subpages
      };
    })
  );

  // Find content in the root directory
  const rootContent = await getContentByDirectory('root');

  return {
    directories: enhancedDirectories,
    rootContent
  };
}
