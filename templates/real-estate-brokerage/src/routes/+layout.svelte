<script>
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
	let siteTitle = $derived(navbarConfig?.siteTitle ?? data.site?.name ?? 'Home');
	let logo = $derived(navbarConfig?.logo ?? null);

	// Disable view transitions for smoother scroll animations
	onNavigate(() => {
		window.scrollTo(0, 0);
	});
</script>

<nav class="site-nav" aria-label="Primary">
	<div class="site-nav__inner">
		<a href="/" class="site-nav__brand" aria-label={siteTitle}>
			{#if logo}
				<img src={logo} alt="" class="site-nav__logo" />
			{/if}
			<span>{siteTitle}</span>
		</a>

		{#if defaultNavItems.length}
			<div class="site-nav__links">
				{#each defaultNavItems as item}
					{#if item?.url && item?.title}
						<a
							href={item.url}
							class="site-nav__link"
							aria-current={currentPath === item.url ? 'page' : undefined}
							>{item.title}</a
						>
					{/if}
				{/each}
			</div>
		{/if}
	</div>
</nav>

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

	.site-nav {
		position: sticky;
		top: 0;
		z-index: 50;
		background: color-mix(in srgb, var(--color-background) 85%, black);
		backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--color-border);
	}

	.site-nav__inner {
		max-width: 80rem;
		margin: 0 auto;
		padding: 0.9rem 1rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.site-nav__brand {
		display: inline-flex;
		align-items: center;
		gap: 0.65rem;
		color: white;
		text-decoration: none;
		font-size: 0.95rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.site-nav__logo {
		width: 1.5rem;
		height: 1.5rem;
		object-fit: contain;
	}

	.site-nav__links {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 0.35rem;
	}

	.site-nav__link {
		color: #d1d5db;
		text-decoration: none;
		font-size: 0.8rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		padding: 0.55rem 0.75rem;
		border: 1px solid transparent;
		transition:
			color 160ms ease,
			border-color 160ms ease,
			background-color 160ms ease;
	}

	.site-nav__link:hover,
	.site-nav__link[aria-current='page'] {
		color: var(--color-primary);
		border-color: var(--color-border);
		background: color-mix(in srgb, var(--color-card) 70%, transparent);
	}

	@media (max-width: 768px) {
		.site-nav__inner {
			flex-direction: column;
			align-items: flex-start;
		}

		.site-nav__links {
			width: 100%;
			justify-content: flex-start;
			gap: 0.25rem;
		}

		.site-nav__link {
			padding: 0.5rem 0.6rem;
			font-size: 0.75rem;
		}
	}
</style>
