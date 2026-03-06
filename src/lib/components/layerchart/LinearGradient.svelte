<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { onDestroy } from 'svelte';
  import { uniqueId } from '@layerstack/utils';

  import { getRenderContext } from './Chart.svelte';
  import { chartContext } from './ChartContext.svelte';
  import { getCanvasContext } from './layout/Canvas.svelte';
  import { cls } from '@layerstack/tailwind';
  import { memoize } from 'lodash-es';

  // Inlined from ../utils/math.js
  function parsePercent(percent: string | number) {
    if (typeof percent === 'number') {
      return percent;
    } else {
      return Number(percent.replace('%', '')) / 100;
    }
  }

  // Inlined from ../utils/canvas.js
  const CANVAS_STYLES_ELEMENT_ID = '__layerchart_canvas_styles_id';

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

  function _createLinearGradient(
    ctx: CanvasRenderingContext2D,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    stops: { offset: number; color: string }[]
  ) {
    const gradient = ctx.createLinearGradient(x0, y0, x1, y1);

    stops.forEach(({ offset, color }) => {
      gradient.addColorStop(offset, color);
    });

    return gradient;
  }

  const createLinearGradient = memoize(
    _createLinearGradient,
    (
      ctx: CanvasRenderingContext2D,
      x0: number,
      y0: number,
      x1: number,
      y1: number,
      stops: { offset: number; color: string }[]
    ) => {
      const key = JSON.stringify({ x0, y0, x1, y1, stops });
      return key;
    }
  );

  /** Unique id for linearGradient */
  export let id: string = uniqueId('linearGradient-');

  /** Array array of strings (colors), will equally distributed from 0-100%.  If array of tuples, will use first value as the offset, and second as color */
  export let stops: string[] | [string | number, string][] = [
    'var(--tw-gradient-from)',
    'var(--tw-gradient-to)',
  ];

  /** Apply color stops top-to-bottom (true) or left-to-right (false) */
  export let vertical = false;
  export let x1 = '0%';
  export let y1 = '0%';
  export let x2 = vertical ? '0%' : '100%';
  export let y2 = vertical ? '100%' : '0%';

  export let rotate: number | undefined = undefined;

  /** Define the coordinate system for attributes (i.e. gradientUnits) */
  export let units: 'objectBoundingBox' | 'userSpaceOnUse' = 'objectBoundingBox';

  const { width, height, padding } = chartContext();

  const renderContext = getRenderContext();
  const canvasContext = getCanvasContext();

  let canvasGradient: CanvasGradient;

  function render(ctx: CanvasRenderingContext2D) {
    // Use `getComputedStyles()` to convert each stop (if using CSS variables and/or classes) to color values
    const _stops = stops.map((stop, i) => {
      if (Array.isArray(stop)) {
        const { fill } = getComputedStyles(ctx.canvas, {
          styles: { fill: stop[1] },
          classes: $$props.class,
        });
        return { offset: parsePercent(stop[0]), color: fill };
      } else {
        const { fill } = getComputedStyles(ctx.canvas, {
          styles: { fill: stop },
          classes: $$props.class,
        });
        return { offset: i / (stops.length - 1), color: fill };
      }
    });

    // TODO: Use x1/y1/x2/y2 values (convert from pecentage strings)
    const gradient = createLinearGradient(
      ctx,
      $padding.left,
      $padding.top,
      vertical ? $padding.left : $width - $padding.right,
      vertical ? $height + $padding.bottom : $padding.top,
      _stops
    );

    canvasGradient = gradient;
  }

  $: if (renderContext === 'canvas') {
    // Redraw when props changes (TODO: styles, class, etc)
    x1 && y1 && x2 && y2 && stops;
    canvasContext.invalidate();
  }

  let canvasUnregister: ReturnType<typeof canvasContext.register>;
  $: if (renderContext === 'canvas') {
    canvasUnregister = canvasContext.register({ name: 'Gradient', render });
  }

  onDestroy(() => {
    if (renderContext === 'canvas') {
      canvasUnregister();
    }
  });
</script>

{#if renderContext === 'canvas'}
  <slot {id} gradient={canvasGradient} />
{:else if renderContext === 'svg'}
  <defs>
    <linearGradient
      {id}
      {x1}
      {y1}
      {x2}
      {y2}
      gradientTransform={rotate ? `rotate(${rotate})` : ''}
      gradientUnits={units}
      {...$$restProps}
    >
      <slot name="stops">
        {#if stops}
          {#each stops as stop, i}
            {#if Array.isArray(stop)}
              <stop offset={stop[0]} stop-color={stop[1]} />
            {:else}
              <stop offset="{i * (100 / (stops.length - 1))}%" stop-color={stop} />
            {/if}
          {/each}
        {/if}
      </slot>
    </linearGradient>
  </defs>

  <slot {id} gradient="url(#{id})" />
{/if}
