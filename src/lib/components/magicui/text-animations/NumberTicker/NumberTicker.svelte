<script lang="ts">
  import { cubicOut } from "svelte/easing";
  import { onMount } from "svelte";
  import { spring, tweened } from "svelte/motion";
  export let value = 100;
  export let initial = 0;
  export let duration = 6000;
  let num = tweened(initial, {
    duration: duration,
    easing: cubicOut,
  });
  onMount(() => {
    num.set(value);
  });
</script>

<div
  class="inline-block  text-black dark:text-white tracking-normal"
  {...$$restProps}
>
  {$num.toFixed(0)}
</div>
