<script lang="ts">
  import type { SubDirectoriesProps } from './types';

  // SubDirectories component - Subdirectories section
  let {
    directories = [],
    title = 'Subcategories'
  }: SubDirectoriesProps = $props();
</script>

{#if directories && directories.length > 0}
  <div class="mb-16">
    <h2 class="text-2xl font-bold mb-6 text-[var(--color-foreground)]">{title}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each directories as subdir}
        <div class="subdir-card bg-[var(--color-card)]/50 backdrop-blur-sm border border-[var(--color-border)] p-6 rounded-xl hover:border-[var(--color-primary)] transition-all duration-300 ">
          <a href={subdir.url} class="block">
            <h3 class="font-bold text-xl text-[var(--color-foreground)]">{subdir.title}</h3>
          </a>
        </div>
      {/each}
    </div>
  </div>
{/if}


<style>
  .subdir-card:hover {
    box-shadow: 0 0 15px color-mix(in srgb, var(--color-primary) 30%, transparent);
  }
</style>
