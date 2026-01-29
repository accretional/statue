<!--
This is a Svelte component from Kampsy-ui

Website: [ui.kampsy.xyz](https://ui.kampsy.xyz/)
GitHub Repository: [kampsy/ui](https://github.com/kampsy/ui)

All components in this directory are sourced from the Kampsy-ui project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { fly, scale } from 'svelte/transition';

	function clickOutside(node: HTMLElement, callback: () => void) {
		const handleClick = (event: MouseEvent) => {
			if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
				callback();
			}
		};

		document.addEventListener('click', handleClick, true);

		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}

	interface Props {
		class?: string;
		children: Snippet;
	}
	let { class: klass = '', children }: Props = $props();

	// Get the state of the select from the context
	const rootState = getContext<{
		getIsMobile: () => boolean;
		getIsActive: () => boolean;
		setIsActive: (value: boolean) => void;
	}>('modal');
</script>

{#snippet mobileSnip()}
	{#if rootState.getIsActive()}
		<div
			in:fly|local={{ y: '50vh', duration: 500, opacity: 1 }}
			out:fly|local={{ y: '100vh', duration: 600, easing: cubicOut, opacity: 1 }}
			role="dialog"
			class="fixed bottom-0 left-0 w-full rounded-t-[10px] bg-card lg:bg-transparent z-[1001]"
		>
			<div
				use:clickOutside={() => {
					rootState.setIsActive(false);
				}}
				class="w-full max-h-[80vh] rounded-t-[10px] rounded-[10px] bg-card
				border-t border-border"
			>
				{@render children()}
			</div>
		</div>
	{/if}
{/snippet}

{#snippet desktopSnip()}
	{#if rootState.getIsActive()}
		<div
			in:scale|local={{ duration: 200 }}
			out:scale|local={{ duration: 300 }}
			use:clickOutside={() => {
				rootState.setIsActive(false);
			}}
			role="dialog"
			class="relative w-[540px] max-h-[626px] rounded-[12px] bg-card border
                border-border {klass}"
		>
			{@render children()}
		</div>
	{/if}
{/snippet}

{#if rootState.getIsMobile()}
	{@render mobileSnip()}
{:else}
	{@render desktopSnip()}
{/if}
