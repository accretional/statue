import { defineConfig } from 'orval';

export default defineConfig({
  petstore: {
    input: './static/openapi-example.json',
    output: {
      target: './src/lib/api/endpoints.ts',
      schemas: './src/lib/api/models',
      client: 'fetch',
      mode: 'tags-split',
      clean: true,
      prettier: true
    }
  }
});
