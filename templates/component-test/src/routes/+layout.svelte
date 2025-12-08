<script>
  import { Footer } from 'statue-ssg';
  import { page } from '$app/stores';
  import '$lib/index.css';
  
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
    background-color: var(--color-background);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    margin: 0;
    padding: 0;
  }
  
  :global(*) {
    box-sizing: border-box;
  }
</style> 