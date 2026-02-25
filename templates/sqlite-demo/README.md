# SQLite Dynamic Components for Statue

SQLite-powered dynamic component rendering with native SQL JOINs and OPFS caching. Use this template to build data-driven static sites that query SQLite databases and render Svelte components dynamically.

## Quick Start

```bash
npx statue init --template sqlite-demo
cd your-project
npm install

# Generate sample databases
node scripts/generate-sample-databases.js

npm run dev
```

The `generate-sample-databases.js` script creates:
- `static/products.db` - 8 sample products with prices and descriptions
- `static/promotions.db` - 5 sample promotions with discounts and badges

## Demo Pages

- **/** - Multi-database joins with promotions demo
- **/components** - Component registry showing all Statue components
- **/project-files** - Project file browser with git status tracking

## Three Components, Three Approaches

### 1. SQLiteMultiDB - Core Data Provider

Foundation component for loading and querying SQLite databases. Exposes data via slots for maximum control.

**Props:**
```typescript
interface DatabaseSource {
  name: string;
  path: string;
  remote?: boolean;
}

interface SQLiteMultiDBProps {
  databases: DatabaseSource[];
  query: string;         // Single SQL query; multi-DB tables accessed via schema prefix
  persist?: boolean;     // Enable OPFS caching (default: true)
  transform?: (data: any[]) => any[];
}
```

**Single Database:**
```svelte
<script>
  import SQLiteMultiDB from 'statue-ssg/components/SQLiteMultiDB.svelte';
</script>

<SQLiteMultiDB
  databases={[{ name: 'products', path: '/products.db' }]}
  query="SELECT * FROM items WHERE featured = 1"
  let:data
>
  {#each data as item}
    <div>{item.name}: ${item.price}</div>
  {/each}
</SQLiteMultiDB>
```

**Multi-Database with LEFT JOIN:**
```svelte
<SQLiteMultiDB
  databases={[
    { name: 'products', path: '/products.db' },
    { name: 'promotions', path: '/promotions.db' }
  ]}
  query="SELECT p.*, d.discount, d.badge
         FROM items p
         LEFT JOIN promotions.deals d ON p.id = d.product_id
         WHERE d.active = 1 OR d.product_id IS NULL"
  let:data
>
  {#each data as item}
    <div>{item.name} - {item.discount ? 'On Sale!' : 'Regular'}</div>
  {/each}
</SQLiteMultiDB>
```

The first database in `databases` is the `main` connection (tables accessible without prefix).
Subsequent databases are ATTACHed under their `name` as a schema prefix.

### 2. SQLiteRenderer - Dynamic Component Renderer

Opinionated wrapper that renders a Svelte component for each row with prop mapping and grid layout.

**Props:**
```typescript
interface SQLiteRendererProps {
  databases: DatabaseSource[];
  query: string;
  persist?: boolean;
  component: ComponentType;
  propMapping?: Record<string, string | ((row: any) => any)>;
  containerProps?: { columns?: number; gap?: string };
  emptyMessage?: string;
}
```

**Usage:**
```svelte
<script>
  import SQLiteRenderer from 'statue-ssg/components/SQLiteRenderer.svelte';
  import ProductCard from '$lib/components/ProductCard.svelte';
</script>

<SQLiteRenderer
  databases={[
    { name: 'products', path: '/products.db' },
    { name: 'promotions', path: '/promotions.db' }
  ]}
  query="SELECT p.*, d.discount, d.badge
         FROM items p
         LEFT JOIN promotions.deals d ON p.id = d.product_id
         WHERE d.active = 1 OR d.product_id IS NULL"
  component={ProductCard}
  propMapping={{
    name: 'title',
    price: (row) => row.discount
      ? `$${(row.price * (1 - row.discount)).toFixed(2)}`
      : `$${row.price.toFixed(2)}`,
    badge: 'badge'
  }}
  containerProps={{ columns: 4, gap: '24px' }}
  emptyMessage="No products found."
/>
```

