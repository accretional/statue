/**
 * Manual test script for content link transformation
 * Run with: node test/test-links-manual.js
 */

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

console.log('Testing link transformation...\n');
console.log('='.repeat(60));

const testCases = [
  {
    markdown: '[Same dir](./file.md)',
    dir: 'docs',
    expected: '/docs/file',
    description: 'Same directory .md link'
  },
  {
    markdown: '[Parent](../contributing/DEVELOPMENT.md)',
    dir: 'docs',
    expected: '/contributing/DEVELOPMENT',
    description: 'Parent directory .md link'
  },
  {
    markdown: '[External](https://example.com)',
    dir: 'docs',
    expected: 'https://example.com',
    description: 'External HTTPS link'
  },
  {
    markdown: '[Anchor](#section)',
    dir: 'docs',
    expected: '#section',
    description: 'Anchor link'
  },
  {
    markdown: '[No ext](./get-started)',
    dir: 'docs',
    expected: '/docs/get-started',
    description: 'Link without extension'
  },
  {
    markdown: '[Implicit relative](other-file.md)',
    dir: 'docs',
    expected: '/docs/other-file',
    description: 'Implicit relative link'
  },
  {
    markdown: '[From root](./docs/guide.md)',
    dir: '',
    expected: '/docs/guide',
    description: 'Link from root-level content'
  },
  {
    markdown: '[Deep nested](../../other/path/file.md)',
    dir: 'docs/guides',
    expected: '/other/path/file',
    description: 'Deep nested relative path'
  },
];

let passed = 0;
let failed = 0;

testCases.forEach(({ markdown, dir, expected, description }) => {
  const renderer = createLinkTransformer(dir);
  const html = marked.parse(markdown, { renderer });
  const match = html.match(/href="([^"]+)"/);
  const actual = match ? match[1] : 'NOT FOUND';
  const isPass = actual === expected;

  if (isPass) {
    passed++;
    console.log(`✓ PASS: ${description}`);
  } else {
    failed++;
    console.log(`✗ FAIL: ${description}`);
  }

  console.log(`  Input:    ${markdown} (dir: "${dir}")`);
  console.log(`  Expected: ${expected}`);
  console.log(`  Actual:   ${actual}`);
  console.log('');
});

console.log('='.repeat(60));
console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log('='.repeat(60));

if (failed > 0) {
  process.exit(1);
}
