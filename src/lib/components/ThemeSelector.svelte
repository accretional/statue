<script lang="ts">
	import { themes, defaultTheme, showSelector } from 'virtual:statue-themes';
	import type { ThemeDefinition } from 'virtual:statue-themes';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let currentTheme = $state(defaultTheme);
	let isOpen = $state(false);

	/**
	 * Apply theme by setting data-theme attribute on html element
	 * CSS handles the rest via [data-theme="..."] selectors
	 */
	function applyTheme(themeId: string) {
		if (!browser) return;
		document.documentElement.dataset.theme = themeId;
	}

	/**
	 * Select and persist a theme
	 */
	function selectTheme(themeId: string) {
		const theme = themes.find((t: ThemeDefinition) => t.id === themeId);
		if (!theme || !browser) return;

		currentTheme = themeId;
		applyTheme(themeId);
		isOpen = false;

		// Save to localStorage for persistence across page loads
		localStorage.setItem('statue-theme', themeId);
	}

	onMount(() => {
		if (!browser) return;

		// Load saved theme from localStorage
		const saved = localStorage.getItem('statue-theme');
		if (saved && themes.find((t: ThemeDefinition) => t.id === saved)) {
			currentTheme = saved;
			applyTheme(saved);
		} else {
			// Ensure default theme is applied
			applyTheme(defaultTheme);
		}
	});

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function closeDropdown() {
		isOpen = false;
	}

	// Get current theme object for display
	let currentThemeObj = $derived(themes.find((t: ThemeDefinition) => t.id === currentTheme) || themes[0]);
</script>

<svelte:window onclick={closeDropdown} />

{#if showSelector && themes.length > 1}
	<div class="relative">
		<button
			onclick={(e) => {
				e.stopPropagation();
				toggleDropdown();
			}}
			class="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-foreground)] hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] transition-colors"
			aria-label="Switch theme"
			aria-expanded={isOpen}
			aria-haspopup="listbox"
			title="Select theme"
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
				aria-hidden="true"
			>
				<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
			</svg>
			<span class="text-sm">{currentThemeObj?.name || 'Theme'}</span>
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
				aria-hidden="true"
			>
				<polyline points="6 9 12 15 18 9" />
			</svg>
		</button>

		{#if isOpen}
			<div
				class="absolute right-0 mt-2 w-48 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] shadow-lg z-50"
				role="listbox"
				aria-label="Theme options"
				onclick={(e) => e.stopPropagation()}
			>
				<div class="py-1">
					{#each themes as theme (theme.id)}
						<button
							onclick={() => selectTheme(theme.id)}
							class="w-full flex items-center gap-3 px-4 py-2 text-left text-sm hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] transition-colors {currentTheme ===
							theme.id
								? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
								: 'text-[var(--color-foreground)]'}"
							role="option"
							aria-selected={currentTheme === theme.id}
						>
							<span
								class="w-4 h-4 rounded-full border border-[var(--color-border)] flex-shrink-0"
								style="background-color: {theme.colors.primary || '#888'}"
								aria-hidden="true"
							></span>
							<span>{theme.name}</span>
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>
{/if}
