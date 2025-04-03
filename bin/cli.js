#!/usr/bin/env node

try {
  // Dist/cli.js dosyasını çağır
  import('../dist/cli.js').catch(err => {
    console.error('Statue SSG CLI çalıştırılırken hata oluştu:', err);
    process.exit(1);
  });
} catch (err) {
  console.error('Statue SSG CLI yüklenirken hata oluştu:', err);
  process.exit(1);
} 