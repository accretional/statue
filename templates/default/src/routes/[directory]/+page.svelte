<script>
	import {
		DirectoryHeader,
		SubDirectories,
		DirectoryContent,
		DocsLayout,
		DocsDirectoryList,
		BlogLayout,
		PageHero
	} from 'statue-ssg';
	import siteConfig from '../../../site.config.json';

	const { data } = $props();

	const enableTags = $derived(siteConfig.blog?.blogTag?.enabled ?? true);
	const isDocsDirectory = $derived(data.currentDirectory.name === 'docs');
	const isBlogDirectory = $derived(data.currentDirectory.name === 'blog');
	const isTagsDirectory = $derived(enableTags && (data.isTagsDirectory || false));

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
	const tags = $derived(enableTags ? (data.tags || []) : []);
</script>

<svelte:head>
	<title>{data.currentDirectory.title}</title>
	<meta name="description" content="{data.currentDirectory.title} page - Created by Statue SSG" />
</svelte:head>

{#if isTagsDirectory}
	<!-- Tags Directory - Show all available tags -->
	<div class="container mx-auto px-4 pt-20">
		<div class="flex items-center gap-2 text-sm text-[var(--color-muted)] mb-4">
			<a href="/" class="hover:text-[var(--color-primary)]">Home</a>
			<span>/</span>
			<span>Tags</span>
		</div>
	</div>

	<PageHero
		title="All Tags"
		description="Browse posts by topic"
	/>

	<div class="container mx-auto px-4 pb-16">
		<div class="max-w-4xl mx-auto">
			{#if tags.length > 0}
				<div class="flex flex-wrap gap-3">
					{#each tags as tag}
						<a
							href="/tags/{tag.toLowerCase().replace(/\s+/g, '-')}"
							class="inline-block px-4 py-2 text-sm font-medium rounded-full bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] hover:border-[var(--color-primary)] transition-colors"
						>
							{tag}
						</a>
					{/each}
				</div>
			{:else}
				<p class="text-[var(--color-muted)]">No tags found.</p>
			{/if}
		</div>
	</div>
{:else if isDocsDirectory}
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
	<BlogLayout title={data.currentDirectory.title} posts={currentDirContent} {enableTags} />
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
