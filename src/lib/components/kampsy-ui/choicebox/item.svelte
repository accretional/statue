<!--
This is a Svelte component from Kampsy-ui

Website: [ui.kampsy.xyz](https://ui.kampsy.xyz/)
GitHub Repository: [kampsy/ui](https://github.com/kampsy/ui)

All components in this directory are sourced from the Kampsy-ui project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
	import { getContext } from 'svelte';
	import type { Snippet } from 'svelte';

	function randomString(length: number): string {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';
		for (let i = 0; i < length; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return result;
	}

	type propT = {
		defaultChecked?: boolean | undefined;
		disabled?: boolean | undefined;
		description?: string | undefined;
		title?: string | undefined;
		value: string;
		icon?: Snippet | undefined;
	};
	let { defaultChecked, disabled = undefined, description, title, value, icon }: propT = $props();

	// Switch props, the parent component

	type switchProps = {
		name: string;
		disabledParent?: boolean | undefined;
		type: 'radio' | 'checkbox' | undefined;
	};

	

	const groupState = getContext<{
		name: string;
		type: 'radio' | 'checkbox';
		disabledParent: boolean;
		get: () => string | Array<string>;
		set: (value: string | Array<string>) => void;
	}>('choicebox');

	const { name, type, disabledParent } = groupState;

	// If the parent is disabled then the child is disabled
	if (disabledParent) {
		disabled = true;
	}

	// If defaultChecked is set and value
	if (defaultChecked) {
		if (type === 'radio') {
			groupState.set(value);
		} else if (type === 'checkbox') {
			groupState.set([...groupState.get(), value]);
		}
	}

	const onchange = (evt: Event) => {
		const target = evt.currentTarget as HTMLInputElement;
		if (type == 'radio') {
			groupState.set(target.value);
		} else if (type == 'checkbox') {
			const arrStr = groupState.get() as Array<string>;
			const val = target.value;
			// if val is in the arrStr then remove it else add it
			if (arrStr.includes(val)) {
				groupState.set(arrStr.filter((item) => item !== val));
			} else {
				groupState.set([...arrStr, val]);
			}
		}
	};

	// random string for unique id
	const unique = `${randomString(4)}_${value}`;

	//When the selected class
	let labelClass = $derived.by(() => {
		// it is desabled
		if (disabled) {
			return ` cursor-not-allowed border-border`;
		}
		if (groupState.get() === value || groupState.get().includes(value)) {
			return `cursor-pointer bg-card border-primary 
			hover:border-secondary`;
		}
		return `cursor-pointer hover:bg-card border-kui-light-gray-200 
		dark:border-kui-dark-gray-400 hover:border-muted`;
	});

	// Title text
	let titleClass = $derived.by(() => {
		// it is desabled
		if (disabled) {
			return `text-muted`;
		}
		if (groupState.get() === value || groupState.get().includes(value)) {
			return `text-foreground`;
		}
		return `text-foreground`;
	});

	// Description text
	let descriptionClass = $derived.by(() => {
		// it is desabled
		if (disabled) {
			return `text-muted`;
		}
		if (groupState.get() === value || groupState.get().includes(value)) {
			return `text-foreground`;
		}
		return `text-foreground`;
	});

	// The rounded radio cont
	let radioContClass = $derived.by(() => {
		// it is desabled
		if (disabled) {
			return `border-border`;
		}

		if (groupState.get() === value) {
			return `border-primary `;
		}
		return `border-border group-hover:border-muted group-hover:bg-card`;
	});

	// The radio cont
	let radioClass = $derived.by(() => {
		if (groupState.get() === value) {
			return `bg-primary `;
		}
		return ``;
	});

	// The rounded radio cont
	let checkboxContClass = $derived.by(() => {
		// it is desabled
		if (disabled) {
			return `border-border`;
		}
		if (groupState.get().includes(value)) {
			return `border-primary bg-primary `;
		}
		return `border-border group-hover:border-muted group-hover:bg-card`;
	});
	let checkboxClass = $derived.by(() => {
		if (groupState.get().includes(value)) {
			return `text-on-primary font-bold `;
		}
		return `text-transparent font-bold`;
	});
</script>

{#snippet radio()}
	{#if type === 'radio'}
		<div
			class="w-[16px] h-[16px] p-[1px] rounded-full transition-colors ease-in flex items-center justify-center border {radioContClass} "
		>
			<div class="w-[16px] h-[16px] flex items-center justify-center">
				<input
					{onchange}
					{type}
					checked={groupState.get() == value}
					id={unique}
					{name}
					{value}
					{disabled}
					class="hidden"
				/>
				<div
					class="w-[8px] h-[8px] bg-red rounded-full transition-colors ease-in {radioClass}"
				></div>
			</div>
		</div>
	{/if}
{/snippet}

{#snippet checkbox()}
	{#if type === 'checkbox'}
		<div
			class="w-[16px] h-[16px] p-[1px] rounded-[4px] transition-colors ease-in flex items-center justify-center border {checkboxContClass} "
		>
			<div class="w-[16px] h-[16px] flex items-center justify-center">
				<input
					{onchange}
					{type}
					checked={groupState.get().includes(value)}
					id={unique}
					{name}
					{value}
					{disabled}
					class="hidden"
				/>
				<div class="w-[10px] h-[10px] transition-colors ease-in {checkboxClass}">
					{#if icon}
						{@render icon()}
					{/if}
				</div>
			</div>
		</div>
	{/if}
{/snippet}

<label
	for={unique}
	class="group w-full transition-colors ease-in border flex  rounded-[6px] {labelClass} "
>
	<div class="w-full p-[12px] flex items-center justify-between">
		<div>
			{#if title}
				<p
					class="first-letter:capitalize ransition-colors ease-in text-sm {titleClass}  font-medium leading-6"
				>
					{title}
				</p>
			{/if}

			{#if description}
				<p
					class="first-letter:capitalize ransition-colors ease-in text-sm {descriptionClass} font-normal leading-6"
				>
					{description}
				</p>
			{/if}
		</div>
		{@render radio()}
		{@render checkbox()}
	</div>
</label>
