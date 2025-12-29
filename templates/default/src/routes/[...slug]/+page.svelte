<script>
	import { page } from '$app/stores';
	import {
		Warning,
		ContentHeader,
		ContentBody,
		DocsLayout,
		DocsContent,
		BlogPostLayout
	} from 'statue-ssg';

	let { data } = $props();

	let isDocsContent = $derived(data.content?.directory?.startsWith('docs'));
	let isBlogContent = $derived(
		data.content?.directory === 'blog' || data.content?.directory?.startsWith('blog/')
	);
	let activePath = $derived($page.url.pathname);
	let title = $derived(data.content ? data.content.metadata.title : 'Content Not Found');

	let headings = $state([]);

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
	{#if data.content?.metadata?.description}
		<meta name="description" content={data.content.metadata.description} />
	{/if}
</svelte:head>

{#if data.notFound}
	{#if isDocsContent || activePath.startsWith('/docs')}
		<DocsLayout
			sidebarItems={data.sidebarItems || []}
			{activePath}
			sidebarTitle="Docs"
			showToc={false}
			headings={[]}
		>
			<div class="text-center py-12">
				<h1 class="text-2xl font-bold text-(--color-foreground) mb-4">Page Not Found</h1>
				<p class="text-(--color-muted)">The documentation page you're looking for doesn't exist.</p>
				<a href="/docs" class="mt-4 inline-block text-(--color-primary) hover:underline">
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
{:else if data.content}
	{#if isDocsContent}
		<DocsLayout sidebarItems={data.sidebarItems || []} {headings} {activePath} sidebarTitle="Docs">
			{#if data.content.metadata.warning}
				<div class="mb-6">
					<Warning warning={data.content.metadata.warning} />
				</div>
			{/if}

			<DocsContent
				content={data.content.content}
				title={data.content.metadata.title}
				description={data.content.metadata.description}
				lastUpdated={data.content.metadata.date}
				bind:headings
			/>
		</DocsLayout>
	{:else if isBlogContent}
		<BlogPostLayout
			title={data.content.metadata.title}
			description={data.content.metadata.description}
			date={data.content.metadata.date}
			author={data.content.metadata.author}
			authorAvatar={data.content.metadata.authorAvatar}
			thumbnail={data.content.metadata.thumbnail}
			content={data.content.content}
			backLink={getBackLink(data.content.directory)}
			backLinkText={getBackLinkText(data.content.directory)}
		/>
	{:else}
		<div
			class="min-h-screen text-white bg-linear-to-b from-(--color-hero-from) via-(--color-hero-via) to-(--color-hero-to)"
		>
			<div class="container mx-auto px-4 py-16">
				<div class="max-w-6xl mx-auto">
					<ContentHeader
						title={data.content.metadata.title}
						date={data.content.metadata.date}
						author={data.content.metadata.author}
						backLink={getBackLink(data.content.directory)}
						backLinkText={getBackLinkText(data.content.directory)}
					/>

					{#if data.content.metadata.warning}
						<Warning warning={data.content.metadata.warning} />
					{/if}

					<ContentBody content={data.content.content} />
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
