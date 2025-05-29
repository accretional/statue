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

<div class="bg-black text-white min-h-screen">
  <!-- Hero Section -->
  <div class="container mx-auto px-4 pt-12 pb-16 md:pt-20 md:pb-20">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
        About Statue SSG
      </h1>
      <p class="text-xl text-gray-300 mb-8">
        We're building the next generation of static site tools for creators and developers.
      </p>
    </div>
  </div>

  <!-- Content Sections with Gradient BG -->
  <div class="bg-gradient-to-b from-black to-gray-900">
    <div class="container mx-auto px-4 py-16">
      <!-- Our Mission Section -->
      <div class="max-w-5xl mx-auto mb-20">
        <h2 class="text-3xl font-bold mb-10 text-center">
          <span class="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Our Mission</span>
        </h2>
        <div class="bg-gray-800 border border-gray-700 p-8 rounded-xl">
          <p class="text-gray-300 text-lg leading-relaxed">
            At Statue SSG, we believe that content creation should be simple, fast, and accessible to everyone. 
            Our mission is to empower creators by providing tools that transform Markdown content into 
            beautiful, high-performing websites without requiring deep technical knowledge.
          </p>
          <p class="text-gray-300 text-lg leading-relaxed mt-4">
            We're committed to maintaining open-source tools that prioritize performance, 
            security, and user experience.
          </p>
        </div>
      </div>
      
      <!-- Team Section -->
      <div class="max-w-5xl mx-auto mt-24 mb-20">
        <h2 class="text-3xl font-bold mb-10 text-center">
          <span class="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Our Team</span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-gray-800 border border-gray-700 p-8 rounded-xl text-center hover:border-green-500 transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <div class="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span class="text-2xl font-bold text-white">JD</span>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">John Doe</h3>
            <p class="text-gray-400">Founder & Lead Developer</p>
          </div>
          <div class="bg-gray-800 border border-gray-700 p-8 rounded-xl text-center hover:border-green-500 transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <div class="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span class="text-2xl font-bold text-white">JS</span>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Jane Smith</h3>
            <p class="text-gray-400">UX Designer</p>
          </div>
          <div class="bg-gray-800 border border-gray-700 p-8 rounded-xl text-center hover:border-green-500 transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <div class="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span class="text-2xl font-bold text-white">MB</span>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Michael Brown</h3>
            <p class="text-gray-400">Documentation Specialist</p>
          </div>
        </div>
      </div>
      
      <!-- Why Choose Us Section -->
      <div class="max-w-5xl mx-auto mt-24 mb-8">
        <h2 class="text-3xl font-bold mb-10 text-center">
          <span class="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Why Choose Statue SSG</span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-gray-800 border border-gray-700 p-8 rounded-xl hover:border-green-500 transition-all duration-300">
            <h3 class="text-xl font-bold text-green-500 mb-3">Developer-Friendly</h3>
            <p class="text-gray-300">Built on Svelte and modern web standards with developers in mind. Extend and customize with ease.</p>
          </div>
          <div class="bg-gray-800 border border-gray-700 p-8 rounded-xl hover:border-green-500 transition-all duration-300">
            <h3 class="text-xl font-bold text-green-500 mb-3">Blazing Fast</h3>
            <p class="text-gray-300">Generate optimized static sites that load instantly and score high on performance metrics.</p>
          </div>
          <div class="bg-gray-800 border border-gray-700 p-8 rounded-xl hover:border-green-500 transition-all duration-300">
            <h3 class="text-xl font-bold text-green-500 mb-3">Content-Focused</h3>
            <p class="text-gray-300">Focus on writing with Markdown while we handle the technical details of publishing.</p>
          </div>
          <div class="bg-gray-800 border border-gray-700 p-8 rounded-xl hover:border-green-500 transition-all duration-300">
            <h3 class="text-xl font-bold text-green-500 mb-3">SEO Optimized</h3>
            <p class="text-gray-300">Built-in SEO features to help your content rank higher in search engines.</p>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="max-w-3xl mx-auto mt-24 text-center">
        <h2 class="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Ready to get started?
        </h2>
        <p class="text-xl text-gray-300 mb-8">
          Join the growing community of creators using Statue SSG
        </p>
        <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <a href="/" class="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-lg transition-all">
            Explore Features
          </a>
          <a href="/docs" class="bg-transparent border border-green-500 hover:bg-green-500/20 text-white font-bold px-6 py-3 rounded-lg transition-all">
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