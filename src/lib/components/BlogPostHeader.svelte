<script>
	import { page } from '$app/stores';
	import AuthorAvatar from './AuthorAvatar.svelte';

	let {
		title = '',
		description = '',
		date = '',
		author = '',
		authorAvatar = '',
		thumbnail = '',
		backLink = '/blog',
		backLinkText = 'Blog'
	} = $props();

	// Format date using $derived
	let formattedDate = $derived(
		date
			? new Date(date).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'long',
					day: '2-digit'
				})
			: ''
	);

	// Check if thumbnail exists
	let hasThumbnail = $derived(!!thumbnail);

	// Generate matching view transition name from current URL - use slug only
	let slug = $derived(
		$page.url.pathname ? $page.url.pathname.split('/').filter(Boolean).pop() : ''
	);
	let transitionName = $derived(slug ? `blog-thumb-${slug}` : '');
</script>

<header class="blog-post-header">
	<!-- <div class="breadcrumb">
		<a href={backLink} class="back-link">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M19 12H5M12 19l-7-7 7-7" />
			</svg>
			<span>{backLinkText}</span>
		</a>
	</div> -->
	<div class="wrapper">
		<h1 class="title">{title}</h1>
		{#if description}
			<p class="description">{description}</p>
		{/if}

		<div class="meta">
			{#if author}
				<span class="author">{author}</span>
			{/if}
			{#if formattedDate}
				<span class="dot"></span>
				<span class="date">{formattedDate}</span>{/if}
		</div>
	</div>

	{#if hasThumbnail}
		<div class="thumbnail-container" style="view-transition-name: {transitionName};">
			<img src={thumbnail} alt={title} class="thumbnail" />
		</div>
	{/if}
</header>

<style>
	.blog-post-header {
		margin-bottom: 48px;
	}
	.wrapper {
		margin-top: 36px;
		margin-bottom: 28px;
		font-family: var(--font-sans);
	}
	.title {
		font-size: 42px;
		font-weight: 700;
		font-family: var(--font-serif);
		color: var(--color-foreground);
		letter-spacing: -0.02em;
	}
	.description {
		color: var(--color-muted);
		line-height: 1.5;
		max-width: 800px;
	}
	.thumbnail-container {
		width: 100%;
		margin: 0 auto 40px;
		border-radius: 18px;
		overflow: hidden;
		background-color: var(--color-card);
	}
	.thumbnail {
		width: 100%;
		height: auto;
		display: block;
	}
	.meta {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 10px;
		margin: 28px 0;
		text-transform: uppercase;
		font-size: 14px;
		color: var(--color-muted);
	}
	.dot {
		width: 2px;
		height: 2px;
		background-color: var(--color-muted);
	}
	.author {
		color: var(--color-muted);
	}
	.date {
		color: var(--color-muted);
	}
	@media (max-width: 768px) {
		.title {
			font-size: 28px;
		}
		.thumbnail-container {
			border-radius: 8px;
		}
	}
</style>
