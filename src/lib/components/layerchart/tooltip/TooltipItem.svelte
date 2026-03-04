<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { format as formatUtil, type FormatType } from '@layerstack/utils';
  import { cls } from '@layerstack/tailwind';

  export let label: any;
  /** Value to be formatted and displayed.  Can also be passed as default slot */
  export let value: any = undefined;
  export let format: FormatType | undefined = undefined;
  export let valueAlign: 'left' | 'right' | 'center' = 'left';
  export let color: string | undefined = undefined;

  export let onclick: ((e: MouseEvent) => void) | undefined = undefined;
  export let onpointerenter: ((e: PointerEvent) => void) | undefined = undefined;
  export let onpointerleave: ((e: PointerEvent) => void) | undefined = undefined;

  export let classes: {
    root?: string;
    label?: string;
    value?: string;
    color?: string;
  } = {};
</script>

<div
  class={cls('contents', classes.root, $$props.class)}
  on:click={onclick}
  on:pointerenter={onpointerenter}
  on:pointerleave={onpointerleave}
  {...$$restProps}
>
  <div class={cls('label', 'flex items-center gap-2 whitespace-nowrap', classes.label)}>
    {#if color}
      <div
        class={cls('color', 'inline-block size-2 rounded-full bg-[var(--color)]', classes.color)}
        style:--color={color}
      ></div>
    {/if}
    <slot name="label">{label}</slot>
  </div>

  <div
    class={cls(
      'value',
      'tabular-nums',
      {
        'text-right': valueAlign === 'right',
        'text-center': valueAlign === 'center',
      },
      classes.value,
      $$props.class
    )}
  >
    <slot>{format ? formatUtil(value, format) : value}</slot>
  </div>
</div>
