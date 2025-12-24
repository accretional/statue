<script lang="ts">
	import { BookOpen, Package, Star, Table, Layout } from 'lucide-svelte';

	export let activeTab: string = 'Overview';
	export let repoCount: number = 0;

	const tabs = [
		{ name: 'Overview', icon: BookOpen },
		{ name: 'Repositories', icon: Layout, count: repoCount },
		{ name: 'Projects', icon: Table },
		{ name: 'Packages', icon: Package },
		{ name: 'Stars', icon: Star, count: 24 }
	];

	$: tabsWithCount = tabs.map(tab => ({
		...tab,
		count: tab.name === 'Repositories' ? repoCount : tab.count
	}));

	function handleTabClick(tabName: string) {
		activeTab = tabName;
	}
</script>

<div class="sticky top-[60px] z-40 bg-canvas-default border-b border-border-default mt-8 md:mt-0">
	<div class="container mx-auto px-4 md:px-6">
		<div class="flex items-center gap-4 md:gap-8 overflow-x-auto no-scrollbar">
			<!-- Spacer for desktop layout to align with content area -->
			<div class="hidden md:block w-[25%] shrink-0"></div>

			<nav class="flex space-x-1" aria-label="Tabs">
				{#each tabsWithCount as tab}
					{@const isActive = activeTab === tab.name}
					<button
						on:click={() => handleTabClick(tab.name)}
						class="whitespace-nowrap flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors {isActive
							? 'border-accent-fg text-fg-default font-semibold'
							: 'border-transparent text-fg-default hover:text-fg-muted hover:border-border-muted'}"
					>
						<svelte:component this={tab.icon} size={16} class={isActive ? 'text-fg-default' : 'text-fg-muted'} />
						{tab.name}
						{#if tab.count !== undefined}
							<span class="bg-canvas-subtle text-fg-default text-xs py-0.5 px-2 rounded-full border border-border-default">
								{tab.count}
							</span>
						{/if}
					</button>
				{/each}
			</nav>
		</div>
	</div>
</div>
