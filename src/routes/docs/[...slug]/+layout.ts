import { getSidebarData, getPageContent } from '$lib/cms/content-processor.js';
import { error } from '@sveltejs/kit';

export function load({ params }) {
	const slug = params.slug || '';
	const fullPath = slug ? `/docs/${slug}` : '/docs';
	const sidebarRaw = getSidebarData('docs');

	// Convert object to array
	const sidebar = Object.entries(sidebarRaw).map(([key, items]) => ({
		title: key,
		isRoot: key === 'Root',
		items: items
	}));

	const pageData = getPageContent(fullPath);

	if (!pageData) {
		throw error(404, 'Page not found');
	}

	return {
		sidebar,
		page: pageData,
		currentPath: fullPath
	};
}
