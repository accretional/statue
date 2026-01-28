import siteConfig from '../../../site.config.json';

export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export function load() {
  return {
    contact: siteConfig.contact,
    profile: siteConfig.profile
  };
}
