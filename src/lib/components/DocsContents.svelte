<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	type Item = {
		title: string;
		url: string;
		order: number;
	};

	const { contents } = $props<{ contents: Section[] }>();

	const pathname = page.url.pathname;

	function sortItems(items: Item[]) {
		return [...items].sort((a, b) => a.order - b.order);
	}
</script>

<nav>
	{#each contents as section (section.title)}
		<div class="section">
			{#if !section.isRoot}
				<h3 class="section-title">Intro</h3>
			{:else}
				<h3 class="section-title">{section.title}</h3>
			{/if}

			<ul class="list">
				{#each sortItems(section.items) as item (item.url)}
					<li>
						<a href={resolve(item.url)} class="link" class:active={pathname === item.url}>
							{item.title}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</nav>

<style>
	nav {
		color: var(--text);
		height: 100vh;
		padding: var(--page-padding);
		padding-top: calc(var(--page-padding) * 3);
		position: sticky;
		top: 0;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
	}

	.section-title {
		font-weight: 300;
		letter-spacing: -0.025em;
		color: var(--text);
	}

	.list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
	}

	.link {
		display: block;
		border-radius: 6px;
		text-decoration: underline;
		color: var(--text);
		transition:
			background 120ms ease,
			color 120ms ease;
	}

	.link:hover {
		color: var(--text);
		text-underline-offset: 0.131h;
	}

	.link.active {
		background: var(--bg);
		color: var(--text);
		font-weight: 500;
	}

	nav:has(.link:hover) .link:not(:hover) {
		color: var(--text-2);
	}
</style>
