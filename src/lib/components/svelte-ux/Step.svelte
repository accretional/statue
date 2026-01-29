<!--
This is a Svelte component from Svelte UX:

Demo Site: [svelte-ux.techniq.dev](https://svelte-ux.techniq.dev/)
GitHub Repository: [techniq/svelte-ux](https://github.com/techniq/svelte-ux)

All components in this directory are sourced from the Svelte UX project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import type { ComponentProps } from 'svelte';

  import Icon from './Icon.svelte';
  import { getSteps } from './Steps.svelte';

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

  /** Override point content (by default uses an incrementing counter) */
  export let point: string | undefined = undefined;

  /** Use icon instead of point content */
  export let icon: ComponentProps<Icon>['data'] = undefined;

  /** If completed, will color content and line leading up to item */
  export let completed = false;

  export let classes: {
    root?: string;
    label?: string;
    line?: string;
    point?: string;
    /** Apply classes to completed item point and line leading up to item */
    completed?: string;
  } = {};

  const stepsContext = getSteps();
  $: vertical = stepsContext?.vertical ?? false;
</script>

<li
  class={cn(
    'Step',
    'group grid place-items-center text-center',
    vertical
      ? 'grid-cols-[40px_1fr] gap-2 min-h-16 justify-items-start'
      : 'grid-rows-[40px_1fr] min-w-16',
    classes.root,
    $$props.class
  )}
>
  <div
    class={cn(
      'group-first:hidden col-start-1 row-start-1 bg-surface-300 text-surface-content top-0',
      vertical ? 'h-full w-2 -mt-[100%] justify-self-center' : 'h-2 w-full -ml-[100%]',
      completed && (classes.completed ?? 'bg-primary'),
      classes.line
    )}
  ></div>

  <span class={cn(classes.label)}>
    <slot />
  </span>

  <div
    class={cn(
      'bg-surface-300 text-surface-content relative col-start-1 row-start-1 grid size-8 place-items-center place-self-center rounded-full [counter-increment:step]',
      point == null && !$$slots.point && icon == null && 'before:content-[counter(step)]',
      completed &&
        (classes.completed ?? 'bg-primary text-primary-content'),
      classes.point
    )}
  >
    <slot name="point">
      {#if icon}
        <Icon data={icon} />
      {:else}
        {point ?? ''}
      {/if}
    </slot>
  </div>
</li>
