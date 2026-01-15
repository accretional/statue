<script>
	import { page } from '$app/stores';
	import { onMount, tick } from 'svelte';
	import { browser } from '$app/environment';
	import {
		Warning,
		ContentHeader,
		DocsLayout,
		BlogPostHeader
	} from 'statue-ssg';

	let { data } = $props();

	let isDocsContent = $derived(data.content?.directory?.startsWith('docs'));
	let isBlogContent = $derived(
		data.content?.directory === 'blog' || data.content?.directory?.startsWith('blog/')
	);
	let activePath = $derived($page.url.pathname);
	let title = $derived(data.content ? data.content.metadata.title : 'Content Not Found');

	let headings = $state([]);
	let contentElement = $state(null);

	// Extract headings from rendered content for TOC
	async function extractHeadings() {
		if (!browser || !contentElement) return;
		await tick();

		const headingElements = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
		const extractedHeadings = [];

		headingElements.forEach((el, index) => {
			if (!el.id) {
				el.id =
					el.textContent
						?.toLowerCase()
						.replace(/[^a-z0-9]+/g, '-')
						.replace(/(^-|-$)/g, '') || `heading-${index}`;
			}

			extractedHeadings.push({
				id: el.id,
				text: el.textContent || '',
				level: parseInt(el.tagName.charAt(1))
			});
		});

		headings = extractedHeadings;
	}

	onMount(() => {
		extractHeadings();
	});

	// Re-extract when content changes
	$effect(() => {
		if (data.ContentComponent) {
			extractHeadings();
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
			<h2 class="text-xl font-bold text-red-700">Page not found</h2>
			<p class="my-2">URL: {$page.url.pathname}</p>
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

			<article class="docs-content">
				<header class="mb-8 pb-8 border-b border-[var(--color-border)]">
					{#if data.content.metadata.title}
						<h1 class="text-3xl sm:text-4xl font-bold text-[var(--color-foreground)] mb-4">
							{data.content.metadata.title}
						</h1>
					{/if}
					{#if data.content.metadata.description}
						<p class="text-lg text-[var(--color-muted)] leading-relaxed">
							{data.content.metadata.description}
						</p>
					{/if}
					{#if data.content.metadata.date}
						<div class="flex items-center gap-1 mt-4 text-sm text-[var(--color-muted)]">
							<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							Last updated: {data.content.metadata.date}
						</div>
					{/if}
				</header>

				<div bind:this={contentElement} class="prose prose-docs max-w-none pb-16">
					{#if data.ContentComponent}
						<data.ContentComponent />
					{:else if data.content.content}
						{@html data.content.content}
					{/if}
				</div>
			</article>
		</DocsLayout>
	{:else if isBlogContent}
		<div class="blog-post-layout">
			<div class="blog-post-container">
				<BlogPostHeader
					title={data.content.metadata.title}
					description={data.content.metadata.description}
					date={data.content.metadata.date}
					author={data.content.metadata.author}
					authorAvatar={data.content.metadata.authorAvatar}
					thumbnail={data.content.metadata.thumbnail}
					backLink={getBackLink(data.content.directory)}
					backLinkText={getBackLinkText(data.content.directory)}
				/>

				<article class="blog-post-content">
					<div bind:this={contentElement} class="prose">
						{#if data.ContentComponent}
							<data.ContentComponent />
						{:else if data.content.content}
							{@html data.content.content}
						{/if}
					</div>
				</article>
			</div>
		</div>
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

					<main bind:this={contentElement} class="prose prose-invert max-w-none">
						{#if data.ContentComponent}
							<data.ContentComponent />
						{:else if data.content.content}
							{@html data.content.content}
						{/if}
					</main>
				</div>
			</div>
		</div>
	{/if}
{:else}
	<div class="bg-yellow-100 p-4 rounded-md my-8 max-w-prose mx-auto">
		<h2 class="text-xl font-bold text-yellow-700">Content unavailable</h2>
		<p class="my-2">URL: {$page.url.pathname}</p>
	</div>
{/if}

<style>
	/* Docs prose styles */
	:global(.prose-docs) {
		color: var(--color-foreground);
	}

	:global(.prose-docs h1) {
		font-size: 2rem;
		font-weight: 700;
		margin-top: 2.5rem;
		margin-bottom: 1rem;
		color: var(--color-foreground);
		scroll-margin-top: 5rem;
	}

	:global(.prose-docs h2) {
		font-size: 1.5rem;
		font-weight: 600;
		margin-top: 2rem;
		margin-bottom: 0.75rem;
		color: var(--color-foreground);
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--color-border);
		scroll-margin-top: 5rem;
	}

	:global(.prose-docs h3) {
		font-size: 1.25rem;
		font-weight: 600;
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
		color: var(--color-foreground);
		scroll-margin-top: 5rem;
	}

	:global(.prose-docs h4) {
		font-size: 1.125rem;
		font-weight: 600;
		margin-top: 1.25rem;
		margin-bottom: 0.5rem;
		color: var(--color-foreground);
		scroll-margin-top: 5rem;
	}

	:global(.prose-docs p) {
		margin-top: 1rem;
		margin-bottom: 1rem;
		line-height: 1.75;
		color: color-mix(in srgb, var(--color-foreground) 70%, var(--color-muted) 30%);
	}

	:global(.prose-docs a) {
		color: var(--color-primary);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	:global(.prose-docs a:hover) {
		opacity: 0.8;
	}

	:global(.prose-docs strong) {
		color: var(--color-foreground);
		font-weight: 600;
	}

	:global(.prose-docs ul),
	:global(.prose-docs ol) {
		margin-top: 1rem;
		margin-bottom: 1rem;
		padding-left: 1.5rem;
	}

	:global(.prose-docs ul) {
		list-style-type: disc;
	}

	:global(.prose-docs ol) {
		list-style-type: decimal;
	}

	:global(.prose-docs li) {
		margin-top: 0.25rem;
		margin-bottom: 0.25rem;
		color: color-mix(in srgb, var(--color-foreground) 70%, var(--color-muted) 30%);
		line-height: 1.75;
	}

	:global(.prose-docs li::marker) {
		color: var(--color-muted);
	}

	:global(.prose-docs code) {
		background-color: var(--color-card);
		padding: 0.125rem 0.375rem;
		border-radius: 0.25rem;
		font-size: 0.875em;
		font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
		color: var(--color-primary);
	}

	:global(.prose-docs pre) {
		background-color: var(--color-card);
		padding: 1rem 1.25rem;
		border-radius: 0.5rem;
		margin-top: 1.5rem;
		margin-bottom: 1.5rem;
		overflow-x: auto;
		border: 1px solid var(--color-border);
	}

	:global(.prose-docs pre code) {
		background-color: transparent;
		padding: 0;
		border-radius: 0;
		font-size: 0.875rem;
		color: var(--color-foreground);
	}

	:global(.prose-docs blockquote) {
		border-left: 4px solid var(--color-primary);
		padding-left: 1rem;
		margin-top: 1.5rem;
		margin-bottom: 1.5rem;
		font-style: italic;
		color: var(--color-muted);
	}

	:global(.prose-docs hr) {
		border: none;
		border-top: 1px solid var(--color-border);
		margin-top: 2rem;
		margin-bottom: 2rem;
	}

	:global(.prose-docs table) {
		width: 100%;
		border-collapse: collapse;
		margin-top: 1.5rem;
		margin-bottom: 1.5rem;
		font-size: 0.875rem;
	}

	:global(.prose-docs th) {
		background-color: var(--color-card);
		padding: 0.75rem 1rem;
		text-align: left;
		font-weight: 600;
		color: var(--color-foreground);
		border-bottom: 2px solid var(--color-border);
	}

	:global(.prose-docs td) {
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--color-border);
		color: color-mix(in srgb, var(--color-foreground) 70%, var(--color-muted) 30%);
	}

	:global(.prose-docs img) {
		max-width: 100%;
		height: auto;
		border-radius: 0.5rem;
		margin-top: 1.5rem;
		margin-bottom: 1.5rem;
	}

	/* Blog layout styles */
	.blog-post-layout {
		min-height: 100vh;
		background: var(--color-background);
	}

	.blog-post-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 60px 48px 120px;
	}

	.blog-post-content {
		max-width: 860px;
		margin: 0 auto;
	}

	.blog-post-content .prose {
		color: color-mix(in srgb, var(--color-foreground) 70%, var(--color-muted) 30%);
		font-size: 17px;
		line-height: 1.75;
	}

	:global(.blog-post-content .prose h1) {
		font-size: 28px;
		font-weight: 600;
		color: var(--color-foreground);
		margin-top: 48px;
		margin-bottom: 16px;
	}

	:global(.blog-post-content .prose h2) {
		font-size: 22px;
		font-weight: 600;
		color: var(--color-foreground);
		margin-top: 40px;
		margin-bottom: 12px;
	}

	:global(.blog-post-content .prose h3) {
		font-size: 18px;
		font-weight: 600;
		color: var(--color-foreground);
		margin-top: 32px;
		margin-bottom: 8px;
	}

	:global(.blog-post-content .prose p) {
		margin-top: 20px;
		margin-bottom: 20px;
	}

	:global(.blog-post-content .prose a) {
		color: var(--color-foreground);
		text-decoration: underline;
		text-decoration-color: var(--color-border);
		text-underline-offset: 3px;
	}

	:global(.blog-post-content .prose a:hover) {
		text-decoration-color: var(--color-foreground);
	}

	:global(.blog-post-content .prose ul) {
		list-style-type: disc;
		padding-left: 24px;
		margin-top: 20px;
		margin-bottom: 20px;
	}

	:global(.blog-post-content .prose ol) {
		list-style-type: decimal;
		padding-left: 24px;
		margin-top: 20px;
		margin-bottom: 20px;
	}

	:global(.blog-post-content .prose li) {
		margin-top: 8px;
		margin-bottom: 8px;
	}

	:global(.blog-post-content .prose code) {
		background-color: var(--color-card);
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 15px;
		font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
	}

	:global(.blog-post-content .prose pre) {
		background-color: var(--color-card);
		padding: 20px 24px;
		border-radius: 8px;
		margin-top: 24px;
		margin-bottom: 24px;
		overflow-x: auto;
		border: 1px solid var(--color-border);
	}

	:global(.blog-post-content .prose pre code) {
		background: none;
		padding: 0;
		font-size: 14px;
		line-height: 1.6;
		color: var(--color-foreground);
	}

	:global(.blog-post-content .prose blockquote) {
		border-left: 3px solid var(--color-border);
		padding-left: 20px;
		margin: 24px 0;
		font-style: italic;
		color: var(--color-muted);
	}

	:global(.blog-post-content .prose img) {
		max-width: 100%;
		height: auto;
		border-radius: 8px;
		margin: 32px 0;
	}

	/* General prose for other content types */
	:global(.prose) {
		max-width: 90ch;
	}

	:global(.prose h1) {
		font-size: 1.3rem;
		font-weight: bold;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}
	:global(.prose h2) {
		font-size: 1.25rem;
		font-weight: bold;
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
	}
	:global(.prose h3) {
		font-size: 1.125rem;
		font-weight: bold;
		margin-top: 1rem;
		margin-bottom: 0.5rem;
	}
	:global(.prose p) {
		margin-top: 1rem;
		margin-bottom: 1rem;
	}
	:global(.prose ul) {
		list-style-type: disc;
		padding-left: 1.25rem;
		margin-top: 1rem;
		margin-bottom: 1rem;
	}
	:global(.prose ol) {
		list-style-type: decimal;
		padding-left: 1.25rem;
		margin-top: 1rem;
		margin-bottom: 1rem;
	}
	:global(.prose a) {
		color: var(--color-prose-link, var(--color-primary));
		text-decoration: underline;
	}
	:global(.prose code) {
		background-color: var(--color-prose-code-bg, var(--color-card));
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
	}
	:global(.prose pre) {
		background-color: var(--color-prose-pre-bg, var(--color-card));
		padding: 1rem;
		border-radius: 0.25rem;
		margin-top: 1rem;
		margin-bottom: 1rem;
		overflow-x: auto;
	}

	@media (max-width: 768px) {
		.blog-post-container {
			padding: 80px 24px 80px;
		}

		.blog-post-content .prose {
			font-size: 16px;
		}

		:global(.blog-post-content .prose h1) {
			font-size: 24px;
		}

		:global(.blog-post-content .prose h2) {
			font-size: 20px;
		}
	}
</style>
