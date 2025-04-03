<script>
  import { onMount } from 'svelte';
  import { loadPageGroup } from '$lib/cms/content-loader';
  import NavigationBar from '$lib/components/NavigationBar.svelte';
  
  let pageGroup = null;
  let navbarItems = [];
  let organizedPages = [];
  
  onMount(async () => {
    const result = await loadPageGroup('docs');
    if (result) {
      pageGroup = result.pageGroup;
      navbarItems = result.navbarItems;
      organizedPages = result.organizedPages;
    }
  });
</script>

<svelte:head>
  <title>{pageGroup ? pageGroup.title : 'Documentation'}</title>
</svelte:head>

<NavigationBar {navbarItems} activePath="/docs" />

<div class="bg-black text-white min-h-screen">
  <div class="container mx-auto px-4 py-16">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-10 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
        {pageGroup ? pageGroup.title : 'Documentation'}
      </h1>
      
      {#if organizedPages.length > 0}
        {#each organizedPages as section}
          <div class="mb-12">
            {#if section.path}
              <h2 class="text-2xl font-bold mb-6 text-white">{section.path.split('/').pop()}</h2>
            {:else}
              <h2 class="text-2xl font-bold mb-6 text-white">Main Content</h2>
            {/if}
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              {#each section.pages as page}
                <a href={page.url} class="block bg-gray-800 border border-gray-700 p-6 rounded-xl hover:border-green-500 transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                  <h3 class="font-bold text-xl text-white mb-2">{page.title}</h3>
                  {#if page.description}
                    <p class="text-gray-400 mt-2">{page.description}</p>
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
        {/each}
      {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {#each pageGroup?.pages || [] as page}
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
      {/if}
    </div>
  </div>
</div>

<footer class="bg-black text-gray-400 py-10 border-t border-gray-800">
  <div class="container mx-auto px-4 text-center">
    <p>© {new Date().getFullYear()} Statue SSG. Static site generator developed with SvelteKit.</p>
  </div>
</footer>

<style>
  :global(body) {
    background-color: #000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
</style> 