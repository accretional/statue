import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { pathToFileURL } from 'url';

/**
 * localStorage key used for theme persistence
 * Exported for use by ThemeSelector and other components
 */
export const THEME_STORAGE_KEY = 'statue-theme';

/**
 * Statue Themes Vite Plugin
 * 
 * Automatically parses theme CSS files at build time and provides:
 * 1. A virtual module 'virtual:statue-themes' with theme data (for ThemeSelector component)
 * 2. A virtual CSS module 'virtual:statue-themes.css' with combined theme CSS
 * 
 * USAGE (for statue-ssg consumers):
 * 
 * In vite.config.js:
 * ```js
 * import { statueThemesPlugin } from 'statue-ssg/vite-plugin';
 * 
 * export default defineConfig({
 *   plugins: [
 *     statueThemesPlugin(),  // Auto-detects site.config.js
 *     sveltekit()
 *   ]
 * });
 * ```
 * 
 * In site.config.js:
 * ```js
 * export const siteConfig = {
 *   theme: {
 *     default: 'Blue',  // Required if multiple themes
 *     themes: [
 *       { name: 'Blue', path: 'statue-ssg/themes/blue.css' },
 *       { name: 'Red', path: 'statue-ssg/themes/red.css' },
 *       // Or use custom themes:
 *       { name: 'Custom', path: './src/lib/themes/custom.css' }
 *     ]
 *   }
 * };
 * ```
 * 
 * @param {Object} [options] - Optional plugin options (auto-detected from site.config.js if not provided)
 * @param {string} [options.default] - Default theme name (required if multiple themes)
 * @param {Array<{name: string, path: string}>} [options.themes] - Array of theme definitions
 */
export function statueThemesPlugin(options = {}) {
	const virtualModuleId = 'virtual:statue-themes';
	const resolvedVirtualModuleId = '\0' + virtualModuleId;

	const virtualCssId = 'virtual:statue-themes.css';
	const resolvedVirtualCssId = '\0' + virtualCssId;

	let parsedThemes = [];
	let defaultTheme = '';
	let generatedCSS = '';
	let projectRoot = '';
	let configOptions = options;

	return {
		name: 'statue-themes',

		async configResolved(config) {
			projectRoot = config.root;

			// Auto-detect site.config.js if no options provided
			if (!configOptions.themes || configOptions.themes.length === 0) {
				const siteConfigPath = path.resolve(projectRoot, 'site.config.js');
				
				if (fs.existsSync(siteConfigPath)) {
					try {
						// Dynamic import of site.config.js
						const siteConfigUrl = pathToFileURL(siteConfigPath).href;
						const { siteConfig } = await import(siteConfigUrl);
						
						if (siteConfig?.theme) {
							configOptions = siteConfig.theme;
							console.log('[statue-themes] Auto-detected theme config from site.config.js');
						}
					} catch (error) {
						console.warn('[statue-themes] Failed to auto-detect site.config.js:', error.message);
					}
				}
			}

			// Validate configuration
			const themes = configOptions.themes || [];

			if (themes.length === 0) {
				// No themes configured - use a sensible default
				console.warn('[statue-themes] No themes configured. Using default black-white theme.');
				themes.push({ name: 'black-white', path: 'statue-ssg/themes/black-white.css' });
			}

		// Validate default theme requirement
		if (themes.length > 1 && !configOptions.default) {
			throw new Error(
				'[statue-themes] Multiple themes configured but no default specified. ' +
					'Please set theme.default in site.config.js'
			);
		}

		// Set default theme
		defaultTheme = configOptions.default || themes[0].name;

			// Validate default theme exists in themes array
			const defaultExists = themes.some((t) => toKebabCase(t.name) === toKebabCase(defaultTheme));
			if (!defaultExists) {
				throw new Error(
					`[statue-themes] Default theme "${defaultTheme}" not found in themes array. ` +
						`Available themes: ${themes.map((t) => t.name).join(', ')}`
				);
			}

			// Parse each theme
			parsedThemes = themes.map((theme) => {
				const cssPath = resolveThemePath(theme.path, projectRoot);
				const cssContent = readThemeFile(cssPath, theme.name);
				const colors = parseCSSVariables(cssContent);
				const displayName = theme.name;
				const id = toKebabCase(theme.name);

				if (Object.keys(colors).length === 0) {
					throw new Error(
						`[statue-themes] No CSS variables found in theme "${theme.name}" at ${cssPath}. ` +
							'Ensure the file contains @theme { --color-*: ...; } or :root { --color-*: ...; } block.'
					);
				}

				return {
					id,
					name: displayName,
					path: theme.path,
					colors
				};
			});

			// Generate combined CSS
			generatedCSS = generateCombinedCSS(parsedThemes, toKebabCase(defaultTheme));

			console.log(
				`[statue-themes] Loaded ${parsedThemes.length} theme(s): ${parsedThemes.map((t) => t.name).join(', ')}`
			);
			console.log(`[statue-themes] Default theme: ${defaultTheme}`);
		},

		resolveId(id) {
			if (id === virtualModuleId) {
				return resolvedVirtualModuleId;
			}
			if (id === virtualCssId) {
				return resolvedVirtualCssId;
			}
		},

		load(id) {
			if (id === resolvedVirtualModuleId) {
				// Return static JS module - no fs at runtime
				const themesForExport = parsedThemes.map((t) => ({
					id: t.id,
					name: t.name,
					colors: t.colors
				}));

				return `
export const themes = ${JSON.stringify(themesForExport, null, 2)};
export const defaultTheme = ${JSON.stringify(toKebabCase(defaultTheme))};
export const showSelector = ${parsedThemes.length > 1};
export const THEME_STORAGE_KEY = ${JSON.stringify(THEME_STORAGE_KEY)};
`;
			}

			if (id === resolvedVirtualCssId) {
				return generatedCSS;
			}
		}
	};
}

