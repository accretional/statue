import { getAllContent, getContentDirectories } from '$lib/cms/content-processor';
import { siteConfig } from '../site.config.js';

/**
 * Get the default theme ID from site.config.js
 * Converts theme name to kebab-case for use in data-theme attribute
 */
function getDefaultThemeId() {
	const themeConfig = siteConfig.theme || {};
	
	// If default is specified, use it
	if (themeConfig.default) {
		return toKebabCase(themeConfig.default);
	}
	
	// If themes array has entries, use the first one
	if (themeConfig.themes && themeConfig.themes.length > 0) {
		return toKebabCase(themeConfig.themes[0].name);
	}
	
	// Fallback
	return 'black-white';
}

/**
 * Convert string to kebab-case
 */
function toKebabCase(str) {
	return str
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '');
}

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	// Collect content paths for static site generation
	if (event.url.pathname === '/api/content-paths') {
		// Scan all content in the Content folder
		const allContent = getAllContent();
		const directories = getContentDirectories();

		// Combine all content URLs and directory URLs
		let contentPaths = allContent.map((content) => content.url);
		const directoryPaths = directories.map((dir) => dir.url);

		// Filter problematic URLs (remove those containing [slug])
		contentPaths = contentPaths.filter((path) => !path.includes('[slug]'));

		// Create a list of all possible paths
		const allPaths = [...contentPaths, ...directoryPaths, '/' /* Home page */];

		return new Response(JSON.stringify(allPaths), {
			headers: {
				'content-type': 'application/json'
			}
		});
	}

	// Get default theme from config
	const defaultThemeId = getDefaultThemeId();

	// Inject data-theme attribute at build/render time
	const response = await resolve(event, {
		transformPageChunk: ({ html }) => {
			// Add data-theme attribute to html element
			return html.replace('<html lang="en">', `<html lang="en" data-theme="${defaultThemeId}">`);
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
		.map((content) => content.url)
		.filter((url) => !url.includes('[slug]'));

	// Return content URLs
	return contentPaths;
}
