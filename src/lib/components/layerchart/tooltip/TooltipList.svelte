<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { cls } from '@layerstack/tailwind';
</script>

<div
  class={cls(
    'TooltipList',
    'grid grid-cols-[1fr_auto] gap-x-2 gap-y-1 items-center',
    $$props.class
  )}
>
  <slot />
</div>
