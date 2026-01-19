<!--
This is a Svelte component from Kampsy-ui

Website: [ui.kampsy.xyz](https://ui.kampsy.xyz/)
GitHub Repository: [kampsy/ui](https://github.com/kampsy/ui)

All components in this directory are sourced from the Kampsy-ui project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string | undefined;
		children: Snippet | undefined;
	}

	let { class: klass = '', children }: Props = $props();
</script>

{#if children}
	<h3
		class="text-[24px] text-foreground leading-[32px] font-semibold {klass}"
	>
		{@render children()}
	</h3>
{/if}
