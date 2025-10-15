<script>
  // Categories component - Categories section
  export let directories = [];
</script>

{#if directories && directories.length > 0}
  <div id="directories" class="max-w-6xl mx-auto mb-32">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-bold mb-4 text-[var(--color-primary)]">
        Categories
      </h2>
      <div class="w-20 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] mx-auto rounded-full"></div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each directories as directory}
        <div class="group relative bg-[var(--color-card)]/50 backdrop-blur-sm border border-[var(--color-border)] rounded-2xl p-8 hover:border-[var(--color-primary)]/50 transition-all duration-300 hover:scale-[1.02]">
          <div class="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative">
            <div class="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 rounded-xl flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4 text-white">{directory.title}</h3>
            <a href={directory.url} class="inline-flex items-center gap-2 text-[var(--color-primary)] font-medium hover:gap-3 transition-all">
              <span>View Content</span>
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}

