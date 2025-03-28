import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

// Let's recreate the __dirname property for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [sveltekit()],
  
  // Define custom paths
  resolve: {
    alias: {
      '$content': path.resolve(__dirname, 'content'),
      '$components': path.resolve(__dirname, 'src/lib/components'),
      '$cms': path.resolve(__dirname, 'src/lib/cms')
    }
  },
  
  // Static resource folder
  publicDir: 'static',
  
  // Development server
  server: {
    port: 3000,
    open: true
  }
}); 