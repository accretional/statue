<!--
This is a Svelte component from Magic UI:

Demo Site: [animation-svelte.vercel.app](https://animation-svelte.vercel.app/)
GitHub Repository: [SikandarJODD/svelte-animations](https://github.com/SikandarJODD/svelte-animations?tab=readme-ov-file#simple-components)

All components in this directory are sourced from the svelte-animations project by SikandarJODD. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { AnimatePresence, Motion } from "svelte-motion";

  interface FramerProps {
    hidden: { rotateX: number; opacity: number };
    visible: { rotateX: number; opacity: number };
  }

  interface Props {
    word?: string;
    duration?: number;
    delayMultiple?: number;
    framerProps?: FramerProps;
  }

  let {
    word = "Flip Text",
    duration = 0.5,
    delayMultiple = 0.08,
    framerProps = {
      hidden: { rotateX: -90, opacity: 0 },
      visible: { rotateX: 0, opacity: 1 },
    }
  }: Props = $props();
  let wordsspilit = word.split("");
</script>

<div class="flex justify-center space-x-2">
  <AnimatePresence let:item list={[{ key: wordsspilit }]}>
    {#each wordsspilit as letter, i}
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
        <span use:motion class="origin-center drop-shadow-sm">
          {letter}
        </span>
      </Motion>
    {/each}
  </AnimatePresence>
</div>
