<!--
This is a Svelte component from Svelte UX:

Demo Site: [svelte-ux.techniq.dev](https://svelte-ux.techniq.dev/)
GitHub Repository: [techniq/svelte-ux](https://github.com/techniq/svelte-ux)

All components in this directory are sourced from the Svelte UX project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts" generics="TItem">
  import { mdiChevronRight } from '@mdi/js';

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

  export let items: TItem[] = [];
  export let divider: string | undefined = undefined;
  export let inline = false;
  let className: string | undefined = undefined;
  export { className as class };

  $: displayItems = items?.filter((x) => x != null) ?? [];
</script>

<div
  {...$$restProps}
  class={cn(
    'Breadcrumb',
    inline ? 'inline-flex' : 'flex',
    'items-center justify-start flex-wrap',
    className
  )}
>
  {#each displayItems as item, index}
    <slot name="item" {item}>
      <div class="item">{item}</div>
    </slot>

    {#if index < displayItems.length - 1}
      <slot name="divider">
        {#if divider}
          <div class="divider opacity-25">{divider}</div>
        {:else}
          <Icon data={mdiChevronRight} class="divider opacity-25" />
        {/if}
      </slot>
    {/if}
  {/each}
</div>
