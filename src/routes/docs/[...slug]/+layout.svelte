<script lang="ts">
	import DocsContents from '$lib/components/DocsContents.svelte';

	const { data, children } = $props();
</script>

<div class="article-layout">
	<aside class="sidebar">
		<DocsContents contents={data.sidebar} />
	</aside>

	<div class="content">
		{@render children()}
	</div>
</div>

<style>
	.article-layout {
		--sidebar-width: 20rem;
		--page-padding: 2rem;
		--content-width: calc(680px + var(--page-padding));
		display: flex;
	}

	.sidebar {
		display: none;
	}

	.content {
		min-width: 0;
		max-width: var(--content-width);
		margin: var(--page-padding);
		margin-top: calc(var(--page-padding) * 3);
	}

	@media (min-width: 832px) {
		.sidebar {
			display: block;
			flex-shrink: 0;
			height: calc(100vh - var(--nav-height));
			width: var(--sidebar-width);
			background: var(--bg-2);
			overflow-y: auto;
			position: sticky;
			top: var(--nav-height);
		}

		.content {
			min-width: 0;
			max-width: var(--content-width);
			margin: var(--page-padding * 2);
			margin-top: calc(var(--page-padding) * 3);
		}
	}

	@media (min-width: 1200px) {
	}
</style>
