<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { scaleLinear } from 'd3-scale';
  import { derived } from 'svelte/store';
  import { tweened as tweenedFn, spring as springFn } from 'svelte/motion';
  import { writable } from 'svelte/store';

  import { chartContext } from './ChartContext.svelte';

  // Inlined from $lib/stores/motionStore.js
  type SpringOptions = Parameters<typeof spring<any>>[1];
  type TweenedOptions = Parameters<typeof tweened<any>>[1];
  type MotionOptions = {
    spring?: boolean | SpringOptions;
    tweened?: boolean | TweenedOptions;
  };

  function motionStore<T = any>(value: T, options: MotionOptions) {
    if (options.spring) {
      return springFn<T>(value, options.spring === true ? undefined : options.spring);
    } else if (options.tweened) {
      return tweenedFn<T>(value, options.tweened === true ? undefined : options.tweened);
    } else {
      return writable<T>(value);
    }
  }

  // Inlined from $lib/utils/scales.js
  interface AnyScale<Domain = any, Range = any, Input = Domain, Output = any> {
    (value: Input): Output;
    domain(): Domain[];
    domain(domain: Iterable<Domain>): this;
    range(): Range[];
    range(range: Iterable<Range>): this;
  }

  function motionScale<Domain, Range>(scale: AnyScale, options: MotionOptions) {
    const domainStore = motionStore<Domain>(undefined as Domain, options);
    const rangeStore = motionStore<Range>(undefined as Range, options);

    const tweenedScale = derived([domainStore, rangeStore], ([domain, range]) => {
      // @ts-expect-error
      const scaleInstance = scale.domain ? scale : scale();

      if (domain) {
        scaleInstance.domain(domain);
      }
      if (range) {
        scaleInstance.range(range);
      }

      return scaleInstance;
    });

    return {
      subscribe: tweenedScale.subscribe,
      domain: (values: Domain) => domainStore.set(values),
      range: (values: Range) => rangeStore.set(values),
    };
  }

  const { width, height } = chartContext();

  type Extents = Partial<{ x0: number; y0: number; x1: number; y1: number }>;
  type ExtentsAcccessor = (dimensions: { width: number; height: number }) => Extents;

  export let domain: Extents | ExtentsAcccessor | null | undefined = undefined;
  export let range: Extents | ExtentsAcccessor | null | undefined = undefined;
  export let spring: boolean | Parameters<typeof motionScale>[1]['spring'] = undefined;
  export let tweened: boolean | Parameters<typeof motionScale>[1]['tweened'] = undefined;

  function getExtents(
    extents: Extents | ExtentsAcccessor | null | undefined,
    axis: 'x' | 'y',
    fallback: number
  ) {
    const resolvedExtents =
      typeof extents === 'function' ? extents({ width: $width, height: $height }) : extents;

    return [
      // @ts-expect-error
      resolvedExtents?.[axis + '0'] ?? 0, // x0 or y0
      // @ts-expect-error
      resolvedExtents?.[axis + '1'] ?? fallback, // x1 or y1, fallback as $width or $height
    ];
  }

  const xScale = motionScale(scaleLinear as any, { spring, tweened });
  $: xScale.domain(getExtents(domain, 'x', $width));
  $: xScale.range(getExtents(range, 'x', $width));

  const yScale = motionScale(scaleLinear as any, { spring, tweened });
  $: yScale.domain(getExtents(domain, 'y', $height));
  $: yScale.range(getExtents(range, 'y', $height));
</script>

<slot xScale={$xScale} yScale={$yScale} />
