<!--
This is a Svelte component from virtua

Website: [inokawa.github.io/virtua](https://inokawa.github.io/virtua/?path=/story/basics-vlist--default)
GitHub Repository: [inokawa/virtua](https://github.com/inokawa/virtua)

All components in this directory are sourced from the virtua project by inokawa. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts" generics="T">
  import { type Snippet, onDestroy } from "svelte";
  import type { SvelteHTMLElements } from "svelte/elements";

  // ─── Inlined from core/resizer.ts ───────────────────────────────────────────
  type ItemResizeObserver = (el: HTMLElement, i: number) => () => void;

  // ─── Inlined from svelte/utils.ts ───────────────────────────────────────────
  const styleToString = (obj: Record<string, string | undefined>): string => {
    return Object.keys(obj).reduce((acc, k) => {
      const value = obj[k];
      if (value == null) return acc;
      return acc + `${k}:${value};`;
    }, "");
  };

  // ─── Props ──────────────────────────────────────────────────────────────────
  interface Props {
    children: Snippet<[item: T, index: number]>;
    item: T;
    as: keyof SvelteHTMLElements | undefined;
    index: number;
    offset: number;
    hide: boolean;
    horizontal: boolean;
    resizer: ItemResizeObserver;
  }

  let {
    children,
    item,
    as = "div",
    index,
    offset,
    hide,
    horizontal,
    resizer,
  }: Props = $props();

  let elementRef: HTMLDivElement;

  let cleanupResizer: (() => void) | undefined;
  let prevIndex: number | undefined;
  $effect(() => {
    if (prevIndex === index) return;
    if (cleanupResizer) cleanupResizer();
    cleanupResizer = resizer(elementRef, (prevIndex = index));
  });
  onDestroy(() => {
    if (cleanupResizer) cleanupResizer();
  });

  let style: string = $derived.by(() => {
    const _style: Record<string, string | undefined> = {
      contain: "layout style",
      position: "absolute",
      [horizontal ? "height" : "width"]: "100%",
      [horizontal ? "top" : "left"]: "0px",
      [horizontal ? "left" : "top"]: offset + "px",
      visibility: hide ? "hidden" : undefined,
    };
    if (horizontal) {
      _style["display"] = "inline-flex";
    }
    return styleToString(_style);
  });
</script>

<svelte:element this={as} bind:this={elementRef} {style}>
  {@render children(item, index)}
</svelte:element>
