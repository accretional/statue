<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts" generics="TData">
  import { onMount, type ComponentProps } from 'svelte';
  import { scaleBand, scaleOrdinal, scaleLinear } from 'd3-scale';
  import { stack, stackOffsetDiverging, stackOffsetExpand, stackOffsetNone } from 'd3-shape';
  import { sum } from 'd3-array';
  import { format } from '@layerstack/utils';
  import { cls } from '@layerstack/tailwind';
  import { selectionStore } from '@layerstack/svelte-stores';
  import { get } from 'lodash-es';

  import Axis from '../Axis.svelte';
  import Bars from '../Bars.svelte';
  import Canvas from '../layout/Canvas.svelte';
  import Chart from '../Chart.svelte';
  import Grid from '../Grid.svelte';
  import Highlight from '../Highlight.svelte';
  import Labels from '../Labels.svelte';
  import Legend from '../Legend.svelte';
  import Rule from '../Rule.svelte';
  import Svg from '../layout/Svg.svelte';
  import TooltipRoot from '../tooltip/Tooltip.svelte';
  import TooltipContext from '../tooltip/TooltipContext.svelte';
  import TooltipHeader from '../tooltip/TooltipHeader.svelte';
  import TooltipItem from '../tooltip/TooltipItem.svelte';
  import TooltipList from '../tooltip/TooltipList.svelte';
  import TooltipSeparator from '../tooltip/TooltipSeparator.svelte';
  import type LineChart from './LineChart.svelte';

  // Inlined from ../../utils/common.js
  type Accessor<TData = any> =
    | number
    | string
    | ((d: TData) => any)
    | undefined
    | null
    | Accessor<TData>[];

  function accessor<TData = any>(prop: Accessor<TData>): (d: TData) => any {
    if (Array.isArray(prop)) {
      return (d: TData) => prop.map((p) => accessor<TData>(p)(d));
    } else if (typeof prop === 'function') {
      return prop;
    } else if (typeof prop === 'string' || typeof prop === 'number') {
      return (d: TData) => get(d, prop);
    } else {
      return (d: TData) => d;
    }
  }

  /** Guarantee chart data is an array */
  function chartDataArray<TData = any>(data: ComponentProps<Chart<TData>>['data']) {
    if (data == null) {
      return [];
    } else if (Array.isArray(data)) {
      return data;
    } else if ('nodes' in data) {
      return data.nodes;
    } else {
      return data.descendants();
    }
  }

  type SimplifiedChartProps = ComponentProps<LineChart<any>>;

  function defaultChartPadding(
    axis: SimplifiedChartProps['axis'],
    legend: SimplifiedChartProps['legend']
  ) {
    if (axis === false) {
      return undefined;
    } else {
      return {
        top: axis === true || axis === 'y' ? 4 : 0,
        left: axis === true || axis === 'y' ? 20 : 0,
        bottom: (axis === true || axis === 'x' ? 20 : 0) + (legend === true ? 32 : 0),
        right: axis === true || axis === 'x' ? 4 : 0,
      };
    }
  }

  /**
   * Find the first instance within `data` with the same value as `original` using prop accessor.
   * Handles complex objects such as `Date` by invoking `.valueOf()`
   */
  function findRelatedData(data: any[], original: any, accessor: Function) {
    return data.find((d) => {
      return accessor(d)?.valueOf() === accessor(original)?.valueOf();
    });
  }

  // Inlined from ../../utils/types.js
  function asAny(x: any): any {
    return x;
  }

  // Inlined from ../../utils/rect.js
  /** A set of inset distances, applied to a rectangle to shrink or expand the area represented by that rectangle. */
  type Insets = {
    /** Applies an inset all sides of a rectangle: `left`, `right`, `bottom`, and `top` */
    all?: number;
    /** Applies an inset all horizontal sides of a rectangle: `left`, and `right`, overriding `all` */
    x?: number;
    /** Applies an inset all vertical sides of a rectangle: `top`, and `bottom`, overriding `all` */
    y?: number;
    /** Applies an inset the left side of a rectangle, overriding `x` */
    left?: number;
    /** Applies an inset the right side of a rectangle, overriding `x` */
    right?: number;
    /** Applies an inset the top side of a rectangle, overriding `y` */
    top?: number;
    /** Applies an inset the bottom side of a rectangle, overriding `y` */
    bottom?: number;
  };

  type ChartProps = ComponentProps<Chart<TData>>;

  interface $$Props extends ChartProps {
    axis?: typeof axis;
    debug?: typeof debug;
    grid?: typeof grid;
    bandPadding?: typeof bandPadding;
    groupPadding?: typeof groupPadding;
    stackPadding?: typeof stackPadding;
    labels?: typeof labels;
    legend?: typeof legend;
    orientation?: typeof orientation;
    profile?: typeof profile;
    props?: typeof props;
    rule?: typeof rule;
    series?: typeof series;
    seriesLayout?: typeof seriesLayout;
    renderContext?: typeof renderContext;
    onbarclick?: typeof onbarclick;
    ontooltipclick?: typeof ontooltipclick;
  }

  export let data: $$Props['data'] = [];
  export let x: Accessor<TData> = undefined;
  export let y: Accessor<TData> = undefined;

  export let orientation: 'vertical' | 'horizontal' = 'vertical';
  $: isVertical = orientation === 'vertical';

  export let series: {
    key: string;
    label?: string;
    value?: Accessor<TData>;
    /** Provider series data, else uses chart data (with value/key accessor) */
    data?: TData[];
    color?: string;
    props?: Partial<ComponentProps<Bars>>;
  }[] = [
    {
      key: 'default',
      value: orientation === 'vertical' ? y : x,
    },
  ];
  $: isDefaultSeries = series.length === 1 && series[0].key === 'default';

  /** Determine how to layout series.  Overlap (default), stack, or group side by side */
  export let seriesLayout: 'overlap' | 'group' | 'stack' | 'stackExpand' | 'stackDiverging' =
    'overlap';
  $: stackSeries = seriesLayout.startsWith('stack');
  $: groupSeries = seriesLayout === 'group';

  export let axis: ComponentProps<Axis> | 'x' | 'y' | boolean = true;
  export let rule: ComponentProps<Rule> | boolean = true;
  export let grid: ComponentProps<Grid> | boolean = true;
  export let labels: ComponentProps<Labels> | boolean = false;
  export let legend: ComponentProps<Legend> | boolean = false;

  /** Padding between primary x or y bands/bars, applied to scaleBand().padding() */
  export let bandPadding = 0.4;
  /** Padding between group/series items when using 'seriesLayout="group"', applied to scaleBand().padding() */
  export let groupPadding = 0;
  /** Padding between series items within bars when using 'seriesLayout="stack"' */
  export let stackPadding = 0;

  /** Expose tooltip context for external access */
  export let tooltipContext: ComponentProps<TooltipContext>['tooltip'] = undefined;

  /** Event dispatched with current tooltip data */
  export let ontooltipclick: (e: MouseEvent, detail: { data: any }) => void = () => {};

  // TODO: Need to find a way to have this play nice with `tooltip={{ mode: 'band' }}`
  /** Event dispatched when individual Bar is clicked (useful with multiple series) */
  export let onbarclick: (
    e: MouseEvent,
    detail: { data: any; series: (typeof series)[number] }
  ) => void = () => {};

  $: xScale = $$props.xScale ?? (isVertical ? scaleBand().padding(bandPadding) : scaleLinear());
  $: xBaseline = isVertical ? undefined : 0;

  $: yScale = $$props.yScale ?? (isVertical ? scaleLinear() : scaleBand().padding(bandPadding));
  $: yBaseline = isVertical ? 0 : undefined;

  let x1Scale: ChartProps['x1Scale'];
  let x1Domain: ChartProps['x1Domain'];
  let x1Range: ChartProps['x1Range'];

  let y1Scale: ChartProps['y1Scale'];
  let y1Domain: ChartProps['y1Domain'];
  let y1Range: ChartProps['y1Range'];

  $: if (seriesLayout === 'group') {
    if (isVertical) {
      x1Scale = scaleBand().padding(groupPadding);
      x1Domain = visibleSeries.map((s) => s.key);
      x1Range = ({ xScale }) => [0, xScale.bandwidth?.()];
    } else {
      y1Scale = scaleBand().padding(groupPadding);
      y1Domain = visibleSeries.map((s) => s.key);
      y1Range = ({ yScale }) => [0, yScale.bandwidth?.()];
    }
  }

  export let props: {
    xAxis?: Partial<ComponentProps<Axis>>;
    yAxis?: Partial<ComponentProps<Axis>>;
    canvas?: Partial<ComponentProps<Canvas>>;
    grid?: Partial<ComponentProps<Grid>>;
    rule?: Partial<ComponentProps<Rule>>;
    bars?: Partial<ComponentProps<Bars>>;
    legend?: Partial<ComponentProps<Legend>>;
    highlight?: Partial<ComponentProps<Highlight>>;
    labels?: Partial<ComponentProps<Labels>>;
    svg?: Partial<ComponentProps<Svg>>;
    tooltip?: {
      context?: Partial<ComponentProps<TooltipContext>>;
      root?: Partial<ComponentProps<TooltipRoot>>;
      header?: Partial<ComponentProps<TooltipHeader>>;
      list?: Partial<ComponentProps<TooltipList>>;
      item?: Partial<ComponentProps<TooltipItem>>;
      separator?: Partial<ComponentProps<TooltipSeparator>>;
      hideTotal?: boolean;
    };
  } = {};

  export let renderContext: 'svg' | 'canvas' = 'svg';

  /** Log initial render performance using `console.time` */
  export let profile = false;

  /** Enable debug mode */
  export let debug = false;

  $: allSeriesData = visibleSeries
    .flatMap((s) =>
      s.data?.map((d) => {
        return { seriesKey: s.key, ...d };
      })
    )
    .filter((d) => d) as Array<TData & { stackData?: any }>;

  $: chartData = (allSeriesData.length ? allSeriesData : chartDataArray(data)) as Array<
    TData & { stackData?: any }
  >;

  $: if (stackSeries) {
    const seriesKeys = visibleSeries.map((s) => s.key);

    const offset =
      seriesLayout === 'stackExpand'
        ? stackOffsetExpand
        : seriesLayout === 'stackDiverging'
          ? stackOffsetDiverging
          : stackOffsetNone;
    const stackData = stack()
      .keys(seriesKeys)
      .value((d, key) => {
        const s = series.find((d) => d.key === key)!;
        return accessor(s.value ?? s.key)(d as any);
      })
      .offset(offset)(chartDataArray(data)) as any[];

    chartData = chartData.map((d, i) => {
      return {
        ...d,
        stackData: stackData.map((sd) => sd[i]),
      };
    });
  }

  let highlightSeriesKey: (typeof series)[number]['key'] | null = null;

  function setHighlightSeriesKey(seriesKey: typeof highlightSeriesKey) {
    highlightSeriesKey = seriesKey;
  }

  $: getBarsProps = (s: (typeof series)[number], i: number) => {
    const isFirst = i == 0;
    const isLast = i == visibleSeries.length - 1;

    const isStackLayout = seriesLayout.startsWith('stack');

    let stackInsets: Insets | undefined = undefined;

    if (isStackLayout) {
      const stackInset = stackPadding / 2;
      if (isVertical) {
        stackInsets = {
          bottom: isFirst ? undefined : stackInset,
          top: isLast ? undefined : stackInset,
        };
      } else {
        stackInsets = {
          left: isFirst ? undefined : stackInset,
          right: isLast ? undefined : stackInset,
        };
      }
    }

    const valueAccessor = stackSeries
      ? (d: any) => d.stackData[i]
      : (s.value ?? (s.data ? undefined : s.key));
    const barsProps: ComponentProps<Bars> = {
      data: s.data,
      x: !isVertical ? valueAccessor : undefined,
      y: isVertical ? valueAccessor : undefined,
      x1: isVertical && groupSeries ? (d) => s.value ?? s.key : undefined,
      y1: !isVertical && groupSeries ? (d) => s.value ?? s.key : undefined,
      rounded: isStackLayout && i !== visibleSeries.length - 1 ? 'none' : 'edge',
      radius: 4,
      strokeWidth: 1,
      insets: stackInsets,
      fill: s.color,
      onbarclick: (e, detail) => onbarclick(e, { ...detail, series: s }),
      ...props.bars,
      ...s.props,
      class: cls(
        'transition-opacity',
        highlightSeriesKey && highlightSeriesKey !== s.key && 'opacity-10',
        props.bars?.class,
        s.props?.class
      ),
    };

    return barsProps;
  };

  function getLabelsProps(s: (typeof series)[number], i: number) {
    const labelsProps: ComponentProps<Labels> = {
      // TODO: Improve placement when using `seriesLayout="group"`
      // data: s.data,
      // y: s.value ?? (s.data ? undefined : s.key),
      ...props.labels,
      ...(typeof labels === 'object' ? labels : null),
      class: cls(
        'stroke-surface-200 transition-opacity',
        highlightSeriesKey && highlightSeriesKey !== s.key && 'opacity-10',
        props.labels?.class,
        typeof labels === 'object' && labels.class
      ),
    };

    return labelsProps;
  }

  const selectedSeries = selectionStore();
  $: visibleSeries = series.filter((s) => {
    return (
      // @ts-expect-error
      $selectedSeries.selected.length === 0 || $selectedSeries.isSelected(s.key)
      // || highlightSeriesKey == s.key
    );
  });

  if (profile) {
    console.time('BarChart render');
    onMount(() => {
      console.timeEnd('BarChart render');
    });
  }
