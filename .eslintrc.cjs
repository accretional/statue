module.exports = {
	root: true,
	extends: ['eslint:recommended', 'plugin:svelte/recommended'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte']
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	rules: {
		// Warnings only for now - we don't want to break existing code
		'no-console': 'warn',
		'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
		'no-undef': 'warn'
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			},
			rules: {
				// {@html} is intentional for markdown rendering
				'svelte/no-at-html-tags': 'warn',
				// Unused exports are fine in components (used externally)
				'svelte/valid-compile': 'warn',
			}
		},
		{
			// Allow console in CLI scripts and build tools
			files: [
				'scripts/**/*.js',
				'postinstall.js',
				'test/**/*.js',
				'src/lib/cms/content-processor.js',
				'*.config.js'
			],
			rules: {
				'no-console': 'off'
			}
		}
	],
	ignorePatterns: [
		'build/',
		'.svelte-kit/',
		'dist/',
		'node_modules/',
		'*.cjs',
		'statue_test_env/'
	]
};
