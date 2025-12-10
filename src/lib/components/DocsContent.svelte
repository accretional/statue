<!--
  DocsContent - Documentation content renderer with TOC extraction

  Usage:
  ```svelte
  <script>
    import { DocsContent } from 'statue-ssg';

    let headings = [];
  </script>

  <DocsContent
    content={htmlContent}
    title="Getting Started"
    description="Learn how to get started with our platform"
    bind:headings
  />
  ```

  Props:
  - content: HTML content string
  - title: Page title
  - description: Optional page description
  - lastUpdated: Optional last updated date
  - editUrl: Optional URL to edit this page on GitHub
  - bind:headings: Extracted headings for TOC (reactive output)
-->

<script>
  import { onMount, tick } from 'svelte';
  import { browser } from '$app/environment';

  export let content = '';
  export let title = '';
  export let description = '';
  export let lastUpdated = '';
  export let editUrl = '';
  export let headings = [];

  let contentElement;
  let lastContent = '';
  let mounted = false;

  onMount(() => {
    mounted = true;
    extractHeadings();
  });

  // Extract headings when content changes
  async function extractHeadings() {
    if (!browser || !contentElement) return;

    await tick(); // Wait for DOM to update

    const headingElements = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const extractedHeadings = [];

    headingElements.forEach((el, index) => {
      // Generate ID if not present
      if (!el.id) {
        el.id = el.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || `heading-${index}`;
      }

      extractedHeadings.push({
        id: el.id,
        text: el.textContent || '',
        level: parseInt(el.tagName.charAt(1))
      });
    });

    headings = extractedHeadings;
  }

  // Re-extract headings when content changes
  $: if (mounted && content !== lastContent) {
    lastContent = content;
    extractHeadings();
  }
</script>

<article class="docs-content">
  <!-- Page header -->
  <header class="mb-8 pb-8 border-b border-[var(--color-border)]">
    {#if title}
      <h1 class="text-3xl sm:text-4xl font-bold text-[var(--color-foreground)] mb-4">
        {title}
      </h1>
    {/if}

    {#if description}
      <p class="text-lg text-[var(--color-muted)] leading-relaxed">
        {description}
      </p>
    {/if}

    {#if lastUpdated || editUrl}
      <div class="flex flex-wrap items-center gap-4 mt-4 text-sm text-[var(--color-muted)]">
        {#if lastUpdated}
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Last updated: {lastUpdated}
          </span>
        {/if}

        {#if editUrl}
          <a
            href={editUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1 hover:text-[var(--color-primary)] transition-colors"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit this page
          </a>
        {/if}
      </div>
    {/if}
  </header>

  <!-- Main content -->
  <div
    bind:this={contentElement}
    class="prose prose-docs max-w-none pb-16"
  >
    {@html content}
  </div>
</article>

<style>
  /* Documentation prose styles */
  :global(.prose-docs) {
    color: var(--color-foreground);
  }

  :global(.prose-docs h1) {
    font-size: 2rem;
    font-weight: 700;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    color: var(--color-foreground);
    scroll-margin-top: 5rem;
  }

  :global(.prose-docs h2) {
    font-size: 1.5rem;
    font-weight: 600;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
    color: var(--color-foreground);
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--color-border);
    scroll-margin-top: 5rem;
  }

  :global(.prose-docs h3) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--color-foreground);
    scroll-margin-top: 5rem;
  }

  :global(.prose-docs h4) {
    font-size: 1.125rem;
    font-weight: 600;
    margin-top: 1.25rem;
    margin-bottom: 0.5rem;
    color: var(--color-foreground);
    scroll-margin-top: 5rem;
  }

  :global(.prose-docs p) {
    margin-top: 1rem;
    margin-bottom: 1rem;
    line-height: 1.75;
    color: color-mix(in srgb, var(--color-foreground) 70%, var(--color-muted) 30%);
  }

  :global(.prose-docs a) {
    color: var(--color-primary);
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  :global(.prose-docs a:hover) {
    opacity: 0.8;
  }

  :global(.prose-docs strong) {
    color: var(--color-foreground);
    font-weight: 600;
  }

  :global(.prose-docs ul),
  :global(.prose-docs ol) {
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }

  :global(.prose-docs ul) {
    list-style-type: disc;
  }

  :global(.prose-docs ol) {
    list-style-type: decimal;
  }

  :global(.prose-docs li) {
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
    color: color-mix(in srgb, var(--color-foreground) 70%, var(--color-muted) 30%);
    line-height: 1.75;
  }

  :global(.prose-docs li::marker) {
    color: var(--color-muted);
  }

  :global(.prose-docs code) {
    background-color: var(--color-card);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-size: 0.875em;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    color: var(--color-primary);
  }

  :global(.prose-docs pre) {
    background-color: var(--color-card);
    padding: 1rem 1.25rem;
    border-radius: 0.5rem;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    overflow-x: auto;
    border: 1px solid var(--color-border);
  }

  :global(.prose-docs pre code) {
    background-color: transparent;
    padding: 0;
    border-radius: 0;
    font-size: 0.875rem;
    color: var(--color-foreground);
  }

  :global(.prose-docs blockquote) {
    border-left: 4px solid var(--color-primary);
    padding-left: 1rem;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    font-style: italic;
    color: var(--color-muted);
  }

  :global(.prose-docs hr) {
    border: none;
    border-top: 1px solid var(--color-border);
    margin-top: 2rem;
    margin-bottom: 2rem;
  }

  :global(.prose-docs table) {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
  }

  :global(.prose-docs th) {
    background-color: var(--color-card);
    padding: 0.75rem 1rem;
    text-align: left;
    font-weight: 600;
    color: var(--color-foreground);
    border-bottom: 2px solid var(--color-border);
  }

  :global(.prose-docs td) {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--color-border);
    color: color-mix(in srgb, var(--color-foreground) 70%, var(--color-muted) 30%);
  }

  :global(.prose-docs img) {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }
</style>
