import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// __dirname özelliğini ESM için yeniden oluşturalım
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build klasörünün tam yolu
const buildDir = path.resolve(__dirname, 'build');

export default defineConfig({
  // Kök dizini build'e ayarla, build klasörü içindeki dosyalar sunulacak
  root: buildDir,
  
  // Base URL'i / olarak ayarla
  base: '/',
  
  // Preview modu (npm run preview için)
  preview: {
    port: 4173,
    open: true,
    strictPort: false
  },
  
  // Vite sunucusu (npm run dev için)
  server: {
    port: 3000,
    open: true,
    strictPort: false
  },
  
  // Build seçenekleri (bu durumda build zaten var olduğundan boş bırakılabilir)
  build: {
    outDir: '.',  // Root zaten build olduğundan, outDir'i . olarak ayarlayabiliriz
    emptyOutDir: false
  }
}); 