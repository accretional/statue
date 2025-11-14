import { getContentDirectories } from '$lib/cms/content-processor';

// Ensure this page is pre-rendered as a static page
export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export function load() {
  const directories = getContentDirectories();
  
  return {
    directories
  };
}

