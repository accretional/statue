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

<div class="min-h-screen container px-6 mx-auto">
	<Hero />
	<Stats />
	<Categories directories={data.directories} />
	<LatestContent rootContent={data.rootContent} />
	<BuiltBy />
</div>
