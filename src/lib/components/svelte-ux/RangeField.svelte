<!--
This is a Svelte component from Svelte UX:

Demo Site: [svelte-ux.techniq.dev](https://svelte-ux.techniq.dev/)
GitHub Repository: [techniq/svelte-ux](https://github.com/techniq/svelte-ux)

All components in this directory are sourced from the Svelte UX project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';

  import Field from './Field.svelte';
  import Button from './Button.svelte';

  type LabelPlacement = 'inset' | 'float' | 'top' | 'left';

  function formatUtil(val: number, format: string) {
    return val.toLocaleString();
  }

  export let value = 0;
  export let min = 0;
  export let max = 100;
  export let step = 1;
  export let format: string = 'none';

  const dispatch = createEventDispatcher<{ change: { value: number } }>();
  $: dispatch('change', { value });
</script>

<Field let:id classes={{ input: 'my-1' }} {...$$restProps}>
  <span slot="prepend">
    <Button
      icon={mdiChevronLeft}
      on:click={() => (value -= value > min ? step : 0)}
      class="mr-2"
      size="sm"
    />
  </span>

  <input type="range" bind:value {min} {max} {step} {id} class="h-6 w-full" />

  <!-- Stack on top to account for min/max value width -->
  <span class="ml-2 text-sm text-surface-content/50 tabular-nums text-right inline-grid">
    <span class="col-span-full row-span-full invisible">{formatUtil(min, format)}</span>
    <span class="col-span-full row-span-full">{formatUtil(value, format)}</span>
    <span class="col-span-full row-span-full invisible">{formatUtil(max, format)}</span>
  </span>

  <span slot="append">
    <Button
      icon={mdiChevronRight}
      on:click={() => (value += value < max ? step : 0)}
      class="ml-2"
      size="sm"
    />
  </span>
</Field>
