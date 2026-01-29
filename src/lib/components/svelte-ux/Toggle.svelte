<!--
This is a Svelte component from Svelte UX:

Demo Site: [svelte-ux.techniq.dev](https://svelte-ux.techniq.dev/)
GitHub Repository: [techniq/svelte-ux](https://github.com/techniq/svelte-ux)

All components in this directory are sourced from the Svelte UX project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let on = false;

  function toggle() {
    on = !on;
    dispatch('toggle', on);
    if (on) {
      dispatch('toggleOn');
    } else {
      dispatch('toggleOff');
    }
  }
  function toggleOn() {
    on = true;
    dispatch('toggle', on);
    dispatch('toggleOn');
  }
  function toggleOff() {
    on = false;
    dispatch('toggle', on);
    dispatch('toggleOff');
  }
</script>

<slot {on} {toggle} {toggleOn} {toggleOff} />
