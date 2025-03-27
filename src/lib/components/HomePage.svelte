<script>
  import NavigationBar from './NavigationBar.svelte';
  
  // Content dizinlerinden alınan sayfa grupları
  export let pageGroups = [];
  export let navbarItems = [];
</script>

<main>
  <NavigationBar {navbarItems} activePath="/" />

  <div class="container mx-auto px-4 py-8">
    <div class="max-w-prose mx-auto">
      <h1 class="text-3xl font-bold mb-6">Statue SSG ile Oluşturulmuş Site</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {#each pageGroups as group}
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h2 class="text-xl font-bold mb-3">{group.title}</h2>
            <p class="text-gray-600 mb-4">
              {group.pages ? `${group.pages.length} sayfa` : 'İçerik yok'}
            </p>
            <a href={`/${group.outputDir}`} class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {group.title} Sayfalarını Görüntüle
            </a>
          </div>
        {/each}
      </div>
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