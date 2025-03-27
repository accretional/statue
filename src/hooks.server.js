import { getAllContent, getContentDirectories } from '$lib/cms/content-processor';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // İçerik yollarını statik site üretimi için topla
  if (event.url.pathname === '/api/content-paths') {
    // Content klasöründeki tüm içeriği tara
    const allContent = getAllContent();
    const directories = getContentDirectories();
    
    // Tüm içerik URL'lerini ve dizin URL'lerini birleştir
    let contentPaths = allContent.map(content => content.url);
    const directoryPaths = directories.map(dir => dir.url);
    
    // Sorunlu URL'leri filtrele ([slug] içerenleri kaldır)
    contentPaths = contentPaths.filter(path => !path.includes('[slug]'));
    
    // Tüm olası yolları içeren bir liste oluştur
    const allPaths = [
      ...contentPaths,
      ...directoryPaths,
      '/' // Ana sayfa
    ];
    
    return new Response(JSON.stringify(allPaths), {
      headers: {
        'content-type': 'application/json'
      }
    });
  }
  
  // Normal rota işleme
  return await resolve(event);
}

/** @type {import('@sveltejs/kit').HandleServerError} */
export function handleError({ error }) {
  console.error('Sunucu hatası oluştu:', error);

  return {
    message: 'Sunucu hatası oluştu, detaylar için loglara bakın'
  };
}

// Tüm statik olarak oluşturulacak sayfaların bir listesini oluştur
/** @type {import('@sveltejs/kit').PrerenderExtendEntries} */
export async function entries() {
  const allContent = getAllContent();
  
  // Sorunlu URL'leri filtrele
  const contentPaths = allContent
    .map(content => content.url)
    .filter(url => !url.includes('[slug]'));
  
  // Content URL'lerini döndür
  return contentPaths;
} 