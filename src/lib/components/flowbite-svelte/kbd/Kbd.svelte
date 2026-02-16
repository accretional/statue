<!--
This is a Svelte component from Flowbite Svelte

Website: [flowbite-svelte.com](https://flowbite-svelte.com/)
GitHub Repository: [themesberg/flowbite-svelte](https://github.com/themesberg/flowbite-svelte)

All components in this directory are sourced from the Flowbite Svelte project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { tv } from "tailwind-variants";
  import clsx from "clsx";
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";

  interface Props extends HTMLAttributes<HTMLElement> {
    children: Snippet;
    class?: string;
  }

  let { children, class: className, ...restProps }: Props = $props();

  // Inline theme definition
  const kbd = tv({
    base: "px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
  });

  // Theme override stub (returns undefined as no global theme system)
  const getTheme = (name: string) => undefined;
  const theme = $derived(getTheme("kbd"));

  const kbdCls = $derived(kbd({ class: clsx(theme, className) }));
</script>

<kbd {...restProps} class={kbdCls}>
  {@render children()}
</kbd>

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Type
[KbdProps](https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/types.ts#L1110)
## Props
@prop children
@prop class: className
@prop ...restProps
-->
