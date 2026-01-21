<script lang="ts">
  import type { ContentBodyProps } from './types';

  let { content = '' }: ContentBodyProps = $props();
</script>

<main class="prose prose-invert max-w-none">
  {@html content}
</main>

<style>
  :global(.prose) {
    max-width: 90ch;
  }
  
  /* Enhanced selectors */
  :global(.prose h1), :global(main.prose > div > h1) { font-size: 1.3rem; font-weight: bold; margin-top: 2rem; margin-bottom: 1rem; }
  :global(.prose h2), :global(main.prose > div > h2) { font-size: 1.25rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.75rem; }
  :global(.prose h3), :global(main.prose > div > h3) { font-size: 1.125rem; font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem; }
  :global(.prose p), :global(main.prose > div > p) { margin-top: 1rem; margin-bottom: 1rem; }
  :global(.prose ul), :global(main.prose > div > ul) { list-style-type: disc; padding-left: 1.25rem; margin-top: 1rem; margin-bottom: 1rem; }
  :global(.prose ol), :global(main.prose > div > ol) { list-style-type: decimal; padding-left: 1.25rem; margin-top: 1rem; margin-bottom: 1rem; }
  :global(.prose a), :global(main.prose > div > a) { color: var(--color-prose-link, var(--color-primary)); text-decoration: underline; }
  :global(.prose a:hover), :global(main.prose > div > a:hover) { text-decoration: underline; opacity: 0.8; }
  :global(.prose code), :global(main.prose > div > code) { background-color: var(--color-prose-code-bg, var(--color-card)); padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-size: 0.875rem; }
  :global(.prose pre), :global(main.prose > div > pre) { background-color: var(--color-prose-pre-bg, var(--color-card)); padding: 1rem; border-radius: 0.25rem; margin-top: 1rem; margin-bottom: 1rem; overflow-x: auto; }
  
  /* Additional styles for list items */
  :global(main.prose > div > ul > li), :global(.prose ul > li) { margin-top: 0.25rem; margin-bottom: 0.25rem; }
  :global(main.prose > div > ol > li), :global(.prose ol > li) { margin-top: 0.25rem; margin-bottom: 0.25rem; }
  
  /* Nested styles */
  :global(main.prose > div > ul > li > *), :global(.prose ul > li > *) { margin-top: 0.25rem; margin-bottom: 0.25rem; }
  :global(main.prose > div > ol > li > *), :global(.prose ol > li > *) { margin-top: 0.25rem; margin-bottom: 0.25rem; }
</style>

