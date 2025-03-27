<script>
  import NavigationBar from '$lib/components/NavigationBar.svelte';
  
  // Yüklenen içerik
  export let data;
  
  $: directories = data.directories;
  $: rootContent = data.rootContent;
</script>

<svelte:head>
  <title>Statue SSG</title>
  <meta name="description" content="Svelte ile güçlendirilmiş Statue SSG, markdown içeriklerden statik site üretir." />
</svelte:head>

<NavigationBar navbarItems={directories} activePath="/" />

<div class="container mx-auto px-4 py-8">
  <div class="max-w-prose mx-auto">
    <h1 class="text-3xl font-bold mb-6">Statue SSG ile Oluşturulmuş Site</h1>
    
    <!-- Klasör Kartları -->
    {#if directories && directories.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {#each directories as directory}
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h2 class="text-xl font-bold mb-3">{directory.title}</h2>
            <a href={directory.url} class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {directory.title} İçeriğini Görüntüle
            </a>
          </div>
        {/each}
      </div>
    {/if}
    
    <!-- Ana Dizindeki İçerikler -->
    {#if rootContent && rootContent.length > 0}
      <div class="mt-12">
        <h2 class="text-2xl font-bold mb-4">İçerikler</h2>
        <ul class="space-y-4">
          {#each rootContent as page}
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
      </div>
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