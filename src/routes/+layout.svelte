<script>
  import NavigationBar from '$lib/components/NavigationBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { page } from '$app/stores';
  import { onNavigate } from '$app/navigation';
  import '$lib/index.css';

  export let data;

  $: globalDirectories = data.globalDirectories;
  $: searchConfig = data.searchConfig;
  $: currentPath = $page.url.pathname;

  // Enable View Transitions API only for blog pages
  onNavigate((navigation) => {
    // Check if View Transitions API is supported
    if (!document.startViewTransition) return;

    // Only enable transitions between blog pages
    const fromPath = navigation.from?.url?.pathname || '';
    const toPath = navigation.to?.url?.pathname || '';
    const isBlogTransition = fromPath.startsWith('/blog') && toPath.startsWith('/blog');

    if (!isBlogTransition) return;

    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<NavigationBar
  navbarItems={globalDirectories}
  showSearch={searchConfig?.enabled ?? false}
  searchPlaceholder={searchConfig?.placeholder ?? "Search..."}
/>

<main>
  <slot />
</main>

<Footer directories={globalDirectories} {currentPath} />

<style>
  :global(body) {
    background-color: var(--color-background);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    margin: 0;
    padding: 0;
  }

  :global(*) {
    box-sizing: border-box;
  }

  /* View Transitions - Blog pages only */
  :global(::view-transition-old(root)),
  :global(::view-transition-new(root)) {
    animation: 200ms ease-out both vt-fade;
  }

  :global(::view-transition-old(root)) {
    animation-direction: reverse;
  }

  @keyframes vt-fade { from { opacity: 0; } to { opacity: 1; } }

  /* Navbar stays static during transition */
  :global(::view-transition-old(navbar)),
  :global(::view-transition-new(navbar)) {
    animation: none;
  }

  /* Hero thumbnail transition - smooth morph */
  :global(::view-transition-group(*)) {
    animation-duration: 250ms;
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
</style> 