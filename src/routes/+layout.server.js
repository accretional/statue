import { getContentDirectories, getContentByDirectory } from '$lib/cms/content-processor';

/** @type {import('./$types').LayoutServerLoad} */
export function load() {
  // Get content directories
  const directories = getContentDirectories();

  // Enhance directories with subpages data for consistent footer
  const enhancedDirectories = directories.map(directory => {
    // Get content from this directory
    const directoryContent = getContentByDirectory(directory.name);
    
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
  });
  
  return {
    globalDirectories: enhancedDirectories
  };
} 