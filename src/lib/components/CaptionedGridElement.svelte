<script>
  // CaptionedGridElement component - Image with caption text
  export let src = '';
  export let alt = '';
  export let caption = '';
  export let title = ''; // Optional title above caption
  export let aspectRatio = '1 / 1'; // Default square (consistent grid look)
  export let expandable = true; // Enable click to expand

  let isExpanded = false;

  function toggleExpand() {
    if (expandable) {
      isExpanded = !isExpanded;
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Escape' && isExpanded) {
      isExpanded = false;
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="captioned-grid-element">
  <button
    class="image-container"
    class:clickable={expandable}
    on:click={toggleExpand}
    type="button"
    aria-label="Click to expand image"
  >
    <img {src} {alt} class="image" style="aspect-ratio: {aspectRatio};" />
  </button>
  {#if title || caption}
    <div class="caption">
      {#if title}
        <h3 class="caption-title">{title}</h3>
      {/if}
      {#if caption}
        <p class="caption-text">{caption}</p>
      {/if}
    </div>
  {/if}
</div>

{#if isExpanded}
  <div class="lightbox" on:click={toggleExpand} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && toggleExpand()}>
    <button class="close-button" on:click|stopPropagation={toggleExpand} aria-label="Close">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    <div class="lightbox-content" on:click={(e) => e.stopPropagation()}>
      <div class="image-wrapper">
        <img {src} {alt} class="expanded-image" />
      </div>
      {#if title || caption}
        <div class="expanded-caption">
          {#if title}
            <h3 class="expanded-title">{title}</h3>
          {/if}
          {#if caption}
            <p class="expanded-text">{caption}</p>
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .captioned-grid-element {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--color-border);
    background: var(--color-card);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .captioned-grid-element:hover {
    border-color: var(--color-primary);
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  .image-container {
    width: 100%;
    overflow: hidden;
    padding: 0;
    border: none;
    background: transparent;
    display: block;
  }

  .image-container.clickable {
    cursor: zoom-in;
  }

  .image {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .captioned-grid-element:hover .image {
    transform: scale(1.05);
  }

  .caption {
    padding: 16px 20px 20px;
    background: var(--color-card);
  }

  .caption-title {
    margin: 0 0 6px 0;
    color: var(--color-foreground);
    font-size: 18px;
    font-weight: 600;
    line-height: 1.3;
    transition: color 0.2s ease;
  }

  .captioned-grid-element:hover .caption-title {
    color: var(--color-primary);
  }

  .caption-text {
    margin: 0;
    color: var(--color-muted);
    font-size: 14px;
    line-height: 1.6;
    font-weight: 400;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  @media (max-width: 640px) {
    .caption {
      padding: 14px 16px 16px;
    }

    .caption-title {
      font-size: 16px;
      margin-bottom: 4px;
    }

    .caption-text {
      font-size: 13px;
      line-height: 1.5;
      -webkit-line-clamp: 2;
    }
  }

  /* Lightbox styles */
  .lightbox {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    cursor: zoom-out;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .lightbox-content {
    position: relative;
    max-width: 85vw;
    cursor: default;
    display: inline-flex;
    flex-direction: column;
  }

  .image-wrapper {
    display: flex;
    justify-content: center;
    background: var(--color-card);
    border-radius: 8px 8px 0 0;
  }

  .expanded-image {
    max-width: 100%;
    max-height: 75vh;
    width: auto;
    height: auto;
    display: block;
    border-radius: 8px 8px 0 0;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    object-fit: contain;
  }

  .expanded-caption {
    background: var(--color-card);
    padding: 20px 24px;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  }

  .expanded-title {
    margin: 0 0 8px 0;
    color: var(--color-foreground);
    font-size: 20px;
    font-weight: 600;
  }

  .expanded-text {
    margin: 0;
    color: var(--color-muted);
    font-size: 15px;
    line-height: 1.6;
  }

  .close-button {
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    color: var(--color-foreground);
    cursor: pointer;
    padding: 12px;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .close-button:hover {
    background: var(--color-primary);
    color: var(--color-on-primary);
    transform: scale(1.05);
    border-color: var(--color-primary);
  }

  .close-button svg {
    display: block;
  }
</style>
