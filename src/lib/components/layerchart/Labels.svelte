<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { type ComponentProps } from 'svelte';
  import { format as formatValue, type FormatType } from '@layerstack/utils';
  import { cls } from '@layerstack/tailwind';

  import Text from './Text.svelte';
  import { chartContext } from './ChartContext.svelte';
  import Points, { type Point } from './Points.svelte';
  import { get } from 'lodash-es';
  import type { ScaleBand } from 'd3-scale';

  // Inlined from $lib/utils/scales.js
  interface AnyScale<Domain = any, Range = any, Input = Domain, Output = any> {
    (value: Input): Output;
    bandwidth?: Function;
  }

  function isScaleBand(scale: AnyScale<any, any>): scale is ScaleBand<any> {
    return typeof scale.bandwidth === 'function';
  }

  // Inlined from ../utils/common.js
  type Accessor<TData = any> =
    | number
    | string
    | ((d: TData) => any)
    | undefined
    | null
    | Accessor<TData>[];

  function accessor<TData = any>(prop: Accessor<TData>): (d: TData) => any {
    if (Array.isArray(prop)) {
      return (d: TData) => prop.map((p) => accessor<TData>(p)(d));
    } else if (typeof prop === 'function') {
      return prop;
    } else if (typeof prop === 'string' || typeof prop === 'number') {
      return (d: TData) => get(d, prop);
    } else {
      return (d: TData) => d;
    }
  }

  const { xScale, yScale } = chartContext();

  /** Override data instead of using context */
  export let data: any = undefined;

  /** Override display value accessor.  By default, uses `y` unless yScale is band scale   */
  export let value: Accessor = undefined;

  /** Override `x` accessor from Chart context */
  export let x: Accessor = undefined;
  /** Override `y` accessor from Chart context */
  export let y: Accessor = undefined;

  export let placement: 'inside' | 'outside' | 'center' = 'outside';
  export let offset = placement === 'center' ? 0 : 4;
  export let format: FormatType | undefined = undefined;

  /** Define unique value for {#each} `(key)` expressions to improve transitions.  `index` position used by default */
  export let key: (d: any, index: number) => any = (d, i) => i;

  $: getTextProps = (point: Point): ComponentProps<Text> => {
    // Used for positioning
    const pointValue = isScaleBand($yScale) ? point.xValue : point.yValue;

    const displayValue = value
      ? accessor(value)(point.data)
      : isScaleBand($yScale)
        ? point.xValue
        : point.yValue;

    const formattedValue = formatValue(
      displayValue,
      format ??
        (value ? undefined : isScaleBand($yScale) ? $xScale.tickFormat?.() : $yScale.tickFormat?.())
    );

    if (isScaleBand($yScale)) {
      // Position label left/right on horizontal bars
      if (pointValue < 0) {
        // left
        return {
          value: formattedValue,
          x: point.x + (placement === 'outside' ? -offset : offset),
          y: point.y,
          textAnchor: placement === 'outside' ? 'end' : 'start',
          verticalAnchor: 'middle',
          capHeight: '.6rem',
        };
      } else {
        // right
        return {
          value: formattedValue,
          x: point.x + (placement === 'outside' ? offset : -offset),
          y: point.y,
          textAnchor: placement === 'outside' ? 'start' : 'end',
          verticalAnchor: 'middle',
          capHeight: '.6rem',
        };
      }
    } else {
      // Position label top/bottom on vertical bars
      if (pointValue < 0) {
        // bottom
        return {
          value: formattedValue,
          x: point.x,
          y: point.y + (placement === 'outside' ? offset : -offset),
          capHeight: '.6rem',
          textAnchor: 'middle',
          verticalAnchor:
            placement === 'center' ? 'middle' : placement === 'outside' ? 'start' : 'end',
        };
      } else {
        // top
        return {
          value: formattedValue,
          x: point.x,
          y: point.y + (placement === 'outside' ? -offset : offset),
          capHeight: '.6rem',
          textAnchor: 'middle',
          verticalAnchor:
            placement === 'center' ? 'middle' : placement === 'outside' ? 'end' : 'start',
        };
      }
    }
  };
</script>

<g class="Labels">
  <Points {data} {x} {y} let:points>
    {#each points as point, i (key(point.data, i))}
      {@const textProps = getTextProps(point)}
      <slot data={point} {textProps}>
        <Text
          {...textProps}
          {...$$restProps}
          class={cls(
            'text-xs',
            placement === 'inside'
              ? 'fill-surface-300 stroke-surface-content'
              : 'fill-surface-content stroke-surface-100',
            textProps.class,
            $$props.class
          )}
        />
      </slot>
    {/each}
  </Points>
</g>
