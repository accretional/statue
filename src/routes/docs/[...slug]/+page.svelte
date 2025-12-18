<script>
	import OnThisPage from '$lib/components/OnThisPage.svelte';

	const { data } = $props();
</script>

<article>
	<main class="flow">
		<header>
			<h1>{data.page.metadata.title}</h1>
			{#if data.page.metadata.description}
				<p class="description">{data.page.metadata.description}</p>
			{/if}
		</header>

		<data.page.content />

		<OnThisPage sections={data.page.sections} />
	</main>
</article>

<style>
	h1 {
		font-weight: 300;
		letter-spacing: -0.025em;
		margin-bottom: 4rem;
	}
</style>
