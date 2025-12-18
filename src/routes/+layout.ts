export const prerender = true;
export const ssr = true;
export const trailingSlash = 'always';

import { getContentByDirectory, getContentDirectories } from "$lib/cms/content-processor";

export function load() {
  // Get content directories
  const directories = getContentDirectories();

  // add subpages data for consistent footer
  const enhancedDirectories = directories.map(directory => {

    const directoryContent = getContentByDirectory(directory.name);
    const subpages = directoryContent.map((content) => ({
      title: content.metadata.title,
      url: content.url
    }));

    return {
      ...directory,
      subpages
    };
  });

  return {
    globalDirectories: enhancedDirectories
  };

}
