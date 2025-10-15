<script>
  // SubDirectories component - Subdirectories section
  export let subDirectories = [];
</script>

{#if subDirectories && subDirectories.length > 0}
  <div class="mb-16">
    <h2 class="text-2xl font-bold mb-6 text-white">Subcategories</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each subDirectories as subdir}
        <div class="bg-[var(--color-card)]/50 backdrop-blur-sm border border-[var(--color-border)] p-6 rounded-xl hover:border-[var(--color-primary)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <a href={subdir.url} class="block">
            <h3 class="font-bold text-xl text-white">{subdir.title}</h3>
          </a>
        </div>
      {/each}
    </div>
  </div>
{/if}

