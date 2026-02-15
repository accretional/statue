import { getContentDirectories, getAllTags } from 'statue-ssg/cms/content-processor';
import { getTagRoutes } from '../../../scripts/get-tag-routes.js';

// Only prerender if tags exist in content
const hasTags = getTagRoutes().length > 0;
export const prerender = hasTags;

/** @type {import('./$types').PageServerLoad} */
export async function load() {
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
