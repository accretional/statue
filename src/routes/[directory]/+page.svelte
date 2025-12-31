<script>
	import {
		DirectoryHeader,
		SubDirectories,
		DirectoryContent,
		DocsLayout,
		DocsDirectoryList,
		BlogLayout
	} from 'statue-ssg';

	const { data } = $props();

	const isDocsDirectory = $derived(data.currentDirectory.name === 'docs');
	const isBlogDirectory = $derived(data.currentDirectory.name === 'blog');

	const currentDirContent = $derived(
		data.directoryContent.filter((page) => {
			return page.directory === data.currentDirectory.name;
		})
	);

	const subDirContent = $derived(
		data.directoryContent.filter((page) => {
			return (
				page.directory !== data.currentDirectory.name &&
				page.directory.startsWith(data.currentDirectory.name + '/')
			);
		})
	);

	const allDocsContent = $derived([...currentDirContent, ...subDirContent]);
</script>

<svelte:head>
	<title>{data.currentDirectory.title}</title>
	<meta name="description" content="{data.currentDirectory.title} page - Created by Statue SSG" />
</svelte:head>

{#if isDocsDirectory}
	<DocsLayout
		sidebarItems={data.sidebarItems || []}
		activePath="/docs"
		sidebarTitle={data.currentDirectory.title}
		showToc={false}
		headings={[]}
	>
		<DocsDirectoryList
			title={data.currentDirectory.title}
			content={allDocsContent}
			subDirectories={data.subDirectories}
		/>
	</DocsLayout>
{:else if isBlogDirectory}
	<BlogLayout title={data.currentDirectory.title} posts={currentDirContent} />
{:else}
	<div
		class="min-h-screen text-white bg-linear-to-b from-(--color-hero-from) via-(--color-hero-via) to-(--color-hero-to)"
	>
		<div class="container mx-auto px-4 py-16">
			<DirectoryHeader title={data.currentDirectory.title} />
			<SubDirectories subDirectories={data.subDirectories} />
			<DirectoryContent content={currentDirContent} />

			{#if subDirContent && subDirContent.length > 0}
				<div>
					<h2 class="text-2xl font-bold mb-6 text-white">Contents in Subdirectories</h2>
					<DirectoryContent content={subDirContent} showDirectory={true} />
				</div>
			{/if}

			{#if !currentDirContent.length && !subDirContent.length && (!data.subDirectories || !data.subDirectories.length)}
				<DirectoryContent content={[]} emptyMessage="No content found in this directory." />
			{/if}
		</div>
	</div>
{/if}
