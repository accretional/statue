<script>
  import { page } from '$app/stores';
  import NavigationBar from '$lib/components/NavigationBar.svelte';
  import Warning from '$lib/components/Warning.svelte';
  
  // Loaded content
  export let data;
  
  // Show content if not having error (notFound: true) 
  $: content = data.content;
  $: directories = data.directories;
  
  // Active URL for highlighting (for navigation bar)
  $: activePath = $page.url.pathname;
  
  // Page title
  $: title = content ? content.metadata.title : 'Content Not Found';
  $: description = content?.metadata?.description;
  
  // Create back link
  $: backLink = content ? getBackLink(content.directory) : '/';
  $: backLinkText = content ? getBackLinkText(content.directory) : 'Home';
  
  // Helper functions for back link
  function getBackLink(directory) {
    if (directory === 'root') return '/';
    return `/${directory}`;
  }
  
  function getBackLinkText(directory) {
    if (directory === 'root') return 'Home';
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
  <!-- Content not found, let Svelte route handle it -->
  <div class="bg-red-100 p-4 rounded-md my-8 max-w-prose mx-auto">
    <h2 class="text-xl font-bold text-red-700">DEBUG: Content not found</h2>
    <p class="my-2">URL: {$page.url.pathname}</p>
    <p class="my-2">Params: {JSON.stringify($page.params)}</p>
    <p class="my-2">Data: {JSON.stringify(data)}</p>
  </div>
{:else if content}
  <NavigationBar navbarItems={directories} {activePath} />

  <div class="min-h-screen text-white bg-gradient-to-b from-[var(--color-hero-from)] via-[var(--color-hero-via)] to-[var(--color-hero-to)]">
    <div class="container mx-auto px-4 py-16">
      <div class="max-w-4xl mx-auto">
        <header class="mb-10">
          <h1 class="text-4xl font-bold mb-4 text-[var(--color-primary)]">
            {content.metadata.title}
          </h1>
          
          {#if content.metadata.date}
            <div class="text-[var(--color-muted)] mt-4">
              Published: {new Date(content.metadata.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
              {#if content.metadata.author}
                by {content.metadata.author}
              {/if}
            </div>
          {/if}
          
          <div class="mt-6">
            <a href={backLink} class="inline-flex items-center text-[var(--color-primary)] hover:brightness-110 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
              </svg>
              Back to {backLinkText}
            </a>
          </div>
        </header>
        
        <!-- Warning component - show if warning exists in frontmatter -->
        {#if content.metadata.warning}
          <Warning warning={content.metadata.warning} />
        {/if}
        
        <main class="prose prose-invert max-w-none">
          {@html content.content}
        </main>
      </div>
    </div>
  </div>
{:else}
  <div class="bg-yellow-100 p-4 rounded-md my-8 max-w-prose mx-auto">
    <h2 class="text-xl font-bold text-yellow-700">DEBUG: Content is undefined or empty</h2>
    <p class="my-2">URL: {$page.url.pathname}</p>
    <p class="my-2">Params: {JSON.stringify($page.params)}</p>
    <p class="my-2">Data: {JSON.stringify(data)}</p>
  </div>
{/if}

<style>
  :global(.prose) {
    max-width: 65ch;
  }
  
  /* Enhanced selectors */
  :global(.prose h1), :global(main.prose > div > h1) { font-size: 1.3rem; font-weight: bold; margin-top: 2rem; margin-bottom: 1rem; }
  :global(.prose h2), :global(main.prose > div > h2) { font-size: 1.25rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.75rem; }
  :global(.prose h3), :global(main.prose > div > h3) { font-size: 1.125rem; font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem; }
  :global(.prose p), :global(main.prose > div > p) { margin-top: 1rem; margin-bottom: 1rem; }
  :global(.prose ul), :global(main.prose > div > ul) { list-style-type: disc; padding-left: 1.25rem; margin-top: 1rem; margin-bottom: 1rem; }
  :global(.prose ol), :global(main.prose > div > ol) { list-style-type: decimal; padding-left: 1.25rem; margin-top: 1rem; margin-bottom: 1rem; }
  :global(.prose a), :global(main.prose > div > a) { color: var(--color-primary); }
  :global(.prose a:hover), :global(main.prose > div > a:hover) { text-decoration: underline; }
  :global(.prose code), :global(main.prose > div > code) { background-color: var(--color-card); padding: 0.125rem 0.25rem; border-radius: 0.25rem; font-size: 0.875rem; }
  :global(.prose pre), :global(main.prose > div > pre) { background-color: var(--color-card); padding: 1rem; border-radius: 0.25rem; margin-top: 1rem; margin-bottom: 1rem; overflow-x: auto; }
  
  /* Additional styles for list items */
  :global(main.prose > div > ul > li), :global(.prose ul > li) { margin-top: 0.25rem; margin-bottom: 0.25rem; }
  :global(main.prose > div > ol > li), :global(.prose ol > li) { margin-top: 0.25rem; margin-bottom: 0.25rem; }
  
  /* Nested styles */
  :global(main.prose > div > ul > li > *), :global(.prose ul > li > *) { margin-top: 0.25rem; margin-bottom: 0.25rem; }
  :global(main.prose > div > ol > li > *), :global(.prose ol > li > *) { margin-top: 0.25rem; margin-bottom: 0.25rem; }
</style> 