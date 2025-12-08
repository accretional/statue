<script>
  import { NavigationBar } from 'statue-ssg';
  import { Hero } from 'statue-ssg';
  import { Stats } from 'statue-ssg';
  import { Categories } from 'statue-ssg';
  import { LatestContent } from 'statue-ssg';
  import { BuiltBy } from 'statue-ssg';
  
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

  <!-- Built By Section -->
    <section class="typewriter-showcase">
      <BuiltBy />
    </section>
  <!-- Stats Section -->
  <div class="stats-wrapper">
    <Stats />
  </div>

  <!-- Content Sections -->
  <div class="container mx-auto px-4 py-10">
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
  
  /* Reduce padding of Stats component on this page to sit closer to BuiltBy */
  .stats-wrapper :global(.container) {
    padding-top: 1rem !important;
  }

    /* Typewriter Showcase Section */
  .typewriter-showcase {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem 0;
    text-align: center;
    position: relative;
    z-index: 10;
  }
  
</style> 