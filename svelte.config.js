import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import path from 'path';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { getTagRoutes } from './scripts/get-tag-routes.js';

// Get dynamic tag routes
const tagRoutes = getTagRoutes();

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.mdx'],

  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: ['.mdx'],
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug]
    })
  ],

  kit: {
    // Static site generator
    adapter: adapter({
      // Static site output folder
      pages: 'build',
      assets: 'build',
      fallback: 'index.html', // Using index.html instead of null for a real static site
      precompress: false,
      strict: true
    }),

    // Custom alias defined to handle the content folder
    alias: {
      $content: path.resolve('./content'),
      $lib: path.resolve('./src/lib')
    },

    // Static site pre-processing options
    prerender: {
      crawl: true,
      entries: ['*',
        ...tagRoutes
      ],
      handleHttpError: 'warn'
    }
  }
};

export default config;