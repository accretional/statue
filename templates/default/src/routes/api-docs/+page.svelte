<!--
  API Documentation Page
  Displays OpenAPI/Swagger documentation using the official Swagger UI

  Requirements:
  - swagger-ui-dist package must be installed
  - +page.js must have: export const ssr = false;
-->

<script>
  import { onMount } from 'svelte';
  import 'swagger-ui-dist/swagger-ui.css';
  import { SwaggerUIBundle } from 'swagger-ui-dist';

  let loaded = false;

  onMount(() => {
    SwaggerUIBundle({
      url: '/openapi-example.json',
      dom_id: '#swagger-container',
      deepLinking: true,
      docExpansion: 'list',
      filter: true
    });
    loaded = true;
  });
</script>

<svelte:head>
  <title>API Documentation</title>
  <meta name="description" content="Interactive API documentation" />
</svelte:head>

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
