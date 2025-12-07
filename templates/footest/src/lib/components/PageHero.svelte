<script>
  // PageHero component - Page header section (for about, docs, etc.)
  export let title = '';
  export let description = '';
</script>

<div class="container mx-auto px-4 pt-12 pb-16 md:pt-20 md:pb-20">
  <div class="max-w-4xl mx-auto text-center">
    <h1 class="text-4xl md:text-5xl font-bold mb-6 text-[var(--color-primary)]">
      {title}
    </h1>
    {#if description}
      <p class="text-xl text-gray-300 mb-8">
        {description}
      </p>
    {/if}
  </div>
</div>

