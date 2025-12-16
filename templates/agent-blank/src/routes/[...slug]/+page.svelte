<script lang="ts">
  // AI AGENT: This is the CONTENT PAGE (individual posts/articles)
  // This page displays markdown content from the content folder
  // URL pattern: /any/path/to/content (catches all nested routes)

  import { page } from '$app/stores';
  import Navbar from '$lib/components/Navbar.svelte';

  interface Directory {
    name: string;
    path: string;
    title: string;
    url: string;
  }

  interface Content {
    directory: string;
    url: string;
    metadata: {
      title: string;
      description?: string;
      date?: string;
      author?: string;
      warning?: string;
    };
    content: string;
  }

  interface PageData {
    content?: Content;
    directories: Directory[];
    notFound?: boolean;
  }

  export let data: PageData;

  $: content = data.content;
  $: directories = data.directories;
  $: activePath = $page.url.pathname;

  // Content metadata available:
  // - content.metadata.title
  // - content.metadata.date
  // - content.metadata.author
  // - content.metadata.description
  // - content.metadata.warning (optional)
  // - content.content (HTML string from markdown)
  // - content.directory (which folder it's in)

  // Create back link
  $: backLink = content ? getBackLink(content.directory) : '/';
  $: backLinkText = content ? getBackLinkText(content.directory) : 'Home';

  function getBackLink(directory: string) {
    if (directory === 'root' || directory === '') return '/';
    return `/${directory}`;
  }

  function getBackLinkText(directory: string) {
    if (directory === 'root' || directory === '') return 'Home';
    return directory.charAt(0).toUpperCase() + directory.slice(1);
  }
</script>

