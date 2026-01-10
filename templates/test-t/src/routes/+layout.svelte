<script>
	import { NavigationBar, Footer } from 'statue-ssg';
	import { page } from '$app/stores';
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
	showSearch={data.searchConfig?.enabled ?? false}
	searchPlaceholder={data.searchConfig?.placeholder ?? 'Search...'}
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

	/* View Transitions - Blog pages only */
	:global(::view-transition-old(root)),
	:global(::view-transition-new(root)) {
		animation: 200ms ease-out both vt-fade;
	}

	:global(::view-transition-old(root)) {
		animation-direction: reverse;
	}

	@keyframes vt-fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	/* Navbar stays static during transition */
	:global(::view-transition-old(navbar)),
	:global(::view-transition-new(navbar)) {
		animation: none;
	}

	/* Hero thumbnail transition - smooth morph */
	:global(::view-transition-group(*)) {
		animation-duration: 250ms;
		animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	}
</style>