</script>

<Chart
  data={chartData}
  x={x ??
    (stackSeries
      ? (d) => visibleSeries.flatMap((s, i) => d.stackData[i])
      : visibleSeries.map((s) => s.value ?? s.key))}
  {xScale}
  {xBaseline}
  xNice={orientation === 'horizontal'}
  {x1Scale}
  {x1Domain}
  {x1Range}
  y={y ??
    (stackSeries
      ? (d) => visibleSeries.flatMap((s, i) => d.stackData[i])
      : visibleSeries.map((s) => s.value ?? s.key))}
  {yScale}
  {yBaseline}
  yNice={orientation === 'vertical'}
  {y1Scale}
  {y1Domain}
  {y1Range}
  c={isVertical ? y : x}
  cRange={['hsl(var(--color-primary))']}
  padding={defaultChartPadding(axis, legend)}
  {...$$restProps}
  tooltip={$$props.tooltip === false
    ? false
    : {
        mode: 'band',
        onclick: ontooltipclick,
        debug,
        ...props.tooltip?.context,
        ...$$props.tooltip,
      }}
  bind:tooltipContext
  let:x
  let:xScale
  let:x1
  let:x1Scale
  let:y1
  let:y
  let:yScale
  let:y1Scale
  let:c
  let:cScale
  let:width
  let:height
  let:padding
  let:tooltip
