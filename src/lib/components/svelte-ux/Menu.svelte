<!--
This is a Svelte component from Svelte UX:

Demo Site: [svelte-ux.techniq.dev](https://svelte-ux.techniq.dev/)
GitHub Repository: [techniq/svelte-ux](https://github.com/techniq/svelte-ux)

All components in this directory are sourced from the Svelte UX project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { createEventDispatcher, type ComponentProps } from 'svelte';
  import { slide } from 'svelte/transition';
  import type { TransitionConfig } from 'svelte/transition';
  import type { Placement } from '@floating-ui/dom';
  import type {
    FlyParams,
    SlideParams,
    BlurParams,
    FadeParams,
    ScaleParams,
  } from 'svelte/transition';

  import { focusMove } from '@layerstack/svelte-actions/focus';

  import Popover from './Popover.svelte';

  type TransitionParams = BlurParams | FadeParams | FlyParams | SlideParams | ScaleParams;

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

  const dispatch = createEventDispatcher();

  export let open = false;
  export let offset = 4;

  export let matchWidth: boolean = false;
  export let placement: Placement = matchWidth ? 'bottom-start' : 'bottom';
  export let autoPlacement = false;
  export let resize: ComponentProps<Popover>['resize'] = false;
  export let disableTransition = false;
  export let transition:
    | ((node: HTMLElement, params: TransitionParams) => TransitionConfig)
    | undefined = undefined;
  export let transitionParams: TransitionParams | undefined = undefined;
  export let explicitClose = false;
  export let moveFocus = true;

  export let classes: {
    root?: string;
    menu?: string;
  } = {};

  $: resolvedTransition =
    transition ??
    (disableTransition
      ? (node: HTMLElement, params: TransitionParams) => ({}) as TransitionConfig
      : slide);
  $: resolvedTransitionParams = transitionParams ?? {};

  export let menuItemsEl: HTMLMenuElement | undefined = undefined;

  function onClick(e: MouseEvent) {
    try {
      if (e.target === menuItemsEl) {
        // Clicked within menu but outside of any items
      } else if (!explicitClose) {
        open = false;
        dispatch('close', 'item');
      }
    } catch (err) {
      console.error(err);
    }
  }
</script>

<Popover
  {placement}
  {autoPlacement}
  {offset}
  {matchWidth}
  {resize}
  {open}
  class={cn(
    'Menu',
    'bg-surface-100 rounded shadow border overflow-auto',
    classes.root,
    $$props.class
  )}
  style={$$props.style}
  on:close
  let:close
>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <menu
    class={cn('menu-items outline-none max-h-screen', classes.menu)}
    bind:this={menuItemsEl}
    on:click={onClick}
    on:mouseup={(e) => {
      // Do not allow event to reach Popover's on:mouseup (clickOutside)
      e.stopPropagation();
    }}
    transition:resolvedTransition={resolvedTransitionParams}
    use:focusMove={{ disabled: !moveFocus }}
  >
    <slot {close} />
  </menu>
</Popover>
