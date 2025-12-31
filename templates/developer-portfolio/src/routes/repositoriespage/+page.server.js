import { siteConfig } from '../../../site.config.js';
import fs from 'fs';
import path from 'path';

export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export function load() {
  // Load repositories from JSON file
  let repositories = [];
  try {
    const reposPath = path.resolve('static/repositories.json');
    if (fs.existsSync(reposPath)) {
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
