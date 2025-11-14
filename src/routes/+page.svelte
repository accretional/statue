<script>
  import NavigationBar from '$lib/components/NavigationBar.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import Stats from '$lib/components/Stats.svelte';
  import Categories from '$lib/components/Categories.svelte';
  import LatestContent from '$lib/components/LatestContent.svelte';
  
  export let data;
  
  $: directories = data.directories;
  $: rootContent = data.rootContent;
</script>

<svelte:head>
  <title>Statue</title>
  <meta name="description" content="Statue SSG powered by Svelte, generates static sites from markdown content." />
</svelte:head>

<NavigationBar navbarItems={directories} activePath="/" />

<div class="min-h-screen bg-gradient-to-b from-[var(--color-hero-from)] via-[var(--color-hero-via)] to-[var(--color-hero-to)]">
  <!-- Hero Section -->
  <Hero />

  <!-- Stats Section -->
  <Stats />

  <!-- Content Sections -->
  <div class="container mx-auto px-4 py-20">
    <!-- Categories Section -->
    <Categories {directories} />
    
    <!-- Latest Content Section -->
    <LatestContent {rootContent} />
  </div>
</div>

<style>
  /* Add smooth scroll behavior */
  :global(html) {
    scroll-behavior: smooth;
  }
</style> 