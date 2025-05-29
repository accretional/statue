<script>
  import Footer from '$lib/components/Footer.svelte';
  import { page } from '$app/stores';
  
  export let data;
  
  $: globalDirectories = data.globalDirectories;
  $: currentPath = $page.url.pathname;
</script>

<main>
  <slot />
</main>

<Footer directories={globalDirectories} {currentPath} />

<style>
  :global(body) {
    background-color: #000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
</style> 