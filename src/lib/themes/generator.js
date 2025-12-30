import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseCSSTheme(cssContent) {
	const colors = {};
	const themeBlockMatch = cssContent.match(/@theme\s*{([^}]*)}/s);

	if (themeBlockMatch) {
		const themeContent = themeBlockMatch[1];
		const colorRegex = /--color-([a-z-]+):\s*([^;]+);/g;
		let match;

		while ((match = colorRegex.exec(themeContent)) !== null) {
			const key = match[1];
			const value = match[2].trim();
			colors[key] = value;
		}
	}

	return colors;
}

function loadThemesForInlineScript() {
	const themesDir = path.resolve(__dirname, '../src/lib/themes');
	const files = fs.readdirSync(themesDir);
	const themes = {};

	for (const file of files) {
		if (file.endsWith('.css') && !file.includes('template')) {
			const filePath = path.join(themesDir, file);
			const cssContent = fs.readFileSync(filePath, 'utf-8');
			const colors = parseCSSTheme(cssContent);

			if (Object.keys(colors).length > 0) {
				const id = file.replace('.css', '');
				themes[id] = colors;
			}
		}
	}

	return themes;
}

export function generateThemeScript() {
	const themes = loadThemesForInlineScript();
	return `
		<script>
			(function() {
				const themes = ${JSON.stringify(themes)};
				const saved = localStorage.getItem('statue-theme');
				if (saved && themes[saved]) {
					const theme = themes[saved];
					Object.entries(theme).forEach(([key, value]) => {
						document.documentElement.style.setProperty('--color-' + key, value);
					});
				}
			})();
		</script>
	`.trim();
}
