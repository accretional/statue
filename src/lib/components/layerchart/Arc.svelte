<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { tick, type ComponentProps } from 'svelte';
  import type { spring as springStore, tweened as tweenedStore } from 'svelte/motion';
  import { arc as d3arc } from 'd3-shape';
  import { scaleLinear } from 'd3-scale';
  import { writable } from 'svelte/store';
  import { spring as springFn, tweened as tweenedFn } from 'svelte/motion';

  import { chartContext } from './ChartContext.svelte';
  import type { TooltipContextValue } from './tooltip/TooltipContext.svelte';
  import Spline from './Spline.svelte';

  // Inlined from $lib/utils/math.js
  function degreesToRadians(degrees: number) {
    return (degrees * Math.PI) / 180;
  }

  // Inlined from $lib/stores/motionStore.js
  type SpringOptions = Parameters<typeof spring<any>>[1];
  type TweenedOptions = Parameters<typeof tweened<any>>[1];
  type MotionOptions = {
    spring?: boolean | SpringOptions;
    tweened?: boolean | TweenedOptions;
  };

  function motionStore<T = any>(value: T, options: MotionOptions) {
    if (options.spring) {
      return springFn<T>(value, options.spring === true ? undefined : options.spring);
    } else if (options.tweened) {
      return tweenedFn<T>(value, options.tweened === true ? undefined : options.tweened);
    } else {
      return writable<T>(value);
    }
  }

  export let spring: boolean | Parameters<typeof springStore>[1] = undefined;
  export let tweened: boolean | Parameters<typeof tweenedStore>[1] = undefined;

  export let value = 0;
  export let initialValue = value;
  let tweened_value = motionStore(initialValue, { spring, tweened });

  $: tick().then(() => {
    tweened_value.set(value);
  });

  export let domain = [0, 100];

  /**
   * Range [min,max] in degrees.  See also startAngle/endAngle
   */
  export let range = [0, 360]; // degrees

  /**
   * Start angle in radians
   */
  export let startAngle: number | undefined = undefined;

  /**
   * End angle in radians
   */
  export let endAngle: number | undefined = undefined;

  /**
   * Define innerRadius. Defaults to yRange min
   *   • value >= 1: discrete value
   *   • value < 1: percent of `outerRadius`
   *   • value < 0: offset of `outerRadius`
   */
  export let innerRadius: number | undefined = undefined;

  /**
   * Define outerRadius. Defaults to smallest width (xRange) or height (yRange) dimension (/2)
   *   • value >= 1: discrete value
   *   • value < 1: percent of chart width or height (smallest) / 2
   *   • value < 0: offset of chart width or height (smallest) / 2
   */
  export let outerRadius: number | undefined = undefined;

  export let cornerRadius = 0;
  export let padAngle = 0;
  // export let padRadius = 0;

  export let fill: string | undefined = undefined;
  export let fillOpacity: number | undefined = undefined;
  export let stroke: string | undefined = 'none';
  export let strokeWidth: number | undefined = undefined;

  let className: string | undefined = undefined;
  export { className as class };

  export let track: boolean | Partial<ComponentProps<Spline>> = false;

  export let onclick: ((e: MouseEvent) => void) | undefined = undefined;
  export let onpointerenter: ((e: PointerEvent) => void) | undefined = undefined;
  export let onpointermove: ((e: PointerEvent) => void) | undefined = undefined;
  export let onpointerleave: ((e: PointerEvent) => void) | undefined = undefined;

  const { xRange, yRange } = chartContext();

  $: scale = scaleLinear().domain(domain).range(range);

  function getOuterRadius(outerRadius: number | undefined, chartRadius: number) {
    if (!outerRadius) {
      return chartRadius;
    } else if (outerRadius > 1) {
      // discrete value
      return outerRadius;
    } else if (outerRadius > 0) {
      // percent of `chartRadius`
      return chartRadius * outerRadius;
    } else if (outerRadius < 0) {
      // offset of `chartRadius`
      return chartRadius + outerRadius;
    } else {
      // 0
      return outerRadius;
    }
  }

  $: _outerRadius = getOuterRadius(outerRadius, (Math.min($xRange[1], $yRange[0]) ?? 0) / 2);

  function getInnerRadius(innerRadius: number | undefined, outerRadius: number) {
    if (innerRadius == null) {
      return Math.min(...$yRange);
    } else if (innerRadius > 1) {
      // discrete value
      return innerRadius;
    } else if (innerRadius > 0) {
      // percent of `outerRadius`
      return outerRadius * innerRadius;
    } else if (innerRadius < 0) {
      // offset of `outerRadius`
      return outerRadius + innerRadius;
    } else {
      // 0
      return innerRadius;
    }
  }
  $: _innerRadius = getInnerRadius(innerRadius, _outerRadius);

  $: arc = d3arc()
    .innerRadius(_innerRadius)
    .outerRadius(_outerRadius)
    .startAngle(startAngle ?? degreesToRadians(range[0]))
    .endAngle(endAngle ?? degreesToRadians(scale($tweened_value)))
    .cornerRadius(cornerRadius)
    .padAngle(padAngle) as Function;
  // .padRadius(padRadius);

  $: trackArc = d3arc()
    .innerRadius(_innerRadius)
    .outerRadius(_outerRadius)
    .startAngle(startAngle ?? degreesToRadians(range[0]))
    .endAngle(endAngle ?? degreesToRadians(range[1]))
    .cornerRadius(cornerRadius)
    .padAngle(padAngle) as Function;
  // .padRadius(padRadius);

  // @ts-expect-error
  $: trackArcCentroid = trackArc.centroid();
  // $: console.log(trackArcCentroid)

  let trackArcEl: SVGPathElement | undefined = undefined;
  $: boundingBox = trackArcEl ? trackArcEl.getBBox() : ({} as DOMRect);

  // $: labelArcCenterOffset = {
  //   x: outerRadius - boundingBox.width / 2,
  //   // x: 0,
  //   y: (outerRadius - boundingBox.height / 2) * -1,
  // };
  // $: console.log(labelArcCenterOffset)

  // $: labelArcBottomOffset = {
  //   // x: outerRadius - boundingBox.width / 2,
  //   x: outerRadius - boundingBox.width / 2,
  //   // x: 0,
  //   // y: (outerRadius - boundingBox.height) * -1
  //   y: (outerRadius - boundingBox.height) * -1,
  // };
  // $: console.log(labelArcBottomOffset)

  /**
   * Offset arc from center
   */
  export let offset = 0;
  $: angle = ((startAngle ?? 0) + (endAngle ?? 0)) / 2;
  $: xOffset = Math.sin(angle) * offset;
  $: yOffset = -Math.cos(angle) * offset;

  /**
   * Tooltip context to setup pointer events to show tooltip for related data.  Must set `data` prop as well
   */
  export let tooltip: TooltipContextValue | undefined = undefined;

  /**
   * Data to set when showing tooltip
   */
  export let data: any = undefined;

  function onPointerEnter(e: PointerEvent) {
    onpointerenter?.(e);
    tooltip?.show(e, data);
  }
  function onPointerMove(e: PointerEvent) {
    onpointermove?.(e);
    tooltip?.show(e, data);
  }
  function onPointerLeave(e: PointerEvent) {
    onpointerleave?.(e);
    tooltip?.hide();
  }
</script>

{#if track}
  <Spline
    pathData={trackArc()}
    class="track"
    stroke="none"
    bind:pathEl={trackArcEl}
    {...typeof track === 'object' ? track : null}
  />
{/if}

<Spline
  pathData={arc()}
  transform="translate({xOffset}, {yOffset})"
  {fill}
  fill-opacity={fillOpacity}
  {stroke}
  stroke-width={strokeWidth}
  class={className}
  {...$$restProps}
  {onclick}
  onpointerenter={onPointerEnter}
  onpointermove={onPointerMove}
  onpointerleave={onPointerLeave}
  ontouchmove={(e) => {
    if (tooltip) {
      // Prevent touch to not interfer with pointer when using tooltip
      e.preventDefault();
    }
  }}
  on:touchmove
/>

<slot value={$tweened_value} centroid={trackArcCentroid} {boundingBox} />
