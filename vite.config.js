import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { fileURLToPath } from 'url';
import path from 'path';
// For library development, import from local vite-plugin
// For consumers: import { statueThemesPlugin } from 'statue-ssg/vite-plugin';
import { statueThemesPlugin } from './vite-plugin/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
	plugins: [
		statueThemesPlugin(), // Auto-detects site.config.js
		sveltekit()
	],

	resolve: {
		alias: {
			$content: path.resolve(__dirname, 'content'),
			$components: path.resolve(__dirname, 'src/lib/components'),
			$cms: path.resolve(__dirname, 'src/lib/cms')
		}
	},

	server: {
		port: 3000,
		open: true
	},

	test: {
		globals: true,

		projects: [
			{
				// Client-side tests (Svelte components)
				extends: true,
				test: {
					name: 'client',
					environment: 'jsdom',
					include: [
						'src/**/*.svelte.{test,spec}.{js,ts}',
						'test/**/*.svelte.{test,spec}.{js,ts}' // Added root test directory
					],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./test/setup.js']
				}
			},
			{
				// Server-side tests
				extends: true,
				test: {
					name: 'server',
					environment: 'node',
					include: [
						'src/**/*.{test,spec}.{js,ts}',
						'test/**/*.{test,spec}.{js,ts}' // Added root test directory
					],
					exclude: [
						'src/**/*.svelte.{test,spec}.{js,ts}',
						'test/**/*.svelte.{test,spec}.{js,ts}' // Exclude Svelte tests from server
					]
				}
			}
		],

		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: [
				'node_modules/',
				'test/',
				'**/*.test.js',
				'build/',
				'.svelte-kit/',
				'scripts/',
				'postinstall.js'
			]
		}
	}
});
