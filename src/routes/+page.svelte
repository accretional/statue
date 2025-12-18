<script>
	import Hero from '$lib/components/Hero.svelte';

	const { data } = $props();
</script>

<svelte:head>
	<title>Statue</title>
	<meta
		name="description"
		content="Statue SSG powered by Svelte, generates static sites from markdown content."
	/>
</svelte:head>

<div
	class="min-h-screen bg-linear-to-b from-(--color-hero-from) via-(--color-hero-via) to-(--color-hero-to)"
>
	<Hero />
</div>
