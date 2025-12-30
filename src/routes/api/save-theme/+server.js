import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const { theme } = await request.json();

		if (!theme || typeof theme !== 'string') {
			return json({ error: 'Invalid theme' }, { status: 400 });
		}

		// Write theme selection to .statue-theme file in project root
		const projectRoot = path.resolve(__dirname, '../../../../..');
		const themeFilePath = path.join(projectRoot, '.statue-theme');

		fs.writeFileSync(themeFilePath, theme, 'utf-8');

		return json({ success: true, theme });
	} catch (error) {
		console.error('Error saving theme:', error);
		return json({ error: 'Failed to save theme' }, { status: 500 });
	}
}
