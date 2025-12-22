import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm'],
	dts: false,
	clean: true,
	minify: false,
	shims: true
});
