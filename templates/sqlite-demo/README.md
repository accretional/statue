# SQLite Dynamic Components for Statue

SQLite-powered dynamic component rendering with JavaScript-based joins for multi-database queries. Use this template to build data-driven static sites that query SQLite databases and render Svelte components dynamically.

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
  queries: Record<string, string> | string;
  joinConfig?: {
    type: 'LEFT' | 'INNER';
    left: { db: string; key: string };
    right: { db: string; key: string };
  };
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
  queries="SELECT * FROM items WHERE featured = 1"
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
  queries={{
    products: "SELECT * FROM items",
    promotions: "SELECT * FROM deals WHERE active = 1"
  }}
  joinConfig={{
    type: 'LEFT',
    left: { db: 'products', key: 'id' },
    right: { db: 'promotions', key: 'product_id' }
  }}
  let:data
>
  {#each data as item}
    <div>{item.name} - {item.discount ? 'On Sale!' : 'Regular'}</div>
  {/each}
</SQLiteMultiDB>
```

### 2. SQLiteRenderer - Dynamic Component Renderer

Opinionated wrapper that renders a Svelte component for each row with prop mapping and grid layout.

**Props:**
```typescript
interface SQLiteRendererProps {
  databases: DatabaseSource[];
  queries: Record<string, string> | string;
  joinConfig?: {
    type: 'LEFT' | 'INNER';
    left: { db: string; key: string };
    right: { db: string; key: string };
  };
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
  queries={{
    products: "SELECT * FROM items",
    promotions: "SELECT * FROM deals WHERE active = 1"
  }}
  joinConfig={{
    type: 'LEFT',
    left: { db: 'products', key: 'id' },
    right: { db: 'promotions', key: 'product_id' }
  }}
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
  queries: Record<string, string> | string;
  joinConfig?: {
    type: 'LEFT' | 'INNER';
    left: { db: string; key: string };
    right: { db: string; key: string };
  };
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
  queries={{
    products: "SELECT * FROM items",
    reviews: "SELECT product_id, AVG(rating) as avg_rating FROM ratings GROUP BY product_id"
  }}
  joinConfig={{
    type: 'LEFT',
    left: { db: 'products', key: 'id' },
    right: { db: 'reviews', key: 'product_id' }
  }}
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

## Join Types

### LEFT JOIN
Returns all rows from the left database, with matching rows from the right database (or null if no match).

```javascript
joinConfig: {
  type: 'LEFT',
  left: { db: 'products', key: 'id' },
  right: { db: 'promotions', key: 'product_id' }
}
```

**Use case:** Show all products, with promotion data if available.

### INNER JOIN
Returns only rows that have matches in both databases.

```javascript
joinConfig: {
  type: 'INNER',
  left: { db: 'products', key: 'id' },
  right: { db: 'promotions', key: 'product_id' }
}
```

**Use case:** Show only products that have active promotions.

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
  queries="SELECT * FROM products"
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
  queries={{
    products: "SELECT * FROM items WHERE in_stock = 1",
    promotions: "SELECT * FROM deals WHERE active = 1 AND end_date > date('now')"
  }}
  joinConfig={{
    type: 'LEFT',
    left: { db: 'products', key: 'id' },
    right: { db: 'promotions', key: 'product_id' }
  }}
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
  queries={{
    posts: "SELECT id, title, slug FROM articles",
    stats: "SELECT post_id, views, shares FROM analytics"
  }}
  joinConfig={{
    type: 'LEFT',
    left: { db: 'posts', key: 'id' },
    right: { db: 'stats', key: 'post_id' }
  }}
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

### WebAssembly File

The SQLite components load `sql-wasm.wasm` from jsDelivr CDN automatically:
```
https://cdn.jsdelivr.net/npm/sql.js@1.13.0/dist/sql-wasm.wasm
```

**No manual setup required** - the WASM file is loaded when components mount.

### Page Configuration

SQLite components use browser APIs and must disable SSR. Add this to any route using SQLite:

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
├── Loads multiple databases in parallel
├── Executes queries on each database
├── Performs JavaScript-based joins
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

### Using Node.js (like our sample generator)

```javascript
import initSqlJs from 'sql.js';
import fs from 'fs/promises';

const SQL = await initSqlJs();
const db = new SQL.Database();

// Create schema
db.run(`
  CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL NOT NULL
  )
`);

// Insert data
const stmt = db.prepare('INSERT INTO products (id, name, price) VALUES (?, ?, ?)');
stmt.run([1, 'Widget', 29.99]);
stmt.free();

// Export to file
const data = db.export();
await fs.writeFile('static/products.db', data);
db.close();
```

### Using SQLite CLI

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

4. Create your queries and component mappings

5. Add `+page.js` with SSR disabled:
   ```javascript
   export const ssr = false;
   export const prerender = true;
   ```

## Learn More

- [Statue Documentation](https://github.com/accretional/statue)
- [sql.js Documentation](https://sql.js.org/)
- [SvelteKit Static Adapter](https://kit.svelte.dev/docs/adapter-static)
