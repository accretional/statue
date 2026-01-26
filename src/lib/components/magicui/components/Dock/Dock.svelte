<!--
This is a Svelte component from Magic UI:

Demo Site: [animation-svelte.vercel.app](https://animation-svelte.vercel.app/)
GitHub Repository: [SikandarJODD/svelte-animations](https://github.com/SikandarJODD/svelte-animations?tab=readme-ov-file#simple-components)

All components in this directory are sourced from the svelte-animations project by SikandarJODD. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { setContext } from "svelte";
  import { Motion, useMotionValue } from "svelte-motion";
  let DEFAULT_MAGNIFICATION = 60;
  let DEFAULT_DISTANCE = 140;
  interface Props {
    direction?: "top" | "middle" | "bottom";
    distance?: number;
    magnification?: number;
  }

  let {
    direction = "top",
    distance = DEFAULT_DISTANCE,
    magnification = DEFAULT_MAGNIFICATION
  }: Props = $props();

  let dockVariants = "mx-auto w-max mt-8 h-[80px] p-3 flex gap-2 rounded-2xl border supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 backdrop-blur-md";
  let mouseX = useMotionValue(Infinity);
  setContext("mouseX", mouseX);
</script>

<Motion let:motion>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    on:mousemove={(e) => mouseX.set(e.pageX)}
    on:mouseleave={() => mouseX.set(Infinity)}
    use:motion
    class="{dockVariants} {direction === 'top' ? 'items-start' : direction === 'middle' ? 'items-center' : 'items-end'}"
  >
    <slot {mouseX}>
      <!-- Default -->Dock
    </slot>
  </div>
</Motion>
