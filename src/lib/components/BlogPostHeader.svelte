<script>
	import { page } from '$app/stores';

	let { title = '', description = '', date = '', author = '', thumbnail = '' } = $props();

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

	// Generate matching view transition name from current URL - use slug only
	let slug = $derived(
		$page.url.pathname ? $page.url.pathname.split('/').filter(Boolean).pop() : ''
	);
	let transitionName = $derived(slug ? `blog-thumb-${slug}` : '');
</script>

<header class="blog-post-header">
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

	{#if thumbnail}
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
		margin-inline: auto;
		font-family: var(--font-sans);
		display: flex;
		flex-direction: column;
		max-width: 800px;
	}
	.title {
		font-size: 42px;
		font-weight: 300;
		font-family: var(--font-serif);
		line-height: 1.4;
		color: var(--color-foreground);
		letter-spacing: -0.02em;
		text-align: center;
	}
	.description {
		color: var(--color-muted);
		line-height: 1.5;
		text-align: center;
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
		margin: 28px auto;
		text-transform: uppercase;
		font-size: 14px;
		color: var(--color-muted);
	}
	.dot {
		width: 2px;
		height: 2px;
		background-color: var(--color-muted);
	}
	@media (max-width: 768px) {
		.title {
			font-size: 28px;
		}
		.thumbnail-container {
			border-radius: 12px;
		}
	}
</style>
