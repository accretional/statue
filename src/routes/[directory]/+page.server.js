import { getContentDirectories, getContentByDirectory, getSubDirectories } from '$lib/cms/content-processor';

// Bu sayfanın önceden render edilip statik sayfa olmasını sağla
export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export function load({ params }) {
  // Dizin adını al
  const directoryName = params.directory;
  
  // blog/ veya docs/ dizinleri için en üst düzey rotayı göster,
  // ama alt seviye "[slug]" rotalarını gösterme
  if (directoryName === 'blog' || directoryName === 'docs') {
    // Bu dizindeki içeriği almaya devam et, ama alt dizinleri filtreleyeceğiz
  }
  
  // Tüm dizinleri al
  const directories = getContentDirectories();
  
  // Belirli dizindeki içeriği al (alt dizinlerdeki içerikler dahil)
  const directoryContent = getContentByDirectory(directoryName);
  
  // Bu dizinin alt dizinlerini bul
  const subDirectories = getSubDirectories(directoryName);
  
  // Dizin bilgilerini al
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