<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { onDestroy, tick } from 'svelte';
  import type { ClassValue } from 'svelte/elements';
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

  type PropMotionOptions = {
    spring?: boolean | SpringOptions | { [prop: string]: SpringOptions };
    tweened?: boolean | TweenedOptions | { [prop: string]: TweenedOptions };
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

  function resolveOptions(prop: string, options: PropMotionOptions) {
    return {
      spring:
        typeof options.spring === 'boolean' || options.spring == null
          ? options.spring
          : prop in options.spring
            ? //@ts-expect-error
              options.spring[prop]
            : Object.keys(options.spring).some((key) =>
                  ['precision', 'damping', 'stiffness'].includes(key)
                )
              ? options.tweened
              : false,
      tweened:
        typeof options.tweened === 'boolean' || options.tweened == null
          ? options.tweened
          : prop in options.tweened
            ? //@ts-expect-error
              options.tweened[prop]
            : Object.keys(options.tweened).some((key) =>
                  ['delay', 'duration', 'easing'].includes(key)
                )
              ? options.tweened
              : false,
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

  function renderRect(
    ctx: CanvasRenderingContext2D,
    coords: { x: number; y: number; width: number; height: number },
    styleOptions: ComputedStylesOptions = {}
  ) {
    renderCanvas(
      ctx,
      {
        fill: (ctx) => ctx.fillRect(coords.x, coords.y, coords.width, coords.height),
        stroke: (ctx) => ctx.strokeRect(coords.x, coords.y, coords.width, coords.height),
      },
      styleOptions
    );
  }

  /** Undlying `<rect>` tag when using <Svg>. Useful for bindings. */
  export let element: SVGRectElement | undefined = undefined;

  export let x = 0;
  export let initialX = x;

  export let y = 0;
  export let initialY = y;

  export let width: number;
  export let initialWidth = width;

  export let height: number;
  export let initialHeight = height;

  export let fill: string | undefined = undefined;
  export let fillOpacity: number | undefined = undefined;
  export let stroke: string | undefined = undefined;
  export let strokeWidth: number | undefined = undefined;

  let className: ClassValue | undefined = undefined;
  export { className as class };

  export let onclick: ((e: MouseEvent) => void) | undefined = undefined;
  export let ondblclick: ((e: MouseEvent) => void) | undefined = undefined;
  export let onpointerenter: ((e: PointerEvent) => void) | undefined = undefined;
  export let onpointermove: ((e: PointerEvent) => void) | undefined = undefined;
  export let onpointerleave: ((e: PointerEvent) => void) | undefined = undefined;
  export let onpointerover: ((e: PointerEvent) => void) | undefined = undefined;
  export let onpointerout: ((e: PointerEvent) => void) | undefined = undefined;

  export let spring: boolean | SpringOptions | { [prop: string]: SpringOptions } = undefined;
  export let tweened: boolean | TweenedOptions | { [prop: string]: TweenedOptions } = undefined;

  let tweened_x = motionStore(initialX, resolveOptions('x', { spring, tweened }));
  let tweened_y = motionStore(initialY, resolveOptions('y', { spring, tweened }));
  let tweened_width = motionStore(initialWidth, resolveOptions('width', { spring, tweened }));
  let tweened_height = motionStore(initialHeight, resolveOptions('height', { spring, tweened }));

  $: tick().then(() => {
    tweened_x.set(x);
    tweened_y.set(y);
    tweened_width.set(width);
    tweened_height.set(height);
  });

  const renderContext = getRenderContext();
  const canvasContext = getCanvasContext();

  function render(
    ctx: CanvasRenderingContext2D,
    styleOverrides: ComputedStylesOptions | undefined
  ) {
    renderRect(
      ctx,
      { x: $tweened_x, y: $tweened_y, width: $tweened_width, height: $tweened_height },
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
    // Redraw when props change
    $tweened_x &&
      $tweened_y &&
      $tweened_width &&
      $tweened_height &&
      fillKey &&
      strokeKey &&
      strokeWidth &&
      className;
    canvasContext.invalidate();
  }

  let canvasUnregister: ReturnType<typeof canvasContext.register>;
  $: if (renderContext === 'canvas') {
    canvasUnregister = canvasContext.register({
      name: 'Rect',
      render,
      events: {
        click: onclick,
        dblclick: ondblclick,
        pointerenter: onpointerenter,
        pointermove: onpointermove,
        pointerleave: onpointerleave,
        pointerover: onpointerover,
        pointerout: onpointerout,
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
  <!-- svelte-ignore a11y-mouse-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <rect
    x={$tweened_x}
    y={$tweened_y}
    width={$tweened_width}
    height={$tweened_height}
    {fill}
    fill-opacity={fillOpacity}
    {stroke}
    stroke-width={strokeWidth}
    class={cls(fill == null && 'fill-surface-content', className)}
    {...$$restProps}
    on:click={onclick}
    on:dblclick={ondblclick}
    on:pointerenter={onpointerenter}
    on:pointerover={onpointerover}
    on:pointermove={onpointermove}
    on:pointerout={onpointerout}
    on:pointerleave={onpointerleave}
    bind:this={element}
  />
{/if}
