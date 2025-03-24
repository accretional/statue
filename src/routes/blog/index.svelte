
<script>
  import PageGroup from '$lib/cms/PageGroup.svelte';
  
  const pages = [{"title":"Hello World","description":"Our first blog post","date":"2025-03-24T00:00:00.000Z","path":"hello-world.md","slug":"hello-world","url":"/blog/hello-world"}];
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-8">Blog</h1>
  
  <PageGroup 
    pages={pages} 
    hierarchical={false} 
  />
</div>
