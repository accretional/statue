<script module lang="ts">
  // Export context symbol for use by BottomNavItem
  export const BOTTOM_NAV_CONTEXT = Symbol("bottomNav");
</script>

<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import clsx from "clsx";
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import { setContext, untrack } from "svelte";

  type Position = "static" | "fixed" | "absolute" | "relative" | "sticky";
  type NavType = "default" | "border" | "application" | "pagination" | "group" | "card" | "meeting" | "video";

  interface BottomNavContextType {
    activeClass: string;
    activeUrl: string;
    navType: NavType;
  }

  interface Props extends HTMLAttributes<HTMLDivElement> {
    children: Snippet;
    header?: Snippet;
    position?: Position;
    navType?: NavType;
    class?: string;
    classes?: { inner?: string };
    outerClass?: string;
    innerClass?: string;
    activeClass?: string;
    activeUrl?: string;
  }

  let { children, header, position = "fixed", navType = "default", class: className, classes, outerClass, innerClass, activeClass, activeUrl = "", ...restProps }: Props = $props();

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
    "BottomNav",
    untrack(() => ({ innerClass, outerClass })),
    { innerClass: "inner", outerClass: "class" }
  );

  const styling = $derived(classes ?? { inner: innerClass });

  // Inline theme definition
  const bottomNav = tv({
    slots: {
      base: "w-full z-30 border-gray-200 dark:bg-gray-700 dark:border-gray-600",
      inner: "grid h-full max-w-lg mx-auto"
    },
    variants: {
      position: {
        static: { base: "static" },
        fixed: { base: "fixed" },
        absolute: { base: "absolute" },
        relative: { base: "relative" },
        sticky: { base: "sticky" }
      },
      navType: {
        default: { base: "bottom-0 start-0 h-16 bg-white border-t" },
        border: { base: "bottom-0 start-0 h-16 bg-white border-t" },
        application: {
          base: "h-16 max-w-lg -translate-x-1/2 rtl:translate-x-1/2 bg-white border rounded-full bottom-4 start-1/2"
        },
        pagination: {
          base: "bottom-0 h-16 -translate-x-1/2 rtl:translate-x-1/2 bg-white border-t start-1/2"
        },
        group: {
          base: "bottom-0 -translate-x-1/2 rtl:translate-x-1/2 bg-white border-t start-1/2"
        },
        card: { base: "bottom-0 start-0 h-16 bg-white border-t" },
        meeting: {
          base: "bottom-0 start-0 grid h-16 grid-cols-1 px-8 bg-white border-t md:grid-cols-3",
          inner: "flex items-center justify-center mx-auto"
        },
        video: {
          base: "bottom-0 start-0 grid h-24 grid-cols-1 px-8 bg-white border-t md:grid-cols-3",
          inner: "flex items-center w-full"
        }
      }
    },
    defaultVariants: {
      position: "fixed",
      navType: "default"
    }
  });

  export type BottomNavVariants = VariantProps<typeof bottomNav>;

  // Theme override stub
  const getTheme = (name: string) => undefined;
  const theme = $derived(getTheme("bottomNav"));

  const activeCls = $derived(clsx("text-primary-700 dark:text-primary-700 hover:text-primary-900 dark:hover:text-primary-900", activeClass));

  // Create reactive context using getters
  const reactiveCtx: BottomNavContextType = {
    get activeClass() {
      return activeCls;
    },
    get activeUrl() {
      return activeUrl;
    },
    get navType() {
      return navType;
    }
  };

  setContext(BOTTOM_NAV_CONTEXT, reactiveCtx);

  const { base, inner } = $derived(bottomNav({ position, navType }));
</script>

<div {...restProps} class={base({ class: clsx(theme?.base, className ?? outerClass) })}>
  {#if header}
    {@render header()}
  {/if}

  <div class={inner({ class: clsx(theme?.inner, styling.inner) })}>
    {@render children()}
  </div>
</div>

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Type
[BottomNavProps](https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/types.ts#L271)
## Props
@prop children
@prop header
@prop position = "fixed"
@prop navType = "default"
@prop class: className
@prop classes
@prop outerClass
@prop innerClass
@prop activeClass
@prop activeUrl = ""
@prop ...restProps
-->
