<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts" context="module">
  export type Point = { x: number; y: number; r: number; xValue: any; yValue: any; data: any };
</script>

<script lang="ts">
  import { type ComponentProps } from 'svelte';
  import { extent } from 'd3-array';
  import { pointRadial } from 'd3-shape';
  import { notNull } from '@layerstack/utils';

  import { chartContext } from './ChartContext.svelte';
  import Circle from './Circle.svelte';
  import Link from './Link.svelte';
  import { get } from 'lodash-es';
  import type { ScaleBand } from 'd3-scale';

  // Inlined from ../utils/scales.js
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

  const context = chartContext() as any;
  const {
    data: contextData,
    x: contextX,
    xScale,
    xGet,
    y: contextY,
    yScale,
    yGet,
    cGet,
    rGet,
    config,
    radial,
  } = context;

  type Offset = number | ((value: number, context: any) => number) | undefined;

  /** Override data instead of using context */
  export let data: any = undefined;

  /** Override `x` accessor from Chart context */
  export let x: Accessor = undefined;
  /** Override `y` accessor from Chart context */
  export let y: Accessor = undefined;

  export let r = 5;
  export let offsetX: Offset = undefined;
  export let offsetY: Offset = undefined;

  /** Enable showing links between related points (array x/y accessors) */
  export let links: boolean | Partial<ComponentProps<Link>> = false;

  export let fill: string | undefined = undefined;
  export let fillOpacity: number | undefined = undefined;
  export let stroke: string | undefined = undefined;
  export let strokeWidth: number | undefined = undefined;

  let className: string | undefined = undefined;
  export { className as class };

  function getOffset(value: any, offset: Offset, scale: AnyScale) {
    if (typeof offset === 'function') {
      return offset(value, context);
    } else if (offset != null) {
      return offset;
    } else if (isScaleBand(scale) && !$radial) {
      return scale.bandwidth() / 2;
    } else {
      return 0;
    }
  }

  $: xAccessor = x ? accessor(x) : $contextX;
  $: yAccessor = y ? accessor(y) : $contextY;

  $: pointsData = data ?? $contextData;

  $: points = pointsData
    .flatMap((d: any) => {
      const xValue = xAccessor(d);
      const yValue = yAccessor(d);

      if (Array.isArray(xValue)) {
        /*
				x={["prop1" ,"prop2"]}
				y="prop3"
			*/
        return xValue.filter(notNull).map((xValue: number) => {
          return {
            x: $xScale(xValue) + getOffset($xScale(xValue), offsetX, $xScale),
            y: $yScale(yValue) + getOffset($yScale(yValue), offsetY, $yScale),
            r: $config.r ? $rGet(d) : r,
            xValue,
            yValue,
            data: d,
          };
        });
      } else if (Array.isArray(yValue)) {
        /*
				x="prop1"
				y={["prop2" ,"prop3"]}
			*/
        return yValue.filter(notNull).map((yValue: number) => {
          return {
            x: $xScale(xValue) + getOffset($xScale(xValue), offsetX, $xScale),
            y: $yScale(yValue) + getOffset($yScale(yValue), offsetY, $yScale),
            r: $config.r ? $rGet(d) : r,
            xValue,
            yValue,
            data: d,
          };
        });
      } else if (xValue != null && yValue != null) {
        /*
				x="prop1"
				y="prop2"
			*/
        return {
          x: $xScale(xValue) + getOffset($xScale(xValue), offsetX, $xScale),
          y: $yScale(yValue) + getOffset($yScale(yValue), offsetY, $yScale),
          r: $config.r ? $rGet(d) : r,
          xValue,
          yValue,
          data: d,
        };
      }
    })
    .filter((p: Point) => p) as Point[];

  $: _links = pointsData.flatMap((d: any) => {
    const xValue = xAccessor(d);
    const yValue = yAccessor(d);

    if (Array.isArray(xValue)) {
      /*
				x={["prop1" ,"prop2"]}
				y="prop3"
			*/
      const [xMin, xMax] = extent($xGet(d)) as unknown as [number, number];
      const y = $yGet(d) + getOffset($yGet(d), offsetY, $yScale);
      return {
        source: {
          x: xMin + getOffset(xMin, offsetX, $xScale) + ($config.r ? $rGet(d) : r),
          y,
        },
        target: {
          x: xMax + getOffset(xMax, offsetX, $xScale) - ($config.r ? $rGet(d) : r),
          y: y,
        },
        data: d,
      };
    } else if (Array.isArray(yValue)) {
      /*
				x="prop1"
				y={["prop2" ,"prop3"]}
			*/
      const x = $xGet(d) + getOffset($xGet(d), offsetX, $xScale);
      const [yMin, yMax] = extent($yGet(d)) as unknown as [number, number];
      return {
        source: {
          x: x,
          y: yMin + getOffset(yMin, offsetY, $yScale),
        },
        target: {
          x: x,
          y: yMax + getOffset(yMax, offsetY, $yScale),
        },
        data: d,
      };
    }
  });
</script>

<slot {points}>
  {#if links}
    {#each _links as link}
      <Link
        data={link}
        stroke={fill ?? ($config.c ? $cGet(link.data) : null)}
        {...typeof links === 'object' ? links : null}
      />
    {/each}
  {/if}

  {#each points as point}
    {@const radialPoint = pointRadial(point.x, point.y)}
    <Circle
      cx={$radial ? radialPoint[0] : point.x}
      cy={$radial ? radialPoint[1] : point.y}
      r={point.r}
      fill={fill ?? ($config.c ? $cGet(point.data) : null)}
      {fillOpacity}
      {stroke}
      {strokeWidth}
      class={className}
      {...$$restProps}
    />
  {/each}
</slot>
