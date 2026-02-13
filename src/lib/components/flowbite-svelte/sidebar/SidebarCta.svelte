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

  interface Props extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet;
    icon?: Snippet;
    divClass?: string;
    spanClass?: string;
    label: string;
    class?: string;
    classes?: { div?: string; span?: string };
  }

  let { children, icon, divClass, spanClass, label, class: className, classes, ...restProps }: Props = $props();

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
    "SidebarCta",
    untrack(() => ({ divClass, spanClass })),
    { divClass: "div", spanClass: "span" }
  );

  const styling = $derived(
    classes ?? {
      div: divClass,
      span: spanClass
    }
  );

  // Inline theme definition
  const sidebarCta = tv({
    slots: {
      base: "p-4 mt-6 bg-primary-50 rounded-lg dark:bg-primary-900",
      div: "flex items-center mb-3",
      span: "bg-primary-100 text-primary-800 text-sm font-semibold me-2 px-2.5 py-0.5 rounded-sm dark:bg-primary-200 dark:text-primary-900"
    }
  });

  // Theme override stub
  const getTheme = (name: string) => undefined;
  const theme = $derived(getTheme("sidebarCta"));

  const { base, div, span } = $derived(sidebarCta());
</script>

<div {...restProps} id="dropdown-cta" class={base({ class: clsx(theme?.base, className) })} role="alert">
  <div class={div({ class: clsx(theme?.div, styling.div) })}>
    <span class={span({ class: clsx(theme?.span, styling.span) })}>{label}</span>
    {#if icon}
      {@render icon()}
    {/if}
  </div>
  {@render children?.()}
</div>

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Type
[SidebarCtaProps](https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/types.ts#L1477)
## Props
@prop children
@prop icon
@prop divClass
@prop spanClass
@prop label
@prop class: className
@prop classes
@prop ...restProps
-->
