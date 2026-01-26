<!--
This is a Svelte component from Magic UI:

Demo Site: [animation-svelte.vercel.app](https://animation-svelte.vercel.app/)
GitHub Repository: [SikandarJODD/svelte-animations](https://github.com/SikandarJODD/svelte-animations?tab=readme-ov-file#simple-components)

All components in this directory are sourced from the svelte-animations project by SikandarJODD. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { getContext } from "svelte";
  import { Motion, useSpring, useTransform } from "svelte-motion";

  let DEFAULT_MAGNIFICATION = 60;
  let DEFAULT_DISTANCE = 140;
  let mouseX = getContext("mouseX");
  $effect(() => {
    console.log(mouseX.current, "---");
  });
  interface Props {
    distance?: number;
    magnification?: number;
  }

  let { distance = DEFAULT_DISTANCE, magnification = DEFAULT_MAGNIFICATION }: Props = $props();
  let ref: HTMLElement;
  let distanceCalc = useTransform(mouseX, (val: number) => {
    const bounds = ref?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 2;
  });
  let widthSync = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [40, magnification, 40]
  );
  let width = useSpring(widthSync, { stiffness: 150, damping: 12, mass: 0.1 });
</script>

<Motion style={{ width }} let:motion>
  <div
    class="flex aspect-square cursor-pointer items-center justify-center rounded-full"
    bind:this={ref}
    use:motion
  >
    <slot>
      <!-- Default -->DockIcon
    </slot>
  </div>
</Motion>
