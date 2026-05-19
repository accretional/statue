import { enhanceXCardVideos } from '../../utils/x-api.js';

export const xEmbedProvider = {
	id: 'x',
	selector: '[data-embed-provider="x"]',
	enhance(root) {
		enhanceXCardVideos(root);
	}
};
