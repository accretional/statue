<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import {
    treemap as d3treemap,
    treemapBinary,
    treemapDice,
    treemapResquarify,
    treemapSlice,
    treemapSliceDice,
    treemapSquarify,
    type HierarchyNode,
    type HierarchyRectangularNode,
    type TreemapLayout,
  } from 'd3-hierarchy';

  import { chartContext } from './ChartContext.svelte';

  // Inlined from ../utils/treemap.js
  type TileFunc = (
    node: HierarchyRectangularNode<any>,
    x0: number,
    y0: number,
    x1: number,
    y1: number
  ) => void;

  /**
   * This custom tiling function adapts the tiling function
   * for the appropriate aspect ratio when the treemap is zoomed-in.
   * see: https://observablehq.com/@d3/zoomable-treemap#tile and https://observablehq.com/@d3/stretched-treemap
   */
  function aspectTile(tile: TileFunc, width: number, height: number): TileFunc {
    return (node, x0, y0, x1, y1) => {
      tile(node, 0, 0, width, height);
      for (const child of node.children ?? []) {
        child.x0 = x0 + (child.x0 / width) * (x1 - x0);
        child.x1 = x0 + (child.x1 / width) * (x1 - x0);
        child.y0 = y0 + (child.y0 / height) * (y1 - y0);
        child.y1 = y0 + (child.y1 / height) * (y1 - y0);
      }
    };
  }

  const { data, width, height } = chartContext();

  export let tile:
    | typeof treemapSquarify
    | 'binary'
    | 'squarify'
    | 'resquarify'
    | 'dice'
    | 'slice'
    | 'sliceDice' = treemapSquarify;
  export let padding = 0;
  export let paddingInner = 0;
  export let paddingOuter = 0;
  export let paddingTop = 0;
  export let paddingBottom = 0;
  export let paddingLeft: number | undefined = undefined;
  export let paddingRight: number | undefined = undefined;

  export let selected: HierarchyRectangularNode<any> | null | undefined = null;

  $: tileFunc =
    tile === 'squarify'
      ? treemapSquarify
      : tile === 'resquarify'
        ? treemapResquarify
        : tile === 'binary'
          ? treemapBinary
          : tile === 'dice'
            ? treemapDice
            : tile === 'slice'
              ? treemapSlice
              : tile === 'sliceDice'
                ? treemapSliceDice
                : tile;

  let treemap: TreemapLayout<any>;
  $: {
    treemap = d3treemap()
      .size([$width, $height])
      .tile(aspectTile(tileFunc, $width, $height));

    if (padding) {
      treemap.padding(padding);
    }
    if (paddingInner) {
      treemap.paddingInner(paddingInner);
    }
    if (paddingOuter) {
      treemap.paddingOuter(paddingOuter);
    }
    if (paddingTop) {
      treemap.paddingTop(paddingTop);
    }
    if (paddingBottom) {
      treemap.paddingBottom(paddingBottom);
    }
    if (paddingLeft) {
      treemap.paddingLeft(paddingLeft);
    }
    if (paddingRight) {
      treemap.paddingRight(paddingRight);
    }
  }

  $: treemapData = treemap($data as HierarchyNode<any>);

  // TODO: Remove selected
  $: selected = treemapData; // set initial selection
</script>

<slot nodes={treemapData.descendants()} />
