<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		text?: string | undefined;
		children: Snippet;
	}
	let { text, children }: Props = $props();

	let showTooltip = $state(false);
</script>

<div class="relative inline-block">
	<div
		onmouseenter={() => (showTooltip = true)}
		onmouseleave={() => (showTooltip = false)}
	>
		{@render children()}
	</div>

	{#if showTooltip && text}
		<div
			class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1
			bg-card border border-border text-foreground text-xs rounded whitespace-nowrap z-50"
		>
			{text}
			<div
				class="absolute top-full left-1/2 transform -translate-x-1/2
				border-4 border-transparent border-t-card"
			></div>
		</div>
	{/if}
</div>
