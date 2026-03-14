/**
 * Svelte action that automatically enhances embedded content (tweets, etc.)
 * within a DOM element.
 *
 * Usage in a Svelte component:
 *
 *   import { embedEnhancer } from 'statue-ssg/embeds/action';
 *
 *   <div use:embedEnhancer>
 *     {@html content}
 *   </div>
 *
 * The action:
 * 1. Runs enhanceEmbeds() on mount (handles initial render)
 * 2. Observes childList/subtree mutations to re-enhance when content changes
 *    (e.g. SvelteKit navigation swapping {@html} content)
 * 3. Cleans up the MutationObserver on destroy
 */

import { enhanceEmbeds } from './runtime.js';

/**
 * @param {HTMLElement} node - The DOM element to observe for embeds
 * @returns {{ destroy: () => void }}
 */
export function embedEnhancer(node) {
	// Initial enhancement — DOM is ready since Svelte actions fire after mount
	enhanceEmbeds(node);

	// Watch for content changes (e.g. SvelteKit client-side navigation)
	const observer = new MutationObserver(() => {
		enhanceEmbeds(node);
	});

	observer.observe(node, { childList: true, subtree: true });

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
