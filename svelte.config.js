import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Using vitePreprocess for preprocessor
  preprocess: vitePreprocess(),

  kit: {
    // Static site generator
    adapter: adapter({
      // Static site output folder
      pages: 'build',
      assets: 'build',
      fallback: 'index.html', // Using index.html instead of null for real static site
      precompress: false,
      strict: true
    }),
    
    // Defining custom alias to handle Content folder
    alias: {
      $content: path.resolve('./content'),
      $lib: path.resolve('./src/lib')
    },
    
    // Static site pre-processing options
    prerender: {
      crawl: true,
      entries: [
        '/', 
        '/statik',
        '/statik/hakkimizda',
        '/pages',
        '/pages/pricing',
        '/blog',
        '/docs',
        '/ornek'
      ],
      handleHttpError: 'warn'
    }
  }
};

export default config; 