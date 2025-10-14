<script>
  // WhyChooseUs component - Neden bizi seçmelisiniz bölümü
  export let features = [
    { title: 'Developer-Friendly', description: 'Built on Svelte and modern web standards with developers in mind. Extend and customize with ease.' },
    { title: 'Blazing Fast', description: 'Generate optimized static sites that load instantly and score high on performance metrics.' },
    { title: 'Content-Focused', description: 'Focus on writing with Markdown while we handle the technical details of publishing.' },
    { title: 'SEO Optimized', description: 'Built-in SEO features to help your content rank higher in search engines.' }
  ];
</script>

<div class="max-w-5xl mx-auto mt-24 mb-8">
  <h2 class="text-3xl font-bold mb-10 text-center text-[var(--color-primary)]">
    Why Choose Statue SSG
  </h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    {#each features as feature}
      <div class="bg-[var(--color-card)]/50 backdrop-blur-sm border border-[var(--color-border)] p-8 rounded-xl hover:border-[var(--color-primary)] transition-all duration-300">
        <h3 class="text-xl font-bold text-[var(--color-primary)] mb-3">{feature.title}</h3>
        <p class="text-[var(--color-foreground)]">{feature.description}</p>
      </div>
    {/each}
  </div>
</div>

