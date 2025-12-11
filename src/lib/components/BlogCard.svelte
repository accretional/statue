<script>
  // BlogCard component - Linear-style blog card with thumbnail
  import AuthorAvatar from './AuthorAvatar.svelte';

  export let title = '';
  export let description = '';
  export let date = '';
  export let author = '';
  export let authorAvatar = '';
  export let thumbnail = '';
  export let url = '';

  // Format date
  $: formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }) : '';

  // Default placeholder thumbnail
  $: thumbnailSrc = thumbnail || '/thumbnails/default.svg';
</script>

<a href={url} class="blog-card group block">
  <!-- Thumbnail -->
  <div class="thumbnail-container">
    <img
      src={thumbnailSrc}
      alt={title}
      class="thumbnail"
    />
  </div>

  <!-- Content -->
  <div class="card-content">
    <!-- Author & Date -->
    {#if author || formattedDate}
      <div class="meta">
        {#if author}
          <AuthorAvatar {author} avatar={authorAvatar} size={20} />
          <span class="author">{author}</span>
        {/if}
        {#if author && formattedDate}<span class="separator">·</span>{/if}
        {#if formattedDate}<span class="date">{formattedDate}</span>{/if}
      </div>
    {/if}

    <!-- Title -->
    <h3 class="title">{title}</h3>

    <!-- Description -->
    {#if description}
      <p class="description">{description}</p>
    {/if}
  </div>
</a>

<style>
  .blog-card {
    display: block;
    text-decoration: none;
  }

  .thumbnail-container {
    width: 100%;
    aspect-ratio: 16 / 10;
    border-radius: 12px;
    overflow: hidden;
    background-color: var(--color-card);
    border: 1px solid var(--color-border);
    margin-bottom: 16px;
  }

  .thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .card-content {
    padding: 0 4px;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: var(--color-muted);
    margin-bottom: 8px;
  }

  .author {
    color: var(--color-muted);
  }

  .separator {
    color: var(--color-muted);
  }

  .date {
    color: var(--color-muted);
  }

  .title {
    font-size: 20px;
    font-weight: 600;
    color: var(--color-foreground);
    line-height: 1.3;
    margin-bottom: 8px;
    transition: color 0.2s ease;
  }

  .blog-card:hover .title {
    color: var(--color-primary);
  }

  .description {
    font-size: 15px;
    line-height: 1.5;
    color: var(--color-muted);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
