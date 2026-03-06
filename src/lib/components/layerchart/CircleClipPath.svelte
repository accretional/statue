<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import type { spring as springStore, tweened as tweenedStore } from 'svelte/motion';

  import { uniqueId } from '@layerstack/utils';

  import ClipPath from './ClipPath.svelte';
  import Circle from './Circle.svelte';

  /** Unique id for clipPath */
  export let id: string = uniqueId('clipPath-');

  export let cx: number = 0;
  export let cy: number = 0;
  export let r: number;
  export let spring: boolean | Parameters<typeof springStore>[1] = undefined;
  export let tweened: boolean | Parameters<typeof tweenedStore>[1] = undefined;

  /** Disable clipping (show all) */
  export let disabled: boolean = false;
</script>

<ClipPath {id} {disabled} let:url>
  <Circle slot="clip" {cx} {cy} {r} {spring} {tweened} {...$$restProps} />
  <slot {id} {url} />
</ClipPath>
