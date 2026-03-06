<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { geoContext } from './GeoContext.svelte';
  import type { GeoProjection, GeoStreamWrapper } from 'd3-geo';

  // Inlined from $lib/utils/geo.js
  function isVisible(projection: GeoProjection | GeoStreamWrapper) {
    let visible;
    // @ts-expect-error
    const stream = projection.stream({
      point() {
        visible = true;
      },
    });
    return ([x, y]: [number, number]) => ((visible = false), stream.point(x, y), visible);
  }

  /** Latitude */
  export let lat: number;
  /** Longitude */
  export let long: number;

  const geo = geoContext();
</script>

{#if isVisible($geo)([long, lat])}
  <slot />
{/if}
