<script lang="ts">
  // Simple test card for SQLite component testing
  export let name = 'Product';
  export let description = 'No description';
  export let price = '0';
  export let badge = '';
  export let featured = 0;
</script>

<div class="product-card">
  {#if badge}
    <div class="badge">{badge}</div>
  {/if}
  <h3>{name}</h3>
  <p>{description}</p>
  <div class="price">{price}</div>
  {#if featured}
    <div class="featured-tag">Featured</div>
  {/if}
</div>

<style>
  .product-card {
    position: relative;
    background-color: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 24px;
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  .badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
  }

  h3 {
    font-size: 20px;
    font-weight: 600;
    color: var(--color-text);
    margin: 0 0 8px 0;
  }

  p {
    color: var(--color-muted);
    font-size: 14px;
    line-height: 1.5;
    margin: 0 0 16px 0;
  }

  .price {
    font-size: 24px;
    font-weight: 700;
    color: var(--color-primary);
  }

  .featured-tag {
    display: inline-block;
    margin-top: 12px;
    background: color-mix(in srgb, var(--color-primary) 20%, transparent);
    color: var(--color-primary);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
  }
</style>
