import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
	{
		ignores: [
			'build/',
			'.svelte-kit/',
			'dist/',
			'node_modules/',
			'**/*.cjs',
			'statue_test_env/'
		]
	},
	js.configs.recommended,
	...svelte.configs.recommended,
	{
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2017
			}
		},
		rules: {
			'no-console': 'warn',
			'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
			'no-undef': 'warn'
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: tsParser,
				extraFileExtensions: ['.svelte']
			}
		},
		rules: {
			'svelte/no-at-html-tags': 'warn',
			'svelte/valid-compile': 'warn',
			// Disabled: rule uses removed `source.isSpaceBetweenTokens` API,
			// crashes under ESLint 10. Re-enable when eslint-plugin-svelte ships a fix.
			'svelte/no-reactive-functions': 'off'
		}
	},
	{
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
];
