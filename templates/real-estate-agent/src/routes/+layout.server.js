import { getContentDirectories } from 'statue-ssg/cms/content-processor';
import siteConfig from '../../site.config.json';

/** @type {import('./$types').LayoutServerLoad} */
export function load() {
	return {
		globalDirectories: getContentDirectories(),
		navbarConfig: siteConfig.navbarConfig || null
	};
}
