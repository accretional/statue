<!--
This is a Svelte component from Flowbite Svelte

Website: [flowbite-svelte.com](https://flowbite-svelte.com/)
GitHub Repository: [themesberg/flowbite-svelte](https://github.com/themesberg/flowbite-svelte)

All components in this directory are sourced from the Flowbite Svelte project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { getContext } from "svelte";
  import clsx from "clsx";
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import { SIDEBAR_CONTEXT, ACTIVE_URL_CONTEXT } from "./Sidebar.svelte";
  import type { Writable } from "svelte/store";

  interface SidebarContextType {
    closeSidebar?: () => void;
    activeClass: string;
    nonActiveClass: string;
    isSingle: boolean;
    selected?: Writable<object | null>;
  }

  interface ActiveUrlContextType {
    value: string;
  }

  interface Props extends HTMLAttributes<HTMLLIElement> {
    icon?: Snippet;
    subtext?: Snippet;
    href: string;
    label: string;
    spanClass?: string;
    activeClass?: string;
    nonActiveClass?: string;
    aClass?: string;
    active?: boolean;
    class?: string;
  }

  let { icon, subtext, href, label, spanClass = "ms-3", activeClass, nonActiveClass, aClass, active, class: className, ...restProps }: Props = $props();

  const context = getContext<SidebarContextType>(SIDEBAR_CONTEXT) ?? { closeSidebar: undefined, activeClass: undefined, nonActiveClass: undefined, isSingle: false, selected: undefined };

  const activeUrl = getContext<ActiveUrlContextType>(ACTIVE_URL_CONTEXT);

  let activeItem = $derived(active !== undefined ? active : activeUrl?.value ? href === activeUrl.value : false);

  let aCls = $derived(activeItem ? (activeClass ?? context.activeClass) : (nonActiveClass ?? context.nonActiveClass));
</script>

<li class={clsx(className)}>
  <a onclick={context.closeSidebar ?? undefined} {...restProps} {href} aria-current={activeItem ? "page" : undefined} class={clsx(aCls, aClass)}>
    {#if icon}
      {@render icon()}
    {/if}
    <span class={clsx(spanClass)}>{label}</span>
    {#if subtext}
      {@render subtext()}
    {/if}
  </a>
</li>

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Type
[SidebarItemProps](https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/types.ts#L1524)
## Props
@prop icon
@prop subtext
@prop href
@prop label
@prop spanClass = "ms-3"
@prop activeClass
@prop nonActiveClass
@prop aClass
@prop active
@prop class: className
@prop ...restProps
-->
