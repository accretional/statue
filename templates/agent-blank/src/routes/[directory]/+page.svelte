<script>
  // AI AGENT: This is the DIRECTORY PAGE (category/section listing)
  // This page displays all content within a directory/category
  // URL pattern: /blog, /docs, /products, etc.
  // Import components from statue-ssg as needed
  // Available: NavigationBar, DirectoryHeader, SubDirectories, DirectoryContent

  import Navbar from '$lib/components/Navbar.svelte';

  export let data;

  $: directories = data.directories;
  $: directoryContent = data.directoryContent;
  $: currentDirectory = data.currentDirectory;
  $: subDirectories = data.subDirectories;

  // Filter contents in current directory only (not subdirectories)
  $: currentDirContent = directoryContent?.filter(page => {
    return page.directory === currentDirectory?.name;
  }) || [];

  // Get contents from subdirectories
  $: subDirContent = directoryContent?.filter(page => {
    return page.directory !== currentDirectory?.name &&
           page.directory?.startsWith(currentDirectory?.name + '/');
  }) || [];

  // Data available:
  // - currentDirectory.name (e.g., "blog")
  // - currentDirectory.title (e.g., "Blog")
  // - currentDirectory.url (e.g., "/blog")
  // - subDirectories (array of child directories)
  // - currentDirContent (array of content items in this directory)
  // - subDirContent (array of content items in subdirectories)
</script>

<svelte:head>
  <!-- AI AGENT: Dynamic title from directory -->
  <title>{currentDirectory?.title || 'Directory'}</title>
  <meta name="description" content="{currentDirectory?.title || 'Directory'} - Browse all content" />
</svelte:head>

<!-- AI AGENT: DIRECTORY PAGE LAYOUT -->
<div class="p-4">

  <!-- NAVIGATION BAR -->
  <Navbar {directories} activePath={currentDirectory?.url || '/'} />

  <!-- DIRECTORY HEADER -->
  <section class="placeholder-box">
    <span class="text-xl font-semibold text-primary uppercase tracking-wider">DIRECTORY HEADER</span>
    <p class="text-sm text-secondary mt-2">Title: {currentDirectory?.title || 'Category'}</p>
    <p class="text-sm text-secondary mt-1">Description, banner image, or intro text</p>
  </section>

  <!-- SUBDIRECTORIES (if any) -->
  {#if subDirectories && subDirectories.length > 0}
    <section class="placeholder-box">
      <span class="text-xl font-semibold text-primary uppercase tracking-wider">SUBDIRECTORIES</span>
      <p class="text-sm text-secondary mt-2">Child categories: {subDirectories.map(s => s.name).join(', ')}</p>
      <p class="text-sm text-secondary mt-1">Display as cards or list with icons</p>
    </section>
  {/if}

  <!-- CONTENT LIST -->
  <section class="placeholder-box">
    <span class="text-xl font-semibold text-primary uppercase tracking-wider">CONTENT LIST</span>
    <p class="text-sm text-secondary mt-2">{currentDirContent.length} items in this directory</p>
    {#if currentDirContent.length > 0}
      <div class="mt-4 w-full">
        {#each currentDirContent as item}
          <a href={item.url} class="flex justify-between p-3 bg-secondary rounded mb-2 no-underline transition-colors hover:bg-muted">
            <span class="text-sm text-primary">{item.metadata?.title || 'Untitled'}</span>
            <span class="text-xs text-muted">{item.metadata?.date || ''}</span>
          </a>
        {/each}
      </div>
    {:else}
      <p class="text-sm text-secondary mt-2">No content yet - add markdown files to the content folder</p>
    {/if}
  </section>

  <!-- SUBDIRECTORY CONTENT (if any) -->
  {#if subDirContent && subDirContent.length > 0}
    <section class="placeholder-box">
      <span class="text-xl font-semibold text-primary uppercase tracking-wider">SUBDIRECTORY CONTENT</span>
      <p class="text-sm text-secondary mt-2">{subDirContent.length} items in subdirectories</p>
      <p class="text-sm text-secondary mt-1">Optionally show content from child directories</p>
    </section>
  {/if}

  <!-- EMPTY STATE -->
  {#if !currentDirContent.length && !subDirContent.length && (!subDirectories || !subDirectories.length)}
    <section class="placeholder-box">
      <span class="text-xl font-semibold text-primary uppercase tracking-wider">EMPTY STATE</span>
      <p class="text-sm text-secondary mt-2">No content found in this directory</p>
      <p class="text-sm text-secondary mt-1">Show helpful message or call-to-action</p>
    </section>
  {/if}

  <!-- PAGINATION / LOAD MORE -->
  <section class="placeholder-box">
    <span class="text-xl font-semibold text-primary uppercase tracking-wider">PAGINATION</span>
    <p class="text-sm text-secondary mt-2">Page navigation or infinite scroll trigger</p>
  </section>

</div>