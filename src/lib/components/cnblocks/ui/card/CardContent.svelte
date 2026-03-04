<!--
This is a Svelte component from Svelte Shadcn Blocks:

Demo Site: [sv-blocks.vercel.app](https://sv-blocks.vercel.app/)
GitHub Repository: [SikandarJODD/cnblocks](https://github.com/SikandarJODD/cnblocks)

All components in this directory are sourced from the Svelte Shadcn Blocks project by SikandarJODD. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
	import type { WithElementRef } from "bits-ui";
	import type { HTMLAttributes } from "svelte/elements";
	  import { type ClassValue, clsx } from "clsx";
  import { twMerge } from "tailwind-merge";

  function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
  }


	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div bind:this={ref} class={cn("p-6", className)} {...restProps}>
	{@render children?.()}
</div>
