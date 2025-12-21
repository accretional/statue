import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { sveltekit } from '@sveltejs/kit/vite';
import { fileURLToPath } from 'url';
import path from 'path';

// Let's recreate __dirname property for ESM
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

export default defineConfig({
	plugins: [sveltekit()],

	// Define custom paths
	resolve: {
		alias: {
			$content: path.resolve(__dirname, 'content'),
			$components: path.resolve(__dirname, 'src/lib/components'),
			$cms: path.resolve(__dirname, 'src/lib/cms')
		}
	},

	// Development server
	server: { port: 3000, open: true },

	test: {
		expect: { requireAssertions: true },

		projects: [
			{
				extends: './vite.config.js',

				test: {
					name: 'client',

					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }]
					},

					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**']
				}
			},

			{
				extends: './vite.config.js',

				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
