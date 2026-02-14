<!--
This is a Svelte component from Kampsy-ui

Website: [ui.kampsy.xyz](https://ui.kampsy.xyz/)
GitHub Repository: [kampsy/ui](https://github.com/kampsy/ui)

All components in this directory are sourced from the Kampsy-ui project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
	import { getContext, type Snippet } from 'svelte';

	interface Props {
		class?: string;
		children: Snippet | undefined;
	};

	let { class: klass = '', children }: Props = $props();

	const rootState = getContext<{
		sticky: boolean;
	}>('modal');

	let footerClass = $derived.by(() => {
		if (rootState.sticky) {
			return ``;
		} else {
			return '';
		}
	});
</script>

{#if children}
	<footer
		aria-labelledby="modal-actions"
		class="sticky lg:absolute inset-x-0 bottom-0 p-6 box-border border-t border-border flex
	items-center justify-between bg-card rounded-b-[12px] drop-shadow-sm {footerClass} {klass}"
	>
		{@render children()}
	</footer>
{/if}
