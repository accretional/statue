<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { onDestroy, tick } from 'svelte';
  import type { spring as springStore, tweened as tweenedStore } from 'svelte/motion';
  import { cls } from '@layerstack/tailwind';
  import { objectId } from '@layerstack/utils/object';
  import { merge } from 'lodash-es';
  import { writable } from 'svelte/store';
  import { spring as springFn, tweened as tweenedFn } from 'svelte/motion';

  import { getRenderContext } from './Chart.svelte';
  import { getCanvasContext } from './layout/Canvas.svelte';

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

  function renderCircle(
    ctx: CanvasRenderingContext2D,
    coords: { cx: number; cy: number; r: number },
    styleOptions: ComputedStylesOptions = {}
  ) {
    ctx.beginPath();
    ctx.arc(coords.cx, coords.cy, coords.r, 0, 2 * Math.PI);
    renderCanvas(
      ctx,
      {
        fill: (ctx) => {
          ctx.fill();
        },
        stroke: (ctx) => {
          ctx.stroke();
        },
      },
      styleOptions
    );
    ctx.closePath();
  }

  export let cx: number = 0;
  export let initialCx = cx;

  export let cy: number = 0;
  export let initialCy = cy;

  export let r: number = 1;
  export let initialR = r;

  export let spring: boolean | Parameters<typeof springStore>[1] = undefined;
  export let tweened: boolean | Parameters<typeof tweenedStore>[1] = undefined;

  export let fill: string | undefined = undefined;
  export let fillOpacity: number | undefined = undefined;
  export let stroke: string | undefined = undefined;
  export let strokeWidth: number | undefined = undefined;

  let className: string | undefined = undefined;
  export { className as class };

  export let onclick: ((e: MouseEvent) => void) | undefined = undefined;
  export let onpointerdown: ((e: PointerEvent) => void) | undefined = undefined;
  export let onpointerenter: ((e: PointerEvent) => void) | undefined = undefined;
  export let onpointermove: ((e: PointerEvent) => void) | undefined = undefined;
  export let onpointerleave: ((e: PointerEvent) => void) | undefined = undefined;

  let tweened_cx = motionStore(initialCx, { spring, tweened });
  let tweened_cy = motionStore(initialCy, { spring, tweened });
  let tweened_r = motionStore(initialR, { spring, tweened });

  $: tick().then(() => {
    tweened_cx.set(cx);
    tweened_cy.set(cy);
    tweened_r.set(r);
  });

  const renderContext = getRenderContext();
  const canvasContext = getCanvasContext();

  function render(
    ctx: CanvasRenderingContext2D,
    styleOverrides: ComputedStylesOptions | undefined
  ) {
    renderCircle(
      ctx,
      { cx: $tweened_cx, cy: $tweened_cy, r: $tweened_r },
      styleOverrides
        ? merge({ styles: { strokeWidth } }, styleOverrides)
        : {
            styles: { fill, fillOpacity, stroke, strokeWidth },
            classes: className,
          }
    );
  }

  // TODO: Use objectId to work around Svelte 4 reactivity issue (even when memoizing gradients)
  $: fillKey = fill && typeof fill === 'object' ? objectId(fill) : fill;
  $: strokeKey = stroke && typeof stroke === 'object' ? objectId(stroke) : stroke;

  $: if (renderContext === 'canvas') {
    // Redraw when props changes
    $tweened_cx &&
      $tweened_cy &&
      $tweened_r &&
      fillKey &&
      fillOpacity &&
      strokeKey &&
      strokeWidth &&
      className;
    canvasContext.invalidate();
  }

  let canvasUnregister: ReturnType<typeof canvasContext.register>;
  $: if (renderContext === 'canvas') {
    canvasUnregister = canvasContext.register({
      name: 'Circle',
      render,
      events: {
        click: onclick,
        pointerdown: onpointerdown,
        pointerenter: onpointerenter,
        pointermove: onpointermove,
        pointerleave: onpointerleave,
      },
    });
  }

  onDestroy(() => {
    if (renderContext === 'canvas') {
      canvasUnregister();
    }
  });
</script>

{#if renderContext === 'svg'}
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <circle
    cx={$tweened_cx}
    cy={$tweened_cy}
    r={$tweened_r}
    {fill}
    fill-opacity={fillOpacity}
    {stroke}
    stroke-width={strokeWidth}
    class={cls(fill == null && 'fill-surface-content', className)}
    {...$$restProps}
    on:click={onclick}
    on:pointerdown={onpointerdown}
    on:pointerenter={onpointerenter}
    on:pointermove={onpointermove}
    on:pointerleave={onpointerleave}
  />
{/if}
