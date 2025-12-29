<script>
	// BlogPostHeader component - Linear-style blog post header with thumbnail
	import { page } from '$app/stores';
	import AuthorAvatar from './AuthorAvatar.svelte';

	export let title = '';
	export let description = '';
	export let date = '';
	export let author = '';
	export let authorAvatar = '';
	export let thumbnail = '';
	export let backLink = '/blog';
	export let backLinkText = 'Blog';

	// Format date
	$: formattedDate = date
		? new Date(date).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: '2-digit'
			})
		: '';

	// Check if thumbnail exists
	$: hasThumbnail = !!thumbnail;

	// Generate matching view transition name from current URL - use slug only
	$: slug = $page.url.pathname ? $page.url.pathname.split('/').filter(Boolean).pop() : '';
	$: transitionName = slug ? `blog-thumb-${slug}` : '';
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
	</div>

	{#if hasThumbnail}
		<div class="thumbnail-container" style="view-transition-name: {transitionName};">
			<img src={thumbnail} alt={title} class="thumbnail" />
		</div>
	{/if}

	<div class="meta">
		{#if formattedDate}<span class="date">{formattedDate}</span>{/if}
		{#if author}
			<span class="dot"></span>
			<div class="avatar-wrapper">
				<span class="author">{author}</span>
			</div>
		{/if}
	</div>
</header>

<style>
	.blog-post-header {
		margin-bottom: 48px;
	}

	.wrapper {
		margin-top: 48px;
		margin-bottom: 36px;
	}

	.title {
		font-size: 42px;
		font-weight: 700;
		color: var(--color-foreground);
		letter-spacing: -0.02em;
		text-align: center;
	}

	.description {
		font-size: 16px;
		color: var(--color-muted);
		line-height: 1.5;
		max-width: 800px;
		text-align: center;
		margin: 0 auto 12px auto;
	}

	.thumbnail-container {
		width: 100%;
		margin: 0 auto 40px;
		border-radius: 12px;
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
		justify-content: center;
		gap: 10px;
		margin-bottom: 16px;
		font-size: 16px;
		color: var(--color-muted);
	}

	.dot {
		width: 2px;
		height: 2px;
		background-color: var(--color-muted);
	}

	.avatar-wrapper {
		display: flex;
		align-items: center;
		gap: 4px;
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
