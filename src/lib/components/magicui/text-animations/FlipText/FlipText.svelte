<script lang="ts">
  import { AnimatePresence, Motion } from "svelte-motion";

  export let word = "Flip Text";
  export let duration = 0.5;
  export let delayMultiple = 0.08;
  export let framerProps = {
    hidden: { rotateX: -90, opacity: 0 },
    visible: { rotateX: 0, opacity: 1 },
  };
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
