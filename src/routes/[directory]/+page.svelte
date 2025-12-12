<script>
  import DirectoryHeader from '$lib/components/DirectoryHeader.svelte';
  import SubDirectories from '$lib/components/SubDirectories.svelte';
  import DirectoryContent from '$lib/components/DirectoryContent.svelte';
  import DocsLayout from '$lib/components/DocsLayout.svelte';
  import DocsDirectoryList from '$lib/components/DocsDirectoryList.svelte';
  import BlogLayout from '$lib/components/BlogLayout.svelte';

  // Loaded content
  export let data;

  $: directories = data.directories;
  $: directoryContent = data.directoryContent;
  $: currentDirectory = data.currentDirectory;
  $: subDirectories = data.subDirectories;
  $: sidebarItems = data.sidebarItems || [];

  // Check if this is docs directory
  $: isDocsDirectory = currentDirectory.name === 'docs';

  // Check if this is blog directory
  $: isBlogDirectory = currentDirectory.name === 'blog';

  // Filter contents only in the current directory
  // Not contents in subdirectories
  $: currentDirContent = directoryContent.filter(page => {
    // Exactly the contents in this directory
    // E.g.: blog/post.md is in blog/ directory
    // But blog/category/post.md is not in blog/ directory
    return page.directory === currentDirectory.name;
  });

  // Get all contents in subdirectories
  $: subDirContent = directoryContent.filter(page => {
    // Contents in directories under this directory
    return page.directory !== currentDirectory.name &&
           page.directory.startsWith(currentDirectory.name + '/');
  });

  // Combined content for docs
  $: allDocsContent = [...currentDirContent, ...subDirContent];
</script>

<svelte:head>
  <title>{currentDirectory.title}</title>
  <meta name="description" content="{currentDirectory.title} page - Created by Statue SSG" />
</svelte:head>

{#if isDocsDirectory}
  <!-- Docs Layout -->
  <DocsLayout
    {sidebarItems}
    activePath="/docs"
    sidebarTitle={currentDirectory.title}
    showToc={false}
    headings={[]}
  >
    <DocsDirectoryList
      title={currentDirectory.title}
      content={allDocsContent}
      {subDirectories}
    />
  </DocsLayout>
{:else if isBlogDirectory}
  <!-- Blog Layout -->
  <BlogLayout
    title={currentDirectory.title}
    posts={currentDirContent}
  />
{:else}
  <!-- Default Layout -->
  <div class="min-h-screen text-white bg-gradient-to-b from-[var(--color-hero-from)] via-[var(--color-hero-via)] to-[var(--color-hero-to)]">
    <div class="container mx-auto px-4 py-16">
      <DirectoryHeader title={currentDirectory.title} />

      <!-- Subdirectories -->
      <SubDirectories {subDirectories} />

      <!-- Contents in this directory -->
      <DirectoryContent content={currentDirContent} />

      <!-- Contents in subdirectories -->
      {#if subDirContent && subDirContent.length > 0}
        <div>
          <h2 class="text-2xl font-bold mb-6 text-white">Contents in Subdirectories</h2>
          <DirectoryContent content={subDirContent} showDirectory={true} />
        </div>
      {/if}

      {#if !currentDirContent.length && !subDirContent.length && (!subDirectories || !subDirectories.length)}
        <DirectoryContent content={[]} emptyMessage="No content found in this directory." />
      {/if}
    </div>
  </div>
{/if}

<style>
  /* Page specific styles can go here */
</style>
