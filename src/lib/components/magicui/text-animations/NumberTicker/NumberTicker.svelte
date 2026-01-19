<!--
This is a Svelte component from Magic UI:

Demo Site: [animation-svelte.vercel.app](https://animation-svelte.vercel.app/)
GitHub Repository: [SikandarJODD/svelte-animations](https://github.com/SikandarJODD/svelte-animations?tab=readme-ov-file#simple-components)

All components in this directory are sourced from the svelte-animations project by SikandarJODD. Please refer to the original repository for documentation, examples, and additional components.
-->

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
