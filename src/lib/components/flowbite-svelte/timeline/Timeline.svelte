<!--
This is a Svelte component from Flowbite Svelte

Website: [flowbite-svelte.com](https://flowbite-svelte.com/)
GitHub Repository: [themesberg/flowbite-svelte](https://github.com/themesberg/flowbite-svelte)

All components in this directory are sourced from the Flowbite Svelte project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script module lang="ts">
  // Export context symbol for use by TimelineItem
  export const TIMELINE_ORDER_CONTEXT = Symbol("timelineOrder");
</script>

<script lang="ts">
  import { setContext } from "svelte";
  import { tv, type VariantProps } from "tailwind-variants";
  import clsx from "clsx";
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";

  type Order = "group" | "horizontal" | "activity" | "vertical" | "default";

  interface Props extends HTMLAttributes<HTMLOListElement> {
    children: Snippet;
    order?: Order;
    class?: string;
  }

  let { children, order = "default", class: className, ...restProps }: Props = $props();

  // Inline theme definition
  const timeline = tv({
    variants: {
      order: {
        group: "p-5 mb-4 bg-gray-50 rounded-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700",
        horizontal: "sm:flex",
        activity: "relative",
        vertical: "relative",
        default: "relative border-s border-gray-200 dark:border-gray-700"
      }
    },
    defaultVariants: {
      order: "default"
    }
  });

  export type TimelineVariants = VariantProps<typeof timeline>;

  // Theme override stub
  const getTheme = (name: string) => undefined;
  const theme = $derived(getTheme("timeline"));

  // svelte-ignore state_referenced_locally
  setContext<Order>(TIMELINE_ORDER_CONTEXT, order);
  const olCls = $derived(timeline({ order, class: clsx(theme, className) }));
</script>

<ol {...restProps} class={olCls}>
  {@render children()}
</ol>

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Type
[TimelineProps](https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/types.ts#L1953)
## Props
@prop children
@prop order = "default"
@prop class: className
@prop ...restProps
-->
