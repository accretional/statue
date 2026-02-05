import { getContentDirectories, getContentByDirectory, getSubDirectories, getSidebarTree, getAllTags } from 'statue-ssg/cms/content-processor';
import siteConfig from '../../../site.config.json';

// Make this page prerendered as a static page
export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  // Get directory name
  const directoryName = params.directory;

  // Special handling for tags directory
  if (directoryName === 'tags') {
    // Check if tags are enabled
    const tagsEnabled = siteConfig.blog?.blogTag?.enabled ?? false;
    if (!tagsEnabled) {
      // Return 404 if tags are disabled
      return {
        notFound: true,
        directories: getContentDirectories(),
        currentDirectory: { name: 'tags', title: 'Tags' },
        isTagsDirectory: false,
        directoryContent: [],
        subDirectories: [],
        sidebarItems: []
      };
    }

    const tags = await getAllTags();
    return {
      directories: getContentDirectories(),
      currentDirectory: {
        name: 'tags',
        title: 'All Tags',
        url: '/tags'
      },
      tags,
      isTagsDirectory: true,
      directoryContent: [],
      subDirectories: [],
      sidebarItems: []
    };
  }

  // Get all directories
  const directories = getContentDirectories();

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
    sidebarItems,
    isTagsDirectory: false
  };
}
