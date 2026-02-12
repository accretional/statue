<script lang="ts">
  import { tv } from "tailwind-variants";
  import clsx from "clsx";
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends HTMLAttributes<HTMLButtonElement> {
    itemName: string;
    active?: boolean;
    class?: string;
  }

  let { itemName, active, class: className, ...restProps }: Props = $props();

  // Inline theme definition
  const bottomNavHeaderItem = tv({
    base: "px-5 py-1.5 text-xs font-medium rounded-lg",
    variants: {
      active: {
        true: "text-white bg-gray-900 dark:bg-gray-300 dark:text-gray-900",
        false: "text-gray-900 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700"
      }
    }
  });

  // Theme override stub
  const getTheme = (name: string) => undefined;
  const theme = $derived(getTheme("bottomNavHeaderItem"));

  let base = $derived(bottomNavHeaderItem({ active, class: clsx(theme, className) }));
</script>

<button {...restProps} class={base}>
  {itemName}
</button>

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Type
[BottomNavHeaderItemProps](https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/types.ts#L296)
## Props
@prop itemName
@prop active
@prop class: className
@prop ...restProps
-->
