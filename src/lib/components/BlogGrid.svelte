<script lang="ts">
  // BlogGrid component - Masonry-style mixed blog grid
  import BlogCard from './BlogCard.svelte';

  export interface BlogGridProps {
    posts?: Array<{
      metadata?: {
        title?: string;
        description?: string;
        date?: string;
        author?: string;
        authorAvatar?: string;
        thumbnail?: string;
        tags?: string[];
      };
      url: string;
    }>;
    emptyMessage?: string;
    enableTags?: boolean;
  }

  let {
    posts = [],
    emptyMessage = 'No posts found.',
    enableTags = false,
  }: BlogGridProps = $props();
</script>

{#if posts && posts.length > 0}
  {@const leftColumn = posts.filter((_, i) => i % 2 === 0)}
  {@const rightColumn = posts.filter((_, i) => i % 2 === 1)}
  <div class="blog-grid">
    <div class="blog-grid-column">
      {#each leftColumn as post, i}
        {@const nextPost = leftColumn[i + 1]}
        {@const nextHasThumbnail = nextPost?.metadata?.thumbnail ? true : false}
        {@const isLast = i === leftColumn.length - 1}
        <BlogCard
          title={post.metadata?.title || 'Untitled'}
          description={post.metadata?.description || ''}
          date={post.metadata?.date || ''}
          author={post.metadata?.author || ''}
          authorAvatar={post.metadata?.authorAvatar || ''}
          thumbnail={post.metadata?.thumbnail || ''}
          url={post.url}
          tags={post.metadata?.tags || []}
          {enableTags}
          {nextHasThumbnail}
          {isLast}
        />
      {/each}
    </div>
    <div class="blog-grid-column">
      {#each rightColumn as post, i}
        {@const nextPost = rightColumn[i + 1]}
        {@const nextHasThumbnail = nextPost?.metadata?.thumbnail ? true : false}
        {@const isLast = i === rightColumn.length - 1}
        <BlogCard
          title={post.metadata?.title || 'Untitled'}
          description={post.metadata?.description || ''}
          date={post.metadata?.date || ''}
          author={post.metadata?.author || ''}
          authorAvatar={post.metadata?.authorAvatar || ''}
          thumbnail={post.metadata?.thumbnail || ''}
          url={post.url}
          tags={post.metadata?.tags || []}
          {enableTags}
          {nextHasThumbnail}
          {isLast}
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
