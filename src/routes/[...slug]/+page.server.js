import { getContentByUrl } from '$lib/cms/content-processor';
import { getContentDirectories } from '$lib/cms/content-processor';

// Bu sayfanın önceden render edilip statik sayfa olmasını sağla
export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export function load({ params }) {
  // URL'nin başına slash ekle
  const url = `/${params.slug}`;
  
  // Sorunlu rotaları devre dışı bırak
  if (url.includes('/blog/[slug]') || url.includes('/docs/[slug]')) {
    throw new Error('Bu rot/a kullanılamaz');
  }
  
  // İçeriği bul
  const content = getContentByUrl(url);
  
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