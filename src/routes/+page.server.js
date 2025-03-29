import { getContentDirectories, getContentByDirectory } from '$lib/cms/content-processor';

// Ensure this page is pre-rendered as a static page
export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export function load() {
  // Get content directories
  const directories = getContentDirectories();
  
  // Find content in the root directory
  const rootContent = getContentByDirectory('root');
  
  return {
    directories,
    rootContent
  };
}