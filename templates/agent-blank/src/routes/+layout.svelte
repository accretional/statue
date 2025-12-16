<script>
  // AI AGENT: This is the ROOT LAYOUT
  // This wraps all pages and provides common elements
  // Import components from statue-ssg as needed
  // Available: Footer

  import { page } from '$app/stores';
  import '$lib/index.css';

  export let data;

  $: globalDirectories = data.globalDirectories;
  $: currentPath = $page.url.pathname;

  // Layout provides:
  // - globalDirectories: all directories for navigation/footer
  // - currentPath: current URL path for active state
</script>

<!-- AI AGENT: ROOT LAYOUT -->
<div class="min-h-screen flex flex-col">
  <!-- MAIN CONTENT SLOT -->
  <main class="flex-1">
    <slot />
  </main>

  <!-- FOOTER -->
  <footer class="placeholder-box m-4 mt-auto">
    <span class="text-xl font-semibold text-primary uppercase tracking-wider">FOOTER</span>
    <p class="text-sm text-secondary mt-2">Site links, social media, copyright</p>
    <p class="text-sm text-secondary mt-1">Directories: {globalDirectories?.map(d => d.name).join(', ') || 'none'}</p>
    <p class="text-sm text-secondary mt-1">Current path: {currentPath}</p>
  </footer>
</div>