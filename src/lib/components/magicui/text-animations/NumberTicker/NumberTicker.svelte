<!--
This is a Svelte component from Magic UI:

Demo Site: [animation-svelte.vercel.app](https://animation-svelte.vercel.app/)
GitHub Repository: [SikandarJODD/svelte-animations](https://github.com/SikandarJODD/svelte-animations?tab=readme-ov-file#simple-components)

All components in this directory are sourced from the svelte-animations project by SikandarJODD. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { cubicOut } from "svelte/easing";
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";

  interface Props {
    value?: number;
    initial?: number;
    duration?: number;
    [key: string]: any;
  }

  let { value = 100, initial = 0, duration = 6000, ...restProps }: Props = $props();

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
  {...restProps}
>
  {$num.toFixed(0)}
</div>
