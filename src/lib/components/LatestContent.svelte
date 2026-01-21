<script lang="ts">
  import type { LatestContentProps } from './types';

  let { rootContent = [], title = 'Latest Content', readMoreText = 'Read more' }: LatestContentProps = $props();
</script>

{#if rootContent && rootContent.length > 0}
  <div class="max-w-6xl mx-auto">
    <div class="text-center mb-16">
      <h2 class="text-4xl md:text-5xl font-bold mb-4 text-[var(--color-primary)]">
        {title}
      </h2>
      <div class="w-20 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] mx-auto rounded-full"></div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each rootContent as page}
        <a href={page.url} class="group relative bg-[var(--color-card)]/50 backdrop-blur-sm border border-[var(--color-border)] rounded-2xl p-8 hover:border-[var(--color-primary)]/50 transition-all duration-300 hover:scale-[1.02]">
          <div class="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative">
            <h3 class="font-bold text-2xl text-white mb-3 group-hover:text-[var(--color-primary)] transition-colors">
              {page.metadata.title}
            </h3>
            {#if page.metadata.description}
              <p class="text-[var(--color-muted)] leading-relaxed mb-4">{page.metadata.description}</p>
            {/if}
            <div class="flex items-center gap-2 text-[var(--color-primary)] font-medium group-hover:gap-3 transition-all">
              <span>{readMoreText}</span>
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
{/if}

