import siteConfig from '../../../site.config.json';
import fs from 'fs';
import path from 'path';

// Prerender for production builds
export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export function load({ depends }) {
  // Mark dependency for cache invalidation
  depends('data:repositories');

  // Load repositories from JSON file (fresh read each time)
  let repositories = [];
  try {
    const reposPath = path.resolve('static/repositories.json');
    if (fs.existsSync(reposPath)) {
      // Clear require cache to get fresh data in dev
      const data = fs.readFileSync(reposPath, 'utf-8');
      repositories = JSON.parse(data);
    }
  } catch (e) {
    console.warn('Could not load repositories.json:', e);
  }

  return {
    profile: siteConfig.profile,
    site: siteConfig.site,
    repositories
  };
}
