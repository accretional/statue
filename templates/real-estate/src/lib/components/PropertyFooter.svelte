<script lang="ts">
	export interface PropertyFooterProps {
		siteName?: string;
		tagline?: string;
		copyright?: string;
	}

	let {
		siteName,
		tagline,
		copyright
	}: PropertyFooterProps = $props();
</script>

<footer class="py-16 px-4 border-t border-[var(--color-border)]">
	<div class="max-w-6xl mx-auto text-center">
		<p class="text-white text-2xl font-light tracking-wider mb-4">{siteName}</p>
		<p class="text-gray-500 text-sm mb-6">{tagline}</p>
		<p class="text-gray-600 text-xs">{@html copyright}</p>
	</div>
</footer>
