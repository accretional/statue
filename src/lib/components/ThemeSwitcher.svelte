<script lang="ts">
	import { themes, defaultTheme, type ThemeDefinition } from '$lib/themes/index.js';
	import { onMount } from 'svelte';

	let currentTheme = $state(defaultTheme);
	let isOpen = $state(false);

	function applyTheme(theme: ThemeDefinition) {
		Object.entries(theme.colors).forEach(([key, value]) => {
			document.documentElement.style.setProperty(`--color-${key}`, value);
		});
	}

	function setTheme(themeId: string) {
		const theme = themes.find((t) => t.id === themeId);
		if (theme) {
			currentTheme = themeId;
			applyTheme(theme);
			localStorage.setItem('statue-theme', themeId);
			isOpen = false;
		}
	}

	onMount(() => {
		const saved = localStorage.getItem('statue-theme');
		if (saved && themes.find((t) => t.id === saved)) {
			currentTheme = saved;
			const theme = themes.find((t) => t.id === saved);
			if (theme) applyTheme(theme);
		}
	});

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function closeDropdown() {
		isOpen = false;
	}
</script>

<svelte:window onclick={closeDropdown} />

<div class="relative">
	<button
		onclick={(e) => {
			e.stopPropagation();
			toggleDropdown();
		}}
		class="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] transition-colors"
		aria-label="Switch theme"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
		</svg>
		<span class="text-sm">{themes.find((t) => t.id === currentTheme)?.name}</span>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="12"
			height="12"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="transition-transform {isOpen ? 'rotate-180' : ''}"
		>
			<polyline points="6 9 12 15 18 9" />
		</svg>
	</button>

	{#if isOpen}
		<div
			class="absolute right-0 mt-2 w-48 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] shadow-lg z-50"
			onclick={(e) => e.stopPropagation()}
		>
			<div class="py-1">
				{#each themes as theme}
					<button
						onclick={() => setTheme(theme.id)}
						class="w-full flex items-center gap-3 px-4 py-2 text-left text-sm hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] transition-colors {currentTheme ===
						theme.id
							? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
							: 'text-[var(--color-foreground)]'}"
					>
						<span
							class="w-4 h-4 rounded-full border border-[var(--color-border)]"
							style="background-color: {theme.colors.primary}"
						></span>
						<span>{theme.name}</span>
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
