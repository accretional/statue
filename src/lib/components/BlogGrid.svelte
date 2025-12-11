<script>
  // BlogGrid component - Linear-style 2-column blog grid
  import BlogCard from './BlogCard.svelte';

  export let posts = [];
  export let emptyMessage = 'No posts found.';
</script>

{#if posts && posts.length > 0}
  <div class="blog-grid">
    {#each posts as post}
      <BlogCard
        title={post.metadata?.title || 'Untitled'}
        description={post.metadata?.description || ''}
        date={post.metadata?.date || ''}
        author={post.metadata?.author || ''}
        authorAvatar={post.metadata?.authorAvatar || ''}
        thumbnail={post.metadata?.thumbnail || ''}
        url={post.url}
      />
    {/each}
  </div>
{:else}
  <div class="empty-state">
    <p>{emptyMessage}</p>
  </div>
{/if}

<style>
  .blog-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 48px 32px;
  }

  @media (max-width: 768px) {
    .blog-grid {
      grid-template-columns: 1fr;
      gap: 40px;
    }
  }

  .empty-state {
    background-color: color-mix(in srgb, var(--color-card) 50%, transparent);
    backdrop-filter: blur(8px);
    border: 1px solid var(--color-border);
    padding: 48px;
    border-radius: 12px;
    text-align: center;
  }

  .empty-state p {
    color: var(--color-muted);
    font-size: 15px;
  }
</style>
