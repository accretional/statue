<!--
This is a Svelte component from Magic UI:

Demo Site: [animation-svelte.vercel.app](https://animation-svelte.vercel.app/)
GitHub Repository: [SikandarJODD/svelte-animations](https://github.com/SikandarJODD/svelte-animations?tab=readme-ov-file#simple-components)

All components in this directory are sourced from the svelte-animations project by SikandarJODD. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { AnimatePresence, Motion } from "svelte-motion";

  interface FramerProps {
    hidden: { opacity: number; x: number };
    visible: { opacity: number; x: number };
  }

  interface Props {
    words?: string;
    duration?: number;
    delayMultiple?: number;
    framerProps?: FramerProps;
  }

  let {
    words = "Gradual Spacing",
    duration = 0.5,
    delayMultiple = 0.04,
    framerProps = {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 },
    }
  }: Props = $props();
  let wordsspilit = words.split("");
</script>

<div class="flex justify-center space-x-1">
  <AnimatePresence let:item list={[{ key: wordsspilit }]}>
    {#each wordsspilit as char, i}
      <Motion
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={framerProps}
        transition={{
          duration: duration,
          delay: i * delayMultiple,
        }}
        let:motion
      >
        <span use:motion class="drop-shadow-sm">
          {#if char === " "}
            <span>&nbsp;</span>
          {:else}
            {char}
          {/if}
        </span>
      </Motion>
    {/each}
  </AnimatePresence>
</div>
