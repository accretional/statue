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

<div class="container mx-auto px-4 py-8">
  <div class="max-w-prose mx-auto">
    <h1 class="text-3xl font-bold mb-8">{pageGroup ? pageGroup.title : 'Blog'}</h1>
    
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