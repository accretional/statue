<script>
  // ContentGrid component - Responsive grid container for content elements
  export let columns = 3; // Default 3 columns
  export let gap = '24px'; // Gap between items
  export let title = ''; // Optional section title
</script>

<div class="content-grid-wrapper">
  {#if title}
    <h2 class="grid-title">{title}</h2>
  {/if}

  <div
    class="content-grid"
    style="--grid-columns: {columns}; --grid-gap: {gap};"
  >
    <slot />
  </div>
</div>

<style>
  .content-grid-wrapper {
    margin: 64px 0;
  }

  .grid-title {
    font-size: 36px;
    font-weight: 700;
    color: var(--color-primary);
    margin-bottom: 40px;
    text-align: center;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  .content-grid {
    display: grid;
    grid-template-columns: repeat(var(--grid-columns), 1fr);
    gap: var(--grid-gap);
  }

  /* Responsive breakpoints */
  @media (max-width: 1024px) {
    .content-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .content-grid-wrapper {
      margin: 48px 0;
    }

    .grid-title {
      font-size: 32px;
      margin-bottom: 32px;
    }
  }

  @media (max-width: 640px) {
    .content-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    .content-grid-wrapper {
      margin: 32px 0;
    }

    .grid-title {
      font-size: 28px;
      margin-bottom: 24px;
      letter-spacing: -0.01em;
    }
  }
</style>
