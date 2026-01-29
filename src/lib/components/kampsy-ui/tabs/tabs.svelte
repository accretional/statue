<!--
This is a Svelte component from Kampsy-ui

Website: [ui.kampsy.xyz](https://ui.kampsy.xyz/)
GitHub Repository: [kampsy/ui](https://github.com/kampsy/ui)

All components in this directory are sourced from the Kampsy-ui project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
	import Tooltip from '$lib/components/kampsy/tooltip/tooltip.svelte';
	import type { Component } from 'svelte';

	interface Props {
		disabled?: boolean | undefined;
		selected?: string | undefined;
		tabs?:
			| Array<{
					title: string;
					value: string;
					icon?: Component;
					disabled?: boolean;
					tooltip?: string;
			  }>
			| undefined;
		type?: 'default' | 'secondary';
	};
	let {
		disabled = false,
		selected = $bindable(''),
		tabs = undefined,
		type = 'default'
	}: Props = $props();

	const isSelected = (value: string) => {
		if (value === selected) {
			return true;
		}
		return false;
	};

	const tabButtonFunc = (
		isActive: boolean,
		isDisabled: boolean,
		isDisabledSpecific: boolean | undefined
	): string => {
		if (type === 'secondary') {
			// if the tab is disabled does not matter if active or not
			if (isDisabled || isDisabledSpecific) {
				return `cursor-not-allowed px-1.5 py-1 text-foreground rounded-md bg-card`;
			}

			if (isActive) {
				return `px-1.5 py-1 text-on-primary rounded-md bg-primary`;
			}
			return `px-1.5 py-1 text-foreground rounded-md bg-card hover:bg-accent`;
		}

		if (type === 'default') {
			if (isActive) {
				// Active but the tab is disabled
				if (isDisabled || isDisabledSpecific) {
					return `cursor-not-allowed px-[2px] py-3 border-b-2 border-primary
                text-muted`;
				}
				return `px-[2px] py-3 border-b-2 border-primary 
                text-foreground`;
			}

			// Not active and the tab is disabled
			if (isDisabled || isDisabledSpecific) {
				return `cursor-not-allowed px-[2px] py-3 border-b-2 border-transparent text-foreground`;
			}
			return `px-[2px] py-3 border-b-2 border-transparent text-kui-light-gray-900 dark:text-kui-dark-gray-900 
            hover:text-foreground`;
		}

		return '';
	};

	let contClass = $derived.by(() => {
		if (type === 'secondary') {
			return 'gap-3';
		}
		return 'gap-6 border-b border-border';
	});
</script>

{#snippet tabButton(
	isActive: boolean,
	tab: {
		title: string;
		value: string;
		icon?: Component;
		disabled?: boolean;
		tooltip?: string;
	}
)}
	<button
		disabled={disabled || tab.disabled}
		onclick={() => (selected = tab.value)}
		class="flex items-center justify-center gap-x-[6px] transition-all text-xs {tabButtonFunc(
			isActive,
			disabled,
			tab.disabled
		)} "
	>
		{#if tab.icon}
			{@const Icon = tab.icon}
			<div class="w-[16px] h-[16px] flex items-center justify-center">
				<div class="w-[16px] h-[16px]">
					<Icon />
				</div>
			</div>
		{/if}
		{tab.title}
	</button>
{/snippet}

<div class="w-full flex items-center {contClass}">
	{#if tabs}
		{#each tabs as tab}
			<div class="mb-[-1px]">
				{#if tab.disabled}
					<Tooltip text={tab.tooltip}>
						{@render tabButton(isSelected(tab.value), tab)}
					</Tooltip>
				{:else}
					{@render tabButton(isSelected(tab.value), tab)}
				{/if}
			</div>
		{/each}
	{/if}
</div>
