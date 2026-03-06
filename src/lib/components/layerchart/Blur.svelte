<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { uniqueId } from '@layerstack/utils';

  export let id: string = uniqueId('blur-');
  export let stdDeviation = 5;
</script>

<defs>
  <filter {id}>
    <feGaussianBlur in="SourceGraphic" {stdDeviation} />
  </filter>
</defs>

{#if $$slots.default}
  <g filter="url(#{id})">
    <slot {id} url="url(#{id})" />
  </g>
{/if}
