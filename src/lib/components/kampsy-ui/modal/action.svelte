<!--
This is a Svelte component from Kampsy-ui

Website: [ui.kampsy.xyz](https://ui.kampsy.xyz/)
GitHub Repository: [kampsy/ui](https://github.com/kampsy/ui)

All components in this directory are sourced from the Kampsy-ui project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
	import { type Component, type Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		onclick?: (evt: Event) => void;
		class?: string;
		shape?: 'circle' | 'square' | undefined;
		size?: 'tiny' | 'small' | 'medium' | 'large';
		variant?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'warning';
		iconPrefix?: Component | undefined;
		iconSuffix?: Component | undefined;
		rounded?: boolean;
		loading?: boolean;
		disabled?: boolean;
		children: Snippet | undefined;
	};
	let {
		children,
		class: klass = '',
		onclick,
		size = 'medium',
		variant = 'primary',
		disabled = false,
		...rest
	}: Props = $props();

	const sizeClasses = {
		tiny: 'px-2 py-1 text-xs',
		small: 'px-3 py-1.5 text-sm',
		medium: 'px-4 py-2 text-base',
		large: 'px-6 py-3 text-lg'
	};

	const variantClasses = {
		primary: 'bg-primary hover:bg-secondary text-on-primary',
		secondary: 'bg-accent hover:bg-muted text-foreground',
		tertiary: 'bg-transparent hover:bg-card text-foreground border border-border',
		error: 'bg-accent hover:bg-muted text-foreground',
		warning: 'bg-secondary hover:bg-muted text-on-primary'
	};

	const buttonClasses = `${sizeClasses[size]} ${variantClasses[variant]} rounded font-medium transition-colors ${klass}`;
</script>

{#if children}
	<button {onclick} {disabled} class={buttonClasses} {...rest}>
		{@render children()}
	</button>
{/if}
