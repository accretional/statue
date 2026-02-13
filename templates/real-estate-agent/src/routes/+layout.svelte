<script>
	import { NavigationBar } from 'statue-ssg';
	import { page } from '$app/stores';
	import { onNavigate } from '$app/navigation';
	import '$lib/index.css';

	let { data, children } = $props();

	let navbarConfig = $derived(data.navbarConfig);
	let currentPath = $derived($page.url.pathname);
	let defaultNavItems = $derived(
		navbarConfig?.defaultNavItems?.map((item) => {
			if (currentPath !== '/' && typeof item?.url === 'string' && item.url.startsWith('#')) {
				return { ...item, url: `/${item.url}` };
			}
			return item;
		}) ?? []
	);

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
	{...(defaultNavItems.length && { defaultNavItems })}
/>

<main>
	{@render children()}
</main>

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

	/* Fix mobile menu button padding */
	:global(nav button:last-child) {
		padding-right: 1rem !important;
	}

	:global(.mobile-menu-button) {
		padding-right: 1rem !important;
	}

	@media (max-width: 768px) {
		:global(nav button[aria-label*='menu']) {
			padding-right: 1rem !important;
		}
	}
</style>
