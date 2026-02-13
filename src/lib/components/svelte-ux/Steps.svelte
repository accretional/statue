<!--
This is a Svelte component from Svelte UX:

Demo Site: [svelte-ux.techniq.dev](https://svelte-ux.techniq.dev/)
GitHub Repository: [techniq/svelte-ux](https://github.com/techniq/svelte-ux)

All components in this directory are sourced from the Svelte UX project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts" context="module">
  import { type ComponentProps, setContext, getContext } from 'svelte';

  type StepsContext = {
    vertical: boolean;
  };

  const stepsKey = Symbol();

  export function setSteps(value: StepsContext | undefined) {
    setContext(stepsKey, value);
  }

  export function getSteps() {
    return getContext<StepsContext | undefined>(stepsKey);
  }
</script>

<script lang="ts">
  import Step from './Step.svelte';
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

  type StepData = {
    label: string;
    content?: string;
    icon?: ComponentProps<Icon>['data'];
    completed?: boolean;
  };

  export let data: StepData[] = [];

  /** Align vertically (default: horizontal) */
  export let vertical: boolean = false;

  export let classes: {
    root?: string;
    item?: ComponentProps<Step>['classes'];
  } = {};

  setSteps({
    vertical,
  });
</script>

<ul
  class={cn(
    'Steps',
    'inline-grid grid-flow-col overflow-hidden overflow-x-auto auto-cols-fr [counter-reset:step]',
    vertical ? 'grid-flow-row' : 'grid-flow-col',
    classes.root,
    $$props.class
  )}
>
  <slot {data}>
    {#each data as item}
      <Step classes={classes.item} {...item}>
        {item.label}
      </Step>
    {/each}
  </slot>
</ul>
