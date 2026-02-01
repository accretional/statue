<script lang="ts">
  // BlogPostContent component - Linear-style blog post content
  import { onMount } from 'svelte';
  import { centerFootnoteHash, handleFootnoteLinkClick } from '../utils/footnote-scroll.js';

  export interface BlogPostContentProps {
    html?: string;
    content?: string;
  }

  let {
    content = '',
    html = ''
  }: BlogPostContentProps = $props();

  // Use content if provided, otherwise fall back to html
  const htmlContent = content || html;

  onMount(() => {
    centerFootnoteHash();
  });
</script>

<article class="blog-post-content">
  <div class="prose" on:click={handleFootnoteLinkClick}>
    {@html htmlContent}
  </div>
</article>

<style>
  .blog-post-content {
    max-width: 860px;
    margin: 0 auto;
  }

  .prose {
    color: color-mix(in srgb, var(--color-foreground) 70%, var(--color-muted) 30%);
    font-size: 17px;
    line-height: 1.75;
  }

  /* Headings */
  :global(.blog-post-content .prose h1) {
    font-size: 28px;
    font-weight: 600;
    color: var(--color-foreground);
    margin-top: 48px;
    margin-bottom: 16px;
    letter-spacing: -0.01em;
  }

  :global(.blog-post-content .prose h2) {
    font-size: 22px;
    font-weight: 600;
    color: var(--color-foreground);
    margin-top: 40px;
    margin-bottom: 12px;
  }

  :global(.blog-post-content .prose h3) {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-foreground);
    margin-top: 32px;
    margin-bottom: 8px;
  }

  /* Paragraphs */
  :global(.blog-post-content .prose p) {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  /* First paragraph after heading - no top margin */
  :global(.blog-post-content .prose h1 + p),
  :global(.blog-post-content .prose h2 + p),
  :global(.blog-post-content .prose h3 + p) {
    margin-top: 0;
  }

  /* Links */
  :global(.blog-post-content .prose a) {
    color: var(--color-foreground);
    text-decoration: underline;
    text-decoration-color: var(--color-border);
    text-underline-offset: 3px;
    transition: text-decoration-color 0.2s ease;
  }

  :global(.blog-post-content .prose a:hover) {
    text-decoration-color: var(--color-foreground);
  }

  /* Lists */
  :global(.blog-post-content .prose ul) {
    list-style-type: disc;
    padding-left: 24px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  :global(.blog-post-content .prose ol) {
    list-style-type: decimal;
    padding-left: 24px;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  :global(.blog-post-content .prose li) {
    margin-top: 8px;
    margin-bottom: 8px;
    color: color-mix(in srgb, var(--color-foreground) 70%, var(--color-muted) 30%);
  }

  :global(.blog-post-content .prose li::marker) {
    color: var(--color-muted);
  }

  /* Strong & Emphasis */
  :global(.blog-post-content .prose strong) {
    color: var(--color-foreground);
    font-weight: 600;
  }

  :global(.blog-post-content .prose em) {
    font-style: italic;
  }

  /* Code */
  :global(.blog-post-content .prose code) {
    background-color: var(--color-card);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 15px;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  }

  :global(.blog-post-content .prose pre) {
    background-color: var(--color-card);
    padding: 20px 24px;
    border-radius: 8px;
    margin-top: 24px;
    margin-bottom: 24px;
    overflow-x: auto;
    border: 1px solid var(--color-border);
  }

  :global(.blog-post-content .prose pre code) {
    background: none;
    padding: 0;
    font-size: 14px;
    line-height: 1.6;
    color: var(--color-foreground);
  }

  /* Blockquote */
  :global(.blog-post-content .prose blockquote) {
    border-left: 3px solid var(--color-border);
    padding-left: 20px;
    margin: 24px 0;
    font-style: italic;
    color: var(--color-muted);
  }

  /* Images */
  :global(.blog-post-content .prose img) {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 32px 0;
  }

  /* Horizontal rule */
  :global(.blog-post-content .prose hr) {
    border: none;
    border-top: 1px solid var(--color-border);
    margin: 48px 0;
  }

  @media (max-width: 768px) {
    .prose {
      font-size: 16px;
    }

    :global(.blog-post-content .prose h1) {
      font-size: 24px;
    }

    :global(.blog-post-content .prose h2) {
      font-size: 20px;
    }

    :global(.blog-post-content .prose pre) {
      padding: 16px;
    }
  }
</style>
