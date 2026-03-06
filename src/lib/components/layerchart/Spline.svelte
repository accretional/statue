<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { onDestroy, tick, type ComponentProps } from 'svelte';
  import { writable } from 'svelte/store';
  import { spring as springFn, tweened as tweenedFn, tweened as tweenedStore } from 'svelte/motion';
  import { draw as _drawTransition } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';
  import { merge, get } from 'lodash-es';

  import { line as d3Line, lineRadial } from 'd3-shape';
  import type { CurveFactory, CurveFactoryLineOnly, Line } from 'd3-shape';
  import type { ScaleBand } from 'd3-scale';
  // import { interpolateString } from 'd3-interpolate';
  import { interpolatePath } from 'd3-interpolate-path';
  import { max } from 'd3-array';
  import { cls } from '@layerstack/tailwind';
  import { uniqueId } from '@layerstack/utils';
  import { objectId } from '@layerstack/utils/object';

  import { chartContext } from './ChartContext.svelte';
  import Group from './Group.svelte';
  import Marker from './Marker.svelte';
  import { getCanvasContext } from './layout/Canvas.svelte';
  import { getRenderContext } from './Chart.svelte';

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

  // Inlined from ../utils/common.js
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

  // Inlined from ../utils/scales.js
  interface AnyScale<Domain = any, Range = any, Input = Domain, Output = any> {
    (value: Input): Output;
    bandwidth?: Function;
  }

  function isScaleBand(scale: AnyScale<any, any>): scale is ScaleBand<any> {
    return typeof scale.bandwidth === 'function';
  }

  // Inlined from ../utils/path.js
  function flattenPathData(pathData: string, yOverride = 0) {
    let result = pathData;

    // Match commands with y-coordinates, and replace `y` coordinate with `0` (or override such as `yScale(0)`)
    result = result.replace(/([MLTQCSAZ])(-?\d*\.?\d+),(-?\d*\.?\d+)/g, (match, command, x, y) => {
      return `${command}${x},${yOverride}`;
    });

    // Replace all vertical line commands (ex. `v123`) with `0` height
    result = result.replace(/([v])(-?\d*\.?\d+)/g, (match, command, l) => {
      return `${command}${0}`;
    });

    return result;
  }

  // Inlined from $lib/utils/canvas.js
  type ComputedStylesOptions = {
    styles?: Partial<
      Omit<CSSStyleDeclaration, 'fillOpacity' | 'strokeWidth' | 'opacity'> & {
        fillOpacity?: number | string;
        strokeWidth?: number | string;
        opacity?: number | string;
      }
    >;
    classes?: any;
  };

  const DEFAULT_FILL = 'rgb(0, 0, 0)';
  const CANVAS_STYLES_ELEMENT_ID = '__layerchart_canvas_styles_id';

  function getComputedStyles(
    canvas: HTMLCanvasElement,
    { styles, classes }: ComputedStylesOptions = {}
  ) {
    try {
      let svg = document.getElementById(CANVAS_STYLES_ELEMENT_ID) as SVGElement | null;

      if (!svg) {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('id', CANVAS_STYLES_ELEMENT_ID);
        svg.style.display = 'none';
        canvas.after(svg);
      }
      svg = svg!;

      svg.removeAttribute('style');
      svg.removeAttribute('class');

      if (styles) {
        Object.assign(svg.style, styles);
      }

      if (classes) {
        svg.setAttribute(
          'class',
          cls(classes)
            .split(' ')
            .filter((s) => !s.startsWith('transition-'))
            .join(' ')
        );
      }

      const computedStyles = window.getComputedStyle(svg);
      return computedStyles;
    } catch (e) {
      console.error('Unable to get computed styles', e);
      return {} as CSSStyleDeclaration;
    }
  }

  function renderCanvas(
    ctx: CanvasRenderingContext2D,
    renderOps: {
      stroke: (ctx: CanvasRenderingContext2D) => void;
      fill: (ctx: CanvasRenderingContext2D) => void;
    },
    styleOptions: ComputedStylesOptions = {}
  ) {
    const computedStyles = getComputedStyles(ctx.canvas, styleOptions);

    const paintOrder =
      computedStyles?.paintOrder === 'stroke' ? ['stroke', 'fill'] : ['fill', 'stroke'];

    if (computedStyles?.opacity) {
      ctx.globalAlpha = Number(computedStyles?.opacity);
    }

    ctx.font = `${computedStyles.fontSize} ${computedStyles.fontFamily}`;

    if (computedStyles.textAnchor === 'middle') {
      ctx.textAlign = 'center';
    } else if (computedStyles.textAnchor === 'end') {
      ctx.textAlign = 'right';
    } else {
      ctx.textAlign = computedStyles.textAlign as CanvasTextAlign;
    }

    if (computedStyles.strokeDasharray.includes(',')) {
      const dashArray = computedStyles.strokeDasharray
        .split(',')
        .map((s) => Number(s.replace('px', '')));
      ctx.setLineDash(dashArray);
    }

    paintOrder.forEach((attr) => {
      if (attr === 'fill') {
        const fill =
          styleOptions.styles?.fill &&
          ((styleOptions.styles?.fill as any) instanceof CanvasGradient ||
            !styleOptions.styles?.fill?.includes('var'))
            ? styleOptions.styles.fill
            : computedStyles?.fill;

        if (fill && !['none', DEFAULT_FILL].includes(fill)) {
          const currentGlobalAlpha = ctx.globalAlpha;

          const fillOpacity = Number(computedStyles?.fillOpacity);
          const opacity = Number(computedStyles?.opacity);
          ctx.globalAlpha = fillOpacity * opacity;

          ctx.fillStyle = fill;
          renderOps.fill(ctx);

          ctx.globalAlpha = currentGlobalAlpha;
        }
      } else if (attr === 'stroke') {
        const stroke =
          styleOptions.styles?.stroke &&
          ((styleOptions.styles?.stroke as any) instanceof CanvasGradient ||
            !styleOptions.styles?.stroke?.includes('var'))
            ? styleOptions.styles?.stroke
            : computedStyles?.stroke;

        if (stroke && !['none'].includes(stroke)) {
          ctx.lineWidth =
            typeof computedStyles?.strokeWidth === 'string'
              ? Number(computedStyles?.strokeWidth?.replace('px', ''))
              : (computedStyles?.strokeWidth ?? 1);

          ctx.strokeStyle = stroke;
          renderOps.stroke(ctx);
        }
      }
    });
  }

  function renderPathData(
    ctx: CanvasRenderingContext2D,
    pathData: string,
    styleOptions: ComputedStylesOptions = {}
  ) {
    const path = new Path2D(pathData);

    renderCanvas(
      ctx,
      {
        fill: (ctx) => ctx.fill(path),
        stroke: (ctx) => ctx.stroke(path),
      },
      styleOptions
    );
  }

  const {
    data: contextData,
    xScale,
    yScale,
    x: contextX,
    y: contextY,
    yRange,
    radial,
    config,
  } = chartContext();

  /** Override data instead of using context */
  export let data: any = undefined;

  /** Pass `<path d={...} />` explicitly instead of calculating from data / context */
  export let pathData: string | undefined | null = undefined;

  /** Override `x` accessor from Chart context */
  export let x: Accessor = undefined;
  /** Override `y` accessor from Chart context */
  export let y: Accessor = undefined;

  /** Interpolate path data using d3-interpolate-path.  Works best without `draw` enabled */
  export let tweened: boolean | Parameters<typeof tweenedStore>[1] = undefined;
  /** Draw path over time.  Works best without `tweened` enabled */
  export let draw: boolean | Parameters<typeof _drawTransition>[1] = undefined;

  /**
   * Curve of spline drawn. Imported via d3-shape.
   *
   * @example
   * import { curveNatural } from 'd3-shape';
   * <Spline curve={curveNatrual} />
   *
   * @type {CurveFactory | CurveFactoryLineOnly | undefined}
   */
  export let curve: CurveFactory | CurveFactoryLineOnly | undefined = undefined;
  export let defined: Parameters<Line<any>['defined']>[0] | undefined = undefined;

  export let fill: string | undefined = undefined;
  export let stroke: string | undefined = undefined;
  export let strokeWidth: number | undefined = undefined;
  export let opacity: number | undefined = undefined;

  let className: string | undefined = undefined;
  export { className as class };

  export let onclick: ((e: MouseEvent) => void) | undefined = undefined;
  export let onpointerenter: ((e: PointerEvent) => void) | undefined = undefined;
  export let onpointermove: ((e: PointerEvent) => void) | undefined = undefined;
  export let onpointerleave: ((e: PointerEvent) => void) | undefined = undefined;
  export let onpointerdown: ((e: PointerEvent) => void) | undefined = undefined;
  export let ontouchmove: ((e: TouchEvent) => void) | undefined = undefined;
  export let onpointerover: ((e: PointerEvent) => void) | undefined = undefined;
  export let onpointerout: ((e: PointerEvent) => void) | undefined = undefined;

  /** Marker to attach to start, mid, and end points of path */
  export let marker: ComponentProps<Marker>['type'] | ComponentProps<Marker> | undefined =
    undefined;
  /** Marker to attach to start point of path */
  export let markerStart: ComponentProps<Marker>['type'] | ComponentProps<Marker> | undefined =
    marker;
  /** Marker to attach to all mid points of path */
  export let markerMid: ComponentProps<Marker>['type'] | ComponentProps<Marker> | undefined =
    marker;
  /** Marker to attach to end point of path */
  export let markerEnd: ComponentProps<Marker>['type'] | ComponentProps<Marker> | undefined =
    marker;

  $: markerStartId = markerStart || $$slots['markerStart'] ? uniqueId('marker-') : '';
  $: markerMidId = markerMid || $$slots['markerMid'] ? uniqueId('marker-') : '';
  $: markerEndId = markerEnd || $$slots['markerEnd'] ? uniqueId('marker-') : '';

  function getScaleValue(data: any, scale: typeof $xScale | typeof $yScale, accessor: Function) {
    let value = accessor(data);

    if (Array.isArray(value)) {
      value = max(value);
    }

    if (scale.domain().length) {
      // If scale is defined with domain, map value
      return scale(value);
    } else {
      // Use raw value
      return value;
    }
  }

  $: xAccessor = x ? accessor(x) : $contextX;
  $: yAccessor = y ? accessor(y) : $contextY;

  $: xOffset = isScaleBand($xScale) ? $xScale.bandwidth() / 2 : 0;
  $: yOffset = isScaleBand($yScale) ? $yScale.bandwidth() / 2 : 0;

  /** Provide initial `0` horizontal baseline and initially hide/untrack scale changes so not reactive (only set on initial mount) */
  function defaultPathData() {
    if (!tweenedOptions) {
      // If not tweened, return empty string (faster initial render)
      return '';
    } else if (pathData) {
      // Flatten all `y` coordinates of pre-defined `pathData`
      return flattenPathData(pathData, Math.min($yScale(0), $yRange[0]));
    } else if ($config.x) {
      // Only use default line if `x` accessor is defined (cartesian chart)
      const path = $radial
        ? lineRadial()
            .angle((d) => $xScale(xAccessor(d)))
            .radius((d) => Math.min($yScale(0), $yRange[0]))
        : d3Line()
            .x((d) => $xScale(xAccessor(d)) + xOffset)
            .y((d) => Math.min($yScale(0), $yRange[0]));

      path.defined(defined ?? ((d) => xAccessor(d) != null && yAccessor(d) != null));

      if (curve) path.curve(curve);

      return path(data ?? $contextData);
    }
  }

  let d: string | null = '';
  const tweenedOptions = tweened
    ? { interpolate: interpolatePath, ...(typeof tweened === 'object' ? tweened : null) }
    : false;
  $: tweened_d = motionStore(defaultPathData(), { tweened: tweenedOptions });
  $: {
    const path = $radial
      ? lineRadial()
          .angle((d) => getScaleValue(d, $xScale, xAccessor))
          .radius((d) => getScaleValue(d, $yScale, yAccessor))
      : d3Line()
          .x((d) => getScaleValue(d, $xScale, xAccessor) + xOffset)
          .y((d) => getScaleValue(d, $yScale, yAccessor) + yOffset);

    path.defined(defined ?? ((d) => xAccessor(d) != null && yAccessor(d) != null));

    if (curve) path.curve(curve);

    d = pathData ?? path(data ?? $contextData) ?? '';
    tweened_d.set(d);
  }

  $: drawTransition = draw ? _drawTransition : () => ({});

  let key = Symbol();
  $: if (draw) {
    // Anytime the path data changes, redraw
    $tweened_d;
    key = Symbol();
  }

  const renderContext = getRenderContext();
  const canvasContext = getCanvasContext();

  function render(
    ctx: CanvasRenderingContext2D,
    styleOverrides: ComputedStylesOptions | undefined
  ) {
    renderPathData(
      ctx,
      $tweened_d,
      styleOverrides
        ? merge({ styles: { strokeWidth } }, styleOverrides)
        : {
            styles: { fill, stroke, strokeWidth, opacity },
            classes: className,
          }
    );
  }

  // TODO: Use objectId to work around Svelte 4 reactivity issue (even when memoizing gradients)
  $: fillKey = fill && typeof fill === 'object' ? objectId(fill) : fill;
  $: strokeKey = stroke && typeof stroke === 'object' ? objectId(stroke) : stroke;

  $: if (renderContext === 'canvas') {
    // Redraw when props change
    $tweened_d && fillKey && strokeKey && strokeWidth && className;
    canvasContext.invalidate();
  }

  let canvasUnregister: ReturnType<typeof canvasContext.register>;
  $: if (renderContext === 'canvas') {
    canvasUnregister = canvasContext.register({
      name: 'Spline',
      render,
      events: {
        click: onclick,
        pointerenter: onpointerenter,
        pointermove: onpointermove,
        pointerleave: onpointerleave,
        pointerdown: onpointerdown,
        pointerover: onpointerover,
        pointerout: onpointerout,
        touchmove: ontouchmove,
      },
    });
  }

  onDestroy(() => {
    if (renderContext === 'canvas') {
      canvasUnregister();
    }
  });

  let pathEl: SVGPathElement | undefined = undefined;
  const startPoint = writable<DOMPoint | undefined>(undefined);
  $: endPoint = motionStore<DOMPoint | undefined>(undefined, {
    tweened: draw
      ? {
          duration: (typeof draw === 'object' && draw.duration) || 800,
          easing: (typeof draw === 'object' && draw.easing) || cubicInOut,
          interpolate(a, b) {
            return (t: number) => {
              const totalLength = pathEl?.getTotalLength() ?? 0;
              const point = pathEl?.getPointAtLength(totalLength * t);
              return point;
            };
          },
        }
      : false,
  });

  $: {
    if ($$slots.start || $$slots.end) {
      // Wait for path data to update DOM, then update
      d;
      tick().then(() => {
        if (pathEl) {
          startPoint.set(pathEl.getPointAtLength(0));

          const totalLength = pathEl.getTotalLength();
          endPoint.set(pathEl.getPointAtLength(totalLength));
        }
      });
    }
  }
