import { describe, test, expect } from 'vitest';
import { compile } from 'mdsvex';
import remarkGfm from 'remark-gfm';
import remarkFootnotes from '../src/lib/mdsvex/remark-footnotes.js';

async function renderMarkdown(markdown) {
  const { code } = await compile(markdown, {
    remarkPlugins: [remarkGfm, remarkFootnotes],
    rehypePlugins: [],
    layout: null
  });

  let html = code.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  html = html.replace(/\{@html\s+`([^`]*(?:`[^`]*`)*)`\}/g, '$1');
  html = html.replace(/\{[\s\S]*?\}/g, (match) => {
    if (match.startsWith('{@') || match.includes('=>')) {
      return '';
    }
    return match;
  });

  return html.trim();
}

describe('Footnote rendering', () => {
  test('renders references and footnote section', async () => {
    const markdown = [
      'Here is a sentence with a footnote.[^1]',
      '',
      '[^1]: This is the first footnote.'
    ].join('\n');

    const html = await renderMarkdown(markdown);

    expect(html).toContain('class="footnote-ref"');
    expect(html).toContain('class="footnotes"');
    expect(html).toContain('Footnotes');
    expect(html).toContain('id="fn-1"');
    expect(html).toContain('href="#fn-1"');
    expect(html).not.toContain('[^1]:');
  });

  test('orders footnotes by first reference', async () => {
    const markdown = [
      'First reference.[^b]',
      'Second reference.[^a]',
      '',
      '[^a]: Alpha.',
      '[^b]: Beta.'
    ].join('\n');

    const html = await renderMarkdown(markdown);
    const indexB = html.indexOf('id="fn-b"');
    const indexA = html.indexOf('id="fn-a"');

    expect(indexB).toBeGreaterThan(-1);
    expect(indexA).toBeGreaterThan(-1);
    expect(indexB).toBeLessThan(indexA);
  });

  test('supports consecutive definitions without blank lines', async () => {
    const markdown = [
      'Sentence with first note.[^1]',
      'Sentence with second note.[^bignote]',
      '',
      '[^1]: First note.',
      '[^bignote]: Second note.'
    ].join('\n');

    const html = await renderMarkdown(markdown);

    expect(html).toContain('id="fn-1"');
    expect(html).toContain('id="fn-bignote"');
    expect(html).toContain('First note.');
    expect(html).toContain('Second note.');
    expect(html).not.toContain('[^bignote]');
  });
});
