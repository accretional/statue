<!--
This is a Svelte component from Svelte UX:

Demo Site: [svelte-ux.techniq.dev](https://svelte-ux.techniq.dev/)
GitHub Repository: [techniq/svelte-ux](https://github.com/techniq/svelte-ux)

All components in this directory are sourced from the Svelte UX project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { mdiMinus, mdiPlus } from '@mdi/js';
  import { step as stepUtil } from '@layerstack/utils/number';
  import { selectOnFocus } from '@layerstack/svelte-actions';

  import Button from './Button.svelte';
  import TextField from './TextField.svelte';

  function cn(...inputs: any[]): string {
    return inputs
      .flat()
      .filter(Boolean)
      .map(input => {
        if (typeof input === 'string') return input;
        if (typeof input === 'object') {
          return Object.entries(input)
            .filter(([_, value]) => value)
            .map(([key]) => key)
            .join(' ');
        }
        return '';
      })
      .filter(Boolean)
      .join(' ');
  }

  export let value: number = 0;
  export let min: number | undefined = undefined;
  export let max: number | undefined = undefined;
  export let step = 1;
  let className: string | undefined = undefined;
  export { className as class };

  const dispatch = createEventDispatcher();

  $: dispatch('change', { value });
</script>

<TextField
  type="integer"
  bind:value
  {min}
  {max}
  {step}
  align="center"
  class={cn('NumberStepper w-24', className)}
  actions={(node) => [selectOnFocus(node)]}
  {...$$restProps}
>
  <div slot="prepend">
    <Button
      icon={mdiMinus}
      on:click={() => (value = stepUtil(value, -step))}
      size="sm"
      disabled={min != null && value <= min}
    />
  </div>
  <div slot="prefix"><slot name="prefix" /></div>
  <div slot="suffix"><slot name="suffix" /></div>
  <div slot="append">
    <Button
      icon={mdiPlus}
      on:click={() => (value = stepUtil(value, step))}
      size="sm"
      disabled={max != null && value >= max}
    />
  </div>
</TextField>
