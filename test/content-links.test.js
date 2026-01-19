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
import { compile } from 'mdsvex';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import path from 'path';

/**
 * Transform internal .md links using mdsvex compiled HTML
 * This mirrors the transformLinks function in content-processor.js
 */
function transformLinks(html, currentDirectory) {
  return html.replace(/href="([^"]+)"/g, (match, href) => {
    // Skip external links and anchors
    if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) {
      return match;
    }

    // Remove .md extension
    let transformedHref = href;
    if (transformedHref.endsWith('.md')) {
      transformedHref = transformedHref.slice(0, -3);
    }

    // Handle relative paths
    if (transformedHref.startsWith('./') || transformedHref.startsWith('../')) {
      const resolvedPath = path.join('/', currentDirectory, transformedHref);
      transformedHref = resolvedPath.replace(/\\/g, '/').replace(/\/$/, '');
    } else if (!transformedHref.startsWith('/')) {
      transformedHref = path.join('/', currentDirectory, transformedHref).replace(/\\/g, '/');
    }

    return `href="${transformedHref}"`;
  });
}

/**
 * Compile markdown with mdsvex and transform links
 */
async function compileAndTransform(markdown, currentDir) {
  const { code } = await compile(markdown, {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
    layout: null
  });

  // Extract HTML from mdsvex output
  let html = code.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

  // Apply link transformation
  return transformLinks(html, currentDir);
}

// Test cases
describe('Content Link Transformation', () => {
  test('transforms .md links in same directory', async () => {
    const markdown = '[Link to file](./other-file.md)';
    const html = await compileAndTransform(markdown, 'docs');

    expect(html).toContain('href="/docs/other-file"');
    expect(html).not.toContain('.md');
  });

  test('transforms .md links without ./ prefix in same directory', async () => {
    const markdown = '[Link to file](other-file.md)';
    const html = await compileAndTransform(markdown, 'docs');

    expect(html).toContain('href="/docs/other-file"');
    expect(html).not.toContain('.md');
  });

  test('transforms relative links to parent directory', async () => {
    const markdown = '[Link to parent](../contributing/DEVELOPMENT.md)';
    const html = await compileAndTransform(markdown, 'docs');

    expect(html).toContain('href="/contributing/DEVELOPMENT"');
    expect(html).not.toContain('.md');
  });

  test('transforms links without .md extension', async () => {
    const markdown = '[Link to page](./get-started)';
    const html = await compileAndTransform(markdown, 'docs');

    expect(html).toContain('href="/docs/get-started"');
  });

  test('preserves external HTTP links', async () => {
    const markdown = '[External link](http://example.com)';
    const html = await compileAndTransform(markdown, 'docs');

    expect(html).toContain('href="http://example.com"');
  });

  test('preserves external HTTPS links', async () => {
    const markdown = '[External link](https://github.com/accretional/statue)';
    const html = await compileAndTransform(markdown, 'docs');

    expect(html).toContain('href="https://github.com/accretional/statue"');
  });

  test('preserves anchor links', async () => {
    const markdown = '[Anchor link](#section)';
    const html = await compileAndTransform(markdown, 'docs');

    expect(html).toContain('href="#section"');
  });

  test('handles absolute internal links', async () => {
    const markdown = '[Absolute link](/blog/my-post)';
    const html = await compileAndTransform(markdown, 'docs');

    expect(html).toContain('href="/blog/my-post"');
  });

  test('handles nested directory links', async () => {
    const markdown = '[Nested](../../other/path/file.md)';
    const html = await compileAndTransform(markdown, 'docs/guides');

    expect(html).toContain('href="/other/path/file"');
    expect(html).not.toContain('.md');
  });

  test('handles links from root-level content', async () => {
    const markdown = '[Docs link](./docs/guide.md)';
    const html = await compileAndTransform(markdown, '');

    expect(html).toContain('href="/docs/guide"');
  });

  test('preserves title attribute', async () => {
    const markdown = '[Link](./file.md "Title text")';
    const html = await compileAndTransform(markdown, 'docs');

    expect(html).toContain('href="/docs/file"');
    expect(html).toContain('title="Title text"');
  });

  test('handles complex relative paths with dots', async () => {
    const markdown = '[Complex](./../docs/./guide.md)';
    const html = await compileAndTransform(markdown, 'blog');

    expect(html).toContain('href="/docs/guide"');
  });
});

// Manual test function that can be run to verify the transformation
export async function testLinkTransformation() {
  console.log('Testing link transformation...\n');

  const testCases = [
    { markdown: '[Same dir](./file.md)', dir: 'docs', expected: '/docs/file' },
    { markdown: '[Parent](../contributing/DEVELOPMENT.md)', dir: 'docs', expected: '/contributing/DEVELOPMENT' },
    { markdown: '[External](https://example.com)', dir: 'docs', expected: 'https://example.com' },
    { markdown: '[Anchor](#section)', dir: 'docs', expected: '#section' },
    { markdown: '[No ext](./get-started)', dir: 'docs', expected: '/docs/get-started' },
  ];

  for (const { markdown, dir, expected } of testCases) {
    const html = await compileAndTransform(markdown, dir);
    const match = html.match(/href="([^"]+)"/);
    const actual = match ? match[1] : 'NOT FOUND';
    const status = actual === expected ? '✓' : '✗';
    console.log(`${status} ${markdown} → ${actual} (expected: ${expected})`);
  }
}

export { transformLinks };
