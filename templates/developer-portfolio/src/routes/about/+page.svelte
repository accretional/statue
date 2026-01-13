<script>
  import { PageHero } from 'statue-ssg';
  import { Mission } from 'statue-ssg';
  import { Team } from 'statue-ssg';
  import { WhyChooseUs } from 'statue-ssg';
  import { CTA } from 'statue-ssg';

  export let data;

  $: directories = data.directories;
</script>

<svelte:head>
  <title>About Your Site</title>
  <meta name="description" content="Learn about your Site, and how it was created." />
</svelte:head>

<div class="min-h-screen text-white bg-gradient-to-b from-[var(--color-hero-from)] via-[var(--color-hero-via)] to-[var(--color-hero-to)]">
  <!-- Hero Section -->
  <PageHero 
    title="About Your Statue Static Site" 
    description="Customize your Statue about page at src/routes/about/+page.svelte"
  />
  <!-- Content Sections -->
  <div class="container mx-auto px-4 pb-32">
    <!-- Introduction Section -->
    <div class="text-center mb-16">
      <img
        src="/favicon.png"
        alt="Statue Logo"
        class="w-64 h-64 mx-auto mb-8"
      />
      <p class="text-lg mb-4">
        Statue is an <a href="https://github.com/accretional/statue" target="_blank" class="underline hover:text-blue-300 transition-colors">open source</a> static site generator brought to you by <a href="https://accretional.com" target="_blank" class="underline hover:text-blue-300 transition-colors">Accretional</a>, a developer tools company.
      </p>
      <p class="text-lg">
        Make this site yours with the components below!
      </p>
    </div>

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

<style>
  /* Page specific styles can go here */
</style> 
