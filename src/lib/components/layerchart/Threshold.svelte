<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import type { CurveFactory } from 'd3-shape';
  import { min } from 'd3-array';

  import { chartContext } from './ChartContext.svelte';
  import Area from './Area.svelte';
  import ClipPath from './ClipPath.svelte';

  const { y, yDomain } = chartContext();

  export let curve: CurveFactory | undefined = undefined;
  export let defined: ComponentProps<Area>['defined'] | undefined = undefined;
</script>

<!-- Recreate on curve change as otherwise is 1 state change behind for some reason -->
{#key curve}
  <ClipPath>
    <svelte:fragment slot="clip">
      <Area y0={(d) => $y(d)[0]} y1={(d) => min($yDomain)} {curve} {defined} />
    </svelte:fragment>

    <slot name="above" {curve} {defined} />
  </ClipPath>

  <ClipPath>
    <svelte:fragment slot="clip">
      <Area y0={(d) => min($yDomain)} y1={(d) => $y(d)[1]} {curve} {defined} />
    </svelte:fragment>

    <slot name="below" {curve} {defined} />
  </ClipPath>

  <slot {curve} {defined} />
{/key}
