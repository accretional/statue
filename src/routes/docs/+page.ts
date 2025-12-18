import { redirect } from '@sveltejs/kit';
import { getFirstPageUrl } from '$lib/cms/content-processor.js';

export function load() {
  const firstPage = getFirstPageUrl('docs');

  if (!firstPage) {
    return { error: 'No docs found' };
  }

  // Redirect to first page
  return redirect(307, firstPage);
}
