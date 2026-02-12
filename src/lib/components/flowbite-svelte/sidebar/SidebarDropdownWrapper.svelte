<!--
This is a Svelte component from Flowbite Svelte

Website: [flowbite-svelte.com](https://flowbite-svelte.com/)
GitHub Repository: [themesberg/flowbite-svelte](https://github.com/themesberg/flowbite-svelte)

All components in this directory are sourced from the Flowbite Svelte project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import clsx from "clsx";
  import { getContext, untrack } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import type { Writable } from "svelte/store";
  import { writable } from "svelte/store";
  import { slide } from "svelte/transition";
  import type { TransitionConfig } from "svelte/transition";
  import { SIDEBAR_CONTEXT } from "./Sidebar.svelte";

  interface SidebarContextType {
    closeSidebar?: () => void;
    activeClass: string;
    nonActiveClass: string;
    isSingle: boolean;
    selected?: Writable<object | null>;
  }

  type ParamsType = any;

  interface Props extends HTMLAttributes<HTMLButtonElement> {
    children: Snippet;
    arrowup?: Snippet;
    arrowdown?: Snippet;
    icon?: Snippet;
    isOpen?: boolean;
    btnClass?: string;
    label: string;
    spanClass?: string;
    ulClass?: string;
    transition?: (node: Element, params?: any) => TransitionConfig;
    params?: any;
    svgClass?: string;
    class?: string;
    classes?: {
      btn?: string;
      span?: string;
      ul?: string;
      svg?: string;
    };
    onclick?: () => void;
  }

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

  let {
    children,
    arrowup,
    arrowdown,
    icon,
    isOpen = $bindable(),
    btnClass,
    label,
    spanClass,
    ulClass,
    transition = slide,
    params,
    svgClass,
    class: className,
    classes,
    onclick,
    ...restProps
  }: Props = $props();

  warnThemeDeprecation(
    "SidebarDropdownWrapper",
    untrack(() => ({ btnClass, spanClass, ulClass, svgClass })),
    { btnClass: "btn", spanClass: "span", ulClass: "ul", svgClass: "svg" }
  );

  const styling = $derived(
    classes ?? {
      btn: btnClass,
      span: spanClass,
      ul: ulClass,
      svg: svgClass
    }
  );

  // Inline theme definition
  const sidebarDropdownWrapper = tv({
    slots: {
      base: "group",
      btn: "flex items-center p-2 w-full text-base font-normal text-gray-900 rounded-sm transition duration-75 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700",
      span: "flex-1 ms-3 text-left whitespace-nowrap",
      svg: "h-3 w-3 text-gray-800 dark:text-white",
      ul: "py-2 space-y-0"
    }
  });

  export type SidebarDropdownWrapperVariants = VariantProps<typeof sidebarDropdownWrapper>;

  // Theme override stub
  const getTheme = (name: string) => undefined;
  const theme = $derived(getTheme("sidebarDropdownWrapper"));

  const { base, btn, span, svg, ul } = sidebarDropdownWrapper();
  const isControlled = $derived(isOpen !== undefined);

  let ctx = getContext<SidebarContextType>(SIDEBAR_CONTEXT) || { isSingle: false, activeClass: "", nonActiveClass: "", closeSidebar: undefined, selected: undefined };

  let self = {};

  if (ctx.isSingle && !ctx.selected) {
    ctx.selected = writable<object | null>(null);
  }

  const selectedStore = $derived(ctx.selected);
  let localOpen = $state(false);

  const openState = $derived(isControlled ? isOpen : ctx.isSingle ? $selectedStore === self : localOpen);

  function handleDropdown() {
    if (isControlled) {
      isOpen = !isOpen;
    } else if (ctx.isSingle) {
      ctx.selected!.update((current) => (current === self ? null : self));
    } else {
      localOpen = !localOpen;
    }

    if (onclick) onclick();
  }
</script>

<li class={base({ class: clsx(theme?.base, className) })}>
  <button {...restProps} onclick={handleDropdown} type="button" class={btn({ class: clsx(theme?.btn, styling.btn) })} aria-controls="sidebar-dropdown">
    {#if icon}
      {@render icon()}
    {/if}
    <span class={span({ class: clsx(theme?.span, styling.span) })}>{label}</span>
    {#if openState}
      {#if arrowup}
        {@render arrowup()}
      {:else}
        <svg class={svg({ class: clsx(theme?.svg, styling.svg) })} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5" />
        </svg>
      {/if}
    {:else if arrowdown}
      {@render arrowdown()}
    {:else}
      <svg class={svg({ class: clsx(theme?.svg, styling.svg) })} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
      </svg>
    {/if}
  </button>
  {#if openState}
    <ul class={ul({ class: clsx(theme?.ul, styling.ul) })} transition:transition={params as ParamsType}>
      {@render children()}
    </ul>
  {/if}
</li>

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Type
[SidebarDropdownWrapperProps](https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/types.ts#L1501)
## Props
@prop children
@prop arrowup
@prop arrowdown
@prop icon
@prop isOpen = $bindable()
@prop btnClass
@prop label
@prop spanClass
@prop ulClass
@prop transition = slide
@prop params
@prop svgClass
@prop class: className
@prop classes
@prop onclick
@prop ...restProps
-->
