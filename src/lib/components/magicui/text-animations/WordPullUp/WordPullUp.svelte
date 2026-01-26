<!--
This is a Svelte component from Magic UI:

Demo Site: [animation-svelte.vercel.app](https://animation-svelte.vercel.app/)
GitHub Repository: [SikandarJODD/svelte-animations](https://github.com/SikandarJODD/svelte-animations?tab=readme-ov-file#simple-components)

All components in this directory are sourced from the svelte-animations project by SikandarJODD. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { Motion } from "svelte-motion";

  interface FramerProps {
    hidden: { y: number; opacity: number };
    show: { y: number; opacity: number };
  }

  interface WrapperFramerProps {
    hidden: { opacity: number };
    show: {
      opacity: number;
      transition: { staggerChildren: number };
    };
  }

  interface Props {
    words?: string;
    wrapperFramerProps?: WrapperFramerProps;
    framerProps?: FramerProps;
  }

  let {
    words = 'Pull Up',
    wrapperFramerProps = {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: 0.25,
        },
      },
    },
    framerProps = {
      hidden: { y: 20, opacity: 0 },
      show: { y: 0, opacity: 1 },
    }
  }: Props = $props();

  let wordSplit = words.split(" ");
</script>

<Motion
  variants={wrapperFramerProps}
  initial="hidden"
  animate="show"
  let:motion
>
  <h1
    class="font-display text-center text-4xl font-bold leading-[5rem] tracking-[-0.02em] drop-shadow-sm"
    use:motion
  >
    {#each wordSplit as word, i}
      <Motion variants={framerProps} let:motion>
        <span class="inline-block pr-[8px]" use:motion>
          {#if word === ""}
            <span>&nbsp;</span>
          {:else}
            {word}
          {/if}
        </span>
      </Motion>
    {/each}
  </h1>
</Motion>
