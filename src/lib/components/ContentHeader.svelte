<script lang="ts">
  export interface ContentHeaderProps {
    title?: string;
    date?: string | null;
    author?: string | null;
    backLink?: string;
    backLinkText?: string;
  }

  let { title = '', date = null, author = null, backLink = '/', backLinkText = 'Home' }: ContentHeaderProps = $props();
</script>

<header class="mb-10">
  <h1 class="text-4xl font-bold mb-4 text-[var(--color-primary)]">
    {title}
  </h1>
  
  {#if date}
    <div class="text-[var(--color-muted)] mt-4">
      Published: {new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
      {#if author}
        by {author}
      {/if}
    </div>
  {/if}
  
  <div class="mt-6">
    <a href={backLink} class="inline-flex items-center text-[var(--color-primary)] hover:brightness-110 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
      </svg>
      Back to {backLinkText}
    </a>
  </div>
</header>
