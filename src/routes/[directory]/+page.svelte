<script>
  import NavigationBar from '$lib/components/NavigationBar.svelte';
  
  // Yüklenen içerik
  export let data;
  
  $: directories = data.directories;
  $: directoryContent = data.directoryContent;
  $: currentDirectory = data.currentDirectory;
  $: subDirectories = data.subDirectories;
  
  // Sadece mevcut dizinde olan içerikleri filtrele
  // Alt dizinlerdeki içerikler değil
  $: currentDirContent = directoryContent.filter(page => {
    // Tam olarak bu dizindeki içerikler 
    // Örn: blog/post.md, blog/ dizinindedir
    // Ama blog/kategori/post.md, blog/ dizininde değildir
    return page.directory === currentDirectory.name;
  });
  
  // Alt dizinlerdeki tüm içerikleri al
  $: subDirContent = directoryContent.filter(page => {
    // Bu dizinin altındaki dizinlerdeki içerikler
    return page.directory !== currentDirectory.name && 
           page.directory.startsWith(currentDirectory.name + '/');
  });
</script>

<svelte:head>
  <title>{currentDirectory.title}</title>
  <meta name="description" content="{currentDirectory.title} sayfası - Statue SSG tarafından oluşturuldu" />
</svelte:head>

<NavigationBar navbarItems={directories} activePath={currentDirectory.url} />

<div class="container mx-auto px-4 py-8">
  <div class="max-w-prose mx-auto">
    <h1 class="text-3xl font-bold mb-8">{currentDirectory.title}</h1>
    
    <!-- Alt dizinler -->
    {#if subDirectories && subDirectories.length > 0}
      <div class="mb-10">
        <h2 class="text-xl font-bold mb-4">Alt Kategoriler</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {#each subDirectories as subdir}
            <div class="border border-blue-200 rounded p-4 hover:bg-blue-50">
              <a href={subdir.url} class="block">
                <h3 class="font-bold">{subdir.title}</h3>
              </a>
            </div>
          {/each}
        </div>
      </div>
    {/if}
    
    <!-- Bu dizine ait içerikler -->
    {#if currentDirContent && currentDirContent.length > 0}
      <div class="mb-8">
        <h2 class="text-xl font-bold mb-4">Bu Dizindeki İçerikler</h2>
        <ul class="space-y-4">
          {#each currentDirContent as page}
            <li class="border-l-4 border-blue-500 pl-4">
              <a href={page.url} class="hover:text-blue-600">
                <h3 class="font-bold">{page.metadata.title}</h3>
                {#if page.metadata.description}
                  <p class="text-gray-600 text-sm mt-1">{page.metadata.description}</p>
                {/if}
                {#if page.metadata.date}
                  <p class="text-gray-500 text-xs mt-1">
                    {new Date(page.metadata.date).toLocaleDateString('tr-TR')}
                  </p>
                {/if}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
    
    <!-- Alt dizinlerdeki içerikler -->
    {#if subDirContent && subDirContent.length > 0}
      <div>
        <h2 class="text-xl font-bold mb-4">Alt Dizinlerdeki İçerikler</h2>
        <ul class="space-y-4">
          {#each subDirContent as page}
            <li class="border-l-4 border-blue-500 pl-4">
              <a href={page.url} class="hover:text-blue-600">
                <h3 class="font-bold">{page.metadata.title}</h3>
                <p class="text-gray-700 text-xs mt-1">
                  Dizin: {page.directory}
                </p>
                {#if page.metadata.description}
                  <p class="text-gray-600 text-sm mt-1">{page.metadata.description}</p>
                {/if}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
    
    {#if !currentDirContent.length && !subDirContent.length}
      <p>Bu klasörde hiçbir içerik bulunamadı.</p>
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