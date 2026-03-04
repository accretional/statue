<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { pack as d3Pack } from 'd3-hierarchy';
  import { chartContext } from './ChartContext.svelte';

  const { data, width, height } = chartContext();

  export let size: [number, number] | undefined = undefined;

  /**
   * see: https://github.com/d3/d3-hierarchy#pack_padding
   */
  export let padding: number | undefined = undefined;

  let pack: ReturnType<typeof d3Pack>;
  $: {
    pack = d3Pack().size(size ?? [$width, $height]);

    if (padding) {
      pack.padding(padding);
    }
  }

  // @ts-expect-error
  $: packData = pack($data);
</script>

<slot nodes={packData.descendants()} />
