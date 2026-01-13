# API Client Generation with Orval

Statue SSG includes [Orval](https://orval.dev) for generating TypeScript API clients from OpenAPI specifications.

## Quick Start

### 1. Add your OpenAPI spec

Place your OpenAPI/Swagger JSON file in the `static/` folder:

```
static/
└── openapi.json    # Your API specification
```

### 2. Update orval.config.ts

Edit the config to point to your spec:

```typescript
import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: './static/openapi.json',  // Your spec file
    output: {
      target: './src/lib/api/endpoints.ts',
      schemas: './src/lib/api/models',
      client: 'fetch',
      mode: 'tags-split',
      clean: true,
      prettier: true,
      baseUrl: 'https://petstore.swagger.io/v2'
    }
  }
});
```

### 3. Generate the client

```bash
npm run generate-api
```

This creates typed API functions in `src/lib/api/`.

## Usage in Components

```svelte
<script>
  import { onMount } from 'svelte';
  import { getPetById } from '$lib/api/pet/pet';

  let pet = null;
  let error = null;

  onMount(async () => {
    try {
      const response = await getPetById(1);
      pet = response.data;
    } catch (e) {
      error = e.message;
    }
  });
</script>

{#if error}
  <p class="error">{error}</p>
{:else if pet}
  <div class="pet-card">
    <h2>{pet.name}</h2>
    <p>Status: {pet.status}</p>
  </div>
{:else}
  <p>Loading...</p>
{/if}
```

## Generated Output Structure

After running `npm run generate-api`:

```
src/lib/api/
├── models/           # TypeScript interfaces
│   ├── pet.ts
│   ├── order.ts
│   └── index.ts
├── pet/              # Pet endpoints
│   └── pet.ts
├── store/            # Store endpoints
│   └── store.ts
└── user/             # User endpoints
    └── user.ts
```

## Configuration Options

| Option | Description |
|--------|-------------|
| `input` | Path to OpenAPI spec (JSON/YAML) |
| `output.target` | Output file for endpoints |
| `output.schemas` | Output folder for TypeScript models |
| `output.client` | HTTP client: `fetch`, `axios`, `angular` |
| `output.mode` | Split mode: `tags-split`, `split`, `single` |

## Advanced: Multiple APIs

```typescript
import { defineConfig } from 'orval';

export default defineConfig({
  petstore: {
    input: './static/petstore.json',
    output: {
      target: './src/lib/api/petstore/endpoints.ts',
      schemas: './src/lib/api/petstore/models',
      client: 'fetch'
    }
  },
  payment: {
    input: './static/payment-api.json',
    output: {
      target: './src/lib/api/payment/endpoints.ts',
      schemas: './src/lib/api/payment/models',
      client: 'fetch'
    }
  }
});
```

## Resources

- [Orval Documentation](https://orval.dev)
- [OpenAPI Specification](https://swagger.io/specification/)
