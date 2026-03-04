<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import {
    partition as d3Partition,
    type HierarchyNode,
    type HierarchyRectangularNode,
  } from 'd3-hierarchy';
  import { chartContext } from './ChartContext.svelte';

  const { data, width, height } = chartContext();

  export let orientation: 'vertical' | 'horizontal' = 'horizontal';

  export let size: [number, number] | undefined = undefined;

  /**
   * see: https://github.com/d3/d3-hierarchy#tree_nodeSize
   */
  export let padding: number | undefined = undefined;

  /**
   * see: https://github.com/d3/d3-hierarchy#tree_nodeSize
   */
  export let round: boolean | undefined = undefined;

  let partition: ReturnType<typeof d3Partition>;
  $: {
    partition = d3Partition().size(
      size ?? (orientation === 'horizontal' ? [$height, $width] : [$width, $height])
    );

    if (padding) {
      partition.padding(padding);
    }
    if (round) {
      partition.round(round);
    }
  }

  $: partitionData = partition($data as HierarchyNode<any>) as HierarchyRectangularNode<any>;
</script>

<slot nodes={partitionData.descendants()} />
