<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { chartContext } from './ChartContext.svelte';

  const context = chartContext() as any;
  const { xGet, yGet } = context;

  /** Single data point to translate to x/y */
  export let d;

  $: x = $xGet(d);
  $: y = $yGet(d);
</script>

<slot {x} {y} />
