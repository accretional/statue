<script lang="ts">
  interface Page {
    path: string;
    url: string;
    title?: string;
    slug: string;
    description?: string;
    date?: string;
  }

  export let pages: Page[] = [];
  export let title = '';
  export let hierarchical = false;
  
  // For hierarchical display, organize pages by their path levels
  $: organizedPages = hierarchical 
    ? organizeHierarchically(pages) 
    : { '': pages };
    
  function organizeHierarchically(allPages: Page[]): Record<string, Page[]> {
    const result: Record<string, Page[]> = {};
    
    allPages.forEach(page => {
      const pathParts = page.path.split('/');
      // Remove the last part (the file name)
      pathParts.pop();
      
      const parentPath = pathParts.join('/');
      
      if (!result[parentPath]) {
        result[parentPath] = [];
      }
      
      result[parentPath].push(page);
    });
    
    return result;
  }

  // Helper to get nice display name from slug
  function formatTitle(slug: string): string {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
</script>

{#if title}
  <h2 class="text-2xl font-bold mb-6">{title}</h2>
{/if}

{#if hierarchical}
  <div class="space-y-4">
    {#each Object.entries(organizedPages) as [path, pathPages]}
      <div>
        {#if path}
          <h3 class="text-xl font-semibold mb-2">{formatTitle(path.split('/').pop() || '')}</h3>
        {/if}
        <ul class="space-y-2 ml-4">
          {#each pathPages as page}
            <li>
              <a 
                href={page.url} 
                class="text-blue-600 hover:underline flex items-center"
              >
                <span class="mr-2">📄</span>
                {page.title || formatTitle(page.slug)}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
{:else}
  <ul class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {#each pages as page}
      <li class="bg-white p-4 rounded shadow-sm border">
        <a 
          href={page.url} 
          class="block hover:bg-blue-50 transition-colors rounded p-2 -m-2"
        >
          <h3 class="font-semibold text-lg">{page.title || formatTitle(page.slug)}</h3>
          
          {#if page.description}
            <p class="text-gray-600 mt-1">{page.description}</p>
          {/if}
          
          {#if page.date}
            <div class="text-gray-500 text-sm mt-2">
              {new Date(page.date).toLocaleDateString()}
            </div>
          {/if}
        </a>
      </li>
    {/each}
  </ul>
{/if} 