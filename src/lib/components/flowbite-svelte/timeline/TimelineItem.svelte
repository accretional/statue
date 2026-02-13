<!--
This is a Svelte component from Flowbite Svelte

Website: [flowbite-svelte.com](https://flowbite-svelte.com/)
GitHub Repository: [themesberg/flowbite-svelte](https://github.com/themesberg/flowbite-svelte)

All components in this directory are sourced from the Flowbite Svelte project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { tv, type VariantProps } from "tailwind-variants";
  import { getContext, untrack } from "svelte";
  import clsx from "clsx";
  import type { HTMLAttributes } from "svelte/elements";
  import type { Snippet } from "svelte";
  import { TIMELINE_ORDER_CONTEXT } from "./Timeline.svelte";

  type Order = "group" | "horizontal" | "activity" | "vertical" | "default";
  type Color = "primary" | "green" | "orange" | "red" | "blue" | "purple" | "gray";
  type DateFormat = "year" | "month-year" | "full-date";

  interface Props extends HTMLAttributes<HTMLLIElement> {
    children: Snippet;
    orientationSlot?: Snippet;
    title?: string;
    date?: string;
    dateFormat?: DateFormat;
    color?: Color;
    isLast?: boolean;
    svgClass?: string;
    liClass?: string;
    defaultDivClass?: string;
    divClass?: string;
    timeClass?: string;
    h3Class?: string;
    connectorClass?: string;
    datePrefix?: string;
    class?: string;
    classes?: {
      svg?: string;
      div?: string;
      time?: string;
      h3?: string;
      connector?: string;
    };
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
    orientationSlot,
    title,
    date,
    dateFormat = "month-year",
    color = "primary",
    isLast = false,
    svgClass,
    liClass,
    defaultDivClass,
    divClass,
    timeClass,
    h3Class,
    connectorClass,
    datePrefix,
    class: className,
    classes,
    ...restProps
  }: Props = $props();

  warnThemeDeprecation(
    "TimelineItem",
    untrack(() => ({ svgClass, liClass, divClass, timeClass, h3Class, connectorClass })),
    {
      liClass: "class",
      svgClass: "svg",
      divClass: "div",
      timeClass: "time",
      h3Class: "h3",
      connectorClass: "connector"
    }
  );

  const styling = $derived({
    svg: svgClass,
    div: divClass,
    time: timeClass,
    h3: h3Class,
    connector: connectorClass
  });

  // Color variant definitions for compound variants
  const colorVariants = {
    primary: {
      dot: "bg-primary-200 dark:bg-primary-900",
      ring: "ring-white dark:ring-gray-900",
      icon: "text-primary-600 dark:text-primary-400",
      connector: "border-primary-200 dark:border-primary-700"
    },
    green: {
      dot: "bg-green-200 dark:bg-green-900",
      ring: "ring-white dark:ring-gray-900",
      icon: "text-green-600 dark:text-green-400",
      connector: "border-green-200 dark:border-green-700"
    },
    orange: {
      dot: "bg-orange-200 dark:bg-orange-900",
      ring: "ring-white dark:ring-gray-900",
      icon: "text-orange-600 dark:text-orange-400",
      connector: "border-orange-200 dark:border-orange-700"
    },
    red: {
      dot: "bg-red-200 dark:bg-red-900",
      ring: "ring-white dark:ring-gray-900",
      icon: "text-red-600 dark:text-red-400",
      connector: "border-red-200 dark:border-red-700"
    },
    blue: {
      dot: "bg-blue-200 dark:bg-blue-900",
      ring: "ring-white dark:ring-gray-900",
      icon: "text-blue-600 dark:text-blue-400",
      connector: "border-blue-200 dark:border-blue-700"
    },
    purple: {
      dot: "bg-purple-200 dark:bg-purple-900",
      ring: "ring-white dark:ring-gray-900",
      icon: "text-purple-600 dark:text-purple-400",
      connector: "border-purple-200 dark:border-purple-700"
    },
    gray: {
      dot: "bg-gray-200 dark:bg-gray-700",
      ring: "ring-white dark:ring-gray-900",
      icon: "text-gray-600 dark:text-gray-400",
      connector: "border-gray-200 dark:border-gray-700"
    }
  };

  // Inline theme definition
  const timelineItem = tv({
    slots: {
      base: "relative",
      div: "",
      defaultDiv: "absolute w-2 h-2 bg-gray-200 rounded-full mt-1.5 -start-5 border border-buffer",
      time: "",
      h3: "",
      svg: "w-4 h-4",
      connector: "absolute top-6 left-3 w-px h-full"
    },
    variants: {
      order: {
        default: {
          base: "mb-10 ms-4",
          div: "absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -left-1.5 border border-white dark:border-gray-900 dark:bg-gray-700",
          time: "mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500",
          h3: "text-lg font-semibold text-gray-900 dark:text-white"
        },
        vertical: {
          base: "mb-10 ms-6 relative",
          div: "flex absolute -left-4 top-1.5 justify-center items-center w-6 h-6 rounded-full ring-8",
          time: "mb-1 pl-4 text-sm font-normal leading-none text-gray-400 dark:text-gray-500",
          h3: "flex ml-4 items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white",
          connector: "absolute top-7 -left-1.5 w-px h-full"
        },
        horizontal: {
          base: "relative mb-6 sm:mb-0",
          div: "flex items-center",
          time: "mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500",
          h3: "text-lg font-semibold text-gray-900 dark:text-white"
        },
        activity: {
          base: "mb-10 ms-6 relative",
          div: "flex absolute -left-4 top-1.5 justify-center items-center w-6 h-6 rounded-full ring-8",
          time: "mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500",
          h3: "text-lg font-semibold text-gray-900 dark:text-white",
          connector: "absolute top-7 -left-4 w-px h-full"
        },
        group: {
          base: "",
          div: "p-5 mb-4 bg-gray-50 rounded-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700",
          time: "text-lg font-semibold text-gray-900 dark:text-white",
          h3: "text-lg font-semibold text-gray-900 dark:text-white"
        }
      },
      color: {
        primary: {},
        green: {},
        orange: {},
        red: {},
        blue: {},
        purple: {},
        gray: {}
      },
      isLast: {
        true: {},
        false: {}
      }
    },
    compoundVariants: [
      // Vertical color variants
      {
        order: "vertical",
        color: "primary",
        class: {
          div: colorVariants.primary.dot + " " + colorVariants.primary.ring,
          svg: colorVariants.primary.icon,
          connector: "bg-primary-200 dark:bg-primary-700"
        }
      },
      {
        order: "vertical",
        color: "green",
        class: {
          div: colorVariants.green.dot + " " + colorVariants.green.ring,
          svg: colorVariants.green.icon,
          connector: "bg-green-200 dark:bg-green-700"
        }
      },
      {
        order: "vertical",
        color: "orange",
        class: {
          div: colorVariants.orange.dot + " " + colorVariants.orange.ring,
          svg: colorVariants.orange.icon,
          connector: "bg-orange-200 dark:bg-orange-700"
        }
      },
      {
        order: "vertical",
        color: "red",
        class: {
          div: colorVariants.red.dot + " " + colorVariants.red.ring,
          svg: colorVariants.red.icon,
          connector: "bg-red-200 dark:bg-red-700"
        }
      },
      {
        order: "vertical",
        color: "blue",
        class: {
          div: colorVariants.blue.dot + " " + colorVariants.blue.ring,
          svg: colorVariants.blue.icon,
          connector: "bg-blue-200 dark:bg-blue-700"
        }
      },
      {
        order: "vertical",
        color: "purple",
        class: {
          div: colorVariants.purple.dot + " " + colorVariants.purple.ring,
          svg: colorVariants.purple.icon,
          connector: "bg-purple-200 dark:bg-purple-700"
        }
      },
      {
        order: "vertical",
        color: "gray",
        class: {
          div: colorVariants.gray.dot + " " + colorVariants.gray.ring,
          svg: colorVariants.gray.icon,
          connector: "bg-gray-200 dark:bg-gray-700"
        }
      },
      // Horizontal color variants
      {
        order: "horizontal",
        color: "primary",
        class: {
          div: colorVariants.primary.dot + " " + colorVariants.primary.ring,
          svg: colorVariants.primary.icon
        }
      },
      {
        order: "horizontal",
        color: "green",
        class: {
          div: colorVariants.green.dot + " " + colorVariants.green.ring,
          svg: colorVariants.green.icon
        }
      },
      {
        order: "horizontal",
        color: "orange",
        class: {
          div: colorVariants.orange.dot + " " + colorVariants.orange.ring,
          svg: colorVariants.orange.icon
        }
      },
      {
        order: "horizontal",
        color: "red",
        class: {
          div: colorVariants.red.dot + " " + colorVariants.red.ring,
          svg: colorVariants.red.icon
        }
      },
      {
        order: "horizontal",
        color: "blue",
        class: {
          div: colorVariants.blue.dot + " " + colorVariants.blue.ring,
          svg: colorVariants.blue.icon
        }
      },
      {
        order: "horizontal",
        color: "purple",
        class: {
          div: colorVariants.purple.dot + " " + colorVariants.purple.ring,
          svg: colorVariants.purple.icon
        }
      },
      {
        order: "horizontal",
        color: "gray",
        class: {
          div: colorVariants.gray.dot + " " + colorVariants.gray.ring,
          svg: colorVariants.gray.icon
        }
      },
      // Hide connector on last item
      {
        isLast: true,
        class: {
          connector: "hidden"
        }
      }
    ],
    defaultVariants: {
      order: "default",
      color: "primary",
      isLast: false
    }
  });

  export type TimelineItemVariants = VariantProps<typeof timelineItem>;

  // Theme override stub
  const getTheme = (name: string) => undefined;
  const theme = $derived(getTheme("timelineItem"));

  let order = getContext<Order>(TIMELINE_ORDER_CONTEXT);

  const { base, div, defaultDiv, time, h3, svg, connector } = $derived(timelineItem({ order, color, isLast }));

  const defaultDivCls = $derived(defaultDivClass ? defaultDivClass : defaultDiv());

  function formatDisplayDate(dateStr: string, format: DateFormat) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    switch (format) {
      case "year":
        return date.toLocaleDateString(undefined, {
          year: "numeric"
        });
      case "month-year":
        return date.toLocaleDateString(undefined, {
          month: "long",
          year: "numeric"
        });
      case "full-date":
        return date.toLocaleDateString(undefined, {
          day: "numeric",
          month: "long",
          year: "numeric"
        });
      default:
        return date.toLocaleDateString(undefined, {
          month: "long",
          year: "numeric"
        });
    }
  }
</script>

<li {...restProps} class={base({ class: clsx(theme?.base, className ?? liClass) })}>
  <!-- Individual connector line for vertical/activity layouts -->
  {#if !isLast && (order === "vertical" || order === "activity")}
    <div class={connector({ class: clsx(theme?.connector, styling.connector) })} aria-hidden="true"></div>
  {/if}

  {#if order !== "default"}
    {#if orientationSlot && (order === "vertical" || order === "horizontal")}
      {@render orientationSlot()}
    {:else}
      <div class={div({ class: clsx(theme?.div, styling.div) })}>
        <svg aria-hidden="true" class={svg({ class: clsx(theme?.svg, styling.svg) })} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    {/if}
  {:else if date}
    <div class={defaultDivCls} aria-hidden="true"></div>
    <time datetime={date} class={time({ class: clsx(theme?.time, styling.time) })}>
      {datePrefix}
      {formatDisplayDate(date, dateFormat)}
    </time>
  {/if}

  {#if title}
    <h3 class={h3({ class: clsx(theme?.h3, styling.h3) })}>
      {title}
    </h3>
  {/if}

  {#if order !== "default"}
    {#if date}
      <time datetime={date} class={time({ class: clsx(theme?.time, styling.time) })}>
        {datePrefix}
        {formatDisplayDate(date, dateFormat)}
      </time>
    {/if}
  {/if}

  {@render children()}
</li>

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Type
[TimelineItemProps](https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/types.ts#L1960)
## Props
@prop children
@prop orientationSlot
@prop title
@prop date
@prop dateFormat = "month-year"
@prop color = "primary"
@prop isLast = false
@prop svgClass
@prop liClass
@prop defaultDivClass
@prop divClass
@prop timeClass
@prop h3Class
@prop connectorClass
@prop datePrefix
@prop class: className
@prop classes
@prop ...restProps
-->
