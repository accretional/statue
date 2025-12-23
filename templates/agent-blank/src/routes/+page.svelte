<script>
  // AI AGENT: This is the HOME PAGE
  // Design your landing page here - add hero sections, features, content grids, etc.

  export let data;

  $: directories = data.directories;
</script>

<svelte:head>
  <!-- AI AGENT: Update title and description for the site -->
  <title>Site Title</title>
  <meta name="description" content="Site description goes here" />
</svelte:head>

<!-- AI AGENT: HOME PAGE LAYOUT -->
<div class="p-4 min-h-screen flex flex-col">

  <!-- HOME PAGE -->
  <div class="flex-1 flex items-center justify-center">
    <h1 class="text-4xl font-bold text-primary uppercase tracking-wider">HOME PAGE</h1>
  </div>

</div>