<svelte:head>
  <!-- AI AGENT: Dynamic title from content -->
  <title>{content?.metadata?.title || 'Content Page'}</title>
  {#if content?.metadata?.description}
    <meta name="description" content={content.metadata.description} />
  {/if}
</svelte:head>

<!-- AI AGENT: CONTENT PAGE LAYOUT -->
<div class="p-4">

  <!-- NAVIGATION BAR -->
  <Navbar {directories} {activePath} />

  {#if data.notFound}
    <!-- 404 STATE -->
    <section class="placeholder-box">
      <span class="text-xl font-semibold text-primary uppercase tracking-wider">404 - NOT FOUND</span>
      <p class="text-sm text-secondary mt-2">Content not found for: {$page.url.pathname}</p>
    </section>
  {:else if content}
    <!-- CONTENT HEADER -->
    <section class="placeholder-box content-header">
      <h1 class="content-title">{content.metadata.title}</h1>

      {#if content.metadata.date || content.metadata.author}
        <div class="content-meta">
          {#if content.metadata.date}
            <span>Published: {new Date(content.metadata.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          {/if}
          {#if content.metadata.author}
            <span>by {content.metadata.author}</span>
          {/if}
        </div>
      {/if}

      <a href={backLink} class="back-link">
        <svg xmlns="http://www.w3.org/2000/svg" class="back-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
        Back to {backLinkText}
      </a>
    </section>

    <!-- WARNING (if exists) -->
    {#if content.metadata.warning}
      <section class="placeholder-box warning-box">
        <span class="warning-label">WARNING</span>
        <p class="warning-text">{content.metadata.warning}</p>
      </section>
    {/if}

    <!-- CONTENT BODY - Rendered Markdown -->
    <section class="placeholder-box">
      <div class="content-body">
        {@html content.content}
      </div>
    </section>
  {:else}
    <!-- LOADING STATE -->
    <section class="placeholder-box">
      <span class="text-xl font-semibold text-primary uppercase tracking-wider">LOADING STATE</span>
      <p class="text-sm text-secondary mt-2">Show skeleton or spinner while content loads</p>
    </section>
  {/if}

</div>

<style>
  /* Content header styles */
  .content-header {
    margin-bottom: 1rem;
  }

  .content-title {
    font-size: 2rem;
    font-weight: bold;
    color: var(--color-text-primary);
    margin-bottom: 0.5rem;
  }

  .content-meta {
    color: var(--color-text-secondary);
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  .content-meta span {
    margin-right: 0.5rem;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    color: blue;
    text-decoration: none;
    font-size: 0.875rem;
    transition: color 0.2s;
  }

  .back-link:hover {
    text-decoration: underline;
  }

  .back-icon {
    width: 1rem;
    height: 1rem;
    margin-right: 0.25rem;
  }

  /* Warning box styles */
  .warning-box {
    background-color: #fef3c7;
    border: 1px solid #f59e0b;
  }

  .warning-label {
    font-weight: bold;
    color: #b45309;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .warning-text {
    color: #92400e;
    margin-top: 0.5rem;
  }

  /* Content body styles - Markdown HTML rendering */
  .content-body {
    color: var(--color-text-primary);
    font-size: 1rem;
    line-height: 1.7;
    max-width: 80ch;
  }

  /* Headings */
  .content-body :global(h1) {
    font-size: 2rem;
    font-weight: bold;
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: var(--color-text-primary);
  }

  .content-body :global(h2) {
    font-size: 1.5rem;
    font-weight: bold;
    margin-top: 1.75rem;
    margin-bottom: 0.75rem;
    color: var(--color-text-primary);
  }

  .content-body :global(h3) {
    font-size: 1.25rem;
    font-weight: bold;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--color-text-primary);
  }

  .content-body :global(h4) {
    font-size: 1.125rem;
    font-weight: bold;
    margin-top: 1.25rem;
    margin-bottom: 0.5rem;
    color: var(--color-text-primary);
  }

  .content-body :global(h5),
  .content-body :global(h6) {
    font-size: 1rem;
    font-weight: bold;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    color: var(--color-text-primary);
  }

  /* Paragraphs */
  .content-body :global(p) {
    margin-bottom: 1rem;
  }

  /* Links */
  .content-body :global(a) {
    color: blue;
    text-decoration: underline;
  }

  .content-body :global(a:visited) {
    color: purple;
  }

  .content-body :global(a:hover) {
    text-decoration: none;
  }

  /* Lists */
  .content-body :global(ul) {
    list-style-type: disc;
    padding-left: 2rem;
    margin-bottom: 1rem;
  }

  .content-body :global(ol) {
    list-style-type: decimal;
    padding-left: 2rem;
    margin-bottom: 1rem;
  }

  .content-body :global(li) {
    margin-bottom: 0.25rem;
  }

  .content-body :global(li > ul),
  .content-body :global(li > ol) {
    margin-top: 0.25rem;
    margin-bottom: 0;
  }

  /* Code */
  .content-body :global(code) {
    background: var(--color-bg-secondary);
    padding: 0.125rem 0.375rem;
    font-family: monospace;
    font-size: 0.875em;
    border-radius: 0.25rem;
  }

  .content-body :global(pre) {
    background: var(--color-bg-secondary);
    padding: 1rem;
    overflow-x: auto;
    margin: 1rem 0;
    border: 1px solid var(--color-line-light);
    border-radius: 0.25rem;
  }

  .content-body :global(pre code) {
    background: none;
    padding: 0;
    font-size: 0.875rem;
  }

  /* Blockquotes */
  .content-body :global(blockquote) {
    border-left: 4px solid var(--color-line-light);
    padding-left: 1rem;
    margin: 1rem 0;
    color: var(--color-text-secondary);
    font-style: italic;
  }

  /* Horizontal rule */
  .content-body :global(hr) {
    border: none;
    border-top: 1px solid var(--color-line-light);
    margin: 2rem 0;
  }

  /* Tables */
  .content-body :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 1rem 0;
  }

  .content-body :global(th),
  .content-body :global(td) {
    border: 1px solid var(--color-line-light);
    padding: 0.5rem 1rem;
    text-align: left;
  }

  .content-body :global(th) {
    background: var(--color-bg-secondary);
    font-weight: bold;
  }

  /* Images */
  .content-body :global(img) {
    max-width: 100%;
    height: auto;
    margin: 1rem 0;
  }

  /* Strong and emphasis */
  .content-body :global(strong) {
    font-weight: bold;
  }

  .content-body :global(em) {
    font-style: italic;
  }
</style>
