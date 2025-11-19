<script>
  export let data;
  const { post } = data;
</script>

<svelte:head>
  <title>{post.metadata.title}</title>
</svelte:head>

<article class="prose dark:prose-invert prose-lg max-w-none">
  <header class="mb-8 not-prose">
    <h1 class="text-4xl font-bold mb-2">{post.metadata.title}</h1>
    <div class="text-slate-500">{post.metadata.date}</div>
  </header>
  
  <!-- Render HTML content -->
  {@html post.content}
</article>

