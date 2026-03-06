<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { type ComponentProps } from 'svelte';
  import type { ComponentProps as ChartComponentProps } from './Chart.svelte';

  import { chartContext } from './ChartContext.svelte';
  import Bar from './Bar.svelte';
  import Rect from './Rect.svelte';

  // Inlined from ../utils/common.js
  type Accessor<TData = any> =
    | number
    | string
    | ((d: TData) => any)
    | undefined
    | null
    | Accessor<TData>[];

  function chartDataArray<TData = any>(data: ChartComponentProps<TData>['data']) {
    if (data == null) {
      return [];
    } else if (Array.isArray(data)) {
      return data;
    } else if ('nodes' in data) {
      return data.nodes;
    } else {
      return data.descendants();
    }
  }

  // Inlined from ../utils/rect.js
  type Insets = {
    all?: number;
    x?: number;
    y?: number;
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  };

  const { data: contextData, cGet, config } = chartContext();

  /**
   * Override `data` from context.  Useful for multiple Bar instances
   */
  export let data: any = undefined;

  /**
   * Override `x` from context.  Useful for multiple Bar instances
   */
  export let x: Accessor = undefined;

  /**
   * Override `y` from context.  Useful for multiple Bar instances
   */
  export let y: Accessor = undefined;

  /**
   * Override `x1` from context.  Useful for multiple Bar instances
   */
  export let x1: Accessor = undefined;

  /**
   * Override `y1` from context.  Useful for multiple Bar instances
   */
  export let y1: Accessor = undefined;

  export let stroke = 'black';
  export let strokeWidth = 0;
  export let radius = 0;
  export let fill: string | undefined = undefined;

  /** Inset the rect for amount of padding.  Useful with multiple bars (bullet, overlap, etc) */
  export let insets: Insets | undefined = undefined;

  /** Define unique value for {#each} `(key)` expressions to improve transitions.  `index` position used by default */
  export let key: (d: any, index: number) => any = (d, i) => i;

  export let spring: ComponentProps<Rect>['spring'] = undefined;
  export let tweened: ComponentProps<Rect>['tweened'] = undefined;

  /** Event dispatched when individual Bar is clicked */
  export let onbarclick: (e: MouseEvent, detail: { data: any }) => void = () => {};

  $: _data = chartDataArray(data ?? $contextData);
</script>

<g class="Bars">
  <slot>
    {#each _data as d, i (key(d, i))}
      <Bar
        bar={d}
        {x}
        {y}
        {x1}
        {y1}
        fill={fill ?? ($config.c ? $cGet(d) : null)}
        {stroke}
        {strokeWidth}
        {radius}
        {insets}
        {spring}
        {tweened}
        onclick={(e) => onbarclick(e, { data: d })}
        {...$$restProps}
      />
    {/each}
  </slot>
</g>
