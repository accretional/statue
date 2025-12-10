import { getContentDirectories, getContentByDirectory, getSubDirectories } from '$lib/cms/content-processor';

// Make this page prerendered as a static page
export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export function load({ params }) {
  // Get directory name
  const directoryName = params.directory;

  // For blog/ or docs/ directories, show the top-level route,
  // but don't show sublevel "[slug]" routes
  if (directoryName === 'blog' || directoryName === 'docs') {
    // Continue to get content from this directory, but we'll filter subdirectories
  }

  // Get all directories
  const directories = getContentDirectories();

  // Get content from specific directory (including content from subdirectories)
  const directoryContent = getContentByDirectory(directoryName);

  // Find subdirectories of this directory
  const subDirectories = getSubDirectories(directoryName);

  // Get directory information
  const currentDirectory = directories.find(dir => dir.name === directoryName) || {
    name: directoryName,
    title: directoryName.charAt(0).toUpperCase() + directoryName.slice(1)
  };

  return {
    directories,
    directoryContent,
    subDirectories,
    currentDirectory
  };
}
