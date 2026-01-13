<script>
	import { Hero, Stats, Categories, LatestContent, BuiltBy } from '$lib';

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
