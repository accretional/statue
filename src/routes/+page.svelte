<script>
  import NavigationBar from '$lib/components/NavigationBar.svelte';
  
  export let data;
  
  $: directories = data.directories;
  $: rootContent = data.rootContent;
</script>

<svelte:head>
  <title>Statue SSG</title>
  <meta name="description" content="Statue SSG powered by Svelte, generates static sites from markdown content." />
</svelte:head>

<NavigationBar navbarItems={directories} activePath="/" />

<div class="bg-black text-white min-h-screen">
  <!-- Hero Section -->
  <div class="container mx-auto px-4 pt-12 pb-20 md:pt-20 md:pb-24">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
        Anyone can create<br />
        content with Markdown!
      </h1>
      <p class="text-xl text-gray-300 mb-10">
        Create amazing static sites easily with Statue SSG using Markdown.
        Fast, secure, and SEO-friendly sites ready in minutes.
      </p>
      <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <a href="#directories" class="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-lg transition-all">
          Explore Content
        </a>
        <a href="/docs" class="bg-transparent border border-green-500 hover:bg-green-500/20 text-white font-bold px-6 py-3 rounded-lg transition-all">
          Documentation
        </a>
      </div>
    </div>
  </div>

  <!-- Content Sections with Gradient BG -->
  <div class="bg-gradient-to-b from-black to-gray-900">
    <div class="container mx-auto px-4 py-16">
      <!-- Folder Cards -->
      {#if directories && directories.length > 0}
        <div id="directories" class="max-w-5xl mx-auto">
          <h2 class="text-3xl font-bold mb-10 text-center">
            <span class="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Categories</span>
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each directories as directory}
              <div class="bg-gray-800 border border-gray-700 p-6 rounded-xl hover:border-green-500 transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                <h3 class="text-xl font-bold mb-3 text-white">{directory.title}</h3>
                <a href={directory.url} class="inline-block bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all mt-2">
                  View Content
                </a>
              </div>
            {/each}
          </div>
        </div>
      {/if}
      
      <!-- Root Directory Contents with Card Style -->
      {#if rootContent && rootContent.length > 0}
        <div class="max-w-5xl mx-auto mt-20">
          <h2 class="text-3xl font-bold mb-10 text-center">
            <span class="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Latest Content</span>
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {#each rootContent as page}
              <a href={page.url} class="block bg-gray-800 border border-gray-700 p-6 rounded-xl hover:border-green-500 transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                <h3 class="font-bold text-xl text-white mb-2">{page.metadata.title}</h3>
                {#if page.metadata.description}
                  <p class="text-gray-400 mt-2">{page.metadata.description}</p>
                {/if}
                <div class="mt-4 text-green-500 text-sm font-medium flex items-center">
                  <span>Read more</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </a>
            {/each}
          </div>
        </div>
      {/if}
      
      <!-- Stats Section (similar to the numbers shown in BotGauge) -->
      <div class="max-w-5xl mx-auto mt-24 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-gray-800 border border-gray-700 p-8 rounded-xl text-center">
            <div class="text-green-500 text-5xl font-bold mb-2">Fast</div>
            <p class="text-gray-400">Convert your content to a static site in seconds</p>
          </div>
          <div class="bg-gray-800 border border-gray-700 p-8 rounded-xl text-center">
            <div class="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent text-5xl font-bold mb-2">Simple</div>
            <p class="text-gray-400">Just write Markdown, we'll handle the rest</p>
          </div>
          <div class="bg-gray-800 border border-gray-700 p-8 rounded-xl text-center">
            <div class="text-green-500 text-5xl font-bold mb-2">Secure</div>
            <p class="text-gray-400">Static sites contain no security vulnerabilities</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Page specific styles can go here */
</style> 