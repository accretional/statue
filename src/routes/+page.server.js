import { getContentDirectories, getContentByDirectory } from '$lib/cms/content-processor';

// Bu sayfanın önceden render edilip statik sayfa olmasını sağla
export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export function load() {
  // İçerik dizinlerini al
  const directories = getContentDirectories();
  
  // Ana dizindeki içerikleri bul (root klasöründekiler)
  const rootContent = getContentByDirectory('root');
  
  return {
    directories,
    rootContent
  };
}