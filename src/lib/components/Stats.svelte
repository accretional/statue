<script lang="ts">
  export interface StatsProps {
    stats?: Array<{
      title: string;
      description: string;
      color?: string;
    }>;
  }

  // Stats component - Statistics cards section
  let { 
    stats = [
      { title: 'Fast', description: 'Put your content on a static site in seconds', color: 'primary' },
      { title: 'Simple', description: 'Just write Markdown, we\'ll handle the rest', color: 'secondary' },
      { title: 'Secure', description: 'Static sites require no server maintenance or configuration', color: 'primary' }
    ]
  }: StatsProps = $props();
</script>

<div class="container mx-auto px-4 pt-8 pb-24">
  <div class="max-w-6xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      {#each stats as stat}
        <div class="group relative bg-[var(--color-card)]/50 backdrop-blur-sm border border-[var(--color-border)] rounded-2xl p-8 hover:border-[var(--color-{stat.color})]/50 transition-all duration-300">
          <div class="absolute inset-0 bg-gradient-to-br from-[var(--color-{stat.color})]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative">
            <div class="text-6xl font-bold mb-4 text-[var(--color-{stat.color})]">
              {stat.title}
            </div>
            <p class="text-[var(--color-muted)] leading-relaxed">{stat.description}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
