<script>
  // BlogCard component - Linear-style blog card with thumbnail
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import AuthorAvatar from './AuthorAvatar.svelte';

  export let title = '';
  export let description = '';
  export let date = '';
  export let author = '';
  export let authorAvatar = '';
  export let thumbnail = '';
  export let url = '';
  export let enableScrollAnimation = false;

  // Format date
  $: formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }) : '';

  // Default placeholder thumbnails
  const defaultThumbnails = [
    '/thumbnails/blog_thumbnail1.jpg',
    '/thumbnails/blog_thumbnail2.jpg'
  ];

  // Generate consistent index based on title (so same post always gets same thumbnail)
  function getDefaultThumbnail(title) {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    return defaultThumbnails[Math.abs(hash) % defaultThumbnails.length];
  }

  // Use provided thumbnail (local path or URL) or fallback to default
  $: thumbnailSrc = thumbnail || getDefaultThumbnail(title);

  // Scroll-based transform
  let cardElement;
  let scale = 1;
  let rotation = 0;

  // Generate unique random direction for this card instance
  const rotationDirection = Math.random() > 0.5 ? 1 : -1;
  const rotationMultiplier = 0.8 + Math.random() * 0.4; // 0.8 to 1.2 variation

  function handleScroll() {
    if (!enableScrollAnimation || !cardElement || !browser) return;

    const rect = cardElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calculate how far the card is from the center of the viewport
    const cardCenter = rect.top + rect.height / 2;
    const viewportCenter = windowHeight / 2;
    const distanceFromCenter = cardCenter - viewportCenter;

    // Normalize: -1 when card is at top, 0 at center, 1 at bottom
    const normalizedPosition = distanceFromCenter / (windowHeight / 2);

    // Only apply effect when card is in viewport
    if (rect.top < windowHeight && rect.bottom > 0) {
      // Progress: 0 at bottom of viewport, 1 when scrolled past top
      const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height)));

      // Scale: starts at 1, increases to 1.35 as we scroll
      scale = 1 + progress * 0.35;

      // Rotation: starts at 0, each card rotates in its own direction (up to 12 degrees)
      rotation = progress * 12 * rotationDirection * rotationMultiplier;
    } else {
      // Reset when out of viewport
      scale = 1;
      rotation = 0;
    }
  }

  onMount(() => {
    if (enableScrollAnimation && browser) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Initial call
    }
  });

  onDestroy(() => {
    if (enableScrollAnimation && browser) {
      window.removeEventListener('scroll', handleScroll);
    }
  });
</script>

<a href={url} class="blog-card group block" bind:this={cardElement}>
  <!-- Thumbnail -->
  <div class="thumbnail-container">
    <img
      src={thumbnailSrc}
      alt={title}
      class="thumbnail"
      style={enableScrollAnimation ? `transform: scale(${scale}) rotate(${rotation}deg);` : ''}
    />
  </div>

  <!-- Content -->
  <div class="card-content">
    <!-- Author & Date -->
    {#if author || formattedDate}
      <div class="meta">
        {#if author}
          <AuthorAvatar {author} avatar={authorAvatar} size={28} />
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
    will-change: transform;
    transition: transform 0.1s ease-out;
  }

  .card-content {
    padding: 0 4px;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    color: var(--color-muted);
    margin-bottom: 10px;
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
