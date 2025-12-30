import { getAllContent, getContentDirectories } from '$lib/cms/content-processor';
import { siteConfig } from '../site.config.js';
import { themes } from '$lib/themes/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Resolve which theme to use based on priority:
 * 1. site.config.js theme.selected (highest priority)
 * 2. .statue-theme file (from ThemeSelector component)
 * 3. src/lib/index.css @import statement (backward compatible)
 * 4. Default theme (black-white)
 */
function getSelectedTheme() {
	// Priority 1: site.config.js
	if (siteConfig.theme?.selected) {
		const theme = themes.find(t => t.id === siteConfig.theme.selected);
		if (theme) return theme;
	}

	// Priority 2: .statue-theme file (from ThemeSelector)
	try {
		const projectRoot = path.resolve(__dirname, '..');
		const themeFilePath = path.join(projectRoot, '.statue-theme');
		if (fs.existsSync(themeFilePath)) {
			const savedTheme = fs.readFileSync(themeFilePath, 'utf-8').trim();
			const theme = themes.find(t => t.id === savedTheme);
			if (theme) return theme;
		}
	} catch (err) {
		// File doesn't exist or can't be read
	}

	// Priority 3: Parse src/lib/index.css for @import (backward compatible)
	try {
		const indexCssPath = path.join(__dirname, '../src/lib/index.css');
		if (fs.existsSync(indexCssPath)) {
			const indexCss = fs.readFileSync(indexCssPath, 'utf-8');
			const match = indexCss.match(/@import\s+["'].*?themes\/([a-z-]+)\.css["']/);
			if (match) {
				const theme = themes.find(t => t.id === match[1]);
				if (theme) return theme;
			}
		}
	} catch (err) {
		// Can't parse index.css
	}

	// Priority 4: Default fallback
	return themes.find(t => t.id === 'black-white') || themes[0];
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  // Collect content paths for static site generation
  if (event.url.pathname === '/api/content-paths') {
    // Scan all content in the Content folder
    const allContent = getAllContent();
    const directories = getContentDirectories();
    
    // Combine all content URLs and directory URLs
    let contentPaths = allContent.map(content => content.url);
    const directoryPaths = directories.map(dir => dir.url);
    
    // Filter problematic URLs (remove those containing [slug])
    contentPaths = contentPaths.filter(path => !path.includes('[slug]'));
    
    // Create a list of all possible paths
    const allPaths = [
      ...contentPaths,
      ...directoryPaths,
      '/' // Home page
    ];
    
    return new Response(JSON.stringify(allPaths), {
      headers: {
        'content-type': 'application/json'
      }
    });
  }

  // Inject selected theme CSS variables at build time
  const selectedTheme = getSelectedTheme();

  const response = await resolve(event, {
    transformPageChunk: ({ html }) => {
      // Inject theme CSS variables as inline style in <html> tag
      const themeStyles = Object.entries(selectedTheme.colors)
        .map(([key, value]) => `--color-${key}:${value}`)
        .join(';');

      return html.replace(
        '<html lang="en">',
        `<html lang="en" style="${themeStyles}">`
      );
    }
  });

  return response;
}

/** @type {import('@sveltejs/kit').HandleServerError} */
export function handleError({ error }) {
  console.error('Server error occurred:', error);

  return {
    message: 'Server error occurred, see logs for details'
  };
}

// Create a list of all pages to be statically generated
/** @type {import('@sveltejs/kit').PrerenderExtendEntries} */
export async function entries() {
  const allContent = getAllContent();
  
  // Filter problematic URLs
  const contentPaths = allContent
    .map(content => content.url)
    .filter(url => !url.includes('[slug]'));
  
  // Return content URLs
  return contentPaths;
} 