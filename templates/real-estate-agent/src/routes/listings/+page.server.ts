import siteConfig from '../../../site.config.json';
import type { PageServerLoad } from './$types';

// Ensure this page is pre-rendered as a static page
export const prerender = true;

interface ListingsConfig {
	items?: Array<Record<string, any>>;
}

export const load: PageServerLoad = async ({ parent }) => {
	const parentData = await parent();

	// Get listings config
	const agentListings = (parentData.agent || siteConfig.agent || {}) as { listings?: ListingsConfig };
	const items = agentListings.listings?.items || siteConfig.agent?.listings?.items || [];

	return {
		...parentData,
		site: parentData.site || siteConfig.site || {},
		agent: {
			...parentData.agent,
			...siteConfig.agent,
			listings: {
				...agentListings.listings,
				...siteConfig.agent?.listings,
				items
			}
		},
		seo: parentData.seo || siteConfig.seo || {}
	};
};
