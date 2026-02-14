<script>
	import { page } from '$app/stores';
	import { tick } from 'svelte';
	import {
		Warning,
		ContentHeader,
		ContentBody,
		DocsLayout,
		DocsContent,
		BlogPostLayout,
		BlogLayout,
		PageHero
	} from 'statue-ssg';

	// Import all MDX files at build time - use non-eager import to avoid build errors
	const mdxModules = import.meta.glob('/content/**/*.mdx');

	let { data } = $props();

	// Helper function to find MDX component
	async function findMdxComponent(pathname) {
		// Remove trailing slash
		const url = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

		// Try different path patterns
		const patterns = [`/content${url}.mdx`, `/content${url}/index.mdx`];

		for (const pattern of patterns) {
			const moduleLoader = mdxModules[pattern];
			if (moduleLoader) {
				try {
					const module = await moduleLoader();
					if (module?.default) {
						return module.default;
					}
				} catch (error) {
					console.warn(`Failed to load MDX module: ${pattern}`, error);
				}
			}
		}
		return null;
	}

	// Reactive values
	let mdxComponent = $state(null);
	let isMdxContent = $derived(mdxComponent !== null);

	// Load MDX component when page changes
	$effect(async () => {
		mdxComponent = await findMdxComponent($page.url.pathname);
	});
	let activePath = $derived($page.url.pathname);
	let title = $derived(data.content ? data.content.metadata.title : (data.isTagPage ? data.pageTitle : 'Content Not Found'));
	let layoutType = $derived(data.layoutType || 'default');
	let isTagPage = $derived(data.isTagPage || false);

	let headings = $state([]);
	let mdxContainer = $state(null);

	// Extract headings from MDX content after render
	$effect(() => {
		mdxComponent;
		if (isMdxContent && mdxContainer) {
			tick().then(() => {
				const h2s = mdxContainer.querySelectorAll('h2[id], h3[id]');
				const extracted = Array.from(h2s).map((el) => ({
					id: el.id,
					text: el.textContent,
					level: el.tagName === 'H2' ? 2 : 3
				}));
				headings = extracted;
			});
		}
	});

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
	{:else if isTagPage}
		<meta name="description" content="Posts tagged with {data.tag}" />
	{/if}
</svelte:head>

{#if isTagPage}
	<!-- Tag Page - Show posts for a specific tag -->
	<div class="container mx-auto px-4 pt-20">
		<div class="flex items-center gap-2 text-sm text-[var(--color-muted)] mb-4">
			<a href="/" class="hover:text-[var(--color-primary)]">Home</a>
			<span>/</span>
			<a href="/blog" class="hover:text-[var(--color-primary)]">Blog</a>
			<span>/</span>
			<span>Tag: {data.tag}</span>
		</div>
	</div>

	<PageHero
		title={`Posts tagged "${data.tag}"`}
		description={`Found ${data.posts.length} ${data.posts.length === 1 ? 'post' : 'posts'}`}
	/>

	<BlogLayout title="" posts={data.posts} />
{:else if isMdxContent}
	<!-- MDX Content - Layout determined by layoutType -->
	{#if layoutType === 'docs'}
		<DocsLayout sidebarItems={data.sidebarItems || []} {headings} {activePath} sidebarTitle="Docs">
			<div bind:this={mdxContainer}>
				{#if data.content?.metadata?.title}
					<header class="mb-8 pb-8 border-(--color-border)">
						<h1 class="text-3xl sm:text-4xl font-bold text-(--color-foreground) mb-4">
							{data.content.metadata.title}
						</h1>
						{#if data.content?.metadata?.description}
							<p class="text-lg text-muted leading-relaxed">
								{data.content.metadata.description}
							</p>
						{/if}
					</header>
				{/if}
				<div class="prose prose-docs max-w-none pb-16">
					{@render mdxComponent?.()}
				</div>
			</div>
		</DocsLayout>
	{:else if layoutType === 'blog'}
		<div class="min-h-screen bg-(--color-background)">
			<div class="container mx-auto px-4 py-16">
				<div class="max-w-4xl mx-auto prose prose-invert">
					{@render mdxComponent?.()}
				</div>
			</div>
		</div>
	{:else}
		<div class="min-h-screen text-white bg-linear-to-b from-(--color-hero-from) via-(--color-hero-via) to-(--color-hero-to)">
			<div class="container mx-auto px-4 py-16">
				<div class="max-w-6xl mx-auto prose prose-invert">
					{@render mdxComponent?.()}
				</div>
			</div>
		</div>
	{/if}
{:else if data.content}
	<!-- Markdown Content - Layout determined by layoutType -->
	{#if layoutType === 'docs'}
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
	{:else if layoutType === 'blog'}
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
