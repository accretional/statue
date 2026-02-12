<!--
This is a Svelte component from Magic UI:

Demo Site: [animation-svelte.vercel.app](https://animation-svelte.vercel.app/)
GitHub Repository: [SikandarJODD/svelte-animations](https://github.com/SikandarJODD/svelte-animations?tab=readme-ov-file#simple-components)

All components in this directory are sourced from the svelte-animations project by SikandarJODD. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { AnimatePresence, Motion } from "svelte-motion";

  interface Variants {
    hidden: { opacity: number };
    visible: (i: any) => { y: number; opacity: number; transition: { delay: number } };
  }

  interface Props {
    words?: string;
    delay?: number;
    variants?: Variants;
  }

  let {
    words = "Fade In",
    delay = 0.19,
    variants = {
      hidden: { opacity: 0 },
      visible: (i: any) => ({
        y: 0,
        opacity: 1,
        transition: { delay: i * delay },
      }),
    }
  }: Props = $props();
  let wordsspilit = words.split(" ");
</script>

<Motion {variants} initial="hidden" animate="visible" let:motion>
  <h1
    class="font-display text-center text-4xl font-bold tracking-[-0.02em] text-black drop-shadow-sm dark:text-white md:text-7xl md:leading-[5rem]"
    use:motion
  >
    {#each wordsspilit as word, i}
      <Motion {variants} custom={i} let:motion>
        <span use:motion> {word}</span>
      </Motion>
    {/each}
  </h1>
</Motion>
