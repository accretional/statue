<script lang="ts">
  interface Props {
    class?: string;
    reverse?: boolean;
    pauseOnHover?: boolean;
    children?: any;
    vertical?: boolean;
    repeat?: number;
  }

  let {
    class: className = "",
    reverse = false,
    pauseOnHover = false,
    children,
    vertical = false,
    repeat = 4
  }: Props = $props();

  // Helper function to combine classes
  function classNames(...classes: (string | Record<string, boolean> | undefined)[]): string {
    return classes
      .map(cls => {
        if (typeof cls === 'string') return cls;
        if (typeof cls === 'object' && cls !== null) {
          return Object.entries(cls)
            .filter(([_, value]) => value)
            .map(([key]) => key)
            .join(' ');
        }
        return '';
      })
      .filter(Boolean)
      .join(' ');
  }
</script>

<div
  class={classNames(
    "marquee-container group flex overflow-hidden p-2",
    {
      "flex-row": !vertical,
      "flex-col": vertical
    },
    className
  )}
  style="--duration: 40s; --gap: 1rem; gap: var(--gap);"
>
  {#each Array(repeat) as _, i}
    <div
      class={classNames("marquee-content flex shrink-0 justify-around", {
        "animate-marquee flex-row": !vertical,
        "animate-marquee-vertical flex-col": vertical,
        "pause-on-hover": pauseOnHover,
        "reverse-animation": reverse
      })}
      style="gap: var(--gap);"
    >
      {@render children?.()}
    </div>
  {/each}
</div>

<style>
  .marquee-container {
    position: relative;
  }

  .marquee-content {
    animation-duration: var(--duration);
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  @keyframes marquee {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(calc(-100% - var(--gap)));
    }
  }

  @keyframes marquee-vertical {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(calc(-100% - var(--gap)));
    }
  }

  .animate-marquee {
    animation-name: marquee;
  }

  .animate-marquee-vertical {
    animation-name: marquee-vertical;
  }

  .group:hover .pause-on-hover {
    animation-play-state: paused;
  }

  .reverse-animation {
    animation-direction: reverse;
  }
</style>