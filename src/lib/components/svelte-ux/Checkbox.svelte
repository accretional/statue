<!--
This is a Svelte component from Svelte UX:

Demo Site: [svelte-ux.techniq.dev](https://svelte-ux.techniq.dev/)
GitHub Repository: [techniq/svelte-ux](https://github.com/techniq/svelte-ux)

All components in this directory are sourced from the Svelte UX project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { mdiCheck, mdiMinus } from '@mdi/js';
  import { uniqueId } from '@layerstack/utils';

  import Icon from './Icon.svelte';

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

  export let id = uniqueId('checkbox-');
  export let name = '';
  export let value: any = undefined;
  export let checked = false;
  export let group: any[] | null = null;
  export let indeterminate = false;
  export let required = false;
  export let disabled = false;
  export let fullWidth = false;
  export let size: 'xs' | 'sm' | 'md' | 'lg' = 'sm';
  export let circle = false;

  export let classes: {
    root?: string;
    input?: string;
    checkbox?: string;
    label?: string;
    icon?: string;
  } = {};

  // Update when group changes.  Separate function to break reactivity loop
  $: if (group !== null) {
    groupCheck();
  }
  function groupCheck() {
    checked = group?.includes(value) ?? false;
  }

  // Update group when checkbox changes
  function onChange() {
    if (group !== null) {
      let inGroup = group.includes(value);
      if (!inGroup) {
        // Add to group
        group = [...group, value];
      } else {
        // Remove from group
        group = group.filter((v) => v != value);
      }
    }
  }
</script>

<div
  class={cn(
    'Checkbox',
    fullWidth ? 'flex' : 'inline-flex',
    'items-center',
    classes.root,
    $$props.class
  )}
>
  <input
    {id}
    {name}
    type="checkbox"
    bind:checked
    on:change={onChange}
    on:change
    {value}
    class={cn('input', 'peer appearance-none absolute', classes.input)}
    {required}
    {disabled}
  />
  <label
    for={id}
    class={cn(
      'checkbox',
      'inline-grid place-items-center border-2',
      circle ? 'rounded-full' : 'rounded',
      'peer-disabled:opacity-50 transition-shadow duration-300',
      !disabled &&
        'peer-hover:border-primary peer-focus-visible:border-primary peer-focus-visible:ring-2 ring-primary/60 ring-offset-1',
      !checked && !disabled && 'peer-hover:bg-primary/10',
      checked
        ? disabled
          ? 'bg-surface-content border-surface-content'
          : 'bg-primary border-primary'
        : 'border-surface-content/50',
      classes.checkbox
    )}
  >
    <Icon
      path={indeterminate ? mdiMinus : mdiCheck}
      class={cn(
        'icon',
        'pointer-events-none text-primary-content transition-transform',
        checked ? 'scale-100' : 'scale-0',
        classes.icon
      )}
      size={{
        xs: '.75rem', // 12px
        sm: '.875rem', // 14px
        md: '1rem', // 16px
        lg: '1.125rem', // 18px
      }[size]}
    />
  </label>

  {#if $$slots.default}
    <label
      for={id}
      class={cn(
        'label',
        'flex-1',
        'pl-1 peer-disabled:opacity-50',
        {
          xs: 'text-xs', // 12px
          sm: 'text-sm', // 14px
          md: 'text-md', // 16px
          lg: 'text-lg', // 18px
        }[size],
        classes.label
      )}
    >
      <slot />
    </label>
  {/if}
</div>
