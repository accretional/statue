<script>
	import { NavigationBar, Footer } from 'statue-ssg';
	import { page } from '$app/stores';
	import { onNavigate } from '$app/navigation';
	import '$lib/index.css';

	let { data, children } = $props();

	let navbarConfig = $derived(data.navbarConfig);
	let currentPath = $derived($page.url.pathname);

	// Disable view transitions for smoother scroll animations
	onNavigate(() => {
		window.scrollTo(0, 0);
	});
</script>

<NavigationBar
	navbarItems={data.globalDirectories}
	showSearch={false}
	siteTitle={navbarConfig?.siteTitle ?? null}
	logo={navbarConfig?.logo ?? null}
	hiddenFromNav={navbarConfig?.hiddenFromNav ?? []}
	{...(navbarConfig?.defaultNavItems && { defaultNavItems: navbarConfig.defaultNavItems })}
/>

<main>
	{@render children()}
</main>

<Footer directories={data.globalDirectories} {currentPath} />

<style>
	:global(body) {
		background-color: var(--color-background);
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
			'Helvetica Neue', sans-serif;
		margin: 0;
		padding: 0;
	}

	:global(*) {
		box-sizing: border-box;
	}
</style>
