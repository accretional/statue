<script>
  import DocsLayout from '$lib/components/DocsLayout.svelte';
  import DocsDirectoryList from '$lib/components/DocsDirectoryList.svelte';

  export let data;

  $: directories = data.directories;
  $: directoryContent = data.directoryContent;
  $: currentDirectory = data.currentDirectory;
  $: subDirectories = data.subDirectories;
  $: sidebarItems = data.sidebarItems || [];

  // Filter contents only in the docs directory (not subdirectories)
  $: currentDirContent = directoryContent.filter(page => page.directory === 'docs');

  // Get all contents in subdirectories
  $: subDirContent = directoryContent.filter(page =>
    page.directory !== 'docs' && page.directory.startsWith('docs/')
  );

  // Combined content for display
  $: allContent = [...currentDirContent, ...subDirContent];

  // Active path for sidebar highlighting
  $: activePath = '/docs';
</script>

<svelte:head>
  <title>{currentDirectory.title}</title>
  <meta name="description" content="Documentation - Statue SSG" />
</svelte:head>

<DocsLayout
  {sidebarItems}
  {activePath}
  sidebarTitle={currentDirectory.title}
  showToc={false}
  headings={[]}
  navbarItems={directories}
>
  <DocsDirectoryList
    title={currentDirectory.title}
    content={allContent}
    {subDirectories}
  />
</DocsLayout>
