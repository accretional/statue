<script>
  import { page } from '$app/stores';
  import NavigationBar from '$lib/components/NavigationBar.svelte';
  
  // Yüklenen içerik
  export let data;
  
  // 404 hatası verilmediyse (notFound: true) içeriği göster
  $: content = data.content;
  $: directories = data.directories;
  
  // Aktif URL için vurgu (navigasyon çubuğu için)
  $: activePath = $page.url.pathname;
  
  // Sayfa başlığı
  $: title = content ? content.metadata.title : 'İçerik Bulunamadı';
  $: description = content?.metadata?.description;
  
  // Geri dön bağlantısı oluştur
  $: backLink = content ? getBackLink(content.directory) : '/';
  $: backLinkText = content ? getBackLinkText(content.directory) : 'Ana Sayfa';
  
  // Geri dönüş bağlantısı için yardımcı fonksiyonlar
  function getBackLink(directory) {
    if (directory === 'root') return '/';
    return `/${directory}`;
  }
  
  function getBackLinkText(directory) {
    if (directory === 'root') return 'Ana Sayfa';
    return directory.charAt(0).toUpperCase() + directory.slice(1);
  }
</script>

<svelte:head>
  <title>{title}</title>
  {#if description}
    <meta name="description" content={description} />
  {/if}
</svelte:head>

{#if data.notFound}
  <!-- İçerik bulunamadı, Svelte rotanın işlenmesine izin ver -->
  <div class="bg-red-100 p-4 rounded-md my-8 max-w-prose mx-auto">
    <h2 class="text-xl font-bold text-red-700">DEBUG: İçerik bulunamadı</h2>
    <p class="my-2">URL: {$page.url.pathname}</p>
    <p class="my-2">Params: {JSON.stringify($page.params)}</p>
    <p class="my-2">Data: {JSON.stringify(data)}</p>
  </div>
{:else if content}
  <NavigationBar navbarItems={directories} {activePath} />

  <div class="container mx-auto px-4 py-8">
    <div class="max-w-prose mx-auto">
      <header class="mb-8">
        <h1 class="text-3xl font-bold">{content.metadata.title}</h1>
        
        {#if content.metadata.date}
        <div class="text-gray-500 mt-2">
          Yayınlanma: {new Date(content.metadata.date).toLocaleDateString('tr-TR')}
          {#if content.metadata.author}
            yazarı: {content.metadata.author}
          {/if}
        </div>
        {/if}
        
        <div class="mt-4">
          <a href={backLink} class="text-blue-600 hover:underline">
            ← {backLinkText}
          </a>
        </div>
      </header>
      
      <main class="prose prose-blue max-w-none">
        {@html content.content}
      </main>
    </div>
  </div>

  <footer class="bg-gray-100 mt-12 py-8">
    <div class="container mx-auto px-4 text-center text-gray-500">
      <p>© {new Date().getFullYear()} Statue SSG. SvelteKit ile geliştirilmiş statik site.</p>
    </div>
  </footer>
{:else}
  <div class="bg-yellow-100 p-4 rounded-md my-8 max-w-prose mx-auto">
    <h2 class="text-xl font-bold text-yellow-700">DEBUG: İçerik tanımlanmamış veya boş</h2>
    <p class="my-2">URL: {$page.url.pathname}</p>
    <p class="my-2">Params: {JSON.stringify($page.params)}</p>
    <p class="my-2">Data: {JSON.stringify(data)}</p>
  </div>
{/if}

<style>
  :global(.prose) {
    max-width: 65ch;
  }
  :global(.prose h1) { font-size: 1.5rem; font-weight: bold; margin-top: 2rem; margin-bottom: 1rem; }
  :global(.prose h2) { font-size: 1.25rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.75rem; }
  :global(.prose h3) { font-size: 1.125rem; font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem; }
  :global(.prose p) { margin-top: 1rem; margin-bottom: 1rem; }
  :global(.prose ul) { list-style-type: disc; padding-left: 1.25rem; margin-top: 1rem; margin-bottom: 1rem; }
  :global(.prose ol) { list-style-type: decimal; padding-left: 1.25rem; margin-top: 1rem; margin-bottom: 1rem; }
  :global(.prose a) { color: #2563eb; }
  :global(.prose a:hover) { text-decoration: underline; }
  :global(.prose code) { background-color: #f3f4f6; padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-size: 0.875rem; }
  :global(.prose pre) { background-color: #f3f4f6; padding: 1rem; border-radius: 0.25rem; margin-top: 1rem; margin-bottom: 1rem; overflow-x: auto; }
</style> 