### 3. SQLiteGrid - Headless Pattern

Maximum flexibility with slot-based rendering.

**Props:**
```typescript
interface SQLiteGridProps {
  databases: DatabaseSource[];
  query: string;
  persist?: boolean;
  transform?: (data: any[]) => any[];
  columns?: number;
  gap?: string;
}
```

**Usage:**
```svelte
<script>
  import SQLiteGrid from 'statue-ssg/components/SQLiteGrid.svelte';
  import ProductCard from '$lib/components/ProductCard.svelte';
</script>

<SQLiteGrid
  databases={[
    { name: 'products', path: '/products.db' },
    { name: 'reviews', path: '/reviews.db' }
  ]}
  query="SELECT p.*, AVG(r.rating) as avg_rating
         FROM items p
         LEFT JOIN reviews.ratings r ON p.id = r.product_id
         GROUP BY p.id"
  columns={3}
  gap="32px"
  let:items
>
  {#each items as product}
    <ProductCard
      title={product.name}
      rating={product.avg_rating?.toFixed(1) || 'N/A'}
      {...product}
    />
  {/each}
</SQLiteGrid>
```

## OPFS Caching

SQLite databases are cached in the browser's [Origin Private File System](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system) after the first load, so subsequent visits skip the network fetch entirely.

SQLite always runs **in-memory** — OPFS is used only to cache the raw `.db` bytes across page loads. This approach uses the async OPFS API (`navigator.storage.getDirectory()`), which works in Web Workers without requiring `Cross-Origin-Opener-Policy` / `Cross-Origin-Embedder-Policy` headers or `SharedArrayBuffer`.

| Scenario | Behavior |
|----------|----------|
| First visit | Fetch `.db` from `path`, write bytes to OPFS, deserialize into memory |
| Subsequent visits | Read bytes from OPFS, deserialize into memory (no network request) |
| `persist={false}` | Always fetch from network, skip OPFS |
| OPFS unavailable | Fetch from network every time, log a warning |

To clear the cache: DevTools → Application → Storage → Clear site data.

> **Note on large databases:** The entire `.db` file is loaded into memory before queries run. For databases larger than ~10 MB, consider the `opfs-sahpool` VFS from `@sqlite.org/sqlite-wasm`, which reads only the B-tree pages accessed by each query rather than the full file.

## Remote Databases

Load databases from remote URLs with CORS support:

```svelte
<SQLiteRenderer
  databases={[
    {
      name: 'products',
      path: 'https://api.mysite.com/products.db',
      remote: true
    }
  ]}
  query="SELECT * FROM products"
  component={ProductCard}
/>
```

**CORS Requirements:** Remote DB hosts must include proper `Access-Control-Allow-Origin` headers.

## Real-World Use Cases

### E-commerce with Dynamic Promotions

Combine a static product catalog with a remote promotions database that updates frequently:

```svelte
<SQLiteRenderer
  databases={[
    { name: 'products', path: '/products.db' },
    { name: 'promotions', path: 'https://api.store.com/promotions.db', remote: true }
  ]}
  query="SELECT p.*, d.discount, d.badge
         FROM items p
         LEFT JOIN promotions.deals d ON p.id = d.product_id
         WHERE (d.active = 1 AND d.end_date > date('now')) OR d.product_id IS NULL
           AND p.in_stock = 1"
  component={ProductCard}
  propMapping={{
    name: 'title',
    price: (row) => row.discount
      ? `$${(row.price * (1 - row.discount)).toFixed(2)}`
      : `$${row.price.toFixed(2)}`,
    badge: (row) => row.discount ? `${(row.discount * 100).toFixed(0)}% OFF` : null
  }}
/>
```

### Blog with Analytics

Show blog posts enriched with view counts from a remote analytics database:

