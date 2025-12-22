import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
	plugins: [sveltekit()],

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
		// Global test configuration
		globals: true,

		// Multi-project setup for different test environments
		projects: [
			{
				// Client-side tests (Svelte components)
				extends: true, // Inherits main config
				test: {
					name: 'client',
					environment: 'jsdom', // or 'happy-dom' for faster alternative
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
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
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		],

		// Coverage configuration
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
