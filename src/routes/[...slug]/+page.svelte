<script>
  import { page } from '$app/stores';
  import NavigationBar from '$lib/components/NavigationBar.svelte';
  import Warning from '$lib/components/Warning.svelte';
  import ContentHeader from '$lib/components/ContentHeader.svelte';
  import ContentBody from '$lib/components/ContentBody.svelte';

  // Loaded content
  export let data;

  // Show content if not having error (notFound: true)
  $: content = data.content;
  $: directories = data.directories;

  // Active URL for highlighting (for navigation bar)
  $: activePath = $page.url.pathname;

  // Page title
  $: title = content ? content.metadata.title : 'Content Not Found';
  $: description = content?.metadata?.description;

  // Create back link
  $: backLink = content ? getBackLink(content.directory) : '/';
  $: backLinkText = content ? getBackLinkText(content.directory) : 'Home';

  // Helper functions for back link
  function getBackLink(directory) {
    if (directory === 'root') return '/';
    return `/${directory}`;
  }

  function getBackLinkText(directory) {
    if (directory === 'root') return 'Home';
    return directory.charAt(0).toUpperCase() + directory.slice(1);
  }
</script>

<svelte:head>
  <title>{title}</title>
  {#if description}
    <meta name="description" content={description} />
  {/if}
</svelte:head>

{#if data.notFound}
  <!-- Content not found, let Svelte route handle it -->
  <div class="bg-red-100 p-4 rounded-md my-8 max-w-prose mx-auto">
    <h2 class="text-xl font-bold text-red-700">DEBUG: Content not found</h2>
    <p class="my-2">URL: {$page.url.pathname}</p>
    <p class="my-2">Params: {JSON.stringify($page.params)}</p>
    <p class="my-2">Data: {JSON.stringify(data)}</p>
  </div>
{:else if content}
  <NavigationBar navbarItems={directories} {activePath} />

  <div class="min-h-screen text-white bg-gradient-to-b from-[var(--color-hero-from)] via-[var(--color-hero-via)] to-[var(--color-hero-to)]">
    <div class="container mx-auto px-4 py-16">
      <div class="max-w-6xl mx-auto">
        <ContentHeader
          title={content.metadata.title}
          date={content.metadata.date}
          author={content.metadata.author}
          {backLink}
          {backLinkText}
        />

        <!-- Warning component - show if warning exists in frontmatter -->
        {#if content.metadata.warning}
          <Warning warning={content.metadata.warning} />
        {/if}

        <ContentBody content={content.content} />
      </div>
    </div>
  </div>
{:else}
  <div class="bg-yellow-100 p-4 rounded-md my-8 max-w-prose mx-auto">
    <h2 class="text-xl font-bold text-yellow-700">DEBUG: Content is undefined or empty</h2>
    <p class="my-2">URL: {$page.url.pathname}</p>
    <p class="my-2">Params: {JSON.stringify($page.params)}</p>
    <p class="my-2">Data: {JSON.stringify(data)}</p>
  </div>
{/if}
