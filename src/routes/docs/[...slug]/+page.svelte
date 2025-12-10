<script>
  import { page } from '$app/stores';
  import DocsLayout from '$lib/components/DocsLayout.svelte';
  import DocsContent from '$lib/components/DocsContent.svelte';
  import Warning from '$lib/components/Warning.svelte';

  export let data;

  $: content = data.content;
  $: directories = data.directories;
  $: sidebarItems = data.sidebarItems || [];

  // Active URL for highlighting
  $: activePath = $page.url.pathname;

  // Page title
  $: title = content ? content.metadata.title : 'Content Not Found';
  $: description = content?.metadata?.description;

  // Headings for table of contents (will be extracted by DocsContent)
  let headings = [];
</script>

<svelte:head>
  <title>{title}</title>
  {#if description}
    <meta name="description" content={description} />
  {/if}
</svelte:head>

{#if data.notFound}
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
{:else if content}
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
{/if}
