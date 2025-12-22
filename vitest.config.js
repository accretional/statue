import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
	plugins: [svelte({ hot: !process.env.VITEST })],
	test: {
		globals: true,
		environment: 'jsdom',
		include: ['test/**/*.test.js', 'src/**/*.test.js'],
		setupFiles: ['./test/setup.js'],
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
	},
	resolve: {
		alias: {
			$lib: path.resolve(__dirname, './src/lib'),
			$content: path.resolve(__dirname, './content'),
			$components: path.resolve(__dirname, './src/lib/components'),
			$cms: path.resolve(__dirname, './src/lib/cms')
		}
	}
});
