<script>
  // ImageGridElement component - Simple image display for grid
  export let src = '';
  export let alt = '';
  export let aspectRatio = '1 / 1'; // Default square (looks best in grids)
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

<button
  class="image-grid-element"
  class:clickable={expandable}
  on:click={toggleExpand}
  type="button"
  aria-label="Click to expand image"
>
  <img {src} {alt} class="image" style="aspect-ratio: {aspectRatio};" />
</button>

{#if isExpanded}
  <div class="lightbox" on:click={toggleExpand} role="button" tabindex="0" on:keydown={(e) => e.key === 'Enter' && toggleExpand()}>
    <button class="close-button" on:click|stopPropagation={toggleExpand} aria-label="Close">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    <div class="lightbox-content" on:click={(e) => e.stopPropagation()}>
      <img {src} {alt} class="expanded-image" />
    </div>
  </div>
{/if}

<style>
  .image-grid-element {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid var(--color-border);
    background: var(--color-card);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 0;
    width: 100%;
    display: block;
  }

  .image-grid-element.clickable {
    cursor: zoom-in;
  }

  .image-grid-element:hover {
    border-color: var(--color-primary);
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  .image {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
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
    max-width: 90vw;
    max-height: 90vh;
    cursor: default;
  }

  .expanded-image {
    max-width: 85vw;
    max-height: 85vh;
    width: auto;
    height: auto;
    display: block;
    border-radius: 8px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    object-fit: contain;
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
