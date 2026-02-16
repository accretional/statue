<!--
This is a Svelte component from Flowbite Svelte

Website: [flowbite-svelte.com](https://flowbite-svelte.com/)
GitHub Repository: [themesberg/flowbite-svelte](https://github.com/themesberg/flowbite-svelte)

All components in this directory are sourced from the Flowbite Svelte project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script module lang="ts">
  // Export context symbols for use by child components
  export const SIDEBAR_CONTEXT = Symbol("sidebar");
  export const ACTIVE_URL_CONTEXT = Symbol("activeUrl");
</script>

<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import clsx from "clsx";
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import { setContext, untrack } from "svelte";
  import { sineIn } from "svelte/easing";
  import type { Writable } from "svelte/store";
  import { writable } from "svelte/store";
  import { fly } from "svelte/transition";
  import type { TransitionConfig } from "svelte/transition";

  type Position = "fixed" | "absolute" | "static";
  type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

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

  interface Props extends HTMLAttributes<HTMLElement> {
    children: Snippet;
    isOpen?: boolean;
    closeSidebar?: () => void;
    isSingle?: boolean;
    breakpoint?: Breakpoint;
    alwaysOpen?: boolean;
    position?: Position;
    activateClickOutside?: boolean;
    backdrop?: boolean;
    backdropClass?: string;
    transition?: (node: Element, params?: any) => TransitionConfig;
    params?: any;
    divClass?: string;
    ariaLabel?: string;
    nonActiveClass?: string;
    activeClass?: string;
    activeUrl?: string;
    class?: string;
    classes?: {
      backdrop?: string;
      div?: string;
      nonactive?: string;
      active?: string;
    };
    disableBreakpoints?: boolean;
  }

  // Inline trapFocus action stub
  function trapFocus(node: HTMLElement, options: { onEscape?: () => void } | null) {
    if (!options) return {};

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && options.onEscape) {
        options.onEscape();
      }
    };

    node.addEventListener('keydown', handleKeydown);

    return {
      destroy() {
        node.removeEventListener('keydown', handleKeydown);
      }
    };
  }

  let {
    children,
    isOpen = false,
    closeSidebar,
    isSingle = true,
    breakpoint = "md",
    alwaysOpen = false,
    position = "fixed",
    activateClickOutside = true,
    backdrop = true,
    backdropClass,
    transition = fly,
    params,
    divClass,
    ariaLabel,
    nonActiveClass,
    activeClass,
    activeUrl = "",
    class: className,
    classes,
    disableBreakpoints = false,
    ...restProps
  }: Props = $props();

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
    "Sidebar",
    untrack(() => ({ backdropClass, divClass, nonActiveClass, activeClass })),
    { backdropClass: "backdrop", divClass: "div", nonActiveClass: "nonactive", activeClass: "active" }
  );

  const styling = $derived(
    classes ?? {
      backdrop: backdropClass,
      div: divClass,
      nonactive: nonActiveClass,
      active: activeClass
    }
  );

  // Inline theme definition
  const sidebar = tv({
    slots: {
      base: "top-0 left-0 z-50 w-64 transition-transform bg-gray-50 dark:bg-gray-800",
      active: "flex items-center group-has-[ul]:ms-6 p-2 text-base font-normal text-gray-900 bg-gray-200 dark:bg-gray-700 rounded-sm dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700",
      nonactive: "flex items-center group-has-[ul]:ms-6 p-2 text-base font-normal text-gray-900 rounded-sm dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700",
      div: "overflow-y-auto px-3 py-4 bg-gray-50 dark:bg-gray-800",
      backdrop: "fixed top-0 start-0 z-40 w-full h-full"
    },
    variants: {
      position: {
        fixed: { base: "fixed" },
        absolute: { base: "absolute" },
        static: { base: "static" }
      },
      isOpen: {
        true: "block",
        false: "hidden"
      },
      breakpoint: {
        sm: { base: "sm:block" },
        md: { base: "md:block" },
        lg: { base: "lg:block" },
        xl: { base: "xl:block" },
        "2xl": { base: "2xl:block" }
      },
      alwaysOpen: {
        true: { base: "block" }
      },
      backdrop: {
        true: { backdrop: "bg-gray-900 opacity-75" }
      }
    },
    compoundVariants: [
      {
        alwaysOpen: true,
        class: {
          base: "!block"
        }
      }
    ]
  });

  export type SidebarVariants = VariantProps<typeof sidebar>;

  // Theme override stub
  const getTheme = (name: string) => undefined;
  const theme = $derived(getTheme("sidebar"));

  const breakpointValues = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536
  };

  let innerWidth: number = $state(-1);
  let isLargeScreen = $derived(disableBreakpoints ? false : alwaysOpen || innerWidth >= breakpointValues[breakpoint]);

  // Create reactive context for activeUrl using getter
  const activeUrlContext: ActiveUrlContextType = {
    get value() {
      return activeUrl;
    }
  };
  setContext(ACTIVE_URL_CONTEXT, activeUrlContext);

  $effect(() => {
    if (disableBreakpoints) isOpen = true;
  });
  const { base, active, nonactive, div, backdrop: backdropCls } = $derived(sidebar({ isOpen, breakpoint, position, backdrop, alwaysOpen: alwaysOpen && !disableBreakpoints }));

  const selectedStore = $derived(isSingle ? writable<object | null>(null) : undefined);
  let sidebarCtx: SidebarContextType = {
    get closeSidebar() {
      return closeSidebar;
    },
    get activeClass() {
      return active({ class: clsx(theme?.active, styling.active) });
    },
    get nonActiveClass() {
      return nonactive({ class: clsx(theme?.nonactive, styling.nonactive) });
    },
    get isSingle() {
      return isSingle;
    },
    get selected() {
      return selectedStore;
    }
  };

  let transitionParams = $derived(params ? params : { x: -320, duration: 200, easing: sineIn });

  setContext(SIDEBAR_CONTEXT, sidebarCtx);

  // Handler for Escape key
  const handleEscape = () => {
    closeSidebar?.();
  };
