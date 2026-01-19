<!--
This is a Svelte component from Kampsy-ui

Website: [ui.kampsy.xyz](https://ui.kampsy.xyz/)
GitHub Repository: [kampsy/ui](https://github.com/kampsy/ui)

All components in this directory are sourced from the Kampsy-ui project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children: Snippet | undefined;
	}

	let { class: klass = '', children }: Props = $props();
</script>

{#if children}
	<p
		aria-labelledby="modal-subtitle"
		class="mt-6 text-md text-foreground leading-[24px] {klass}"
	>
		{@render children()}
	</p>
{/if}
