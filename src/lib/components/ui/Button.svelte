<script lang="ts">
	import { resolve } from '$app/paths';

	let { variant = 'default', href = undefined, children, ...rest } = $props();

	// Check if URL is external
	function isExternal(url: string): boolean {
		return /^(https?:)?\/\//.test(url);
	}
</script>

{#if href && isExternal(href)}
	<!-- External URL - use as-is, eslint-disable for external links -->
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a data-variant={variant} {href} {...rest} target="_blank" rel="noopener noreferrer">
		{@render children()}
	</a>
{:else if href}
	<a data-variant={variant} href={resolve(href)} {...rest}>
		{@render children()}
	</a>
{:else}
	<button data-variant={variant} {...rest}>
		{@render children()}
	</button>
{/if}

<style>
	@reference "tailwindcss";
	button,
	a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.75rem;
		cursor: pointer;
		font-weight: 500;
		transition: all 0.2s;
		text-decoration: none;
		border: none;
		padding: 12px 16px;
	}
	[data-variant='default'] {
		@apply bg-transparent text-(--text) ring-1 ring-(--text)/10 hover:bg-(--brand)/20 hover:ring-(--brand)/20;
	}
	[data-variant='brand'] {
		@apply bg-(--brand) text-(--text) inset-shadow-sm inset-shadow-white/40 hover:bg-(--brand)/90 focus:inset-shadow-white/10;
	}
	[data-variant='subtle'] {
		@apply bg-(--brand) text-(--text);
	}
	[data-variant='link'] {
		@apply bg-transparent p-0 text-(--text) no-underline hover:underline;
	}
</style>