</script>

<svelte:window bind:innerWidth />

{#if !disableBreakpoints}
  {#if isOpen || isLargeScreen}
    {#if isOpen && !alwaysOpen}
      {#if backdrop && activateClickOutside}
        <div role="presentation" class={backdropCls({ class: clsx(theme?.backdrop, styling.backdrop) })} onclick={closeSidebar}></div>
      {:else if backdrop && !activateClickOutside}
        <div role="presentation" class={backdropCls({ class: clsx(theme?.backdrop, styling.backdrop) })}></div>
      {:else if !backdrop && activateClickOutside}
        <div role="presentation" class="fixed start-0 top-0 z-50 h-full w-full" onclick={closeSidebar}></div>
      {:else if !backdrop && !activateClickOutside}
        <div role="presentation" class="fixed start-0 top-0 z-50 h-full w-full"></div>
      {/if}
    {/if}
    <aside
      use:trapFocus={!isLargeScreen && isOpen && !alwaysOpen ? { onEscape: closeSidebar ? handleEscape : undefined } : null}
      transition:transition={!alwaysOpen ? transitionParams : undefined}
      {...restProps}
      class={base({ class: clsx(theme?.base, className) })}
      aria-label={ariaLabel}
    >
      <div class={div({ class: clsx(theme?.base, styling.div) })}>
        {@render children()}
      </div>
    </aside>
  {/if}
{:else}
  <aside use:trapFocus={isOpen ? { onEscape: closeSidebar ? handleEscape : undefined } : null} {...restProps} class={base({ class: clsx(theme?.base, className) })} aria-label={ariaLabel}>
    <div class={div({ class: clsx(theme?.base, styling.div) })}>
      {@render children()}
    </div>
  </aside>
{/if}

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Type
[SidebarProps](https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/types.ts#L1453)
## Props
@prop children
@prop isOpen = false
@prop closeSidebar
@prop isSingle = true
@prop breakpoint = "md"
@prop alwaysOpen = false
@prop position = "fixed"
@prop activateClickOutside = true
@prop backdrop = true
@prop backdropClass
@prop transition = fly
@prop params
@prop divClass
@prop ariaLabel
@prop nonActiveClass
@prop activeClass
@prop activeUrl = ""
@prop class: className
@prop classes
@prop disableBreakpoints = false
@prop ...restProps
-->