```svelte
<SQLiteGrid
  databases={[
    { name: 'posts', path: '/posts.db' },
    { name: 'stats', path: 'https://analytics.mysite.com/stats.db', remote: true }
  ]}
  query="SELECT a.id, a.title, a.slug, s.views, s.shares
         FROM articles a
         LEFT JOIN stats.analytics s ON a.id = s.post_id"
  let:items
>
  {#each items as post}
    <BlogCard
      {...post}
      popularity={post.views || 0}
    />
  {/each}
</SQLiteGrid>
```

## Setup Requirements

### WebAssembly

The SQLite components use `@sqlite.org/sqlite-wasm` — the official SQLite WASM build — loaded automatically at runtime. No manual setup required.

### Page Configuration

SQLite components use browser APIs (Web Workers, OPFS) and must disable SSR. Add this to any route using SQLite:

```javascript
// +page.js
export const ssr = false;
export const prerender = true;
```

## Included Databases

This template includes sample databases demonstrating different use cases:

### Product Catalog (`static/products.db`)

Sample e-commerce product data. Generate with:
```bash
node scripts/generate-sample-databases.js
```

Schema:
```sql
CREATE TABLE items (
  id INTEGER PRIMARY KEY,
  name TEXT,
  description TEXT,
  price REAL,
  featured INTEGER
);
```

### Promotions (`static/promotions.db`)

Sample promotion and discount data. Generated by the same script above.

Schema:
```sql
CREATE TABLE deals (
  id INTEGER PRIMARY KEY,
  product_id INTEGER,
  discount REAL,
  badge TEXT,
  active INTEGER
);
```

### Component Registry (`static/components.db`)

Auto-generated database of all Svelte components in the project. Regenerate with:
```bash
npm run generate:components-db
```

### Project Files (`static/project-files.db`)

Auto-generated database of all project files with git status. Regenerate with:
```bash
npm run generate:project-files-db
```

## Component Hierarchy

```
SQLiteMultiDB (Core)
├── Spawns a Web Worker for SQLite/OPFS operations
├── Worker fetches + caches DBs in OPFS
├── Worker executes SQL (with ATTACH for multi-DB)
└── Exposes data via slots

SQLiteRenderer (Opinionated wrapper)
├── Uses SQLiteMultiDB for data
├── Dynamic component rendering
├── Prop mapping & transforms
└── Responsive grid layout

SQLiteGrid (Headless wrapper)
├── Uses SQLiteMultiDB for data
├── Slot-based composition
└── Maximum flexibility
```

## Creating Your Own Databases

### Using the SQLite CLI

```bash
# Create database
sqlite3 static/products.db

# Create table and insert data
CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price REAL);
INSERT INTO products VALUES (1, 'Widget', 29.99);
.quit
```

### Using a GUI Tool

Tools like [DB Browser for SQLite](https://sqlitebrowser.org/) provide a visual interface for creating and managing databases.

## Customizing This Template

1. **Replace sample databases** with your own data (see "Creating Your Own Databases" above)
2. **Create custom card components** for your data model
3. **Add additional pages** as needed
4. **Customize layout and styling** to match your brand
5. **Configure remote databases** for dynamic content

## Building Your Own Site

To use SQLite components in any Statue project:

1. Install Statue with the sqlite-demo template:
   ```bash
   npx statue init --template sqlite-demo
   ```

2. Import components in your routes:
   ```svelte
   import SQLiteRenderer from 'statue-ssg/components/SQLiteRenderer.svelte';
   import SQLiteGrid from 'statue-ssg/components/SQLiteGrid.svelte';
   import SQLiteMultiDB from 'statue-ssg/components/SQLiteMultiDB.svelte';
   ```

3. Add your database files to `static/`

4. Write a SQL query (use schema prefix for multi-DB joins)

5. Add `+page.js` with SSR disabled:
   ```javascript
   export const ssr = false;
   export const prerender = true;
   ```

## Learn More

- [Statue Documentation](https://github.com/accretional/statue)
- [@sqlite.org/sqlite-wasm](https://sqlite.org/wasm/doc/trunk/index.md)
- [Origin Private File System (OPFS)](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system)
- [SvelteKit Static Adapter](https://kit.svelte.dev/docs/adapter-static)
