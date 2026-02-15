import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import sirv from 'sirv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve resources/ as additional public directory for shared assets
const serveResources = () => ({
	name: 'serve-resources',
	configureServer(server) {
		const resourcesDir = path.resolve(__dirname, 'resources');
		if (fs.existsSync(resourcesDir)) {
			server.middlewares.use(sirv(resourcesDir, { dev: true }));
		}
	}
});

const plugins = [sveltekit(), serveResources()];

try {
	const { componentDataPlugin } = await import('./scripts/component-data-plugin.js');
	plugins.unshift(componentDataPlugin({
		componentDir: 'templates/real-estate/src/lib/components',
		dataExtension: '.data.md',
		strict: false
	}));
} catch (error) {
	// Plugin not available, skip
	console.warn('Component data plugin not available, skipping...');
}

export default defineConfig({
	plugins,

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