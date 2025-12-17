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
		'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
		'no-undef': 'warn'
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser'
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
