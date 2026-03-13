/**
 * Remark plugin that detects standalone X/Twitter URLs in markdown
 * and replaces them with rendered tweet cards at build time.
 *
 * Detection rule: Only bare X/Twitter URLs on their own line (a paragraph
 * containing ONLY the URL as a single link child) become cards. URLs mixed
 * with text, inside markdown links, or inline remain regular clickable links.
 *
 * The plugin fetches tweet data via the public syndication API and injects
 * the card HTML + styles directly into the AST. No client-side JS required.
 */

import visit from 'unist-util-visit';
import { isXUrl, renderTweetCardFromUrl, getXCardStyles } from '../utils/x-api.js';

// Track whether styles have already been injected for this build pass
let stylesInjected = false;

/**
 * Check whether a paragraph node contains exactly one child that is an
 * auto-linked X/Twitter status URL.
 *
 * Remark/GFM auto-links bare URLs, producing an AST like:
 *   paragraph -> link (url, children: [text])
 *
 * We match when:
 *  1. The paragraph has exactly one child
 *  2. That child is a `link` node
 *  3. The link URL matches an X/Twitter status pattern
 *  4. The link has a single text child whose value matches the URL
 *     (i.e. it was auto-linked, not a user-written `[text](url)`)
 *
 * @param {object} node - MDAST paragraph node
 * @returns {string|null} The URL if it matches, otherwise null
 */
function getStandaloneXUrl(node) {
	if (!node || node.type !== 'paragraph') return null;
	if (!node.children || node.children.length !== 1) return null;

	const child = node.children[0];
	if (child.type !== 'link') return null;
	if (!isXUrl(child.url)) return null;

	// Ensure the link was auto-linked (text content == URL) rather than
	// a user markdown link like [click here](https://x.com/...)
	if (
		child.children &&
		child.children.length === 1 &&
		child.children[0].type === 'text' &&
		child.children[0].value === child.url
	) {
		return child.url;
	}

	return null;
}

/**
 * Remark plugin factory.
 * @returns {(tree: object) => Promise<void>} Transformer
 */
export default function remarkXCard() {
	// Reset styles injection flag for each plugin instantiation
	// (covers fresh builds)
	stylesInjected = false;

	return async (tree) => {
		// Collect nodes that need replacement (we can't mutate during visit)
		/** @type {{ node: object, index: number, parent: object, url: string }[]} */
		const targets = [];

		visit(tree, 'paragraph', (node, index, parent) => {
			const url = getStandaloneXUrl(node);
			if (url) {
				targets.push({ node, index, parent, url });
			}
		});

		if (targets.length === 0) return;

		// Fetch tweet data and build replacement nodes in parallel
		const results = await Promise.allSettled(
			targets.map(async (t) => {
				const html = await renderTweetCardFromUrl(t.url);
				return { ...t, html };
			})
		);

		// Inject styles once at the top of the document if we have any cards
		const hasCards = results.some((r) => r.status === 'fulfilled');
		if (hasCards && !stylesInjected) {
			stylesInjected = true;
			tree.children.unshift({
				type: 'html',
				value: `<style>${getXCardStyles()}</style>`
			});
		}

		// Replace nodes in reverse order to preserve indices.
		// Because we unshifted a <style> node onto tree.children, any target
		// whose parent IS the tree root has its original index shifted by +1.
		for (let i = results.length - 1; i >= 0; i--) {
			const result = results[i];
			const target = targets[i];

			if (result.status === 'fulfilled') {
				const htmlNode = {
					type: 'html',
					value: result.value.html
				};

				const offset = hasCards && target.parent === tree ? 1 : 0;
				target.parent.children.splice(target.index + offset, 1, htmlNode);
			} else {
				// On failure, leave the original link in place but log a warning
				console.warn(
					`[remark-x-card] Failed to render tweet card for ${target.url}:`,
					result.reason?.message || result.reason
				);
			}
		}
	};
}
