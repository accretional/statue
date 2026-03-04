<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { chartContext } from './ChartContext.svelte';
  import RectClipPath from './RectClipPath.svelte';

  const { width, height, padding } = chartContext();

  /** Include padding area (ex. axis) */
  export let full = false;

  /** Disable clipping (show all) */
  export let disabled: boolean = false;
</script>

<RectClipPath
  x={full && $padding.left ? -$padding.left : 0}
  y={full && $padding.top ? -$padding.top : 0}
  width={$width + (full ? ($padding?.left ?? 0) + ($padding?.right ?? 0) : 0)}
  height={$height + (full ? ($padding?.top ?? 0) + ($padding?.bottom ?? 0) : 0)}
  {disabled}
  {...$$restProps}
>
  <slot />
</RectClipPath>