>
  {@const slotProps = {
    x,
    xScale,
    x1,
    x1Scale,
    y,
    yScale,
    y1,
    y1Scale,
    c,
    cScale,
    width,
    height,
    padding,
    tooltip,
    series,
    visibleSeries,
    getBarsProps,
    getLabelsProps,
    highlightSeriesKey,
    setHighlightSeriesKey,
  }}
  <slot {...slotProps}>
    <slot name="belowContext" {...slotProps} />

    <svelte:component
      this={renderContext === 'canvas' ? Canvas : Svg}
      {...asAny(renderContext === 'canvas' ? props.canvas : props.svg)}
      {debug}
    >
      <slot name="grid" {...slotProps}>
        {#if grid}
          <Grid
            x={!isVertical}
            y={isVertical}
            {...typeof grid === 'object' ? grid : null}
            {...props.grid}
          />
        {/if}
      </slot>

      <slot name="belowMarks" {...slotProps} />

      <slot name="marks" {...slotProps}>
        {#each visibleSeries as s, i (s.key)}
          <Bars {...getBarsProps(s, i)} />
        {/each}
      </slot>

      <slot name="aboveMarks" {...slotProps} />

      <slot name="axis" {...slotProps}>
        {#if axis}
          {#if axis !== 'x'}
            <Axis
              placement="left"
              format={(value) => {
                if (isVertical && seriesLayout === 'stackExpand') {
                  return format(value, 'percentRound');
                } else {
                  return format(value, undefined, { variant: 'short' });
                }
              }}
              {...typeof axis === 'object' ? axis : null}
              {...props.yAxis}
            />
          {/if}

          {#if axis !== 'y'}
            <Axis
              placement="bottom"
              format={(value) => {
                if (!isVertical && seriesLayout === 'stackExpand') {
                  return format(value, 'percentRound');
                } else {
                  return format(value, undefined, { variant: 'short' });
                }
              }}
              {...typeof axis === 'object' ? axis : null}
              {...props.xAxis}
            />
          {/if}

          {#if rule}
            <Rule
              x={isVertical ? false : 0}
              y={isVertical ? 0 : false}
              {...typeof rule === 'object' ? rule : null}
              {...props.rule}
            />
          {/if}
        {/if}
      </slot>

      <slot name="highlight" {...slotProps}>
        <Highlight area {...props.highlight} />
      </slot>

      {#if labels}
        {#each visibleSeries as s, i (s.key)}
          <Labels {...getLabelsProps(s, i)} />
        {/each}
      {/if}
    </svelte:component>

    <slot name="aboveContext" {...slotProps} />

    <slot name="legend" {...slotProps}>
      {#if legend}
        <Legend
          scale={isDefaultSeries
            ? undefined
            : scaleOrdinal(
                series.map((s) => s.key),
                series.map((s) => s.color)
              )}
          tickFormat={(key) => series.find((s) => s.key === key)?.label ?? key}
          placement="bottom"
          variant="swatches"
          onclick={(e, item) => $selectedSeries.toggleSelected(item.value)}
          onpointerenter={(e, item) => (highlightSeriesKey = item.value)}
          onpointerleave={(e) => (highlightSeriesKey = null)}
          {...props.legend}
          {...typeof legend === 'object' ? legend : null}
          classes={{
            item: (item) =>
              visibleSeries.length && !visibleSeries.some((s) => s.key === item.value)
                ? 'opacity-50'
                : '',
            ...props.legend?.classes,
            ...(typeof legend === 'object' ? legend.classes : null),
          }}
        />
      {/if}
    </slot>

    <slot name="tooltip" {...slotProps}>
      <TooltipRoot {...props.tooltip?.root} let:data>
        <TooltipHeader
          value={isVertical ? x(data) : y(data)}
          {format}
          {...props.tooltip?.header}
        />

        <TooltipList {...props.tooltip?.list}>
          <!-- Reverse series order so tooltip items match stacks -->
          {@const seriesItems = stackSeries ? [...visibleSeries].reverse() : visibleSeries}
          {#each seriesItems as s}
            {@const seriesTooltipData = s.data ? findRelatedData(s.data, data, x) : data}
            {@const valueAccessor = accessor(s.value ?? (s.data ? asAny(y) : s.key))}
            <TooltipItem
              label={s.label ?? (s.key !== 'default' ? s.key : 'value')}
              value={seriesTooltipData ? valueAccessor(seriesTooltipData) : null}
              color={s.color ?? cScale?.(c(data))}
              {format}
              valueAlign="right"
              onpointerenter={() => (highlightSeriesKey = s.key)}
              onpointerleave={() => (highlightSeriesKey = null)}
              {...props.tooltip?.item}
            />
          {/each}

          {#if (stackSeries || groupSeries) && visibleSeries.length > 1 && !props.tooltip?.hideTotal}
            <TooltipSeparator {...props.tooltip?.separator} />

            <TooltipItem
              label="total"
              value={sum(visibleSeries, (s) => {
                const seriesTooltipData = s.data ? findRelatedData(s.data, data, x) : data;
                const valueAccessor = accessor(s.value ?? (s.data ? asAny(y) : s.key));
                return valueAccessor(seriesTooltipData);
              })}
              format="integer"
              valueAlign="right"
              {...props.tooltip?.item}
            />
          {/if}
        </TooltipList>
      </TooltipRoot>
    </slot>
  </slot>
</Chart>
