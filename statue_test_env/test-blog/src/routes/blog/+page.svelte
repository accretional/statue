<script>
  export let data;
  const { posts } = data;
</script>

<svelte:head>
  <title>Articles - My Blog</title>
</svelte:head>

<h1 class="text-3xl font-bold mb-8">Latest Articles</h1>

<div class="grid gap-8">
  {#each posts as post}
    <article class="group">
      <a href={post.url} class="block">
        <h2 class="text-2xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">{post.metadata.title}</h2>
        <div class="text-slate-500 text-sm mb-3">{post.metadata.date || 'No date'}</div>
        <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
          {post.metadata.description}
        </p>
      </a>
    </article>
  {/each}
</div>

