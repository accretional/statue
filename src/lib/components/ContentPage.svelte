<script>
  import NavigationBar from './NavigationBar.svelte';
  
  export let title = '';
  export let content = '';
  export let date = null;
  export let author = null;
  export let backLink = null;
  export let backLinkText = '';
  export let navbarItems = [];
  export let activePath = '';
</script>

<main>
  <NavigationBar {navbarItems} {activePath} />

  <div class="container mx-auto px-4 py-8">
    <div class="max-w-prose mx-auto">
      <header class="mb-8">
        <h1 class="text-3xl font-bold">{title}</h1>
        {#if date}
        <div class="text-gray-500 mt-2">
          Yayınlanma: {new Date(date).toLocaleDateString('tr-TR')}
          {#if author}yazarı: {author}{/if}
        </div>
        {/if}
        {#if backLink}
        <div class="mt-4">
          <a href={backLink} class="text-blue-600 hover:underline">← {backLinkText} sayfasına dön</a>
        </div>
        {/if}
      </header>
      
      <main class="prose prose-blue max-w-none">
        {@html content}
      </main>
    </div>
  </div>

  <footer class="bg-gray-100 mt-12 py-8">
    <div class="container mx-auto px-4 text-center text-gray-500">
      <p>© {new Date().getFullYear()} Statue SSG. Svelte ile geliştirilmiş statik site.</p>
    </div>
  </footer>
</main>

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