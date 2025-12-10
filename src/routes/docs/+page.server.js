import { getContentDirectories, getContentByDirectory, getSubDirectories, getSidebarTree } from '$lib/cms/content-processor';

// Make this page prerendered as a static page
export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export function load() {
  const directoryName = 'docs';

  // Get all directories for navbar
  const directories = getContentDirectories();

  // Get content from docs directory (including subdirectories)
  const directoryContent = getContentByDirectory(directoryName);

  // Find subdirectories of docs
  const subDirectories = getSubDirectories(directoryName);

  // Get directory information
  const currentDirectory = directories.find(dir => dir.name === directoryName) || {
    name: directoryName,
    title: 'Docs'
  };

  // Get sidebar tree for docs
  const sidebarItems = getSidebarTree(directoryName);

  return {
    directories,
    directoryContent,
    subDirectories,
    currentDirectory,
    sidebarItems
  };
}
