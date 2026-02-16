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

  interface Props extends HTMLAttributes<HTMLButtonElement> {
    breakpoint?: "sm" | "md" | "lg" | "xl" | "2xl";
    class?: string;
    classes?: { svg?: string };
  }

  let { breakpoint = "md", class: className, classes, ...restProps }: Props = $props();

  // Inline theme definition
  const sidebarButton = tv({
    slots: {
      base: "inline-flex items-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600",
      svg: "h-6 w-6 m-2"
    },
    variants: {
      breakpoint: {
        sm: "sm:hidden",
        md: "md:hidden",
        lg: "lg:hidden",
        xl: "xl:hidden",
        "2xl": "2xl:hidden"
      }
    }
  });

  // Theme override stub
  const getTheme = (name: string) => undefined;
  const theme = $derived(getTheme("sidebarButton"));

  const { base, svg } = $derived(sidebarButton({ breakpoint }));
</script>

<button {...restProps} type="button" class={base({ class: clsx(theme?.base, className) })}>
  <span class="sr-only">Open sidebar</span>
  <svg class={svg({ class: clsx(theme?.svg, classes?.svg) })} aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path
      clip-rule="evenodd"
      fill-rule="evenodd"
      d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
    ></path>
  </svg>
</button>

<!--
@component
[Go to docs](https://flowbite-svelte.com/)
## Type
[SidebarButtonProps](https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/types.ts#L1472)
## Props
@prop breakpoint = "md"
@prop class: className
@prop classes
@prop ...restProps
-->
