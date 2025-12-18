<script lang="ts">
	let { sections } = $props();
</script>

<aside class="on-this-page">
	<h3>On this page</h3>
	<nav>
		<ul>
			{#each sections as section (section.slug)}
				<li>
					<a href="#{section.slug}">{section.title}</a>
				</li>
			{/each}
		</ul>
	</nav>
</aside>

<style>
	.on-this-page {
		padding: 1.5rem;
	}

	h3 {
		margin: 0 0 1rem 0;
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		color: var(--sk-fg-4);
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	li {
		margin-bottom: 0.5rem;
	}

	a {
		color: var(--sk-fg-2);
		text-decoration: none;
		font-size: 0.875rem;
	}

	a:hover {
		color: var(--sk-fg-1);
		text-decoration: underline;
	}
</style>
