import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Preprocessor için vitePreprocess kullanıyoruz
  preprocess: vitePreprocess(),

  kit: {
    // Statik site üreteci
    adapter: adapter({
      // Statik site çıktı klasörü
      pages: 'build',
      assets: 'build',
      fallback: null, // Gerçek statik site için null
      precompress: false,
      strict: true
    }),
    
    // Content klasörünü handle etmek için özel alias tanımlıyoruz
    alias: {
      $content: path.resolve('./content'),
      $lib: path.resolve('./src/lib')
    },
    
    // Statik site ön-işleme seçenekleri
    prerender: {
      crawl: true,
      entries: [
        '/', 
        '/statik',
        '/statik/hakkimizda',
        '/blog',
        '/docs',
        '/ornek'
      ],
      handleHttpError: 'warn'
    }
  }
};

export default config; 