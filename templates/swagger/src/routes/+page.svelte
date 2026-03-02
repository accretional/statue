<!--
  API Documentation Page
  Uses SwaggerUI component from statue-ssg
-->

<script>
  import SwaggerUI from 'statue-ssg/components/SwaggerUI.svelte';
</script>

<svelte:head>
  <title>API Documentation</title>
  <meta name="description" content="Interactive API documentation" />
</svelte:head>

<SwaggerUI url="/openapi-example.json" />
