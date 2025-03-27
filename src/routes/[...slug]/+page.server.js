import { getContentByUrl } from '$lib/cms/content-processor';
import { getContentDirectories } from '$lib/cms/content-processor';

// Bu sayfanın önceden render edilip statik sayfa olmasını sağla
export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export function load({ params }) {
  // URL'nin başına slash ekle
  const url = `/${params.slug}`;
  
  // DEBUG: URL parametresini ve oluşturulan URL'yi konsola yaz
  console.log('Params slug:', params.slug);
  console.log('Generated URL:', url);
  
  // Sorunlu rotaları devre dışı bırak
  if (url.includes('/blog/[slug]') || url.includes('/docs/[slug]')) {
    throw new Error('Bu rot/a kullanılamaz');
  }
  
  // İçeriği bul
  const content = getContentByUrl(url);
  
  // DEBUG: Bulunan içeriği konsola yaz
  console.log('Found content:', content ? 'YES' : 'NO');
  if (content) {
    console.log('Content URL:', content.url);
    console.log('Content Directory:', content.directory);
  }
  
  // Navigasyon bağlantıları için content klasöründeki klasörleri al
  const directories = getContentDirectories();
  
  // Content bulunamadıysa
  if (!content) {
    // SvelteKit rotasına yönlendirme yapmasına izin ver
    // Eğer Svelte bileşeni varsa o gösterilecek, yoksa 404 döndürecek
    return { notFound: true, directories };
  }
  
  // İçeriği dön
  return {
    content,
    directories
  };
} 