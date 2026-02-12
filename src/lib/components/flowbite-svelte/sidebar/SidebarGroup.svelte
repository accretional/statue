<!--
This is a Svelte component from Flowbite Svelte

Website: [flowbite-svelte.com](https://flowbite-svelte.com/)
GitHub Repository: [themesberg/flowbite-svelte](https://github.com/themesberg/flowbite-svelte)

All components in this directory are sourced from the Flowbite Svelte project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import clsx from "clsx";
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends HTMLAttributes<HTMLUListElement> {
    children: any;
    class?: string;
    borderClass?: string;
    border?: boolean;
  }

  let { children, class: className = "space-y-2", borderClass = "pt-4 mt-4 border-t border-gray-200 dark:border-gray-700", border = false, ...restProps }: Props = $props();
</script>

<ul {...restProps} class={border ? clsx(borderClass) : clsx(className)}>
  {@render children()}
</ul>

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Type
[SidebarGroupProps](https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/types.ts#L1518)
## Props
@prop children
@prop class: className = "space-y-2"
@prop borderClass = "pt-4 mt-4 border-t border-gray-200 dark:border-gray-700"
@prop border = false
@prop ...restProps
-->
