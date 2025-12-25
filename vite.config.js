import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

// Let's recreate __dirname property for ESM
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
  
  // Development server
  server: {
    port: 5173,
    open: true,
    hmr: {
      clientPort: 443,
      host: 'c2296dff1b2b.ngrok-free.app',
      protocol: 'wss'
    }
  }
}); 