import { getContentDirectories, getContentByDirectory, getSubDirectories, getSidebarTree } from 'statue-ssg/cms/content-processor';
import { siteConfig } from '../../../site.config.js';

// Make this page prerendered as a static page
export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export function load({ params }) {
  // Get directory name
  const directoryName = params.directory;

  // Get all directories
  const directories = getContentDirectories();

  // Get content from specific directory (including content from subdirectories)
  const directoryContent = getContentByDirectory(directoryName);

  // Apply default author info from site config
  if (directoryContent) {
    directoryContent.forEach(content => {
      if (content.metadata) {
        if (siteConfig.profile?.name) {
          content.metadata.author = siteConfig.profile?.name || siteConfig.site?.author;
        }
        if (siteConfig.profile?.avatarUrl) {
          content.metadata.authorAvatar = siteConfig.profile?.avatarUrl || siteConfig.blog?.defaultAuthorAvatar || '/avatar.jpg';
        }
      }
    });
  }

  // Find subdirectories of this directory
  const subDirectories = getSubDirectories(directoryName);

  // Get directory information
  const currentDirectory = directories.find(dir => dir.name === directoryName) || {
    name: directoryName,
    title: directoryName.charAt(0).toUpperCase() + directoryName.slice(1)
  };

  // Get sidebar tree for docs directory
  const sidebarItems = directoryName === 'docs' ? getSidebarTree(directoryName) : [];

  return {
    directories,
    directoryContent,
    subDirectories,
    currentDirectory,
    sidebarItems
  };
}
