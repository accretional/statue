<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  // https://github.com/d3/d3-sankey
  import {
    sankey as d3Sankey,
    sankeyLeft,
    sankeyCenter,
    sankeyRight,
    sankeyJustify,
    type SankeyNode,
    type SankeyLink,
  } from 'd3-sankey';

  import { chartContext } from './ChartContext.svelte';

  const { data, width, height } = chartContext();

  export let nodes = (d: any) => d.nodes;
  export let nodeId = (d: any) => d.index;
  /**
   * see: https://github.com/d3/d3-sankey#alignments
   */
  export let nodeAlign:
    | ((node: SankeyNode<any, any>, n: number) => number)
    | 'left'
    | 'right'
    | 'center'
    | 'justify' = sankeyJustify;
  export let nodeWidth = 4;
  export let nodePadding = 10;
  export let nodeSort = undefined;

  export let links = (d: any) => d.links;
  export let linkSort = undefined;

  export let onupdate: ((data: typeof sankeyData) => void) | undefined = undefined;

  $: sankey = d3Sankey()
    .size([$width, $height])
    .nodes(nodes)
    .nodeId(nodeId)
    .nodeAlign(
      nodeAlign === 'left'
        ? sankeyLeft
        : nodeAlign === 'center'
          ? sankeyCenter
          : nodeAlign === 'right'
            ? sankeyRight
            : nodeAlign === 'justify'
              ? sankeyJustify
              : nodeAlign
    )
    .nodeWidth(nodeWidth)
    .nodePadding(nodePadding)
    // @ts-expect-error
    .nodeSort(nodeSort)
    .links(links)
    // @ts-expect-error
    .linkSort(linkSort);

  // @ts-expect-error
  $: sankeyData = sankey($data);
  type NodeExtraProperties = Record<string, any>;
  $: _nodes = sankeyData.nodes as SankeyNode<NodeExtraProperties, any>[];
  $: _links = sankeyData.links as SankeyLink<NodeExtraProperties, any>[];

  $: onupdate?.(sankeyData);
</script>

<slot nodes={_nodes} links={_links} />
