<script>
	import NavigationBar from 'statue-ssg/components/NavigationBar.svelte';
	import { page } from '$app/stores';
	import { onNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
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

	// Intersection Observer for scroll animations
	let observer;

	onMount(() => {
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('visible');
					}
				});
			},
			{
				threshold: 0.1,
				rootMargin: '0px 0px -50px 0px'
			}
		);

		// Observe all elements with animate-on-scroll class
		const observeElements = () => {
			document.querySelectorAll('.animate-on-scroll').forEach((el) => {
				observer.observe(el);
			});
		};

		observeElements();

		// Re-observe on navigation
		const mutationObserver = new MutationObserver(observeElements);
		mutationObserver.observe(document.body, { childList: true, subtree: true });

		return () => {
			observer.disconnect();
			mutationObserver.disconnect();
		};
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
