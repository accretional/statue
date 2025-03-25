
<script>
  import PageGroup from '$lib/cms/PageGroup.svelte';
  
  const pages = [{"title":"Advanced Configuration","description":"Learn about advanced configuration options","path":"advanced/configuration.md","slug":"configuration","url":"/docs/advanced/configuration"},{"title":"Getting Started","description":"Learn how to get started with our platform","path":"getting-started.md","slug":"getting-started","url":"/docs/getting-started"}];
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">Documentation</h1>
  
  <PageGroup 
    pages={pages} 
    hierarchical={true} 
  />
</div>
