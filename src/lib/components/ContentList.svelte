<script>
  import NavigationBar from './NavigationBar.svelte';
  
  export let title = '';
  export let pages = [];
  export let hierarchical = false;
  export let organizedPages = [];
  export let navbarItems = [];
  export let activePath = '';
</script>

<main>
  <NavigationBar {navbarItems} {activePath} />

  <div class="container mx-auto px-4 py-8">
    <div class="max-w-prose mx-auto">
      <h1 class="text-3xl font-bold mb-8">{title}</h1>
      
      {#if hierarchical && organizedPages.length > 0}
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
                    {#if page.date}
                      <p class="text-gray-500 text-xs mt-1">
                        {new Date(page.date).toLocaleDateString('tr-TR')}
                      </p>
                    {/if}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      {:else}
        <ul class="space-y-4">
          {#each pages as page}
            <li class="border-l-4 border-blue-500 pl-4">
              <a href={page.url} class="hover:text-blue-600">
                <h3 class="font-bold">{page.title}</h3>
                {#if page.description}
                  <p class="text-gray-600 text-sm mt-1">{page.description}</p>
                {/if}
                {#if page.date}
                  <p class="text-gray-500 text-xs mt-1">
                    {new Date(page.date).toLocaleDateString('tr-TR')}
                  </p>
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
      <p>© {new Date().getFullYear()} Statue SSG. Svelte ile geliştirilmiş statik site.</p>
    </div>
  </footer>
</main>

<style>
  :global(body) {
    background-color: #f9fafb;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
</style> 