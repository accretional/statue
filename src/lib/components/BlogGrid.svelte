<script>
  // BlogGrid component - Masonry-style mixed blog grid
  import BlogCard from './BlogCard.svelte';

  export let posts = [];
  export let emptyMessage = 'No posts found.';
</script>

{#if posts && posts.length > 0}
  <div class="blog-grid">
    <div class="blog-grid-column">
      {#each posts.filter((_, i) => i % 2 === 0) as post}
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
    <div class="blog-grid-column">
      {#each posts.filter((_, i) => i % 2 === 1) as post}
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
  </div>
{:else}
  <div class="empty-state">
    <p>{emptyMessage}</p>
  </div>
{/if}

<style>
  .blog-grid {
    display: flex;
    gap: 32px;
  }

  .blog-grid-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  @media (max-width: 768px) {
    .blog-grid {
      flex-direction: column;
      gap: 24px;
    }

    .blog-grid-column {
      gap: 24px;
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
