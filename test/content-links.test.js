/**
 * Tests for internal content link resolution
 *
 * The bug: Markdown links to other content files (e.g., ./file.md or ../dir/file.md)
 * are not transformed to the correct URLs and remain as .md links in the HTML output.
 *
 * Expected behavior: Internal links should be transformed to match the URL structure
 * that the SSG creates (e.g., ./file.md → /docs/file, ../blog/post.md → /blog/post)
 */

import { describe, test, expect } from 'vitest';
import { marked } from 'marked';
import path from 'path';

/**
 * Custom renderer for marked that transforms internal markdown links
 * to proper URLs based on the current file's location in the content tree
 */
function createLinkTransformer(currentDirectory) {
  const renderer = new marked.Renderer();
  const originalLinkRenderer = renderer.link.bind(renderer);

  renderer.link = function(token) {
    // In marked v15+, the link renderer receives a token object
    let href = token.href || '';
    const title = token.title || null;
    const text = token.text || '';

    // Only transform relative links that point to .md files or local paths
    if (href && typeof href === 'string' && !href.startsWith('http://') && !href.startsWith('https://') && !href.startsWith('#')) {
      // Handle .md file links
      if (href.endsWith('.md')) {
        // Remove .md extension
        href = href.slice(0, -3);
      }

      // Handle relative paths
      if (href.startsWith('./') || href.startsWith('../')) {
        // Resolve the path relative to the current directory
        const resolvedPath = path.join('/', currentDirectory, href);
        // Normalize path separators and remove any trailing slashes
        href = resolvedPath.replace(/\\/g, '/').replace(/\/$/, '');
      } else if (!href.startsWith('/')) {
        // If it's not absolute and not explicitly relative, treat as relative to current dir
        href = path.join('/', currentDirectory, href).replace(/\\/g, '/');
      }
    }

    // Create modified token with transformed href
    const modifiedToken = { ...token, href };
    return originalLinkRenderer(modifiedToken);
  };

  return renderer;
}

// Test cases
describe('Content Link Transformation', () => {
  test('transforms .md links in same directory', () => {
    const markdown = '[Link to file](./other-file.md)';
    const currentDir = 'docs';
    const renderer = createLinkTransformer(currentDir);
    const html = marked.parse(markdown, { renderer });

    expect(html).toContain('href="/docs/other-file"');
    expect(html).not.toContain('.md');
  });

  test('transforms .md links without ./ prefix in same directory', () => {
    const markdown = '[Link to file](other-file.md)';
    const currentDir = 'docs';
    const renderer = createLinkTransformer(currentDir);
    const html = marked.parse(markdown, { renderer });

    expect(html).toContain('href="/docs/other-file"');
    expect(html).not.toContain('.md');
  });

  test('transforms relative links to parent directory', () => {
    const markdown = '[Link to parent](../contributing/DEVELOPMENT.md)';
    const currentDir = 'docs';
    const renderer = createLinkTransformer(currentDir);
    const html = marked.parse(markdown, { renderer });

    expect(html).toContain('href="/contributing/DEVELOPMENT"');
    expect(html).not.toContain('.md');
  });

  test('transforms links without .md extension', () => {
    const markdown = '[Link to page](./get-started)';
    const currentDir = 'docs';
    const renderer = createLinkTransformer(currentDir);
    const html = marked.parse(markdown, { renderer });

    expect(html).toContain('href="/docs/get-started"');
  });

  test('preserves external HTTP links', () => {
    const markdown = '[External link](https://example.com)';
    const currentDir = 'docs';
    const renderer = createLinkTransformer(currentDir);
    const html = marked.parse(markdown, { renderer });

    expect(html).toContain('href="https://example.com"');
  });

  test('preserves external HTTPS links', () => {
    const markdown = '[External link](https://github.com/accretional/statue)';
    const currentDir = 'docs';
    const renderer = createLinkTransformer(currentDir);
    const html = marked.parse(markdown, { renderer });

    expect(html).toContain('href="https://github.com/accretional/statue"');
  });

  test('preserves anchor links', () => {
    const markdown = '[Anchor link](#section)';
    const currentDir = 'docs';
    const renderer = createLinkTransformer(currentDir);
    const html = marked.parse(markdown, { renderer });

    expect(html).toContain('href="#section"');
  });

  test('handles absolute internal links', () => {
    const markdown = '[Absolute link](/blog/my-post)';
    const currentDir = 'docs';
    const renderer = createLinkTransformer(currentDir);
    const html = marked.parse(markdown, { renderer });

    expect(html).toContain('href="/blog/my-post"');
  });

  test('handles nested directory links', () => {
    const markdown = '[Nested](../../other/path/file.md)';
    const currentDir = 'docs/guides';
    const renderer = createLinkTransformer(currentDir);
    const html = marked.parse(markdown, { renderer });

    expect(html).toContain('href="/other/path/file"');
    expect(html).not.toContain('.md');
  });

  test('handles links from root-level content', () => {
    const markdown = '[Docs link](./docs/guide.md)';
    const currentDir = '';
    const renderer = createLinkTransformer(currentDir);
    const html = marked.parse(markdown, { renderer });

    expect(html).toContain('href="/docs/guide"');
  });

  test('preserves title attribute', () => {
    const markdown = '[Link](./file.md "Title text")';
    const currentDir = 'docs';
    const renderer = createLinkTransformer(currentDir);
    const html = marked.parse(markdown, { renderer });

    expect(html).toContain('href="/docs/file"');
    expect(html).toContain('title="Title text"');
  });

  test('handles complex relative paths with dots', () => {
    const markdown = '[Complex](./../docs/./guide.md)';
    const currentDir = 'blog';
    const renderer = createLinkTransformer(currentDir);
    const html = marked.parse(markdown, { renderer });

    expect(html).toContain('href="/docs/guide"');
  });
});

// Manual test function that can be run to verify the transformation
export function testLinkTransformation() {
  console.log('Testing link transformation...\n');

  const testCases = [
    { markdown: '[Same dir](./file.md)', dir: 'docs', expected: '/docs/file' },
    { markdown: '[Parent](../contributing/DEVELOPMENT.md)', dir: 'docs', expected: '/contributing/DEVELOPMENT' },
    { markdown: '[External](https://example.com)', dir: 'docs', expected: 'https://example.com' },
    { markdown: '[Anchor](#section)', dir: 'docs', expected: '#section' },
    { markdown: '[No ext](./get-started)', dir: 'docs', expected: '/docs/get-started' },
  ];

  testCases.forEach(({ markdown, dir, expected }) => {
    const renderer = createLinkTransformer(dir);
    const html = marked.parse(markdown, { renderer });
    const match = html.match(/href="([^"]+)"/);
    const actual = match ? match[1] : 'NOT FOUND';
    const status = actual === expected ? '✓' : '✗';
    console.log(`${status} ${markdown} → ${actual} (expected: ${expected})`);
  });
}

export { createLinkTransformer };
