<script lang="ts">
  import { tv } from "tailwind-variants";
  import clsx from "clsx";
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import { untrack } from "svelte";

  interface Props extends HTMLAttributes<HTMLDivElement> {
    children: Snippet;
    class?: string;
    classes?: { innerDiv?: string };
    outerClass?: string;
    innerClass?: string;
  }

  let { children, class: className, classes, outerClass, innerClass, ...restProps }: Props = $props();

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
    "BottomNavHeader",
    untrack(() => ({ innerClass, outerClass })),
    { innerClass: "inner", outerClass: "class" }
  );

  const styling = $derived(classes ?? { innerDiv: innerClass });

  // Inline theme definition
  const bottomNavHeader = tv({
    slots: {
      base: "w-full",
      innerDiv: "grid max-w-xs grid-cols-3 gap-1 p-1 mx-auto my-2 bg-gray-100 rounded-lg dark:bg-gray-600"
    }
  });

  // Theme override stub
  const getTheme = (name: string) => undefined;
  const theme = $derived(getTheme("bottomNavHeader"));

  const { innerDiv, base } = $derived(bottomNavHeader());
</script>

<div {...restProps} class={base({ class: clsx(theme?.base, className ?? outerClass) })}>
  <div class={innerDiv({ class: clsx(theme?.innerDiv, styling.innerDiv) })} role="group">
    {@render children()}
  </div>
</div>

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Type
[BottomNavHeaderProps](https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/types.ts#L290)
## Props
@prop children
@prop class: className
@prop classes
@prop outerClass
@prop innerClass
@prop ...restProps
-->
