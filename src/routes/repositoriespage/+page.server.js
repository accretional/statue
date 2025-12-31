import { siteConfig } from '../../../site.config.js';
import fs from 'fs';
import path from 'path';

// Prerender disabled for development (enable for production builds)
// export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export function load({ depends, url }) {
  console.log('[repositoriespage/+page.server.js] load() called, url:', url.pathname);

  // Mark dependency for cache invalidation
  depends('data:repositories');

  // Load repositories from JSON file (fresh read each time)
  let repositories = [];
  try {
    const reposPath = path.resolve('static/repositories.json');
    console.log('[repositoriespage/+page.server.js] reposPath:', reposPath);
    console.log('[repositoriespage/+page.server.js] file exists:', fs.existsSync(reposPath));

    if (fs.existsSync(reposPath)) {
      // Clear require cache to get fresh data in dev
      const data = fs.readFileSync(reposPath, 'utf-8');
      repositories = JSON.parse(data);
      console.log('[repositoriespage/+page.server.js] loaded repos count:', repositories.length);
    }
  } catch (e) {
    console.warn('Could not load repositories.json:', e);
  }

  console.log('[repositoriespage/+page.server.js] returning repositories:', repositories.length);

  return {
    profile: siteConfig.profile,
    site: siteConfig.site,
    repositories
  };
}
