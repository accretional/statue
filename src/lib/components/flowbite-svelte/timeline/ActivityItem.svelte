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
  import { untrack } from "svelte";

  interface ActivityType {
    title: string;
    date: string;
    src: string;
    alt: string;
    text?: string;
    id?: string | number;
  }

  interface Props extends HTMLAttributes<HTMLLIElement> {
    activities: ActivityType[];
    liClass?: string;
    spanClass?: string;
    imgClass?: string;
    outerDivClass?: string;
    innerDivClass?: string;
    timeClass?: string;
    titleClass?: string;
    textClass?: string;
    class?: string;
    classes?: {
      span?: string;
      img?: string;
      outer?: string;
      inner?: string;
      time?: string;
      title?: string;
      text?: string;
    };
  }

  let { activities, liClass, spanClass, imgClass, outerDivClass, innerDivClass, timeClass, titleClass, textClass, class: className, classes, ...restProps }: Props = $props();

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
    "ActivityItem",
    untrack(() => ({ liClass, spanClass, imgClass, outerDivClass, innerDivClass, timeClass, titleClass, textClass })),
    {
      liClass: "class",
      spanClass: "span",
      imgClass: "img",
      outerDivClass: "outer",
      innerDivClass: "inner",
      timeClass: "time",
      titleClass: "title",
      textClass: "text"
    }
  );

  const styling = $derived(
    classes ?? {
      span: spanClass,
      img: imgClass,
      outer: outerDivClass,
      inner: innerDivClass,
      time: timeClass,
      title: titleClass,
      text: textClass
    }
  );

  // Inline theme definition
  const activityItem = tv({
    slots: {
      li: "mb-10 ms-6",
      span: "flex absolute -start-3 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900",
      img: "rounded-full shadow-lg",
      outer: "p-4 bg-white rounded-lg border border-gray-200 shadow-xs dark:bg-gray-700 dark:border-gray-600",
      inner: "justify-between items-center mb-3 sm:flex",
      time: "mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0",
      title: "text-sm font-normal text-gray-500 lex dark:text-gray-300",
      text: "p-3 text-xs italic font-normal text-gray-500 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300"
    }
  });

  // Theme override stub
  const getTheme = (name: string) => undefined;
  const theme = $derived(getTheme("activityItem"));

  const { li, span, img, outer, inner, time, title, text } = $derived(activityItem());
</script>

{#each activities as { title: name, date, src, alt, text: activity, id }, index (id ?? src ?? index)}
  <li {...restProps} class={li({ class: clsx(theme?.li, className ?? liClass) })}>
    <span class={span({ class: clsx(theme?.span, styling.span) })}>
      <img class={img({ class: clsx(theme?.img, styling.img) })} {src} {alt} />
    </span>
    <div class={outer({ class: clsx(theme?.outer, styling.outer) })}>
      <div class={inner({ class: clsx(theme?.inner, styling.inner) })}>
        <time class={time({ class: clsx(theme?.time, styling.time) })}>{date}</time>
        <div class={title({ class: clsx(theme?.title, styling.title) })}>
          {@html name}
        </div>
      </div>
      {#if activity}
        <div class={text({ class: clsx(theme?.text, styling.text) })}>
          {@html activity}
        </div>
      {/if}
    </div>
  </li>
{/each}

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Type
[ActivityItemProps](https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/types.ts#L1912)
## Props
@prop activities
@prop liClass
@prop spanClass
@prop imgClass
@prop outerDivClass
@prop innerDivClass
@prop timeClass
@prop titleClass
@prop textClass
@prop class: className
@prop classes
@prop ...restProps
-->
