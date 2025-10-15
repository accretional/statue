<script>
  // DirectoryContent component - Directory content section
  export let content = [];
  export let showDirectory = false;
  export let emptyMessage = 'No content found in this directory.';
</script>

{#if content && content.length > 0}
  <div class="mb-16">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each content as page}
        <a href={page.url} class="block bg-[var(--color-card)]/50 backdrop-blur-sm border border-[var(--color-border)] p-6 rounded-xl hover:border-[var(--color-primary)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <h3 class="font-bold text-xl text-white mb-2">{page.metadata.title}</h3>
          {#if showDirectory && page.directory}
            <p class="text-[var(--color-primary)] text-sm mb-2">
              Directory: {page.directory}
            </p>
          {/if}
          {#if page.metadata.description}
            <p class="text-[var(--color-muted)] mt-2">{page.metadata.description}</p>
          {/if}
          {#if page.metadata.date}
            <p class="text-[var(--color-muted)] text-sm mt-2">
              {new Date(page.metadata.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          {/if}
          <div class="mt-4 text-[var(--color-primary)] text-sm font-medium flex items-center">
            <span>Read more</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
        </a>
      {/each}
    </div>
  </div>
{:else}
  <div class="bg-[var(--color-card)]/50 backdrop-blur-sm border border-[var(--color-border)] p-8 rounded-xl text-center">
    <p class="text-[var(--color-muted)]">{emptyMessage}</p>
  </div>
{/if}

