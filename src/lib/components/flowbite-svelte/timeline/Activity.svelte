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

  interface Props extends HTMLAttributes<HTMLOListElement> {
    children: Snippet;
    class?: string;
  }

  let { children, class: className, ...restProps }: Props = $props();

  // Inline theme definition
  const activity = tv({
    base: "relative border-s border-gray-200 dark:border-gray-700"
  });

  // Theme override stub
  const getTheme = (name: string) => undefined;
  const theme = $derived(getTheme("activity"));
</script>

<ol {...restProps} class={activity({ class: clsx(theme, className) })}>
  {@render children()}
</ol>

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Type
[ActivityProps](https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/types.ts#L1908)
## Props
@prop children
@prop class: className
@prop ...restProps
-->
