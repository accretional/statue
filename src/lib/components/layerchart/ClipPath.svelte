<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { uniqueId } from '@layerstack/utils';

  /** Unique id for clipPath */
  export let id: string = uniqueId('clipPath-');

  /** Use existing path or shape (by id) for clipPath */
  export let useId: string | undefined = undefined;

  /** Disable clipping (show all) */
  export let disabled: boolean = false;
</script>

<defs>
  <clipPath {id} {...$$restProps}>
    <slot name="clip" {id} />

    {#if useId}
      <use href="#{useId}" />
    {/if}
  </clipPath>
</defs>

{#if $$slots.default}
  {#if disabled}
    <slot />
  {:else}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <g style:clip-path="url(#{id})">
      <slot {id} url="url(#{id})" {useId} />
    </g>
  {/if}
{/if}
