<script>
  import { page } from '$app/stores';
  import NavigationBar from '$lib/components/NavigationBar.svelte';
  import Warning from '$lib/components/Warning.svelte';
  import ContentHeader from '$lib/components/ContentHeader.svelte';
  import ContentBody from '$lib/components/ContentBody.svelte';
  import DocsLayout from '$lib/components/DocsLayout.svelte';
  import DocsContent from '$lib/components/DocsContent.svelte';

  // Loaded content
  export let data;

  // Show content if not having error (notFound: true)
  $: content = data.content;
  $: directories = data.directories;
  $: sidebarItems = data.sidebarItems || [];

  // Check if this is docs content
  $: isDocsContent = content?.directory?.startsWith('docs');

  // Active URL for highlighting (for navigation bar)
  $: activePath = $page.url.pathname;

  // Page title
  $: title = content ? content.metadata.title : 'Content Not Found';
  $: description = content?.metadata?.description;

  // Create back link
  $: backLink = content ? getBackLink(content.directory) : '/';
  $: backLinkText = content ? getBackLinkText(content.directory) : 'Home';

  // Headings for table of contents (will be extracted by DocsContent)
  let headings = [];

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
  <!-- Content not found -->
  {#if isDocsContent || activePath.startsWith('/docs')}
    <DocsLayout
      {sidebarItems}
      {activePath}
      sidebarTitle="Docs"
      showToc={false}
      headings={[]}
      navbarItems={directories}
    >
      <div class="text-center py-12">
        <h1 class="text-2xl font-bold text-[var(--color-foreground)] mb-4">Page Not Found</h1>
        <p class="text-[var(--color-muted)]">The documentation page you're looking for doesn't exist.</p>
        <a href="/docs" class="mt-4 inline-block text-[var(--color-primary)] hover:underline">
          Back to Documentation
        </a>
      </div>
    </DocsLayout>
  {:else}
    <div class="bg-red-100 p-4 rounded-md my-8 max-w-prose mx-auto">
      <h2 class="text-xl font-bold text-red-700">DEBUG: Content not found</h2>
      <p class="my-2">URL: {$page.url.pathname}</p>
      <p class="my-2">Params: {JSON.stringify($page.params)}</p>
      <p class="my-2">Data: {JSON.stringify(data)}</p>
    </div>
  {/if}
{:else if content}
  {#if isDocsContent}
    <!-- Docs Layout -->
    <DocsLayout
      {sidebarItems}
      {headings}
      {activePath}
      sidebarTitle="Docs"
      navbarItems={directories}
    >
      {#if content.metadata.warning}
        <div class="mb-6">
          <Warning warning={content.metadata.warning} />
        </div>
      {/if}

      <DocsContent
        content={content.content}
        title={content.metadata.title}
        description={content.metadata.description}
        lastUpdated={content.metadata.date}
        bind:headings
      />
    </DocsLayout>
  {:else}
    <!-- Default Layout -->
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
  {/if}
{:else}
  <div class="bg-yellow-100 p-4 rounded-md my-8 max-w-prose mx-auto">
    <h2 class="text-xl font-bold text-yellow-700">DEBUG: Content is undefined or empty</h2>
    <p class="my-2">URL: {$page.url.pathname}</p>
    <p class="my-2">Params: {JSON.stringify($page.params)}</p>
    <p class="my-2">Data: {JSON.stringify(data)}</p>
  </div>
{/if}
