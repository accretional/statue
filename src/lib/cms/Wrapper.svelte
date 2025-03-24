<script lang="ts">
  export let title = '';
  export let content = '';
  export let metadata: {
    date?: string;
    author?: string;
    [key: string]: any;
  } = {};
</script>

<div class="markdown-wrapper max-w-prose mx-auto">
  {#if title}
    <h1 class="text-3xl font-bold mb-6">{title}</h1>
  {/if}

  {#if metadata.date}
    <div class="text-gray-500 mb-4">
      Published on {new Date(metadata.date).toLocaleDateString()}
      {#if metadata.author}
        by {metadata.author}
      {/if}
    </div>
  {/if}

  <div class="prose prose-blue max-w-none">
    {@html content}
  </div>
</div>

<style>
  /* Custom styling for markdown content */
  :global(.prose h1) {
    font-size: 1.5rem;
    font-weight: bold;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
  :global(.prose h2) {
    font-size: 1.25rem;
    font-weight: bold;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }
  :global(.prose h3) {
    font-size: 1.125rem;
    font-weight: bold;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }
  :global(.prose p) {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  :global(.prose ul) {
    list-style-type: disc;
    padding-left: 1.25rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  :global(.prose ol) {
    list-style-type: decimal;
    padding-left: 1.25rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  :global(.prose a) {
    color: #2563eb;
  }
  :global(.prose a:hover) {
    text-decoration: underline;
  }
  :global(.prose code) {
    background-color: #f3f4f6;
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
  }
  :global(.prose pre) {
    background-color: #f3f4f6;
    padding: 1rem;
    border-radius: 0.25rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    overflow-x: auto;
  }
</style> 