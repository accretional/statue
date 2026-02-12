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

  interface Props extends HTMLAttributes<HTMLAnchorElement> {
    children?: Snippet;
    site?: { href?: string; img: string; name: string };
    imgClass?: string;
    spanClass?: string;
    class?: string;
    classes?: { img?: string; span?: string };
  }

  let { children, site, imgClass, spanClass, class: className, classes, ...restProps }: Props = $props();

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
    "SidebarBrand",
    untrack(() => ({ imgClass, spanClass })),
    { imgClass: "img", spanClass: "span" }
  );

  const styling = $derived(
    classes ?? {
      img: imgClass,
      span: spanClass
    }
  );

  // Inline theme definition
  const sidebarBrand = tv({
    slots: {
      base: "flex items-center ps-2.5 mb-5",
      img: "h-6 me-3 sm:h-7",
      span: "self-center text-xl font-semibold whitespace-nowrap dark:text-white"
    }
  });

  // Theme override stub
  const getTheme = (name: string) => undefined;
  const theme = $derived(getTheme("sidebarBrand"));

  const { base, img, span } = $derived(sidebarBrand());
</script>

<a {...restProps} href={site?.href ? site.href : "/"} class={base({ class: clsx(theme?.base, className) })}>
  {#if site}
    <img src={site.img} class={img({ class: clsx(theme?.img, styling.img) })} alt={site.name} />
    <span class={span({ class: clsx(theme?.span, styling.span) })}>{site.name}</span>
  {:else if children}
    {@render children()}
  {/if}
</a>

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Type
[SidebarBrandProps](https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/types.ts#L1490)
## Props
@prop children
@prop site
@prop imgClass
@prop spanClass
@prop class: className
@prop classes
@prop ...restProps
-->
