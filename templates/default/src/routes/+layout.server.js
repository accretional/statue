import { getContentDirectories, getContentByDirectory, getRootLevelContent } from 'statue-ssg/cms/content-processor';
import siteConfig from '../../site.config.json';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
  // Get content directories
  const directories = getContentDirectories();

  // Get root-level content files
  const rootContent = getRootLevelContent();

  // Enhance directories with subpages data for consistent footer
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

  return {
    globalDirectories: enhancedDirectories,
    rootContent,
    searchConfig: siteConfig.search || null,
    navbarConfig: siteConfig.navbar || null,
    rssEnabled: siteConfig.rss?.enabled ?? false,
    siteUrl: siteConfig.site?.url || ''
  };
}
