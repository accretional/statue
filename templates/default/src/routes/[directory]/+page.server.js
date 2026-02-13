import { getContentDirectories, getContentByDirectory, getSubDirectories, getSidebarTree, getContentByUrl, detectNamingConflicts, clearContentCache } from 'statue-ssg/cms/content-processor';
import { error } from '@sveltejs/kit';

// Make this page prerendered as a static page
export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  // Clear cache to ensure fresh conflict detection
  clearContentCache();

  // Get directory name
  const directoryName = params.directory;

  // Get all directories
  const directories = getContentDirectories();

  // Check for naming conflicts
  const conflicts = await detectNamingConflicts();
  const hasConflict = conflicts.find(c => c.name === directoryName);

  // If this directory has a naming conflict, show error page
  if (hasConflict) {
    return {
      hasNamingConflict: true,
      conflictData: hasConflict,
      directories
    };
  }

  // Check if this is an actual directory
  const isActualDirectory = directories.some(dir => dir.name === directoryName);

  if (isActualDirectory) {
    // This IS a real directory - render directory listing
    // Continue to directory handling below...
  } else {
    // NOT a directory - check if it's a root-level content file
    const content = await getContentByUrl(`/${directoryName}`);

    if (content) {
      console.log(`📄 Rendering content file: ${content.path}`);

      const sidebarItems = content.directory?.startsWith('docs') ? await getSidebarTree('docs') : [];
      return {
        content,
        directories,
        sidebarItems
      };
    }
  }

  // Get content from specific directory (including content from subdirectories)
  const directoryContent = await getContentByDirectory(directoryName);

  // Find subdirectories of this directory
  const subDirectories = await getSubDirectories(directoryName);

  // Get directory information
  const currentDirectory = directories.find(dir => dir.name === directoryName) || {
    name: directoryName,
    title: directoryName.charAt(0).toUpperCase() + directoryName.slice(1)
  };

  // Get sidebar tree for docs directory
  const sidebarItems = directoryName === 'docs' ? await getSidebarTree(directoryName) : [];

  return {
    directories,
    directoryContent,
    subDirectories,
    currentDirectory,
    sidebarItems
  };
}
