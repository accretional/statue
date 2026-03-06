<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { onDestroy } from 'svelte';
  import {
    geoTransform as d3geoTransform,
    type GeoIdentityTransform,
    type GeoPermissibleObjects,
    type GeoProjection,
    type GeoTransformPrototype,
  } from 'd3-geo';
  import { cls } from '@layerstack/tailwind';
  import { merge } from 'lodash-es';

  import { getRenderContext } from './Chart.svelte';
  import { getCanvasContext } from './layout/Canvas.svelte';
  import { geoContext } from './GeoContext.svelte';
  import type { TooltipContextValue } from './tooltip/TooltipContext.svelte';
  import { curveLinearClosed, type CurveFactory, type CurveFactoryLineOnly } from 'd3-shape';
  import { objectId } from '@layerstack/utils/object';
  import { geoPath as d3geoPath, type GeoContext } from 'd3-geo';
  import { path, type Path } from 'd3-path';

  // Inlined from $lib/utils/geo.js
  function geoCurvePath(
    projection: GeoProjection | GeoIdentityTransform | null,
    curve: CurveFactory | CurveFactoryLineOnly,
    context?: CanvasRenderingContext2D | Path
  ): ReturnType<typeof d3geoPath> {
    const pathContext = context === undefined ? path() : context;
    const geoPath = d3geoPath(projection, curveContext(curve(pathContext)));

    const fn = (object: GeoPermissibleObjects) => {
      geoPath(object);
      return context === undefined ? pathContext + '' : undefined;
    };

    Object.setPrototypeOf(fn, geoPath);

    // @ts-expect-error
    return fn;
  }

  function curveContext(curve: ReturnType<CurveFactory | CurveFactoryLineOnly>): GeoContext {
    return {
      beginPath() {},
      moveTo(x, y) {
        curve.lineStart();
        curve.point(x, y);
      },
      arc(x, y, radius, startAngle, endAngle, anticlockwise) {},
      lineTo(x, y) {
        curve.point(x, y);
      },
      closePath() {
        curve.lineEnd();
      },
    };
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
    pathData: string | null | undefined,
    styleOptions: ComputedStylesOptions = {}
  ) {
    const path = new Path2D(pathData ?? '');

    renderCanvas(
      ctx,
      {
        fill: (ctx) => ctx.fill(path),
        stroke: (ctx) => ctx.stroke(path),
      },
      styleOptions
    );
  }

  export let geojson: GeoPermissibleObjects | null | undefined = undefined;

  export let fill: string | undefined = undefined;
  export let stroke: string | undefined = undefined;
  export let strokeWidth: number | undefined = undefined;

  /**
   * Tooltip context to setup pointer events to show tooltip for related data
   */
  export let tooltip: TooltipContextValue | undefined = undefined;

  export let onclick:
    | ((e: MouseEvent, geoPath: ReturnType<typeof geoCurvePath>) => void)
    | undefined = undefined;
  export let onpointerenter: ((e: PointerEvent) => void) | undefined = undefined;
  export let onpointermove: ((e: PointerEvent) => void) | undefined = undefined;
  export let onpointerleave: ((e: PointerEvent) => void) | undefined = undefined;
  export let onpointerdown: ((e: PointerEvent) => void) | undefined = undefined;
  export let ontouchmove: ((e: TouchEvent) => void) | undefined = undefined;

  /**
   * Curve of path drawn. Imported via d3-shape.
   *
   * @example
   * import { curveCatmullRom } from 'd3-shape';
   * <GeoPath curve={curveCatmullRom} />
   *
   * @type {CurveFactory | CurveFactoryLineOnly | undefined}
   */
  export let curve: CurveFactory | CurveFactoryLineOnly = curveLinearClosed;

  let className: string | undefined = undefined;
  export { className as class };

  const geo = geoContext();

  /**
   * Apply geo transform to projection.  Useful to draw straight lines with `geoMercator` projection.
   * See: https://d3js.org/d3-geo/projection#geoTransform and https://stackoverflow.com/a/56409480/191902
   **/
  export let geoTransform:
    | ((projection: GeoProjection | GeoIdentityTransform) => GeoTransformPrototype)
    | undefined = undefined;

  $: _projection = geoTransform ? d3geoTransform(geoTransform($geo)) : $geo;

  $: geoPath = geoCurvePath(_projection, curve);
  $: {
    // Recreate `geoPath()` if `geojson` data changes (fixes ghosting issue when rendering to canvas)
    geojson;
    geoPath = geoCurvePath(_projection, curve);
  }

  const renderContext = getRenderContext();
  const canvasContext = getCanvasContext();

  function render(
    ctx: CanvasRenderingContext2D,
    styleOverrides: ComputedStylesOptions | undefined
  ) {
    if (geojson) {
      const pathData = geoPath(geojson);
      renderPathData(
        ctx,
        pathData,
        styleOverrides
          ? merge({ styles: { strokeWidth } }, styleOverrides)
          : {
              styles: { fill, stroke, strokeWidth },
              classes: className,
            }
      );
    }
  }

  // TODO: Use objectId to work around Svelte 4 reactivity issue (even when memoizing gradients)
  $: fillKey = fill && typeof fill === 'object' ? objectId(fill) : fill;
  $: strokeKey = stroke && typeof stroke === 'object' ? objectId(stroke) : stroke;

  $: if (renderContext === 'canvas') {
    // Redraw when geojson, projection, or class change
    geojson && _projection && fillKey && strokeKey && strokeWidth && className;
    canvasContext.invalidate();
  }

  // Hide `geoPath` and `tooltip` reactivity
  function _onClick(e: MouseEvent) {
    onclick?.(e, geoPath);
  }
  function _onPointerEnter(e: PointerEvent) {
    onpointerenter?.(e);
    tooltip?.show(e, geojson);
  }
  function _onPointerMove(e: PointerEvent) {
    onpointermove?.(e);
    tooltip?.show(e, geojson);
  }
  function _onPointerLeave(e: PointerEvent) {
    onpointerleave?.(e);
    tooltip?.hide();
  }

  let canvasUnregister: ReturnType<typeof canvasContext.register>;
  $: if (renderContext === 'canvas') {
    canvasUnregister = canvasContext.register({
      name: 'GeoPath',
      render,
      events: {
        click: _onClick,
        pointerenter: _onPointerEnter,
        pointermove: _onPointerMove,
        pointerleave: _onPointerLeave,
        pointerdown: onpointerdown,
        touchmove: ontouchmove,
      },
    });
  }

  onDestroy(() => {
    if (renderContext === 'canvas') {
      canvasUnregister();
    }
  });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<slot {geoPath}>
  {#if renderContext === 'svg'}
    <path
      {...$$restProps}
      d={geojson ? geoPath(geojson) : ''}
      {fill}
      {stroke}
      stroke-width={strokeWidth}
      on:click={_onClick}
      on:pointerenter={_onPointerEnter}
      on:pointermove={_onPointerMove}
      on:pointerleave={_onPointerLeave}
      on:pointerdown={onpointerdown}
      on:touchmove={ontouchmove}
      class={cls(fill == null && 'fill-transparent', className)}
    />
  {/if}
</slot>
