<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { type ComponentProps } from 'svelte';
  import { derived } from 'svelte/store';
  import { max, min } from 'd3-array';
  import { get } from 'lodash-es';
  import type { ScaleBand } from 'd3-scale';

  import { chartContext } from './ChartContext.svelte';
  import type { ChartContext } from './ChartContext.svelte';
  import Rect from './Rect.svelte';
  import Spline from './Spline.svelte';

  import { getRenderContext } from './Chart.svelte';
  import { getCanvasContext } from './layout/Canvas.svelte';
  import { greatestAbs } from '@layerstack/utils';

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

  // Inlined from ../utils/scales.js
  interface AnyScale<Domain = any, Range = any, Input = Domain, Output = any> {
    (value: Input): Output;
    bandwidth?: Function;
  }

  function isScaleBand(scale: AnyScale<any, any>): scale is ScaleBand<any> {
    return typeof scale.bandwidth === 'function';
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

  type ResolvedInsets = {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };

  type DimensionGetterOptions = {
    x?: Accessor;
    y?: Accessor;
    x1?: Accessor;
    y1?: Accessor;
    insets?: Insets;
  };

  function firstValue(value: number | number[]) {
    return Array.isArray(value) ? value[0] : value;
  }

  function resolveInsets(insets?: Insets): ResolvedInsets {
    const all = insets?.all ?? 0;
    const x = insets?.x ?? all;
    const y = insets?.y ?? all;
    const left = insets?.left ?? x;
    const right = insets?.right ?? x;
    const top = insets?.top ?? y;
    const bottom = insets?.bottom ?? y;
    return { left, right, bottom, top };
  }

  function createDimensionGetter<TData>(
    context: ChartContext<TData>,
    options?: DimensionGetterOptions
  ) {
    const {
      xScale,
      yScale,
      x: xAccessor,
      y: yAccessor,
      x1: x1Accessor,
      y1: y1Accessor,
      x1Scale,
      y1Scale,
    } = context;

    return derived(
      [xScale, x1Scale, yScale, y1Scale, xAccessor, yAccessor, x1Accessor, y1Accessor],
      ([$xScale, $x1Scale, $yScale, $y1Scale, $xAccessor, $yAccessor, $x1Accessor, $y1Accessor]) => {
        const insets = resolveInsets(options?.insets);
        const [minXDomain, maxXDomain] = $xScale.domain();
        const [minYDomain, maxYDomain] = $yScale.domain();

        const _x = accessor(options?.x ?? $xAccessor);
        const _y = accessor(options?.y ?? $yAccessor);
        const _x1 = accessor(options?.x1 ?? $x1Accessor);
        const _y1 = accessor(options?.y1 ?? $y1Accessor);

        // @ts-expect-error
        return function getter(item) {
          if (isScaleBand($yScale)) {
            const y =
              firstValue($yScale(_y(item)) ?? 0) + ($y1Scale ? $y1Scale(_y1(item)) : 0) + insets.top;
            const height = Math.max(
              0,
              $yScale.bandwidth
                ? ($y1Scale ? ($y1Scale.bandwidth?.() ?? 0) : $yScale.bandwidth()) -
                    insets.bottom -
                    insets.top
                : 0
            );

            const xValue = _x(item);

            let left = 0;
            let right = 0;
            if (Array.isArray(xValue)) {
              left = min(xValue);
              right = max(xValue);
            } else if (xValue == null) {
              left = 0;
              right = 0;
            } else if (xValue > 0) {
              left = max([0, minXDomain]);
              right = xValue;
            } else {
              left = xValue;
              right = min([0, maxXDomain]);
            }

            const x = $xScale(left) + insets.left;
            const width = Math.max(0, $xScale(right) - $xScale(left) - insets.left - insets.right);

            return { x, y, width, height };
          } else {
            const x =
              firstValue($xScale(_x(item))) + ($x1Scale ? $x1Scale(_x1(item)) : 0) + insets.left;
            const width = Math.max(
              0,
              $xScale.bandwidth
                ? ($x1Scale ? ($x1Scale.bandwidth?.() ?? 0) : $xScale.bandwidth()) -
                    insets.left -
                    insets.right
                : 0
            );

            const yValue = _y(item);

            let top = 0;
            let bottom = 0;
            if (Array.isArray(yValue)) {
              top = max(yValue);
              bottom = min(yValue);
            } else if (yValue == null) {
              top = 0;
              bottom = 0;
            } else if (yValue > 0) {
              top = yValue;
              bottom = max([0, minYDomain]);
            } else {
              top = min([0, maxYDomain]);
              bottom = yValue;
            }

            const y = $yScale(top) + insets.top;
            const height = $yScale(bottom) - $yScale(top) - insets.bottom - insets.top;

            return { x, y, width, height };
          }
        };
      }
    );
  }

  const { x: xContext, y: yContext, xScale } = chartContext();

  export let bar: Object;

  /**
   * Override `x` from context.  Useful for multiple Bar instances
   */
  export let x: Accessor = $xContext;

  /**
   * Override `y` from context.  Useful for multiple Bar instances
   */
  export let y: Accessor = $yContext;

  /**
   * Override `x1` from context.  Useful for multiple Bar instances
   */
  export let x1: Accessor = undefined;

  /**
   * Override `y1` from context.  Useful for multiple Bar instances
   */
  export let y1: Accessor = undefined;

  export let fill: string | undefined = undefined;
  export let stroke = 'black';
  export let strokeWidth = 0;
  export let radius = 0;

  /** Control which corners are rounded with radius.  Uses <path> instead of <rect> when not set to `all` */
  export let rounded:
    | 'all'
    | 'none'
    | 'edge'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right' = 'all';

  export let insets: Insets | undefined = undefined;

  export let onclick: ((e: MouseEvent) => void) | undefined = undefined;
  export let onpointerenter: ((e: PointerEvent) => void) | undefined = undefined;
  export let onpointermove: ((e: PointerEvent) => void) | undefined = undefined;
  export let onpointerleave: ((e: PointerEvent) => void) | undefined = undefined;

  export let spring: ComponentProps<Rect>['spring'] = undefined;
  export let tweened: ComponentProps<Rect>['tweened'] = undefined;

  $: if (stroke === null || stroke === undefined) stroke = 'black';

  $: getDimensions = createDimensionGetter(chartContext(), {
    x,
    y,
    x1,
    y1,
    insets,
  });
  $: dimensions = $getDimensions(bar) ?? { x: 0, y: 0, width: 0, height: 0 };

  $: isVertical = isScaleBand($xScale);
  $: valueAccessor = accessor(isVertical ? y : x);
  $: value = valueAccessor(bar);
  $: resolvedValue = Array.isArray(value) ? greatestAbs(value) : value;

  // Resolved `rounded="edge"` based on orientation and value
  $: _rounded =
    rounded === 'edge'
      ? isVertical
        ? resolvedValue >= 0
          ? 'top'
          : 'bottom'
        : resolvedValue >= 0
          ? 'right'
          : 'left'
      : rounded;

  $: topLeft = ['all', 'top', 'left', 'top-left'].includes(_rounded);
  $: topRight = ['all', 'top', 'right', 'top-right'].includes(_rounded);
  $: bottomLeft = ['all', 'bottom', 'left', 'bottom-left'].includes(_rounded);
  $: bottomRight = ['all', 'bottom', 'right', 'bottom-right'].includes(_rounded);

  $: width = dimensions.width;
  $: height = dimensions.height;
  $: diameter = 2 * radius;

  $: pathData = `M${dimensions.x + radius},${dimensions.y} h${width - diameter}
      ${topRight ? `a${radius},${radius} 0 0 1 ${radius},${radius}` : `h${radius}v${radius}`}
      v${height - diameter}
      ${bottomRight ? `a${radius},${radius} 0 0 1 ${-radius},${radius}` : `v${radius}h${-radius}`}
      h${diameter - width}
      ${bottomLeft ? `a${radius},${radius} 0 0 1 ${-radius},${-radius}` : `h${-radius}v${-radius}`}
      v${diameter - height}
      ${topLeft ? `a${radius},${radius} 0 0 1 ${radius},${-radius}` : `v${-radius}h${radius}`}
      z`
    .split('\n')
    .join('');

  const renderContext = getRenderContext();
  const canvasContext = getCanvasContext();
</script>

{#if _rounded === 'all' || _rounded === 'none' || radius === 0}
  <Rect
    {fill}
    {spring}
    {tweened}
    {stroke}
    {strokeWidth}
    rx={_rounded === 'none' ? 0 : radius}
    {onclick}
    {onpointerenter}
    {onpointermove}
    {onpointerleave}
    on:touchmove
    {...dimensions}
    {...$$restProps}
  />
{:else}
  <Spline
    {pathData}
    {fill}
    {spring}
    {tweened}
    {stroke}
    {strokeWidth}
    {onclick}
    {onpointerenter}
    {onpointermove}
    {onpointerleave}
    on:touchmove
    {...$$restProps}
  />
{/if}
