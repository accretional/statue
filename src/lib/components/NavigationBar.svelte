<script>
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Button from '$lib/components/ui/Button.svelte';

	const { navbarItems = [], activePath = '' } = $props();

	let menuOpen = $state(false);

	const isHome = page.url.pathname === '/';

	const closeMenu = () => (menuOpen = false);
	const toggleMenu = () => (menuOpen = !menuOpen);
</script>

<svelte:window
	onkeydown={(e) => {
		if (menuOpen && e.key === 'Escape') {
			menuOpen = false;
		}
	}}
/>

<nav
	class={[
		'fixed top-0 z-50 h-(--nav-height) w-full bg-(--bg)',
		!isHome && 'border-b border-b-(--divider)'
	]}
>
	<div class="container mx-auto px-4">
		<div class="flex h-16 items-center justify-between">
			<div class="flex items-center">
				<a href={resolve('/')} class="flex items-center space-x-2">
					<div class="h-8 w-8 text-(--color-primary)">
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
							<path d="M12 8L12 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
						</svg>
					</div>
					<span class="text-xl font-bold">
						<span class="text-(--color-primary)">Statue</span>SSG
					</span>
				</a>
			</div>

			<!-- Desktop Menu -->
			<div class="hidden items-center space-x-4 md:flex">
				<Button href="/about" variant="link">About</Button>
				<Button href="/docs" variant="link">Documentation</Button>
			</div>

			<!-- Mobile menu button -->
			<div class="relative md:hidden">
				<button aria-label="Toggle menu" aria-expanded={menuOpen} onclick={toggleMenu} class="p-2">
					{#if !menuOpen}
						<!-- Hamburger -->
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					{:else}
						<!-- Close -->
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					{/if}
				</button>

				{#if menuOpen}
					<!-- Mobile Menu -->
					<div class="fixed top-16 right-0 left-0 bg-(--bg-2) shadow-lg md:hidden">
						<div class="flex flex-col space-y-1 px-2 py-3">
							<Button href="/" variant="link" on:click={closeMenu}>Home</Button>
							<Button href="/about" variant="link" on:click={closeMenu}>About</Button>
							<Button href="/docs" variant="link" on:click={closeMenu}>Documentation</Button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</nav>
