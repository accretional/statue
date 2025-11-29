import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

// Let's recreate __dirname property for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [sveltekit()],
    
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    
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
      port: 3000,
      open: true
    }
  };
}); 