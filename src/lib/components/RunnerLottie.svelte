<script>
  import { onMount, onDestroy } from 'svelte';
  import lottie from 'lottie-web';

  export let pose = 'idle'; // idle | left | right
  export let speed = 1.2;
  export let path = '/runner2.json';

  // runner2.json: 0. frame duruş, 0–10 arası tam bir adım; her 10 frame'de cycle tekrar ediyor
  const segmentMap = {
    idle: [[0, 0]],
    // ilk adım
    left: [[0, 10]],
    // ikinci adım (cycle'ın bir sonraki fazı)
    right: [[10, 20]]
  };

  let container;
  let animation;

  function playCurrentPose() {
    if (!animation) return;
    const segments = segmentMap[pose] ?? segmentMap.idle;
    const normalizedSegments = segments.map(([from, to]) => [from, to]);

    if (pose === 'idle') {
      animation.goToAndStop(normalizedSegments[0][0], true);
      return;
    }

    animation.playSegments(
      normalizedSegments.length === 1 ? normalizedSegments[0] : normalizedSegments,
      true
    );
  }

  onMount(() => {
    animation = lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet'
      }
    });

    animation.setSpeed(speed);
    playCurrentPose();
  });

  onDestroy(() => {
    animation?.destroy();
  });

  $: if (animation) {
    animation.setSpeed(speed);
  }

  $: if (animation && pose) {
    playCurrentPose();
  }
</script>

<div class="runner-lottie" bind:this={container}></div>

<style>
  :global(.runner-lottie svg) {
    width: 100%;
    height: 100%;
  }

  .runner-lottie {
    width: 100%;
    height: 100%;
  }
</style>

