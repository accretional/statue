<script lang="ts">
	import '$lib/styles/global.css';

	import favicon from '$lib/assets/favicon.svg';
	import NavigationBar from '$lib/components/NavigationBar.svelte';

	let { data, children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<NavigationBar navbarItems={data.directories} activePath="/" />

<main class="pt-(--nav-height)">
	{@render children()}
</main>
