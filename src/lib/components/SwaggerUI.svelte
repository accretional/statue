<!--
  SwaggerUI Component
  Renders OpenAPI/Swagger documentation using the official Swagger UI

  Usage:
  <script>
    import { SwaggerUI } from 'statue-ssg';
  </script>

  <SwaggerUI url="/openapi.json" />

  Props:
  - url: URL to the OpenAPI spec JSON file

  Note: Requires +page.js with `export const ssr = false;`
-->

<script lang="ts">
  import { onMount } from 'svelte';
  import 'swagger-ui-dist/swagger-ui.css';
  import { SwaggerUIBundle } from 'swagger-ui-dist';

  export interface SwaggerUIProps {
    url?: string;
  }

  let { url = '/openapi-example.json' }: SwaggerUIProps = $props();

  let loaded = false;

  onMount(() => {
    SwaggerUIBundle({
      url,
      dom_id: '#swagger-container',
      deepLinking: true,
      docExpansion: 'list',
      filter: true
    });
    loaded = true;
  });
</script>

<div class="swagger-wrapper">
  {#if !loaded}
    <div class="swagger-loading">Loading API documentation...</div>
  {/if}
  <div id="swagger-container"></div>
</div>

<style>
  .swagger-wrapper {
    padding-top: 5rem;
    min-height: 100vh;
  }

  .swagger-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    color: #666;
  }

  :global(.swagger-ui .topbar) {
    display: none;
  }
</style>
