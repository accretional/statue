<script>
  import NavigationBar from '$lib/components/NavigationBar.svelte';
  
  // Loaded content
  export let data;
  
  $: directories = data.directories;
  $: directoryContent = data.directoryContent;
  $: currentDirectory = data.currentDirectory;
  $: subDirectories = data.subDirectories;
  
  // Filter contents only in the current directory
  // Not contents in subdirectories
  $: currentDirContent = directoryContent.filter(page => {
    // Exactly the contents in this directory
    // E.g.: blog/post.md is in blog/ directory
    // But blog/category/post.md is not in blog/ directory
    return page.directory === currentDirectory.name;
  });
  
  // Get all contents in subdirectories
  $: subDirContent = directoryContent.filter(page => {
    // Contents in directories under this directory
    return page.directory !== currentDirectory.name && 
           page.directory.startsWith(currentDirectory.name + '/');
  });
</script>

<svelte:head>
  <title>{currentDirectory.title}</title>
  <meta name="description" content="{currentDirectory.title} page - Created by Statue SSG" />
</svelte:head>

<NavigationBar navbarItems={directories} activePath={currentDirectory.url} />

<div class="min-h-screen text-white bg-gradient-to-b from-[var(--color-hero-from)] via-[var(--color-hero-via)] to-[var(--color-hero-to)]">
  <div class="container mx-auto px-4 py-16">
    <div class="max-w-5xl mx-auto">
      <h1 class="text-4xl font-bold mb-10 text-[var(--color-primary)]">
        {currentDirectory.title}
      </h1>
      
      <!-- Subdirectories -->
      {#if subDirectories && subDirectories.length > 0}
        <div class="mb-16">
          <h2 class="text-2xl font-bold mb-6 text-white">Subcategories</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each subDirectories as subdir}
              <div class="bg-[var(--color-card)]/50 backdrop-blur-sm border border-[var(--color-border)] p-6 rounded-xl hover:border-[var(--color-primary)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <a href={subdir.url} class="block">
                  <h3 class="font-bold text-xl text-white">{subdir.title}</h3>
                </a>
              </div>
            {/each}
          </div>
        </div>
      {/if}
      
      <!-- Contents in this directory -->
      {#if currentDirContent && currentDirContent.length > 0}
        <div class="mb-16">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {#each currentDirContent as page}
              <a href={page.url} class="block bg-[var(--color-card)]/50 backdrop-blur-sm border border-[var(--color-border)] p-6 rounded-xl hover:border-[var(--color-primary)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <h3 class="font-bold text-xl text-white mb-2">{page.metadata.title}</h3>
                {#if page.metadata.description}
                  <p class="text-[var(--color-muted)] mt-2">{page.metadata.description}</p>
                {/if}
                {#if page.metadata.date}
                  <p class="text-[var(--color-muted)] text-sm mt-2">
                    {new Date(page.metadata.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                {/if}
                <div class="mt-4 text-[var(--color-primary)] text-sm font-medium flex items-center">
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
      
      <!-- Contents in subdirectories -->
      {#if subDirContent && subDirContent.length > 0}
        <div>
          <h2 class="text-2xl font-bold mb-6 text-white">Contents in Subdirectories</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {#each subDirContent as page}
              <a href={page.url} class="block bg-[var(--color-card)]/50 backdrop-blur-sm border border-[var(--color-border)] p-6 rounded-xl hover:border-[var(--color-primary)] transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <h3 class="font-bold text-xl text-white mb-2">{page.metadata.title}</h3>
                <p class="text-[var(--color-primary)] text-sm mb-2">
                  Directory: {page.directory}
                </p>
                {#if page.metadata.description}
                  <p class="text-[var(--color-muted)] mt-2">{page.metadata.description}</p>
                {/if}
                <div class="mt-4 text-[var(--color-primary)] text-sm font-medium flex items-center">
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
      
      {#if !currentDirContent.length && !subDirContent.length}
        <div class="bg-[var(--color-card)]/50 backdrop-blur-sm border border-[var(--color-border)] p-8 rounded-xl text-center">
          <p class="text-[var(--color-muted)]">No content found in this directory.</p>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  /* Page specific styles can go here */
</style> 