<script>
	import { NavigationBar, Footer } from 'statue-ssg';
	import { page } from '$app/state';
	import { onNavigate } from '$app/navigation';
	import '$lib/index.css';

	let { data, children } = $props();

	let searchConfig = $derived(data.searchConfig);
	let navbarConfig = $derived(data.navbarConfig);
	let currentPath = $derived($page.url.pathname);

	// Enable View Transitions API only for blog pages
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		// Only enable transitions between blog pages
		const fromPath = navigation.from?.url?.pathname || '';
		const toPath = navigation.to?.url?.pathname || '';
		const isBlogTransition = fromPath.startsWith('/blog') && toPath.startsWith('/blog');

		if (!isBlogTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<NavigationBar
	navbarItems={data.globalDirectories}
	showSearch={searchConfig?.enabled ?? false}
	searchPlaceholder={searchConfig?.placeholder ?? 'Search...'}
	siteTitle={navbarConfig?.siteTitle ?? null}
	logo={navbarConfig?.logo ?? null}
	hiddenFromNav={navbarConfig?.hiddenFromNav ?? []}
	{...navbarConfig?.defaultNavItems && { defaultNavItems: navbarConfig.defaultNavItems }}
/>

<main>
	{@render children()}
</main>

<Footer directories={data.globalDirectories} {currentPath} />
