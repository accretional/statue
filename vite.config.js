import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

// __dirname özelliğini ESM için yeniden oluşturalım
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [sveltekit()],
  
  // Özel yollar tanımlama
  resolve: {
    alias: {
      '$content': path.resolve(__dirname, 'content'),
      '$components': path.resolve(__dirname, 'src/lib/components'),
      '$cms': path.resolve(__dirname, 'src/lib/cms')
    }
  },
  
  // Statik kaynak klasörü
  publicDir: 'static',
  
  // Geliştirme sunucusu
  server: {
    port: 3000,
    open: true
  }
}); 