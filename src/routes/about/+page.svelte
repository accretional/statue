<script>
  import NavigationBar from '$lib/components/NavigationBar.svelte';
  
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
  <div class="container mx-auto px-4 pt-12 pb-16 md:pt-20 md:pb-20">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl md:text-5xl font-bold mb-6 text-[var(--color-primary)]">
        About Statue SSG
      </h1>
      <p class="text-xl text-gray-300 mb-8">
        We're building the next generation of static site tools for creators and developers.
      </p>
    </div>
  </div>

  <!-- Content Sections (no background transition) -->
  <div>
    <div class="container mx-auto px-4 py-16">
      <!-- Our Mission Section -->
      <div class="max-w-5xl mx-auto mb-20">
        <h2 class="text-3xl font-bold mb-10 text-center text-[var(--color-primary)]">
          Our Mission
        </h2>
        <div class="bg-[var(--color-card)]/50 backdrop-blur-sm border border-[var(--color-border)] p-8 rounded-xl">
          <p class="text-[var(--color-foreground)] text-lg leading-relaxed">
            At Statue SSG, we believe that content creation should be simple, fast, and accessible to everyone. 
            Our mission is to empower creators by providing tools that transform Markdown content into 
            beautiful, high-performing websites without requiring deep technical knowledge.
          </p>
          <p class="text-[var(--color-foreground)] text-lg leading-relaxed mt-4">
            We're committed to maintaining open-source tools that prioritize performance, 
            security, and user experience.
          </p>
        </div>
      </div>
      
      <!-- Team Section -->
      <div class="max-w-5xl mx-auto mt-24 mb-20">
        <h2 class="text-3xl font-bold mb-10 text-center text-[var(--color-primary)]">
          Our Team
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-[var(--color-card)] border border-[var(--color-border)] p-8 rounded-xl text-center hover:border-[var(--color-primary)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <div class="w-24 h-24 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full mx-auto mb-4 flex items-center justify-center">
              <span class="text-2xl font-bold text-white">JD</span>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">John Doe</h3>
            <p class="text-[var(--color-muted)]">Founder & Lead Developer</p>
          </div>
          <div class="bg-[var(--color-card)] border border-[var(--color-border)] p-8 rounded-xl text-center hover:border-[var(--color-primary)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <div class="w-24 h-24 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full mx-auto mb-4 flex items-center justify-center">
              <span class="text-2xl font-bold text-white">JS</span>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Jane Smith</h3>
            <p class="text-[var(--color-muted)]">UX Designer</p>
          </div>
          <div class="bg-[var(--color-card)] border border-[var(--color-border)] p-8 rounded-xl text-center hover:border-[var(--color-primary)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <div class="w-24 h-24 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] rounded-full mx-auto mb-4 flex items-center justify-center">
              <span class="text-2xl font-bold text-white">MB</span>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Michael Brown</h3>
            <p class="text-[var(--color-muted)]">Documentation Specialist</p>
          </div>
        </div>
      </div>
      
      <!-- Why Choose Us Section -->
      <div class="max-w-5xl mx-auto mt-24 mb-8">
        <h2 class="text-3xl font-bold mb-10 text-center text-[var(--color-primary)]">
          Why Choose Statue SSG
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-[var(--color-card)]/50 backdrop-blur-sm border border-[var(--color-border)] p-8 rounded-xl hover:border-[var(--color-primary)] transition-all duration-300">
            <h3 class="text-xl font-bold text-[var(--color-primary)] mb-3">Developer-Friendly</h3>
            <p class="text-[var(--color-foreground)]">Built on Svelte and modern web standards with developers in mind. Extend and customize with ease.</p>
          </div>
          <div class="bg-[var(--color-card)]/50 backdrop-blur-sm border border-[var(--color-border)] p-8 rounded-xl hover:border-[var(--color-primary)] transition-all duration-300">
            <h3 class="text-xl font-bold text-[var(--color-primary)] mb-3">Blazing Fast</h3>
            <p class="text-[var(--color-foreground)]">Generate optimized static sites that load instantly and score high on performance metrics.</p>
          </div>
          <div class="bg-[var(--color-card)]/50 backdrop-blur-sm border border-[var(--color-border)] p-8 rounded-xl hover:border-[var(--color-primary)] transition-all duration-300">
            <h3 class="text-xl font-bold text-[var(--color-primary)] mb-3">Content-Focused</h3>
            <p class="text-[var(--color-foreground)]">Focus on writing with Markdown while we handle the technical details of publishing.</p>
          </div>
          <div class="bg-[var(--color-card)]/50 backdrop-blur-sm border border-[var(--color-border)] p-8 rounded-xl hover:border-[var(--color-primary)] transition-all duration-300">
            <h3 class="text-xl font-bold text-[var(--color-primary)] mb-3">SEO Optimized</h3>
            <p class="text-[var(--color-foreground)]">Built-in SEO features to help your content rank higher in search engines.</p>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="max-w-3xl mx-auto mt-24 text-center">
        <h2 class="text-3xl font-bold mb-6 text-[var(--color-primary)]">
          Ready to get started?
        </h2>
        <p class="text-xl text-[var(--color-foreground)] mb-8">
          Join the growing community of creators using Statue SSG
        </p>
        <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <a href="/" class="bg-[var(--color-primary)] hover:brightness-110 text-white font-bold px-6 py-3 rounded-lg transition-all">
            Explore Features
          </a>
          <a href="/docs" class="bg-transparent border border-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 text-white font-bold px-6 py-3 rounded-lg transition-all">
            Read Documentation
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Page specific styles can go here */
</style> 