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
  import { untrack } from "svelte";

  interface Props extends HTMLAttributes<HTMLOListElement> {
    children: Snippet;
    divClass?: string;
    timeClass?: string;
    date: string;
    olClass?: string;
    class?: string;
    classes?: { time?: string; ol?: string };
  }

  let { children, divClass, timeClass, date, olClass, class: className, classes, ...restProps }: Props = $props();

  // Deprecation warning stub
  const warnThemeDeprecation = (name: string, props: any, mapping: any) => {
    if (import.meta.env.DEV) {
      Object.keys(props).forEach(key => {
        if (props[key] !== undefined && mapping[key]) {
          console.warn(`[${name}] Prop '${key}' is deprecated. Use 'classes.${mapping[key]}' instead.`);
        }
      });
    }
  };

  warnThemeDeprecation(
    "Group",
    untrack(() => ({ divClass, timeClass, olClass })),
    {
      divClass: "class",
      timeClass: "time",
      olClass: "ol"
    }
  );

  const styling = $derived({
    time: timeClass,
    ol: olClass
  });

  // Inline theme definition
  const group = tv({
    slots: {
      div: "p-5 mb-4 bg-gray-50 rounded-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700",
      time: "text-lg font-semibold text-gray-900 dark:text-white",
      ol: "mt-3 divide-y divider-gray-200 dark:divide-gray-700"
    }
  });

  // Theme override stub
  const getTheme = (name: string) => undefined;
  const theme = $derived(getTheme("group"));

  const { div, time, ol } = $derived(group());
</script>

<div class={div({ class: clsx(theme?.div, className ?? divClass) })}>
  <time class={time({ class: clsx(theme?.time, styling.time) })}>{date}</time>
  <ol {...restProps} class={ol({ class: clsx(theme?.ol, styling.ol) })}>
    {@render children()}
  </ol>
</div>

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Type
[GroupProps](https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/types.ts#L1924)
## Props
@prop children
@prop divClass
@prop timeClass
@prop date
@prop olClass
@prop class: className
@prop classes
@prop ...restProps
-->
