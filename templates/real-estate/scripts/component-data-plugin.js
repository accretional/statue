import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import MagicString from 'magic-string';

/**
 * Vite plugin for injecting component default props from .data.md files
 *
 * This plugin:
 * 1. Scans for .svelte components in specified directories
 * 2. Looks for co-located .data.md files with YAML frontmatter
 * 3. Parses the YAML and injects defaults into component $props() destructuring
 * 4. Transforms component code at build time (transparent to developer)
 *
 * @param {Object} options - Plugin configuration
 * @param {string} options.componentDir - Directory containing components (can be relative or absolute)
 * @param {string} options.dataExtension - File extension for data files (default: '.data.md')
 * @param {boolean} options.strict - If true, throw error when .data.md missing; if false, warn (default: false)
 * @returns {Object} Vite plugin object
 */
export function componentDataPlugin(options = {}) {
	const {
		componentDir = 'src/lib/components',
		dataExtension = '.data.md',
		strict = false
	} = options;

	return {
		name: 'component-data-plugin',
		enforce: 'pre',

		/**
		 * Hook that runs for each module during build
		 * @param {string} code - Source code of the module
		 * @param {string} id - Module ID (file path)
		 * @returns {Object|null} Transformation result or null if no transform needed
		 */
		async transform(code, id) {
			// Only process .svelte files in componentDir
			if (!id.includes(componentDir) || !id.endsWith('.svelte')) {
				return null;
			}

			// Check for co-located .data.md file
			const dataFile = id.replace('.svelte', dataExtension);

			if (!fs.existsSync(dataFile)) {
				// Only warn/error if strict mode enabled
				if (strict) {
					const componentName = path.basename(id);
					throw new Error(
						`${componentName} requires ${path.basename(dataFile)}\n` +
						`Expected: ${dataFile}`
					);
				}
				return null;
			}

			try {
				// Parse YAML frontmatter
				const fileContent = fs.readFileSync(dataFile, 'utf-8');
				const { data: defaults } = matter(fileContent);

				// Check if component has $props() to inject into
				if (!code.includes('$props()')) {
					console.warn(
						`[component-data-plugin] ${path.basename(id)} has .data.md but no $props() found. Skipping.`
					);
					return null;
				}

				// Transform component code
				const result = transformComponentWithDefaults(code, defaults, id);
				if (result) {
					console.log(
						`[component-data-plugin] ✓ Transformed ${path.basename(id)} (${Object.keys(defaults).length} props)`
					);
				}
				return result;
			} catch (error) {
				const componentName = path.basename(id);
				const dataFileName = path.basename(dataFile);

				if (error.name === 'YAMLException' || error.code === 'ENOENT') {
					throw new Error(
						`[component-data-plugin] Error parsing ${dataFileName}:\n${error.message}`
					);
				}

				throw error;
			}
		}
	};
}

/**
 * Transform component code by injecting defaults into $props() destructuring
 * @param {string} code - Original component source code
 * @param {Object} defaults - Default values from .data.md
 * @param {string} filePath - File path (for error messages)
 * @returns {Object|null} Transformation result with code and source map
 */
function transformComponentWithDefaults(code, defaults, filePath) {
	const s = new MagicString(code);

	// Find $props() destructuring pattern
	// Matches: let { prop1, prop2, ... }: TypeName = $props();
	const propsRegex = /let\s+\{([^}]*)\}\s*:\s*(\w+)\s*=\s*\$props\(\)/;
	const match = code.match(propsRegex);

	if (!match) {
		return null; // Not a component with $props in this format
	}

	const propNames = match[1]; // "subtitle, title, spaces, showCapacity"
	const propsType = match[2];  // "PropertyAvailableSpacesProps"

	// Build new destructuring with defaults
	const newDestructuring = buildDestructuringWithDefaults(propNames, defaults);

	if (!newDestructuring) {
		return null; // No defaults to inject
	}

	// Replace in code
	const oldCode = match[0];
	const newCode = `let ${newDestructuring}: ${propsType} = $props()`;

	s.overwrite(code.indexOf(oldCode), code.indexOf(oldCode) + oldCode.length, newCode);

	return {
		code: s.toString(),
		map: s.generateMap({ hires: true })
	};
}

/**
 * Build destructuring syntax with defaults from .data.md
 * @param {string} propNames - Comma-separated prop names from component
 * @param {Object} defaults - Default values from .data.md
 * @returns {string|null} Destructuring syntax with defaults, or null if no values to inject
 */
function buildDestructuringWithDefaults(propNames, defaults) {
	const props = propNames
		.split(',')
		.map(p => p.trim())
		.filter(p => p.length > 0);

	if (props.length === 0) {
		return null;
	}

	const withDefaults = props.map(prop => {
		const defaultValue = defaults[prop];
		if (defaultValue === undefined) {
			return prop;
		}

		// Serialize value safely (handles objects, arrays, primitives)
		const serialized = serializeValue(defaultValue);
		return `${prop} = ${serialized}`;
	});

	return `{ ${withDefaults.join(', ')} }`;
}

/**
 * Safely serialize JavaScript values for code generation
 * Handles objects, arrays, strings, numbers, booleans, null, undefined
 * @param {*} value - Value to serialize
 * @param {number} depth - Current nesting depth (for formatting)
 * @returns {string} JavaScript code representation of the value
 */
function serializeValue(value, depth = 0) {
	// Primitive types
	if (value === null) return 'null';
	if (value === undefined) return 'undefined';
	if (typeof value === 'boolean') return String(value);
	if (typeof value === 'number') return String(value);
	if (typeof value === 'string') return JSON.stringify(value);

	// Arrays
	if (Array.isArray(value)) {
		if (value.length === 0) return '[]';

		const items = value.map(item => {
			const serialized = serializeValue(item, depth + 1);
			return serialized;
		});

		// Format: inline for short arrays, multiline for long arrays
		const inline = `[${items.join(', ')}]`;
		if (inline.length < 80 && !hasComplexObjects(value)) {
			return inline;
		}

		// Multiline format for complex arrays
		const indent = '\t'.repeat(depth + 1);
		const closingIndent = '\t'.repeat(depth);
		return `[\n${indent}${items.join(`,\n${indent}`)}\n${closingIndent}]`;
	}

	// Objects
	if (typeof value === 'object') {
		const keys = Object.keys(value);
		if (keys.length === 0) return '{}';

		const entries = keys.map(key => {
			const serializedValue = serializeValue(value[key], depth + 1);
			// Only quote keys if necessary
			const quotedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
			return `${quotedKey}: ${serializedValue}`;
		});

		// Format: inline for simple objects, multiline for complex
		const inline = `{ ${entries.join(', ')} }`;
		if (inline.length < 80 && !hasComplexObjects(value)) {
			return inline;
		}

		// Multiline format for complex objects
		const indent = '\t'.repeat(depth + 1);
		const closingIndent = '\t'.repeat(depth);
		return `{\n${indent}${entries.join(`,\n${indent}`)}\n${closingIndent}}`;
	}

	// Fallback (shouldn't reach here in normal usage)
	return JSON.stringify(value);
}

/**
 * Check if an object/array contains nested objects or arrays
 * Used to decide between inline and multiline formatting
 * @param {*} value - Value to check
 * @returns {boolean} True if value contains complex nested structures
 */
function hasComplexObjects(value) {
	if (Array.isArray(value)) {
		return value.some(item => typeof item === 'object' && item !== null);
	}

	if (typeof value === 'object') {
		return Object.values(value).some(v => typeof v === 'object' && v !== null);
	}

	return false;
}
