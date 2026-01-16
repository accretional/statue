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
        <img {src} {alt} class="expanded-image" style="aspect-ratio: {aspectRatio};" />
      </div>
      {#if title || caption}
        <div class="expanded-caption-card">
          <div class="caption-content">
            {#if title}
              <h3 class="expanded-title">{title}</h3>
            {/if}
            {#if caption}
              <p class="expanded-text">{caption}</p>
            {/if}
          </div>
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
    -webkit-line-clamp: 2;
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
    animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .lightbox-content {
    position: relative;
    cursor: default;
    max-width: min(600px, 90vw);
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    border-radius: 12px;
    background: var(--color-card);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    border: 1px solid var(--color-border);
    animation: scaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .image-wrapper {
    display: flex;
    justify-content: center;
    border-radius: 12px 12px 0 0;
    background: var(--color-card);
    overflow: hidden;
  }

  .expanded-image {
    width: 100%;
    aspect-ratio: var(--aspect-ratio, 1 / 1);
    display: block;
    object-fit: cover;
  }

  .expanded-caption-card {
    position: relative;
    background: var(--color-card);
    width: 100%;
    text-align: left;
    border-radius: 0 0 12px 12px;
  }

  .caption-content {
    padding: 20px 24px;
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

  @media (max-width: 640px) {
    .lightbox {
      padding: 12px;
    }

    .lightbox-content {
      max-width: 95vw;
    }

    .caption-content {
      padding: 16px;
    }

    .expanded-title {
      font-size: 18px;
    }

    .expanded-text {
      font-size: 14px;
      line-height: 1.5;
    }

    .close-button {
      top: 12px;
      right: 12px;
    }
  }
</style>
