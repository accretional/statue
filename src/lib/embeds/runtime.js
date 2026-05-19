import { xEmbedProvider } from './providers/x.js';

export const embedProviders = [];

export function registerEmbedProvider(provider) {
	if (!provider?.enhance) return;
	if (provider.id && embedProviders.some((entry) => entry.id === provider.id)) return;
	embedProviders.push(provider);
}

function hasTargets(root, selector) {
	if (!selector) return true;

	if (root instanceof Element && root.matches(selector)) {
		return true;
	}

	return !!root.querySelector?.(selector);
}

export function enhanceEmbeds(root = document, providers = embedProviders) {
	if (typeof document === 'undefined' || !root) return;

	for (const provider of providers) {
		if (!provider?.enhance) continue;
		if (!hasTargets(root, provider.selector)) continue;

		try {
			provider.enhance(root);
		} catch (error) {
			console.error(`[embeds] Failed to enhance provider \"${provider.id || 'unknown'}\"`, error);
		}
	}
}

registerEmbedProvider(xEmbedProvider);
