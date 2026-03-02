import fs from 'fs-extra';
import { globby } from 'globby';

async function migrate() {
	const files = await globby(
		['src/**/*.{svelte,js}', 'templates/**/*.{svelte,js}', 'templates/**/*.{md,mdx}', '*.md'],
		{
			ignore: ['**/node_modules/**']
		}
	);

	for (const file of files) {
		let content = await fs.readFile(file, 'utf8');
		let original = content;

		const barrelRegex = /import\s+\{([^}]+)\}\s+from\s+['"]statue-ssg['"]/g;
		content = content.replace(barrelRegex, (match, componentsList) => {
			const components = componentsList
				.split(',')
				.map((c) => c.trim())
				.filter((c) => c.length > 0);
			return components
				.map((c) => {
					if (c === 'getPageMetadata')
						return `import { getPageMetadata } from 'statue-ssg';`;
					if (
						[
							'getContentDirectories',
							'getContentByDirectory',
							'getSubDirectories',
							'getSidebarTree',
							'getContentByUrl',
							'getAllContent'
						].includes(c)
					) {
						return `import { ${c} } from 'statue-ssg/cms/content-processor.js';`;
					}
					return `import ${c} from 'statue-ssg/components/${c}.svelte';`;
				})
				.join('\n');
		});

		content = content.replace(/;;+/g, ';');

		content = content.replace(
			/from\s+['"]statue-ssg\/cms\/content-processor['"]/g,
			"from 'statue-ssg/cms/content-processor.js'"
		);

		if (content !== original) {
			await fs.writeFile(file, content);
			console.log(`✅ Migrated: ${file}`);
		}
	}
}

migrate();
