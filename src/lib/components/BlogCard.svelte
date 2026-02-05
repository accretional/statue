<script lang="ts">
  // BlogCard component - Linear-style blog card with thumbnail or minimal design
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import AuthorAvatar from './AuthorAvatar.svelte';
  import TagList from './TagList.svelte';

  export interface BlogCardProps {
    title: string;
    description?: string;
    date?: string;
    author?: string;
    authorAvatar?: string;
    thumbnail?: string;
    url: string;
    tags?: string[];
    enableTags?: boolean;
    enableScrollAnimation?: boolean;
    nextHasThumbnail?: boolean;
    isLast?: boolean;
  }

  let {
    title = '',
    description = '',
    date = '',
    author = '',
    authorAvatar = '',
    thumbnail = '',
    url = '',
    tags = [],
    enableTags = false,
    enableScrollAnimation = false,
    nextHasThumbnail = false,
    isLast = false,
  }: BlogCardProps = $props();

  // Check if thumbnail exists
  let hasThumbnail = $derived(!!thumbnail);

  // Generate unique view transition name from URL - use slug only
  let slug = $derived(url ? url.split('/').filter(Boolean).pop() : '');
  let transitionName = $derived(slug ? `blog-thumb-${slug}` : '');

  // Get title initial for minimal card
  let _titleInitial = $derived(title ? title.trim().charAt(0).toUpperCase() : '?');

  // Format date
  let formattedDate = $derived(date ? new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  }) : '');

  // Scroll-based transform
  let cardElement = $state(null);
  let scale = $state(1);
  let rotation = $state(0);

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
    const _normalizedPosition = distanceFromCenter / (windowHeight / 2);

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

{#if hasThumbnail}
  <!-- Card with Thumbnail -->
  <a href={url} class="blog-card blog-card--with-thumbnail" class:no-border={nextHasThumbnail || isLast} bind:this={cardElement}>
    <div class="thumbnail-container" style="view-transition-name: {transitionName};">
      <img
        src={thumbnail}
        alt={title}
        class="thumbnail"
        style={enableScrollAnimation ? `transform: scale(${scale}) rotate(${rotation}deg);` : ''}
      />
    </div>

    <div class="card-content">
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

      <h3 class="title">{title}</h3>

      {#if description}
        <p class="description">{description}</p>
      {/if}

      {#if enableTags}
        <TagList {tags} />
      {/if}
    </div>
  </a>
{:else}
  <!-- Minimal text-only card without Thumbnail -->
  <a href={url} class="blog-card blog-card--minimal" bind:this={cardElement}>
    {#if author || formattedDate}
      <div class="meta">
        {#if author}
          <AuthorAvatar {author} avatar={authorAvatar} size={24} />
          <span class="author">{author}</span>
        {/if}
        {#if author && formattedDate}<span class="separator">·</span>{/if}
        {#if formattedDate}<span class="date">{formattedDate}</span>{/if}
      </div>
    {/if}

    <h3 class="title">{title}</h3>

    {#if description}
      <p class="description">{description}</p>
    {/if}

    {#if enableTags}
      <TagList {tags} />
    {/if}
  </a>
{/if}

<style>
  .blog-card {
    display: block;
    text-decoration: none;
  }

  /* Card with Thumbnail */
  .blog-card--with-thumbnail {
    padding-bottom: 24px;
    border-bottom: 1px solid var(--color-border);
  }

  .blog-card--with-thumbnail.no-border {
    border-bottom: none;
  }

  .blog-card--with-thumbnail .thumbnail-container {
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

  /* Minimal Card without Thumbnail */
  .blog-card--minimal {
    display: block;
    padding: 20px 0;
    border-bottom: 1px solid var(--color-border);
  }

  .blog-card--minimal .title {
    font-size: 18px;
    margin-bottom: 6px;
  }

  .blog-card--minimal .description {
    -webkit-line-clamp: 2;
    line-clamp: 2;
    font-size: 14px;
  }

  .blog-card--minimal .meta {
    margin-bottom: 8px;
    font-size: 13px;
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
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