</script>

{#if renderContext === 'svg'}
  {#key key}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <path
      d={$tweened_d}
      {...$$restProps}
      class={cls('path-line', !fill && 'fill-none', !stroke && 'stroke-surface-content', className)}
      {fill}
      {stroke}
      stroke-width={strokeWidth}
      {opacity}
      marker-start={markerStartId ? `url(#${markerStartId})` : undefined}
      marker-mid={markerMidId ? `url(#${markerMidId})` : undefined}
      marker-end={markerEndId ? `url(#${markerEndId})` : undefined}
      in:drawTransition|global={typeof draw === 'object' ? draw : undefined}
      on:click={onclick}
      on:pointerenter={onpointerenter}
      on:pointermove={onpointermove}
      on:pointerleave={onpointerleave}
      on:pointerdown={onpointerdown}
      on:pointerover={onpointerover}
      on:pointerout={onpointerout}
      on:touchmove={ontouchmove}
      bind:this={pathEl}
    />

    <slot name="markerStart" id={markerStartId}>
      {#if markerStart}
        <Marker
          id={markerStartId}
          type={typeof markerStart === 'string' ? markerStart : undefined}
          {...typeof markerStart === 'object' ? markerStart : null}
        />
      {/if}
    </slot>

    <slot name="markerMid" id={markerMidId}>
      {#if markerMid}
        <Marker
          id={markerMidId}
          type={typeof markerMid === 'string' ? markerMid : undefined}
          {...typeof markerMid === 'object' ? markerMid : null}
        />
      {/if}
    </slot>

    <slot name="markerEnd" id={markerEndId}>
      {#if markerEnd}
        <Marker
          id={markerEndId}
          type={typeof markerEnd === 'string' ? markerEnd : undefined}
          {...typeof markerEnd === 'object' ? markerEnd : null}
        />
      {/if}
    </slot>

    {#if $$slots.start && $startPoint}
      <Group x={$startPoint.x} y={$startPoint.y}>
        <slot name="start" point={$startPoint} />
      </Group>
    {/if}

    {#if $$slots.end && $endPoint}
      <Group x={$endPoint.x} y={$endPoint.y}>
        <slot name="end" point={$endPoint} />
      </Group>
    {/if}
  {/key}
{/if}
