import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { spawn } from 'child_process';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		{
			name: 'cms-builder',
			buildStart() {
				console.log('Building CMS pages...');
				return new Promise((resolve, reject) => {
					const process = spawn('node', ['src/lib/cms/build.mjs']);
					
					process.stdout.on('data', (data) => {
						console.log(`CMS: ${data}`);
					});
					
					process.stderr.on('data', (data) => {
						console.error(`CMS Error: ${data}`);
					});
					
					process.on('close', (code) => {
						if (code === 0) {
							console.log('CMS build completed successfully.');
							resolve();
						} else {
							console.error(`CMS build failed with code ${code}`);
							reject(new Error(`CMS build failed with code ${code}`));
						}
					});
				});
			}
		},
		sveltekit()
	]
});
