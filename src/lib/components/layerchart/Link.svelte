<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import type { tweened as tweenedStore } from 'svelte/motion';
  import { link as d3Link, curveBumpX, curveBumpY } from 'd3-shape';
  import { interpolatePath } from 'd3-interpolate-path';
  import { uniqueId } from '@layerstack/utils';
  import { writable } from 'svelte/store';
  import { spring as springFn, tweened as tweenedFn } from 'svelte/motion';

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

  import Marker from './Marker.svelte';
  import Spline from './Spline.svelte';

  // Override what is used from context
  export let data: any = undefined; // TODO: Update Type

  /**
   * Update source and target accessors to be compatible with d3-sankey.  see: https://github.com/d3/d3-sankey#sankeyLinkHorizontal
   */
  export let sankey = false;
  export let source = sankey ? (d: any) => [d.source.x1, d.y0] : (d: any) => d.source;
  export let target = sankey ? (d: any) => [d.target.x0, d.y1] : (d: any) => d.target;

  /** Convenient property to swap x/y accessor logic */
  export let orientation: 'vertical' | 'horizontal' = sankey ? 'horizontal' : 'vertical';
  export let x = (d: any) => (sankey ? d[0] : orientation === 'horizontal' ? d.y : d.x);
  export let y = (d: any) => (sankey ? d[1] : orientation === 'horizontal' ? d.x : d.y);
  export let curve = orientation === 'horizontal' ? curveBumpX : curveBumpY;

  export let onclick: ((e: MouseEvent) => void) | undefined = undefined;
  export let onpointerenter: ((e: PointerEvent) => void) | undefined = undefined;
  export let onpointermove: ((e: PointerEvent) => void) | undefined = undefined;
  export let onpointerleave: ((e: PointerEvent) => void) | undefined = undefined;
  export let onpointerover: ((e: PointerEvent) => void) | undefined = undefined;
  export let onpointerout: ((e: PointerEvent) => void) | undefined = undefined;

  /** Marker to attach to start, mid, and end points of path */
  export let marker: ComponentProps<Marker>['type'] | ComponentProps<Marker> | undefined =
    undefined;
  /** Marker to attach to start point of path */
  export let markerStart: ComponentProps<Marker>['type'] | ComponentProps<Marker> | undefined =
    marker;
  /** Marker to attach to all mid points of path */
  export let markerMid: ComponentProps<Marker>['type'] | ComponentProps<Marker> | undefined =
    marker;
  /** Marker to attach to end point of path */
  export let markerEnd: ComponentProps<Marker>['type'] | ComponentProps<Marker> | undefined =
    marker;

  $: markerStartId = markerStart || $$slots['markerStart'] ? uniqueId('marker-') : '';
  $: markerMidId = markerMid || $$slots['markerMid'] ? uniqueId('marker-') : '';
  $: markerEndId = markerEnd || $$slots['markerEnd'] ? uniqueId('marker-') : '';

  export let tweened: boolean | Parameters<typeof tweenedStore>[1] = undefined;
  const tweenedOptions = tweened
    ? { interpolate: interpolatePath, ...(typeof tweened === 'object' ? tweened : null) }
    : false;
  $: tweened_d = motionStore('', { tweened: tweenedOptions });

  $: {
    orientation; // subscribe to orientation changes to update link
    const link = d3Link(curve).source(source).target(target).x(x).y(y);
    const d = link(data) ?? '';
    tweened_d.set(d);
  }
</script>

<Spline
  class="path-link"
  pathData={$tweened_d}
  fill="none"
  marker-start={markerStartId ? `url(#${markerStartId})` : undefined}
  marker-mid={markerMidId ? `url(#${markerMidId})` : undefined}
  marker-end={markerEndId ? `url(#${markerEndId})` : undefined}
  {onclick}
  {onpointerenter}
  {onpointermove}
  {onpointerleave}
  {onpointerover}
  {onpointerout}
  {...$$restProps}
/>

<slot name="markerStart" id={markerStartId}>
  {#if markerStart}
    <Marker
      id={markerStartId}
      type={typeof markerStart === 'string' ? markerStart : undefined}
      {...typeof markerStart === 'object' ? markerStart : null}
    />
  {/if}
</slot>

<slot name="markerMid" id={markerMidId}>
  <Marker
    id={markerMidId}
    type={typeof markerMid === 'string' ? markerMid : undefined}
    {...typeof markerMid === 'object' ? markerMid : null}
  />
</slot>

<slot name="markerEnd" id={markerEndId}>
  <Marker
    id={markerEndId}
    type={typeof markerEnd === 'string' ? markerEnd : undefined}
    {...typeof markerEnd === 'object' ? markerEnd : null}
  />
</slot>
