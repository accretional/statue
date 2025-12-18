import { getContentDirectories } from '$lib/cms/content-processor';

/** @type {import('./$types').PageLoad} */
export function load() {
	// Get content directories for navigation
	const directories = getContentDirectories();

	// Enhance directories with proper URLs
	const enhancedDirectories = directories.map((directory) => {
		return {
			...directory
		};
	});

	return {
		directories: enhancedDirectories
	};
}
