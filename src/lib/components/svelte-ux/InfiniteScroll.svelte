<!--
This is a Svelte component from Svelte UX:

Demo Site: [svelte-ux.techniq.dev](https://svelte-ux.techniq.dev/)
GitHub Repository: [techniq/svelte-ux](https://github.com/techniq/svelte-ux)

All components in this directory are sourced from the Svelte UX project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { intersection } from '@layerstack/svelte-actions';

  type T = $$Generic;

  export let items: T[];
  export let perPage = 10;
  export let disabled = false;

  let page = 1;
  $: visibleItems = disabled ? items : items.slice(0, page * perPage);
</script>

<slot {visibleItems} />

{#if !disabled}
  <!-- Make 1px tall as sometimes it is now detected  -->
  <div
    class="sentinel h-px"
    use:intersection
    on:intersecting={(e) => {
      if (e.detail.isIntersecting) {
        page += 1;
      }
    }}
    on:intersecting
  ></div>
{/if}
