<!--
This is a Svelte component from Kampsy-ui

Website: [ui.kampsy.xyz](https://ui.kampsy.xyz/)
GitHub Repository: [kampsy/ui](https://github.com/kampsy/ui)

All components in this directory are sourced from the Kampsy-ui project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
	import { getContext, type Snippet } from 'svelte';

	interface Props {
		children: Snippet | undefined;
	}

	let { children }: Props = $props();

	const rootState = getContext<{
		sticky: boolean;
	}>('modal');

	let headerClass = $derived.by(() => {
		if (rootState.sticky) {
			return `absolute inset-x-0 top-0  w-full px-[24px] py-[20px]  bg-card
			rounded-t-[12px] border-b border-border drop-shadow-sm`;
		} else {
			return 'px-6 pt-6 mb-6';
		}
	});
</script>

{#if children}
	<header aria-labelledby="modal-title" class={headerClass}>
		{@render children()}
	</header>
{/if}
