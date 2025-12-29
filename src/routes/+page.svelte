<script>
	import Hero from '$lib/components/Hero.svelte';
	import Stats from '$lib/components/Stats.svelte';
	import Categories from '$lib/components/Categories.svelte';
	import LatestContent from '$lib/components/LatestContent.svelte';
	import BuiltBy from '$lib/components/BuiltBy.svelte';

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

	<section class="typewriter-showcase">
		<BuiltBy />
	</section>

	<div class="stats-wrapper">
		<Stats />
	</div>

	<div class="container mx-auto px-4 py-10">
		<Categories directories={data.directories} />

		<LatestContent rootContent={data.rootContent} />
	</div>
</div>

<style>
	/* Reduce padding of Stats component on this page to sit closer to BuiltBy */
	.stats-wrapper :global(.container) {
		padding-top: 1rem !important;
	}

	/* Typewriter Showcase Section */
	.typewriter-showcase {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem 2rem 0;
		text-align: center;
		position: relative;
		z-index: 10;
	}
</style>
