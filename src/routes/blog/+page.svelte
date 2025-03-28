<script>
  import { onMount } from 'svelte';
  import { loadPageGroup } from '$lib/cms/content-loader';
  import NavigationBar from '$lib/components/NavigationBar.svelte';
  
  let pageGroup = null;
  let navbarItems = [];
  let pages = [];
  
  onMount(async () => {
    const result = await loadPageGroup('blog');
    if (result) {
      pageGroup = result.pageGroup;
      navbarItems = result.navbarItems;
      pages = pageGroup.pages.map(p => ({
        title: p.metadata.title || formatTitle(p.slug),
        url: p.url,
        description: p.metadata.description,
        date: p.metadata.date
      }));
    }
  });
  
  function formatTitle(slug) {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
</script>

<svelte:head>
  <title>{pageGroup ? pageGroup.title : 'Blog'}</title>
</svelte:head>

<NavigationBar {navbarItems} activePath="/blog" />

<div class="bg-black text-white min-h-screen">
  <div class="container mx-auto px-4 py-16">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-10 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
        {pageGroup ? pageGroup.title : 'Blog'}
      </h1>
      
      <div class="grid grid-cols-1 gap-6">
        {#each pages as page}
          <a href={page.url} class="block bg-gray-800 border border-gray-700 p-6 rounded-xl hover:border-green-500 transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <h3 class="font-bold text-xl text-white mb-2">{page.title}</h3>
            <div class="flex flex-col md:flex-row md:justify-between md:items-end">
              <div>
                {#if page.description}
                  <p class="text-gray-400 mt-2">{page.description}</p>
                {/if}
              </div>
              {#if page.date}
                <p class="text-gray-500 text-sm mt-3 md:mt-0 md:ml-4">
                  {new Date(page.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              {/if}
            </div>
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