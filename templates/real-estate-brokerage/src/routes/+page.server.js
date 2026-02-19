import siteConfig from '../../site.config.json';

export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {
		site: siteConfig.site || {},
		seo: siteConfig.seo || {},
		brokerage: siteConfig.brokerage || {}
	};
}
