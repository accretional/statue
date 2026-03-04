<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { timeWeek, timeYear } from 'd3-time';
  import { endOfMonth } from 'date-fns';

  export let date: Date;

  /**
   * Size of cell.  If `number`, sets width/height as same.  If array, sets [width,height].  If undefined, is based on Chart width/height
   */
  export let cellSize: number | [number, number];

  $: [cellWidth, cellHeight] = Array.isArray(cellSize) ? cellSize : [cellSize, cellSize];

  // start of month
  $: startDayOfWeek = date.getDay();
  $: startWeek = timeWeek.count(timeYear(date), date);

  // end of month
  $: monthEnd = endOfMonth(date);
  $: endDayOfWeek = monthEnd.getDay();
  $: endWeek = timeWeek.count(timeYear(monthEnd), monthEnd);

  $: pathData = `
    M${(startWeek + 1) * cellWidth},${startDayOfWeek * cellHeight}
    H${startWeek * cellWidth} V${cellHeight * 7}
    H${endWeek * cellWidth} V${(endDayOfWeek + 1) * cellHeight}
    H${(endWeek + 1) * cellWidth} V0
    H${(startWeek + 1) * cellWidth}Z
  `;
</script>

<path d={pathData} fill="none" class="stroke-surface-content/20" {...$$restProps} />
