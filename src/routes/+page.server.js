import { getContentDirectories, getContentByDirectory } from 'statue-ssg/cms/content-processor';

// Ensure this page is pre-rendered as a static page
export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export function load() {
  // Get content directories
  const directories = getContentDirectories();

   // Enhance directories with subpages data
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
  
  // Find content in the root directory
  const rootContent = getContentByDirectory('root');
  
  return {
    directories: enhancedDirectories,
    rootContent
  };
}