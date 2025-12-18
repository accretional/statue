import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit(), devtoolsJson()],
  server: {
      fs: {
        allow: [
          // Default allowed directories
          '.',
          // content folder
          'content'
        ]
      }
    }},
);
