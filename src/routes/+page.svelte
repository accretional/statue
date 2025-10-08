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

<div class="min-h-screen bg-gradient-to-b from-[var(--color-hero-from)] via-[var(--color-hero-via)] to-[var(--color-hero-to)]">
  <!-- Hero Section -->
  <div class="container mx-auto px-4 pt-20 pb-32 md:pt-32 md:pb-40">
    <div class="max-w-5xl mx-auto text-center relative">
      <!-- Decorative elements -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl opacity-20"></div>
      
      <div class="relative z-10">
        <!-- Badge -->
        <div class="inline-flex items-center px-4 py-1.5 rounded-full bg-[color:oklch(0.78_0.14_152.17)/0.10] border border-[color:oklch(0.78_0.14_152.17)/0.20] mb-8">
          <span class="text-sm font-medium text-[var(--color-primary)]">✨ Powered by Markdown Files</span>
        </div>
        
        <h1 class="text-5xl md:text-7xl font-bold mb-8 leading-tight">
          <span class="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Anyone can create<br />
          </span>
          <span class="bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] bg-clip-text text-transparent">
            Websites with Markdown!
          </span>
        </h1>
        
        <p class="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
          Create amazing static sites easily with Statue SSG using Markdown.
          Fast, secure, and SEO-friendly sites ready in minutes.
        </p>
        
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <a href="#directories" class="group relative px-8 py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105">
            <span class="relative z-10">Explore Content</span>
            <div class="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] opacity-0 group-hover:opacity-100 transition-opacity brightness-110"></div>
          </a>
          <a href="/docs" class="group px-8 py-4 bg-slate-800/50 backdrop-blur-sm text-white font-semibold rounded-xl border border-slate-700/50 hover:border-[var(--color-primary)]/50 hover:bg-slate-800 transition-all duration-300">
            Documentation
            <span class="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- Stats Section - Moved up for better flow -->
  <div class="container mx-auto px-4 pb-24">
    <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 hover:border-[var(--color-primary)]/50 transition-all duration-300">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative">
            <div class="text-6xl font-bold mb-4 bg-gradient-to-br from-[var(--color-primary)] to-emerald-600 bg-clip-text text-transparent">
              Fast
            </div>
            <p class="text-slate-400 leading-relaxed">Convert your content to a static site in seconds</p>
          </div>
        </div>
        
        <div class="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 hover:border-[var(--color-secondary)]/50 transition-all duration-300">
          <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative">
            <div class="text-6xl font-bold mb-4 bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-accent)] bg-clip-text text-transparent">
              Simple
            </div>
            <p class="text-slate-400 leading-relaxed">Just write Markdown, we'll handle the rest</p>
          </div>
        </div>
        
        <div class="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 hover:border-[var(--color-primary)]/50 transition-all duration-300">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="relative">
            <div class="text-6xl font-bold mb-4 bg-gradient-to-br from-[var(--color-primary)] to-emerald-600 bg-clip-text text-transparent">
              Secure
            </div>
            <p class="text-slate-400 leading-relaxed">Static sites contain no security vulnerabilities</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Content Sections -->
  <div class="container mx-auto px-4 py-20">
    <!-- Categories Section -->
    {#if directories && directories.length > 0}
      <div id="directories" class="max-w-6xl mx-auto mb-32">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-4">
            <span class="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
              Categories
            </span>
          </h2>
          <div class="w-20 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] mx-auto rounded-full"></div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each directories as directory}
            <div class="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 hover:border-[var(--color-primary)]/50 transition-all duration-300 hover:scale-[1.02]">
              <div class="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="relative">
                <div class="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 rounded-xl flex items-center justify-center mb-4">
                  <svg class="w-6 h-6 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <h3 class="text-2xl font-bold mb-4 text-white">{directory.title}</h3>
                <a href={directory.url} class="inline-flex items-center gap-2 text-[var(--color-primary)] font-medium hover:gap-3 transition-all">
                  <span>View Content</span>
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
    
    <!-- Latest Content Section -->
    {#if rootContent && rootContent.length > 0}
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-4">
            <span class="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
              Latest Content
            </span>
          </h2>
          <div class="w-20 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] mx-auto rounded-full"></div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {#each rootContent as page}
            <a href={page.url} class="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 hover:border-[var(--color-primary)]/50 transition-all duration-300 hover:scale-[1.02]">
              <div class="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="relative">
                <h3 class="font-bold text-2xl text-white mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                  {page.metadata.title}
                </h3>
                {#if page.metadata.description}
                  <p class="text-slate-400 leading-relaxed mb-4">{page.metadata.description}</p>
                {/if}
                <div class="flex items-center gap-2 text-[var(--color-primary)] font-medium group-hover:gap-3 transition-all">
                  <span>Read more</span>
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </a>
          {/each}
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  /* Add smooth scroll behavior */
  :global(html) {
    scroll-behavior: smooth;
  }
</style> 