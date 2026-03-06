<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { format as formatUtil, type FormatType } from '@layerstack/utils';
  import { cls } from '@layerstack/tailwind';

  export let value: any = undefined;
  export let format: FormatType | undefined = undefined;
  export let color: string | undefined = undefined;

  export let classes: {
    root?: string;
    color?: string;
  } = {};
</script>

<div
  class={cls(
    'TooltipHeader',
    'font-semibold whitespace-nowrap border-b mb-1 pb-1 flex items-center gap-2',
    classes.root,
    $$props.class
  )}
>
  {#if color}
    <div
      class={cls('color', 'inline-block size-2 rounded-full bg-[var(--color)]', classes.color)}
      style:--color={color}
    ></div>
  {/if}
  <slot>{format ? formatUtil(value, format) : value}</slot>
</div>
