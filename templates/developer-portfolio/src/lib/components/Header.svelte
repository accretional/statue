<script lang="ts">
	import { Menu, Bell, Plus, Search } from 'lucide-svelte';

	export let userProfile: {
		avatarUrl: string;
		username: string;
	};

	let isMenuOpen = false;
</script>

<header class="bg-canvas-subtle border-b border-border-default py-3 px-4 md:px-6 sticky top-0 z-50">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<button
				class="md:hidden text-fg-muted hover:text-fg-default"
				on:click={() => isMenuOpen = !isMenuOpen}
			>
				<Menu size={24} />
			</button>

			<a href="#" class="text-fg-default hover:text-fg-muted transition-colors">
				<svg height="32" viewBox="0 0 16 16" version="1.1" width="32" aria-hidden="true" fill="currentColor">
					<path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0 4.42 3.58 8 8 8Z"></path>
				</svg>
			</a>

			<div class="hidden md:flex items-center gap-1 ml-2">
				<span class="text-sm font-semibold text-fg-default px-2 py-1 rounded-md hover:bg-canvas-overlay cursor-pointer">Product</span>
				<span class="text-sm font-semibold text-fg-default px-2 py-1 rounded-md hover:bg-canvas-overlay cursor-pointer">Solutions</span>
				<span class="text-sm font-semibold text-fg-default px-2 py-1 rounded-md hover:bg-canvas-overlay cursor-pointer">Open Source</span>
				<span class="text-sm font-semibold text-fg-default px-2 py-1 rounded-md hover:bg-canvas-overlay cursor-pointer">Pricing</span>
			</div>
		</div>

		<div class="flex items-center gap-3">
			<div class="hidden md:flex relative">
				<div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
					<Search size={14} class="text-fg-muted"/>
				</div>
				<input
					type="text"
					placeholder="Type / to search"
					class="bg-canvas-default border border-border-default rounded-md py-1 pl-8 pr-12 text-sm text-fg-default focus:ring-2 focus:ring-accent-fg focus:border-accent-fg outline-none w-64 transition-all"
				/>
				<div class="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
					<kbd class="border border-border-muted rounded px-1 text-[10px] text-fg-muted font-mono">/</kbd>
				</div>
			</div>

			<div class="flex items-center gap-2 border-l border-border-muted pl-4 ml-2">
				<button class="p-1 text-fg-default border border-border-default rounded-md hover:bg-canvas-overlay">
					<Plus size={16} />
				</button>
				<button class="p-1 text-fg-default border border-border-default rounded-md hover:bg-canvas-overlay">
					<div class="relative">
						<Bell size={16} />
						<span class="absolute -top-1 -right-1 w-2 h-2 bg-accent-fg rounded-full"></span>
					</div>
				</button>
				<button class="p-1 text-fg-default border border-border-default rounded-md hover:bg-canvas-overlay">
					<img src={userProfile.avatarUrl} alt="Me" class="w-4 h-4 rounded-full" />
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if isMenuOpen}
		<div class="md:hidden mt-4 pb-2 border-t border-border-default pt-2">
			<input
				type="text"
				placeholder="Search GitHub"
				class="w-full bg-canvas-default border border-border-default rounded-md py-2 px-3 text-sm text-fg-default mb-4"
			/>
			<nav class="flex flex-col gap-2">
				<a href="#" class="text-fg-default font-semibold py-1">Dashboard</a>
				<a href="#" class="text-fg-default font-semibold py-1">Pull requests</a>
				<a href="#" class="text-fg-default font-semibold py-1">Issues</a>
				<a href="#" class="text-fg-default font-semibold py-1">Marketplace</a>
				<a href="#" class="text-fg-default font-semibold py-1">Explore</a>
				<div class="border-t border-border-default my-1"></div>
				<a href="#" class="text-fg-default font-semibold py-1 flex items-center gap-2">
					<img src={userProfile.avatarUrl} class="w-5 h-5 rounded-full" alt="" /> {userProfile.username}
				</a>
				<a href="#" class="text-fg-default py-1 pl-7">Sign out</a>
			</nav>
		</div>
	{/if}
</header>
