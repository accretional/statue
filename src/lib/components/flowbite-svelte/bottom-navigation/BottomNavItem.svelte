<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import clsx from "clsx";
  import { getContext, untrack } from "svelte";
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import { BOTTOM_NAV_CONTEXT } from "./BottomNav.svelte";

  type NavType = "default" | "border" | "application" | "pagination" | "group" | "card" | "meeting" | "video";
  type AppBtnPosition = "left" | "middle" | "right";

  interface BottomNavContextType {
    activeClass: string;
    activeUrl: string;
    navType: NavType;
  }

  interface Props {
    children: Snippet;
    btnName: string;
    appBtnPosition?: AppBtnPosition;
    activeClass?: string;
    class?: string;
    classes?: { span?: string };
    btnClass?: string;
    spanClass?: string;
    active?: boolean;
    href?: string;
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

  let { children, btnName, appBtnPosition = "middle", activeClass, class: className, classes, btnClass, spanClass, active: manualActive, ...restProps }: Props = $props();

  warnThemeDeprecation(
    "BottomNavItem",
    untrack(() => ({ spanClass, btnClass })),
    { spanClass: "span", btnClass: "class" }
  );

  const styling = $derived(classes ?? { span: spanClass });

  // Inline theme definition
  const bottomNavItem = tv({
    slots: {
      base: "inline-flex flex-col items-center justify-center",
      span: "text-sm"
    },
    variants: {
      navType: {
        default: {
          base: "px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group",
          span: "text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500"
        },
        border: {
          base: "px-5 border-gray-200 border-x hover:bg-gray-50 dark:hover:bg-gray-800 group dark:border-gray-600",
          span: "text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500"
        },
        application: {
          base: "",
          span: "sr-only"
        },
        pagination: {
          base: "px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group",
          span: "sr-only"
        },
        group: {
          base: "p-4 hover:bg-gray-50 dark:hover:bg-gray-800 group",
          span: "sr-only"
        },
        card: {
          base: "px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group",
          span: "text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500"
        },
        meeting: {
          base: "",
          span: ""
        },
        video: {
          base: "",
          span: ""
        }
      },
      appBtnPosition: {
        left: {
          base: "px-5 rounded-s-full hover:bg-gray-50 dark:hover:bg-gray-800 group"
        },
        middle: { base: "px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group" },
        right: {
          base: "px-5 rounded-e-full hover:bg-gray-50 dark:hover:bg-gray-800 group"
        }
      }
    },
    defaultVariants: {
      navType: "default",
      appBtnPosition: "middle"
    }
  });

  export type BottomNavItemVariants = VariantProps<typeof bottomNavItem>;

  // Theme override stub
  const getTheme = (name: string) => undefined;
  const theme = $derived(getTheme("bottomNavItem"));

  const context = getContext<BottomNavContextType>(BOTTOM_NAV_CONTEXT);

  let navUrl = $derived(context?.activeUrl || "");

  const { base, span } = $derived(bottomNavItem({ navType: context?.navType, appBtnPosition }));

  // Determine active state based on manual prop or URL matching
  let isActive = $derived.by(() => {
    const href = restProps.href ?? "";
    return manualActive !== undefined
      ? !!manualActive
      : navUrl
        ? href === "/"
          ? navUrl === "/"
          : href && (navUrl === href || navUrl.startsWith(href + "/") || (href !== "/" && navUrl.replace(/^https?:\/\/[^/]+/, "").startsWith(href)))
        : false;
  });

  function getCommonClass() {
    return base({ class: clsx(isActive && (activeClass ?? context?.activeClass), theme?.base, className ?? btnClass) });
  }

  function getSpanClass() {
    return span({ class: clsx(isActive && (activeClass ?? context?.activeClass), theme?.span, styling.span) });
  }

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const commonProps: Record<string, any> = $derived({
    "aria-label": btnName,
    class: getCommonClass(),
    ...restProps
  });

  const anchorProps: HTMLAnchorAttributes = $derived({
    ...commonProps
  });

  const buttonProps: HTMLButtonAttributes = $derived({
    ...commonProps,
    type: "button" as const
  });
</script>

{#if restProps.href === undefined}
  <button {...buttonProps}>
    {@render children()}
    <span class={getSpanClass()}>{btnName}</span>
  </button>
{:else}
  <a {...anchorProps}>
    {@render children()}
    <span class={getSpanClass()}>{btnName}</span>
  </a>
{/if}

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Type
[BottomNavItemProps](https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/types.ts#L280)
## Props
@prop children
@prop btnName
@prop appBtnPosition = "middle"
@prop activeClass
@prop class: className
@prop classes
@prop btnClass
@prop spanClass
@prop active: manualActive
@prop ...restProps
-->
