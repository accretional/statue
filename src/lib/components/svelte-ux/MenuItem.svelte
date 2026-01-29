<!--
This is a Svelte component from Svelte UX:

Demo Site: [svelte-ux.techniq.dev](https://svelte-ux.techniq.dev/)
GitHub Repository: [techniq/svelte-ux](https://github.com/techniq/svelte-ux)

All components in this directory are sourced from the Svelte UX project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import Button from './Button.svelte';
  import {
    scrollIntoView as scrollIntoViewAction,
    type ScrollIntoViewOptions,
  } from '@layerstack/svelte-actions';

  import { setButtonGroup } from './ButtonGroup.svelte';

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

  type ButtonProps = ComponentProps<Button>;

  export let icon: ButtonProps['icon'] = undefined;
  export let scrollIntoView: ScrollIntoViewOptions | boolean = false;
  export let disabled = false;
  export let selected = false;

  export let classes: ButtonProps['classes'] & { selected?: string } = {
    root: 'text-sm gap-3',
    icon: 'text-surface-content/50',
    selected: 'font-semibold [:not(.group:hover)>&]:bg-surface-content/5',
  };

  let scrollOptions: ScrollIntoViewOptions;
  $: scrollOptions =
    typeof scrollIntoView === 'boolean'
      ? ({ condition: scrollIntoView } as ScrollIntoViewOptions)
      : scrollIntoView;

  // Clear ButtonGroup if set
  setButtonGroup(undefined);

  // Needs variable to restore reactivity.
  $: actions = (node: HTMLElement) => [scrollIntoViewAction(node, scrollOptions)];
</script>

<Button
  variant="none"
  {icon}
  {classes}
  fullWidth
  {actions}
  {disabled}
  {...$$restProps}
  class={cn(
    'MenuItem',
    'text-left items-center p-2 hover:bg-surface-content/5 rounded duration-75',
    selected && classes?.selected,
    classes?.root,
    $$props.class
  )}
  on:click
  on:mouseover
  on:mouseout
>
  <slot />
</Button>
