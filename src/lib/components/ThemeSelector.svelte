<script lang="ts">
	import { themes, defaultTheme, showSelector, THEME_STORAGE_KEY } from 'virtual:statue-themes';
	import type { ThemeDefinition } from 'virtual:statue-themes';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let currentTheme = $state(defaultTheme);
	let isOpen = $state(false);
	let focusedIndex = $state(-1);
	let dropdownRef: HTMLDivElement | null = $state(null);

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
		focusedIndex = -1;

		// Save to localStorage for persistence across page loads
		localStorage.setItem(THEME_STORAGE_KEY, themeId);
	}

	onMount(() => {
		if (!browser) return;

		// Load saved theme from localStorage
		const saved = localStorage.getItem(THEME_STORAGE_KEY);
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
		if (isOpen) {
			// Set focus to current theme when opening
			focusedIndex = themes.findIndex((t: ThemeDefinition) => t.id === currentTheme);
		} else {
			focusedIndex = -1;
		}
	}

	function closeDropdown() {
		isOpen = false;
		focusedIndex = -1;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!isOpen) {
			// Open dropdown on Enter, Space, ArrowDown, or ArrowUp when closed
			if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
				event.preventDefault();
				toggleDropdown();
			}
			return;
		}

		switch (event.key) {
			case 'Escape':
				event.preventDefault();
				closeDropdown();
				break;
			case 'ArrowDown':
				event.preventDefault();
				focusedIndex = (focusedIndex + 1) % themes.length;
				break;
			case 'ArrowUp':
				event.preventDefault();
				focusedIndex = focusedIndex <= 0 ? themes.length - 1 : focusedIndex - 1;
				break;
			case 'Enter':
			case ' ':
				event.preventDefault();
				if (focusedIndex >= 0 && focusedIndex < themes.length) {
					selectTheme(themes[focusedIndex].id);
				}
				break;
			case 'Tab':
				// Close dropdown on tab out
				closeDropdown();
				break;
			case 'Home':
				event.preventDefault();
				focusedIndex = 0;
				break;
			case 'End':
				event.preventDefault();
				focusedIndex = themes.length - 1;
				break;
		}
	}

	// Get current theme object for display
	let currentThemeObj = $derived(themes.find((t: ThemeDefinition) => t.id === currentTheme) || themes[0]);
</script>

<svelte:window onclick={closeDropdown} onkeydown={(e) => { if (e.key === 'Escape' && isOpen) closeDropdown(); }} />

{#if showSelector && themes.length > 1}
	<div class="relative">
		<button
			onclick={(e) => {
				e.stopPropagation();
				toggleDropdown();
			}}
			onkeydown={handleKeydown}
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
				bind:this={dropdownRef}
				class="absolute right-0 mt-2 w-48 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] shadow-lg z-50"
				role="listbox"
				tabindex="-1"
				aria-label="Theme options"
				aria-activedescendant={focusedIndex >= 0 ? `theme-option-${themes[focusedIndex].id}` : undefined}
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.stopPropagation()}
			>
				<div class="py-1">
					{#each themes as theme, index (theme.id)}
						<button
							id="theme-option-{theme.id}"
							onclick={() => selectTheme(theme.id)}
							class="w-full flex items-center gap-3 px-4 py-2 text-left text-sm hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] transition-colors {currentTheme ===
							theme.id
								? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
								: 'text-[var(--color-foreground)]'} {focusedIndex === index && currentTheme !== theme.id
								? 'outline outline-2 outline-[var(--color-primary)]'
								: ''}"
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
