<script>
  // BlogPostHeader component - Linear-style blog post header with thumbnail
  import { page } from '$app/stores';
  import AuthorAvatar from './AuthorAvatar.svelte';

  export let title = '';
  export let description = '';
  export let date = '';
  export let author = '';
  export let authorAvatar = '';
  export let thumbnail = '';
  export let backLink = '/blog';
  export let backLinkText = 'Blog';

  // Date parsing without confusion due to timezone
  // Handles both string ("2025-12-11") and Date object from gray-matter
  function parseLocalDate(dateInput) {
    if (!dateInput) return null;

    // If it's already a Date object, return it
    if (dateInput instanceof Date) {
      return dateInput;
    }

    if (typeof dateInput === 'string') {
      const [year, month, day] = dateInput.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    return null;
  }

  // Format date
  $: formattedDate = date ? parseLocalDate(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    })
  : '';

  // Check if thumbnail exists
  $: hasThumbnail = !!thumbnail;

  // Generate matching view transition name from current URL - use slug only
  $: slug = $page.url.pathname ? $page.url.pathname.split('/').filter(Boolean).pop() : '';
  $: transitionName = slug ? `blog-thumb-${slug}` : '';
</script>

<header class="blog-post-header">
  <!-- Back link / Breadcrumb -->
  <div class="breadcrumb">
    <a href={backLink} class="back-link">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      <span>{backLinkText}</span>
    </a>
  </div>

  <!-- Title -->
  <h1 class="title">{title}</h1>

  <!-- Description -->
  {#if description}
    <p class="description">{description}</p>
  {/if}

  <!-- Thumbnail (only if provided) -->
  {#if hasThumbnail}
    <div class="thumbnail-container" style="view-transition-name: {transitionName};">
      <img src={thumbnail} alt={title} class="thumbnail" />
    </div>
  {/if}

  <!-- Meta: Author & Date -->
  <div class="meta">
    {#if author}
      <div class="avatar-wrapper" class:has-image={!!authorAvatar}>
        <AuthorAvatar {author} avatar={authorAvatar} size={null} />
      </div>
      <span class="author">{author}</span>
    {/if}
    {#if author && formattedDate}<span class="separator">·</span>{/if}
    {#if formattedDate}<span class="date">{formattedDate}</span>{/if}
  </div>
</header>

<style>
  .blog-post-header {
    text-align: center;
    margin-bottom: 48px;
  }

  .breadcrumb {
    margin-bottom: 24px;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--color-muted);
    text-decoration: none;
    font-size: 14px;
    transition: color 0.2s ease;
  }

  .back-link:hover {
    color: var(--color-foreground);
  }

  .title {
    font-size: 42px;
    font-weight: 500;
    color: var(--color-foreground);
    line-height: 1.2;
    letter-spacing: -0.02em;
    margin-bottom: 16px;
  }

  .description {
    font-size: 18px;
    color: var(--color-muted);
    line-height: 1.5;
    max-width: 800px;
    margin: 0 auto 40px;
  }

  .thumbnail-container {
    width: 100%;
    margin: 0 auto 40px;
    border-radius: 12px;
    overflow: hidden;
    background-color: var(--color-card);
  }

  .thumbnail {
    width: 100%;
    height: auto;
    display: block;
  }

  .meta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    font-size: 16px;
    color: var(--color-muted);
  }

  .avatar-wrapper {
    width: 36px;
    height: 36px;
  }

  .avatar-wrapper.has-image {
    transition: width 0.15s ease-out, height 0.15s ease-out;
  }

  .avatar-wrapper.has-image:hover {
    width: 108px;
    height: 108px;
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

  @media (max-width: 768px) {
    .title {
      font-size: 28px;
    }

    .thumbnail-container {
      border-radius: 8px;
    }
  }
</style>
