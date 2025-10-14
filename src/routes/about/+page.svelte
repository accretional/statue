<script>
  import NavigationBar from '$lib/components/NavigationBar.svelte';
  import PageHero from '$lib/components/PageHero.svelte';
  import Mission from '$lib/components/Mission.svelte';
  import Team from '$lib/components/Team.svelte';
  import WhyChooseUs from '$lib/components/WhyChooseUs.svelte';
  import CTA from '$lib/components/CTA.svelte';
  
  export let data;
  
  $: directories = data.directories;
</script>

<svelte:head>
  <title>About Us | Statue SSG</title>
  <meta name="description" content="Learn about the team behind Statue SSG, our mission and values." />
</svelte:head>

<NavigationBar navbarItems={directories} activePath="/about" />

<div class="min-h-screen text-white bg-gradient-to-b from-[var(--color-hero-from)] via-[var(--color-hero-via)] to-[var(--color-hero-to)]">
  <!-- Hero Section -->
  <PageHero 
    title="About Statue SSG" 
    description="We're building the next generation of static site tools for creators and developers." 
  />

  <!-- Content Sections -->
  <div>
    <div class="container mx-auto px-4 py-16">
      <!-- Our Mission Section -->
      <Mission />
      
      <!-- Team Section -->
      <Team />
      
      <!-- Why Choose Us Section -->
      <WhyChooseUs />

      <!-- CTA Section -->
      <CTA />
    </div>
  </div>
</div>

<style>
  /* Page specific styles can go here */
</style> 