import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/repositories.json');
		if (!response.ok) {
			return { repositories: [] };
		}
		const repositories = await response.json();
		return { repositories };
	} catch {
		return { repositories: [] };
	}
};
