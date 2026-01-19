<!--
This is a Svelte component from Magic UI:

Demo Site: [animation-svelte.vercel.app](https://animation-svelte.vercel.app/)
GitHub Repository: [SikandarJODD/svelte-animations](https://github.com/SikandarJODD/svelte-animations?tab=readme-ov-file#simple-components)

All components in this directory are sourced from the svelte-animations project by SikandarJODD. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  export let words: string[] = ["Hello", "Svelte", "Coders"];
  export let duration: number = 2100;

  let index = 0;
  let chnageIndex = () => {
    index = (index + 1) % words.length;
  };
  onMount(() => {
    let interval = setInterval(chnageIndex, duration);
    return () => clearInterval(interval);
  });
  //  I tried with Svelte Motion but there was a slight delay in the animation
  //  so I used the built-in svelte transition
</script>

<div class="overflow-hidden py-2">
  {#key index}
    <!-- Change In, Out Animation for Rotate Effects -->
    <h1
      in:fly={{ y: -50, delay: 200 }}
      out:fly={{ y: 40, duration: 200 }}
      class="text-center"
    >
      {words[index]}
    </h1>
  {/key}
</div>
