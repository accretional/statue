<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import type { SVGAttributes } from 'svelte/elements';
  import { fade } from 'svelte/transition';
  import { cubicIn } from 'svelte/easing';
  import type { spring as springStore, tweened as tweenedStore } from 'svelte/motion';

  import { curveLinearClosed } from 'd3-shape';

  import { cls } from '@layerstack/tailwind';
  import type { TransitionParams } from 'svelte-ux'; // TODO: Replace with `@layerstack/svelte-types` or similar
  import type { ScaleBand } from 'd3-scale';

  import { chartContext } from './ChartContext.svelte';

  // Inlined from $lib/utils/scales.js
  interface AnyScale<Domain = any, Range = any, Input = Domain, Output = any> {
    (value: Input): Output;
    bandwidth?: Function;
    ticks?: Function;
    domain(): Domain[];
  }

  function isScaleBand(scale: AnyScale<any, any>): scale is ScaleBand<any> {
    return typeof scale.bandwidth === 'function';
  }

  import Rule from './Rule.svelte';
  import Spline from './Spline.svelte';
  import Circle from './Circle.svelte';

  type TicksConfig = number | any[] | ((scale: AnyScale) => any) | null | undefined;

  const { xScale, yScale, radial } = chartContext();

  /** Draw a x-axis lines */
  export let x: boolean | Pick<SVGAttributes<SVGElement>, 'class' | 'style'> = false;

  /** Draw a y-axis lines */
  export let y: boolean | Pick<SVGAttributes<SVGElement>, 'class' | 'style'> = false;

  /** Control the number of x-axis ticks */
  export let xTicks: TicksConfig = undefined;

  /** Control the number of y-axis ticks */
  export let yTicks: TicksConfig = !isScaleBand($yScale) ? 4 : undefined;

  /** Line alignment when band scale is used (x or y axis) */
  export let bandAlign: 'center' | 'between' = 'center';

  /** Render `y` lines with circles or linear splines */
  export let radialY: 'circle' | 'linear' = 'circle';

  export let spring: boolean | Parameters<typeof springStore>[1] = undefined;
  export let tweened: boolean | Parameters<typeof tweenedStore>[1] = undefined;

  export let transitionIn = tweened
    ? fade
    : () => {
        return {};
      };
  export let transitionInParams: TransitionParams = { easing: cubicIn };

  export let classes: {
    root?: string;
    line?: string;
  } = {};

  function getTickVals(scale: AnyScale, ticks: TicksConfig): any[] {
    return Array.isArray(ticks)
      ? ticks
      : typeof ticks === 'function'
        ? ticks(scale)
        : isScaleBand(scale)
          ? ticks
            ? scale.domain().filter((v: any, i: number) => i % ticks === 0)
            : scale.domain()
          : scale.ticks?.(ticks);
  }

  $: xTickVals = getTickVals($xScale, xTicks);
  $: yTickVals = getTickVals($yScale, yTicks);

  $: xBandOffset = isScaleBand($xScale)
    ? bandAlign === 'between'
      ? -($xScale.padding() * $xScale.step()) / 2 // before
      : $xScale.step() / 2 - ($xScale.padding() * $xScale.step()) / 2 // center
    : 0;

  $: yBandOffset = isScaleBand($yScale)
    ? bandAlign === 'between'
      ? -($yScale.padding() * $yScale.step()) / 2 // before
      : $yScale.step() / 2 - ($yScale.padding() * $yScale.step()) / 2 // center
    : 0;
</script>

<g class={cls('Grid', classes.root, $$props.class)}>
  {#if x}
    {@const splineProps = typeof x === 'object' ? x : null}
    <g in:transitionIn={transitionInParams}>
      {#each xTickVals as x (x)}
        {#if $radial}
          <Spline
            data={yTickVals.map((y) => ({ x, y }))}
            x="x"
            y="y"
            xOffset={xBandOffset}
            curve={curveLinearClosed}
            {tweened}
            {spring}
            {...splineProps}
            class={cls('stroke-surface-content/10', classes.line, splineProps?.class)}
          />
        {:else}
          <Rule
            {x}
            xOffset={xBandOffset}
            {tweened}
            {spring}
            {...splineProps}
            class={cls('stroke-surface-content/10', classes.line, splineProps?.class)}
          />
        {/if}
      {/each}

      <!-- Add extra rule after last band -->
      {#if isScaleBand($xScale) && bandAlign === 'between' && !$radial && xTickVals.length}
        <Rule
          x={xTickVals[xTickVals.length - 1]}
          xOffset={xBandOffset + $xScale.step()}
          {tweened}
          {spring}
          {...splineProps}
          class={cls('stroke-surface-content/10', classes.line, splineProps?.class)}
        />
      {/if}
    </g>
  {/if}

  {#if y}
    {@const splineProps = typeof y === 'object' ? y : null}
    <g in:transitionIn={transitionInParams}>
      {#each yTickVals as y (y)}
        {#if $radial}
          {#if radialY === 'circle'}
            <Circle
              r={$yScale(y)}
              {tweened}
              {spring}
              {...splineProps}
              class={cls('fill-none stroke-surface-content/10', classes.line, splineProps?.class)}
            />
          {:else}
            <Spline
              data={xTickVals.map((x) => ({ x, y }))}
              x="x"
              y="y"
              yOffset={yBandOffset}
              {tweened}
              {spring}
              curve={curveLinearClosed}
              {...splineProps}
              class={cls('stroke-surface-content/10', classes.line, splineProps?.class)}
            />
          {/if}
        {:else}
          <Rule
            {y}
            yOffset={yBandOffset}
            {tweened}
            {spring}
            {...splineProps}
            class={cls('stroke-surface-content/10', classes.line, splineProps?.class)}
          />
        {/if}
      {/each}

      <!-- Add extra rule after last band -->
      {#if isScaleBand($yScale) && bandAlign === 'between' && !$radial && yTickVals.length}
        <Rule
          y={yTickVals[yTickVals.length - 1]}
          yOffset={yBandOffset + $yScale.step()}
          {tweened}
          {spring}
          {...splineProps}
          class={cls('stroke-surface-content/10', classes.line, splineProps?.class)}
        />
      {/if}
    </g>
  {/if}
</g>
