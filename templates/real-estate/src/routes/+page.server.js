import { getContentDirectories } from 'statue-ssg/cms/content-processor';
import siteConfig from '../../site.config.json';

// Ensure this page is pre-rendered as a static page
export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	// Get content directories for navbar/footer
	const directories = getContentDirectories();

	return {
		directories,
		site: siteConfig.site || {},
		seo: siteConfig.seo || {},
		footer: siteConfig.footer || {},
		property: siteConfig.property || {}
	};
}
