<script>
	import { page } from '$app/state';
	import Search from './Search.svelte';

	let {
		navbarItems = [],
		activePath = '',
		showSearch = false,
		searchPlaceholder = 'Search...',
		siteTitle = null,
		logo = null,
		defaultNavItems = [{ title: 'Home', url: '/' }],
		hiddenFromNav = []
	} = $props();

	let isMenuOpen = $state(false);
	let isHidden = $state(false);
	let lastScrollY = $state(0);
	let scrollY = $state(0);

	let currentPath = $derived(page.url.pathname);
	let filteredNavbarItems = $derived(
		navbarItems.filter((item) => !hiddenFromNav.includes(item.name))
	);
	let ctaItem = $derived([...defaultNavItems, ...filteredNavbarItems].find((item) => item.cta));

	function isActive(itemUrl, path) {
		if (itemUrl === '/') {
			return path === '/';
		}
		return path === itemUrl || path.startsWith(itemUrl + '/');
	}

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	function handleScroll() {
		const delta = scrollY - lastScrollY;
		// Hide on scroll down, show on scroll up
		if (Math.abs(delta) > 6) {
			isHidden = delta > 0 && scrollY > 24;
			lastScrollY = scrollY;
		}
	}
</script>

<svelte:window bind:scrollY onscroll={handleScroll} />

<nav
	class:md:!bg-transparent={currentPath === '/' && !isMenuOpen && scrollY < 10}
	class:-translate-y-full={isHidden}
	class:translate-y-0={!isHidden}
	class="fixed top-0 z-50 w-full bg-background text-foreground transition-transform duration-300"
	style="view-transition-name: navbar;"
>
	<div class="container mx-auto px-4">
		<div class="flex items-center justify-between h-16">
			<div class="flex items-center">
				<a href="/" class="flex items-center space-x-2">
					<!-- Logo: true = default SVG, string = custom image, false/null = no logo -->
					{#if logo === true}
						<div class="text-primary w-8 h-8">
							<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
								<rect
									x="3"
									y="3"
									width="18"
									height="18"
									rx="2"
									stroke="currentColor"
									stroke-width="2"
								/>
								<path d="M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
								<path
									d="M12 8L12 16"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
								/>
							</svg>
						</div>
					{:else if logo}
						<img src={logo} alt={siteTitle || 'Logo'} class="w-8 h-8 object-contain" />
					{/if}
					{#if siteTitle}
						<span class="font-bold text-xl text-foreground">
							{siteTitle}
						</span>
					{/if}
				</a>
			</div>

			<!-- Desktop Menu -->
			<div class="hidden md:flex items-center space-x-4">
				{#each defaultNavItems as item}
					{#if !item.cta}
						<a
							href={item.url}
							class="py-2 px-3 font-medium text-sm transition-colors duration-200 {isActive(
								item.url,
								currentPath
							)
								? 'text-primary'
								: 'text-foreground hover:text-primary'}"
						>
							{item.title}
						</a>
					{/if}
				{/each}

				{#each filteredNavbarItems as item}
					{#if !item.cta}
						<a
							href={item.url}
							class="py-2 px-3 font-medium text-sm transition-colors duration-200 {isActive(
								item.url,
								currentPath
							)
								? 'text-primary'
								: 'text-foreground hover:text-primary'}"
						>
							{item.title}
						</a>
					{/if}
				{/each}

				<!-- Search component -->
				{#if showSearch}
					<div class="ml-2 w-56">
						<Search placeholder={searchPlaceholder} />
					</div>
				{/if}

				{#if ctaItem}
					<a
						href={ctaItem.url}
						class="ml-4 px-4 py-2 rounded-lg bg-primary hover:brightness-110 text-on-primary text-sm font-medium transition-colors duration-200"
					>
						{ctaItem.title}
					</a>
				{/if}
			</div>

			<!-- Mobile menu button -->
			<div class="md:hidden">
				<button onclick={toggleMenu} class="text-muted hover:text-primary focus:outline-none">
					{#if isMenuOpen}
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					{:else}
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					{/if}
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if isMenuOpen}
		<div class="md:hidden bg-background">
			<div class="px-2 pt-2 pb-3 space-y-1">
				<!-- Search in mobile menu -->
				{#if showSearch}
					<div class="px-3 py-2">
						<Search placeholder={searchPlaceholder} />
					</div>
				{/if}

				{#each defaultNavItems as item}
					{#if !item.cta}
						<a
							href={item.url}
							class="block px-3 py-2 rounded-md text-base font-medium {isActive(
								item.url,
								currentPath
							)
								? 'bg-surface text-white'
								: 'text-slate-300 hover:bg-surface hover:text-white'}"
						>
							{item.title}
						</a>
					{/if}
				{/each}

				{#each filteredNavbarItems as item}
					{#if !item.cta}
						<a
							href={item.url}
							class="block px-3 py-2 rounded-md text-base font-medium {isActive(
								item.url,
								currentPath
							)
								? 'bg-surface text-white'
								: 'text-slate-300 hover:bg-surface hover:text-white'}"
						>
							{item.title}
						</a>
					{/if}
				{/each}

				{#if ctaItem}
					<a
						href={ctaItem.url}
						class="block px-3 py-2 rounded-md text-base font-medium bg-primary hover:brightness-110 text-on-primary mt-3"
					>
						{ctaItem.title}
					</a>
				{/if}
			</div>
		</div>
	{/if}
</nav>
