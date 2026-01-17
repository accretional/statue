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
