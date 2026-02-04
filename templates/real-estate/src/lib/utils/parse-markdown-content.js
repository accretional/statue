import matter from 'gray-matter';
import { readFileSync } from 'fs';

/**
 * Parse a markdown file with YAML frontmatter
 * @param {string} filePath - Absolute path to the markdown file
 * @returns {Object} Object with { metadata, content }
 */
export function parseMarkdownContent(filePath) {
	try {
		const fileContent = readFileSync(filePath, 'utf-8');
		const { data: metadata, content } = matter(fileContent);
		return {
			metadata,
			content,
			success: true
		};
	} catch (error) {
		console.warn(`Failed to parse markdown file at ${filePath}:`, error.message);
		return {
			metadata: {},
			content: '',
			success: false,
			error: error.message
		};
	}
}
