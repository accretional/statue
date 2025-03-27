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
  <title>{pageGroup ? pageGroup.title : 'Dokümantasyon'}</title>
</svelte:head>

<NavigationBar {navbarItems} activePath="/docs" />

<div class="container mx-auto px-4 py-8">
  <div class="max-w-prose mx-auto">
    <h1 class="text-3xl font-bold mb-8">{pageGroup ? pageGroup.title : 'Dokümantasyon'}</h1>
    
    {#if organizedPages.length > 0}
      {#each organizedPages as section}
        <div class="mb-10">
          {#if section.path}
            <h2 class="text-xl font-bold mb-4">{section.path.split('/').pop()}</h2>
          {:else}
            <h2 class="text-xl font-bold mb-4">Ana İçerikler</h2>
          {/if}
          
          <ul class="space-y-4">
            {#each section.pages as page}
              <li class="border-l-4 border-blue-500 pl-4">
                <a href={page.url} class="hover:text-blue-600">
                  <h3 class="font-bold">{page.title}</h3>
                  {#if page.description}
                    <p class="text-gray-600 text-sm mt-1">{page.description}</p>
                  {/if}
                </a>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    {:else}
      <ul class="space-y-4">
        {#each pageGroup?.pages || [] as page}
          <li class="border-l-4 border-blue-500 pl-4">
            <a href={page.url} class="hover:text-blue-600">
              <h3 class="font-bold">{page.metadata.title}</h3>
              {#if page.metadata.description}
                <p class="text-gray-600 text-sm mt-1">{page.metadata.description}</p>
              {/if}
            </a>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>

<footer class="bg-gray-100 mt-12 py-8">
  <div class="container mx-auto px-4 text-center text-gray-500">
    <p>© {new Date().getFullYear()} Statue SSG. SvelteKit ile geliştirilmiş statik site.</p>
  </div>
</footer>

<style>
  :global(body) {
    background-color: #f9fafb;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
</style> 