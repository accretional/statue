import { getContentDirectories } from 'statue-ssg/cms/content-processor';
import siteConfig from '../../site.config.json';
import { parseMarkdownContent } from '$lib/utils/parse-markdown-content.js';
import { join } from 'path';

// Ensure this page is pre-rendered as a static page
export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	// Get content directories for navbar/footer
	const directories = getContentDirectories();

	// Try loading property.md first
	let propertyOverride = {};
	const mdPath = join(process.cwd(), 'content/property.md');
	const parseResult = parseMarkdownContent(mdPath);

	if (parseResult.success) {
		propertyOverride = parseResult.metadata.property || {};
	} else {
		console.log('No property.md found, using site.config.json');
	}

	// Deep merge: markdown overrides JSON defaults for property config
	// We do a recursive merge for nested objects
	function deepMerge(target, source) {
		const output = { ...target };

		if (isObject(target) && isObject(source)) {
			Object.keys(source).forEach((key) => {
				if (isObject(source[key])) {
					if (!(key in target)) {
						Object.assign(output, { [key]: source[key] });
					} else {
						output[key] = deepMerge(target[key], source[key]);
					}
				} else {
					Object.assign(output, { [key]: source[key] });
				}
			});
		}

		return output;
	}

	function isObject(item) {
		return item && typeof item === 'object' && !Array.isArray(item);
	}

	const property = deepMerge(siteConfig.property || {}, propertyOverride);

	return {
		directories,
		site: siteConfig.site || {},
		seo: siteConfig.seo || {},
		footer: siteConfig.footer || {},
		property
	};
}
