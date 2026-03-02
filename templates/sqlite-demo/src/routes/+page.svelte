<script lang="ts">
  import SQLiteMultiDB from 'statue-ssg/components/SQLiteMultiDB.svelte';
  import SQLiteRenderer from 'statue-ssg/components/SQLiteRenderer.svelte';
  import SQLiteGrid from 'statue-ssg/components/SQLiteGrid.svelte';
  import ProductCard from '$lib/components/ProductCard.svelte';

  // Database sources for multi-database testing
  const databases = [
    { name: 'products', path: '/products.db' },
    { name: 'promotions', path: '/promotions.db' }
  ];
</script>

<svelte:head>
  <title>SQLite Dynamic Components Demo</title>
  <meta name="description" content="Demonstration of Statue's SQLite dynamic component rendering with OPFS caching and native SQL JOINs" />
</svelte:head>

<div class="demo-page">
  <header>
    <h1>SQLite Dynamic Components</h1>
    <p class="subtitle">Multi-database queries with native SQL JOINs and OPFS caching</p>
    <nav class="header-nav">
      <a href="/components" class="nav-link nav-link-secondary">Component Registry →</a>
      <a href="/project-files" class="nav-link nav-link-secondary">Project Files →</a>
    </nav>
  </header>

  <!-- Demo 1: SQLiteRenderer with SQL LEFT JOIN -->
  <section>
    <h2>1. SQLiteRenderer - Cross-Database LEFT JOIN</h2>
    <p class="description">
      Queries products.db and promotions.db using a native SQL LEFT JOIN via ATTACH DATABASE.
      Results are cached in OPFS after the first load.
    </p>

    <SQLiteRenderer
      {databases}
      query="SELECT p.*, d.discount, d.badge
             FROM items p
             LEFT JOIN promotions.deals d ON p.id = d.product_id
             WHERE d.active = 1 OR d.product_id IS NULL"
      component={ProductCard}
      propMapping={{
        name: 'name',
        description: 'description',
        price: (row) => row.discount
          ? `$${(row.price * (1 - row.discount)).toFixed(2)}`
          : `$${row.price.toFixed(2)}`,
        badge: 'badge',
        featured: 'featured'
      }}
      containerProps={{ columns: 3, gap: '24px' }}
      emptyMessage="No products with active promotions found."
    />
  </section>

  <!-- Demo 2: SQLiteMultiDB Raw Data with INNER JOIN -->
  <section>
    <h2>2. SQLiteMultiDB - INNER JOIN (Only Promoted Products)</h2>
    <p class="description">
      SQL INNER JOIN returns only products that have active promotions.
    </p>

    <SQLiteMultiDB
      {databases}
      query="SELECT p.*, d.discount, d.badge
             FROM items p
             INNER JOIN promotions.deals d ON p.id = d.product_id
             WHERE d.active = 1"
      let:data
    >
      <div class="data-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Original Price</th>
              <th>Discount</th>
              <th>Final Price</th>
              <th>Badge</th>
            </tr>
          </thead>
          <tbody>
            {#each data as item}
              <tr>
                <td>{item.name}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>{item.discount ? `${(item.discount * 100).toFixed(0)}%` : 'None'}</td>
                <td><strong>${item.discount ? (item.price * (1 - item.discount)).toFixed(2) : item.price.toFixed(2)}</strong></td>
                <td>{item.badge || 'N/A'}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </SQLiteMultiDB>
  </section>

  <!-- Demo 3: Single Database with SQLiteRenderer -->
  <section>
    <h2>3. Single Database - All Products</h2>
    <p class="description">
      Simple single-database query showing all products.
    </p>

    <SQLiteRenderer
      databases={[{ name: 'main', path: '/products.db' }]}
      query="SELECT * FROM items"
      component={ProductCard}
      propMapping={{
        name: 'name',
        description: 'description',
        price: (row) => `$${row.price.toFixed(2)}`,
        featured: 'featured'
      }}
      containerProps={{ columns: 4, gap: '20px' }}
    />
  </section>

</div>

<style>
  .demo-page {
    max-width: 1400px;
    margin: 0 auto;
    padding: 40px 20px;
  }

  header {
    text-align: center;
    margin-bottom: 60px;
  }

  h1 {
    font-size: 48px;
    font-weight: 700;
    color: var(--color-primary);
    margin: 0 0 16px 0;
    letter-spacing: -0.02em;
  }

  .subtitle {
    font-size: 18px;
    color: var(--color-muted);
    margin: 0 0 24px 0;
  }

  .header-nav {
    display: flex;
    justify-content: center;
    gap: 16px;
  }

  .nav-link {
    display: inline-flex;
    align-items: center;
    padding: 10px 20px;
    background-color: var(--color-primary);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .nav-link:hover {
    background-color: color-mix(in srgb, var(--color-primary) 85%, black);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px color-mix(in srgb, var(--color-primary) 30%, transparent);
  }

  .nav-link-secondary {
    background-color: transparent;
    color: var(--color-primary);
    border: 2px solid var(--color-primary);
  }

  section {
    margin-bottom: 80px;
  }

  h2 {
    font-size: 28px;
    font-weight: 600;
    color: var(--color-text);
    margin: 0 0 8px 0;
  }

  .description {
    color: var(--color-muted);
    font-size: 15px;
    margin: 0 0 32px 0;
    line-height: 1.6;
  }

  .data-table {
    background-color: var(--color-card);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 24px;
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th {
    text-align: left;
    padding: 12px;
    border-bottom: 2px solid var(--color-border);
    color: var(--color-text);
    font-weight: 600;
    font-size: 14px;
  }

  td {
    padding: 12px;
    border-bottom: 1px solid var(--color-border);
    color: var(--color-muted);
    font-size: 14px;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr:hover {
    background-color: color-mix(in srgb, var(--color-primary) 5%, transparent);
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 36px;
    }

    h2 {
      font-size: 24px;
    }

    section {
      margin-bottom: 60px;
    }
  }
</style>
