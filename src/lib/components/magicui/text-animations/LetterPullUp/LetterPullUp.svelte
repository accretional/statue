<!--
This is a Svelte component from Magic UI:

Demo Site: [animation-svelte.vercel.app](https://animation-svelte.vercel.app/)
GitHub Repository: [SikandarJODD/svelte-animations](https://github.com/SikandarJODD/svelte-animations?tab=readme-ov-file#simple-components)

All components in this directory are sourced from the svelte-animations project by SikandarJODD. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { AnimatePresence, Motion } from "svelte-motion";

  export let words = "Letter Pull Up";
  export let delay = 0.05;
  let pullupVariant = {
    hidden: { y: 100, opacity: 0 },
    visible: (i: any) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * delay },
    }),
  };
  let letters = words.split("");
</script>

<div class="flex justify-center">
    <!-- <AnimatePresence let:item list={[{ key: words }]}> -->
  {#each letters as letter, i}
      <Motion
        variants={pullupVariant}
        initial="hidden"
        animate="visible"
        custom={i}
        let:motion
      >
        <h1
          class="font-display text-center text-4xl font-bold tracking-[-0.02em] text-black drop-shadow-sm dark:text-white md:text-4xl md:leading-[5rem]"
          use:motion
        >
          {#if letter === " "}
            <span>&nbsp;</span>
          {:else}
            {letter}
          {/if}
        </h1>
      </Motion>
      {/each}
    <!-- </AnimatePresence> -->
</div>
