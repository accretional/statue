import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import path from 'path';
import fs from 'fs';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
//TODO: move template variables to other file
// Load site config for template variable replacement
let siteConfig = {};
try {
  const configPath = path.resolve('./site.config.js');
  if (fs.existsSync(configPath)) {
    const configModule = await import(configPath);
    siteConfig = configModule.siteConfig || {};
  }
} catch (e) {
  console.warn('Could not load site.config.js:', e.message);
}

// Build variables map from site config
function getTemplateVariables() {
  const site = siteConfig.site || {};
  const contact = siteConfig.contact || {};
  const social = siteConfig.social || {};
  const legal = siteConfig.legal || {};

  return {
    'site.name': site.name || '',
    'site.description': site.description || '',
    'site.url': site.url || '',
    'site.author': site.author || '',
    'contact.email': contact.email || '',
    'contact.privacyEmail': contact.privacyEmail || '',
    'contact.supportEmail': contact.supportEmail || '',
    'contact.phone': contact.phone || '',
    'contact.address.street': contact.address?.street || '',
    'contact.address.city': contact.address?.city || '',
    'contact.address.state': contact.address?.state || '',
    'contact.address.zipCode': contact.address?.zipCode || '',
    'contact.address.country': contact.address?.country || '',
    'contact.address.full': contact.address
      ? `${contact.address.street || ''}, ${contact.address.city || ''}, ${contact.address.state || ''} ${contact.address.zipCode || ''}`.trim()
      : '',
    'social.twitter': social.twitter || '',
    'social.github': social.github || '',
    'social.linkedin': social.linkedin || '',
    'social.facebook': social.facebook || '',
    'social.instagram': social.instagram || '',
    'social.youtube': social.youtube || '',
    'social.discord': social.discord || '',
    'social.reddit': social.reddit || '',
    'legal.privacyPolicyLastUpdated': legal.privacyPolicyLastUpdated || '',
    'legal.termsLastUpdated': legal.termsLastUpdated || '',
    'legal.doNotSell.processingTime': legal.doNotSell?.processingTime || '',
    'date.now': new Date().toLocaleDateString('en-US'),
    'date.year': new Date().getFullYear().toString(),
    'date.month': new Date().toLocaleDateString('en-US', { month: 'long' }),
    'date.day': new Date().getDate().toString()
  };
}

// Replace {{variable}} with values
function replaceTemplateVars(text) {
  const vars = getTemplateVariables();
  return text.replace(/\{\{([^}]+)\}\}/g, (match, name) => {
    const key = name.trim();
    return Object.hasOwn(vars, key) ? vars[key] : match;
  });
}

// Remark plugin to process template variables before Svelte compilation
function remarkTemplateVars() {
  return (tree) => {
    visit(tree, 'text', (node) => {
      if (node.value?.includes('{{')) {
        node.value = replaceTemplateVars(node.value);
      }
    });
    visit(tree, 'link', (node) => {
      if (node.url?.includes('{{')) node.url = replaceTemplateVars(node.url);
      if (node.title?.includes('{{')) node.title = replaceTemplateVars(node.title);
    });
    visit(tree, 'html', (node) => {
      if (node.value?.includes('{{')) {
        node.value = replaceTemplateVars(node.value);
      }
    });
  };
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],

  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: ['.md'],
      remarkPlugins: [remarkGfm, remarkTemplateVars],
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
      entries: ['*'],
      handleHttpError: 'warn'
    }
  }
};

export default config; 