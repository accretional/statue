<!--
This is a Svelte component from Magic UI:

Demo Site: [animation-svelte.vercel.app](https://animation-svelte.vercel.app/)
GitHub Repository: [SikandarJODD/svelte-animations](https://github.com/SikandarJODD/svelte-animations?tab=readme-ov-file#simple-components)

All components in this directory are sourced from the svelte-animations project by SikandarJODD. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { onMount } from "svelte";

  interface Props {
    text?: string;
    duration?: number;
  }

  let { text = "Typing Animation", duration = 200 }: Props = $props();

  let displayedText = "";
  onMount(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        displayedText = text.slice(0, i + 1);
        i++;
      } else {
        clearInterval(interval);
      }
    }, duration);
    return () => clearInterval(interval);
  });
</script>

<h1
  class="font-display text-center text-4xl font-bold leading-[5rem] tracking-[-0.02em] drop-shadow-sm transition-all"
>
  {displayedText ? displayedText : text}
</h1>
