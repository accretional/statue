// İstemci tarafında çalışacak dosya - navigasyon için
// Tüm veri işleme işlemleri +page.server.js dosyasında yapılacak

/** @type {import('./$types').PageLoad} */
export function load({ data }) {
  // Server tarafından yüklenen verileri doğrudan geçir
  return data;
} 