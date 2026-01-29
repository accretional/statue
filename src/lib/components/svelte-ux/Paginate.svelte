<!--
This is a Svelte component from Svelte UX:

Demo Site: [svelte-ux.techniq.dev](https://svelte-ux.techniq.dev/)
GitHub Repository: [techniq/svelte-ux](https://github.com/techniq/svelte-ux)

All components in this directory are sourced from the Svelte UX project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { paginationStore } from '@layerstack/svelte-stores';

  type T = $$Generic;

  export let data: T[];
  export let perPage = 10;

  const pagination = paginationStore({ perPage });
  $: pagination.setPerPage(perPage);
  $: pagination.setTotal(data.length);
  $: pageData = $pagination.slice(data);
</script>

<slot {pagination} {pageData} current={$pagination} />
