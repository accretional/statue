<!--
This is a Svelte component from virtua

Website: [inokawa.github.io/virtua](https://inokawa.github.io/virtua/?path=/story/basics-vlist--default)
GitHub Repository: [inokawa/virtua](https://github.com/inokawa/virtua)

All components in this directory are sourced from the virtua project by inokawa. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts" generics="T">
  import { type Snippet } from "svelte";
  import type { HTMLAttributes, AriaAttributes } from "svelte/elements";
  import Virtualizer from "./Virtualizer.svelte";

  // ─── Inlined from svelte/utils.ts ───────────────────────────────────────────
  const styleToString = (obj: Record<string, string | undefined>): string => {
    return Object.keys(obj).reduce((acc, k) => {
      const value = obj[k];
      if (value == null) return acc;
      return acc + `${k}:${value};`;
    }, "");
  };

  // ─── Inlined from core/types.ts ─────────────────────────────────────────────
  declare const cacheSymbol: unique symbol;
  interface CacheSnapshot {
    [cacheSymbol]: never;
  }
  interface ScrollToIndexOpts {
    align?: "start" | "center" | "end" | "nearest";
    smooth?: boolean;
    offset?: number;
  }

  // ─── Inlined from svelte/types.ts ───────────────────────────────────────────
  type ViewportComponentAttributes = Pick<
    HTMLAttributes<HTMLElement>,
    "class" | "style" | "id" | "role" | "tabindex"
  > &
    AriaAttributes;

  // ─── Inlined from VList.type.ts / Virtualizer.type.ts ───────────────────────
  interface VListProps<T> {
    data: readonly T[];
    children: Snippet<[item: T, index: number]>;
    getKey?: (data: T, index: number) => string | number;
    bufferSize?: number;
    itemSize?: number;
    ssrCount?: number;
    shift?: boolean;
    horizontal?: boolean;
    keepMounted?: readonly number[];
    cache?: CacheSnapshot;
    onscroll?: (offset: number) => void;
    onscrollend?: () => void;
  }

  interface VListHandle {
    getCache: () => CacheSnapshot;
    getScrollOffset: () => number;
    getScrollSize: () => number;
    getViewportSize: () => number;
    findItemIndex(offset: number): number;
    getItemOffset(index: number): number;
    getItemSize(index: number): number;
    scrollToIndex(index: number, opts?: ScrollToIndexOpts): void;
    scrollTo(offset: number): void;
    scrollBy(offset: number): void;
  }

  // ─── Props ──────────────────────────────────────────────────────────────────
  interface Props extends VListProps<T>, ViewportComponentAttributes {}

  let {
    data,
    getKey,
    bufferSize,
    itemSize,
    ssrCount,
    shift,
    horizontal,
    keepMounted,
    cache,
    children,
    onscroll,
    onscrollend,
    ...rest
  }: Props = $props();

  let ref: Virtualizer<T> = $state()!;

  // ─── Forwarded handle methods ───────────────────────────────────────────────
  export const getCache = (() =>
    ref.getCache()) satisfies VListHandle["getCache"] as VListHandle["getCache"];
  export const getScrollOffset = (() =>
    ref.getScrollOffset()) satisfies VListHandle["getScrollOffset"] as VListHandle["getScrollOffset"];
  export const getScrollSize = (() =>
    ref.getScrollSize()) satisfies VListHandle["getScrollSize"] as VListHandle["getScrollSize"];
  export const getViewportSize = (() =>
    ref.getViewportSize()) satisfies VListHandle["getViewportSize"] as VListHandle["getViewportSize"];
  export const findItemIndex = ((...args) =>
    ref.findItemIndex(
      ...args,
    )) satisfies VListHandle["findItemIndex"] as VListHandle["findItemIndex"];
  export const getItemOffset = ((...args) =>
    ref.getItemOffset(
      ...args,
    )) satisfies VListHandle["getItemOffset"] as VListHandle["getItemOffset"];
  export const getItemSize = ((...args) =>
    ref.getItemSize(
      ...args,
    )) satisfies VListHandle["getItemSize"] as VListHandle["getItemSize"];
  export const scrollToIndex = ((...args) =>
    ref.scrollToIndex(
      ...args,
    )) satisfies VListHandle["scrollToIndex"] as VListHandle["scrollToIndex"];
  export const scrollTo = ((...args) =>
    ref.scrollTo(
      ...args,
    )) satisfies VListHandle["scrollTo"] as VListHandle["scrollTo"];
  export const scrollBy = ((...args) =>
    ref.scrollBy(
      ...args,
    )) satisfies VListHandle["scrollBy"] as VListHandle["scrollBy"];

  // ─── Viewport style ─────────────────────────────────────────────────────────
  const viewportStyle = styleToString({
    display: horizontal ? "inline-block" : "block",
    [horizontal ? "overflow-x" : "overflow-y"]: "auto",
    contain: "strict",
    width: "100%",
    height: "100%",
  });
</script>

<div {...rest} style="{viewportStyle} {rest.style || ''}">
  <Virtualizer
    bind:this={ref}
    {data}
    {children}
    {getKey}
    {bufferSize}
    {itemSize}
    {ssrCount}
    {shift}
    {horizontal}
    {keepMounted}
    {cache}
    {onscroll}
    {onscrollend}
  />
</div>
