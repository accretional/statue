<!--
This is a Svelte component from Magic UI:

Demo Site: [animation-svelte.vercel.app](https://animation-svelte.vercel.app/)
GitHub Repository: [SikandarJODD/svelte-animations](https://github.com/SikandarJODD/svelte-animations?tab=readme-ov-file#simple-components)

All components in this directory are sourced from the svelte-animations project by SikandarJODD. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { inview } from "svelte-inview";
  import { Motion, useAnimation } from "svelte-motion";
  import { onMount } from "svelte";

  export let width = "fit-content";
  export let boxColor: string | undefined = undefined;
  export let duration = 0.5;

  let themeColor = "";

  // Get color from CSS variable if boxColor is not provided
  onMount(() => {
    if (!boxColor && typeof document !== "undefined") {
      const primaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-primary")
        .trim();
      themeColor = primaryColor || "#5046e6";
    }
  });

  $: effectiveBoxColor = boxColor || themeColor || "#5046e6";

  //   Animation Controls
  let mainControls = useAnimation();
  let sideControls = useAnimation();

  let viewEnter = () => {
    // console.log("view entered");
    mainControls.start("visible");
    sideControls.start("visible");
  };
  let viewLeave = () => {
    // console.log("view exited");
    mainControls.start("hidden");
    sideControls.start("hidden");
  };
</script>

<div
  class="relative overflow-hidden"
  style="width:{width}"
  use:inview
  on:inview_enter={viewEnter}
  on:inview_leave={viewLeave}
>
  <Motion
    let:motion
    variants={{
      hidden: { opacity: 0, y: 75 },
      visible: { opacity: 1, y: 0 },
    }}
    initial="hidden"
    animate={mainControls}
    transition={{ duration: duration ? duration : 0.5, delay: 0.25 }}
  >
    <div use:motion>
      <slot>Default</slot>
    </div>
  </Motion>
  <Motion
    variants={{
      hidden: { left: 0 },
      visible: { left: "100%" },
    }}
    initial="hidden"
    animate={sideControls}
    transition={{ duration: duration ? duration : 0.5, ease: "easeIn" }}
    let:motion
  >
    <div
      style="background:{effectiveBoxColor}"
      class="absolute top-[4px] bottom-[4px] left-0 right-0 z-40"
      use:motion
    ></div>
  </Motion>
</div>