/**
 * Convert a string to kebab-case for use as data-theme attribute
 */
function toKebabCase(str) {
	return str
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '')
		.replace(/-+/g, '-')        // Collapse multiple dashes
		.replace(/^-|-$/g, '');     // Trim leading/trailing dashes
}

/**
 * Resolve theme path - handles both npm package paths and local paths
 */
function resolveThemePath(themePath, projectRoot) {
	// Handle npm package paths (e.g., 'statue-ssg/themes/blue.css')
	if (!themePath.startsWith('.') && !themePath.startsWith('/')) {
		try {
			const require = createRequire(projectRoot + '/package.json');
			// Resolve the full import path (honors package.json exports)
			const resolvedPath = require.resolve(themePath);
			return resolvedPath;
		} catch (e) {
			// If package resolution fails, try as relative path
			return path.resolve(projectRoot, themePath);
		}
	}

	// Handle relative paths (e.g., './src/themes/custom.css')
	return path.resolve(projectRoot, themePath);
}

/**
 * Read theme file with error handling
 */
function readThemeFile(filePath, themeName) {
	try {
		if (!fs.existsSync(filePath)) {
			throw new Error(`File not found: ${filePath}`);
		}
		return fs.readFileSync(filePath, 'utf-8');
	} catch (e) {
		throw new Error(
			`[statue-themes] Failed to read theme "${themeName}" at ${filePath}: ${e.message}`
		);
	}
}

/**
 * Parse CSS variables from @theme {} or :root {} blocks
 */
function parseCSSVariables(cssContent) {
	const colors = {};

	// Try @theme block first (Tailwind v4 style)
	let themeBlockMatch = cssContent.match(/@theme\s*{([^}]*)}/s);

	// Fall back to :root block
	if (!themeBlockMatch) {
		themeBlockMatch = cssContent.match(/:root\s*{([^}]*)}/s);
	}

	if (themeBlockMatch) {
		const blockContent = themeBlockMatch[1];
		// Match --color-* variables
		const colorRegex = /--color-([a-z0-9-]+):\s*([^;]+);/gi;
		let match;

		while ((match = colorRegex.exec(blockContent)) !== null) {
			const key = match[1].toLowerCase();
			const value = match[2].trim();
			colors[key] = value;
		}
	}

	return colors;
}

/**
 * Generate combined CSS with :root and [data-theme] selectors
 */
function generateCombinedCSS(themes, defaultThemeId) {
	let css = '/* Statue SSG - Combined Theme CSS (Generated by Vite Plugin) */\n\n';

	// Find default theme
	const defaultTheme = themes.find((t) => t.id === defaultThemeId) || themes[0];

	// Generate :root with default theme (fallback)
	if (defaultTheme) {
		css += ':root {\n';
		Object.entries(defaultTheme.colors).forEach(([key, value]) => {
			css += `  --color-${key}: ${value};\n`;
		});
		css += '}\n\n';
	}

	// Generate [data-theme="..."] for each theme
	themes.forEach((theme) => {
		css += `html[data-theme="${theme.id}"] {\n`;
		Object.entries(theme.colors).forEach(([key, value]) => {
			css += `  --color-${key}: ${value};\n`;
		});

		// Add theme-specific visibility variables
		themes.forEach(t => {
			const isCurrent = t.id === theme.id;
			css += `  --theme-display-${t.id}: ${isCurrent ? 'block' : 'none'};\n`;
		});

		css += '}\n\n';
	});

	// Add default theme visibility variables to :root
	if (defaultTheme) {
		themes.forEach(t => {
			const isDefault = t.id === defaultTheme.id;
			// Only add if not already defined (though :root usually comes first)
			if (!css.includes(`--theme-display-${t.id}`)) {
				// We need to inject these into the :root block created earlier
				// This is a bit hacky, but we'll append a new :root block for these variables
			}
		});

		css += ':root {\n';
		themes.forEach(t => {
			const isDefault = t.id === defaultTheme.id;
			css += `  --theme-display-${t.id}: ${isDefault ? 'block' : 'none'};\n`;
		});
		css += '}\n\n';
	}

	return css;
}

export default statueThemesPlugin;
