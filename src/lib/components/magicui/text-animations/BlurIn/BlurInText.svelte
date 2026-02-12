<!--
This is a Svelte component from Magic UI:

Demo Site: [animation-svelte.vercel.app](https://animation-svelte.vercel.app/)
GitHub Repository: [SikandarJODD/svelte-animations](https://github.com/SikandarJODD/svelte-animations?tab=readme-ov-file#simple-components)

All components in this directory are sourced from the svelte-animations project by SikandarJODD. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { Motion } from "svelte-motion";

  interface Variant {
    hidden: { filter: string; opacity: number };
    visible: { filter: string; opacity: number };
  }

  interface Props {
    word?: string;
    variant?: Variant;
    duration?: number;
  }

  let {
    word = "Blur In",
    variant = {
      hidden: { filter: "blur(10px)", opacity: 0 },
      visible: { filter: "blur(0px)", opacity: 1 },
    },
    duration = 1
  }: Props = $props();

  let defaultVariants = {
    hidden: { filter: "blur(10px)", opacity: 0 },
    visible: { filter: "blur(0px)", opacity: 1 },
  };
  let combinedVariants = variant || defaultVariants;
</script>

<Motion
  initial="hidden"
  animate="visible"
  transition={{ duration }}
  variants={combinedVariants}
  let:motion
>
  <h1
    class="font-display text-center text-4xl font-bold tracking-[-0.02em] drop-shadow-sm md:text-7xl md:leading-[5rem]"
    use:motion
  >
    {word}
  </h1>
</Motion>
