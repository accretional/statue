<!--
This is a Svelte component from Kampsy-ui

Website: [ui.kampsy.xyz](https://ui.kampsy.xyz/)
GitHub Repository: [kampsy/ui](https://github.com/kampsy/ui)

All components in this directory are sourced from the Kampsy-ui project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
	import { setContext, type Snippet } from 'svelte';

	function randomString(length: number): string {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';
		for (let i = 0; i < length; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return result;
	}

	function createGroupState(initial: {
		selected: string | Array<string>;
		name: string;
		type: 'radio' | 'checkbox';
		disabledParent: boolean;
	}) {
		let selected = $state(initial.selected);

		function get() {
			return selected;
		}
		function set(value: string | Array<string>) {
			selected = value;
		}

		return {
			name: initial.name,
			type: initial.type,
			disabledParent: initial.disabledParent,
			get,
			set
		};
	}

	interface Props {
		type?: 'radio' | 'checkbox' | undefined;
		label?: string | undefined;
		value?: string | Array<string> | undefined;
		disabled?: boolean | undefined;
		children?: Snippet | undefined;
	};
	let {
		type = 'radio',
		label = undefined,
		value = $bindable(''),
		disabled = false,
		children = undefined
	}: Props = $props();

	const groupState = createGroupState({
		selected: '',
		name: randomString(8),
		type: type,
		disabledParent: disabled
	});

	setContext('choicebox', groupState);

	let labelClass = $derived.by(() => {
		if (disabled) {
			return 'text-muted';
		}
		return 'text-foreground';
	});

	$effect(() => {
		value = groupState.get();
	});
</script>

<div class="w-full">
	{#if label}
		<div class="text-[13px] mb-[8px] first-letter:capitalize {labelClass} ">
			{label}
		</div>
	{/if}
	<div class="w-full flex gap-x-4">
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>
