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

  /** Unique id for linearGradient */
  export let id: string = uniqueId('radialGradient-');

  /** Array array of strings (colors), will equally distributed from 0-100%.  If array of tuples, will use first value as the offset, and second as color */
  export let stops: string[] | [string | number, string][] = [
    'var(--tw-gradient-from)',
    'var(--tw-gradient-to)',
  ];

  export let cx = '50%';
  export let cy = '50%';
  export let fx = cx;
  export let fy = cy;
  export let r = '50%';
  // TODO: Svelte / Typescript does not know `<radialRadiant fr="...">`
  // export let fr = '0%';

  /** Indicates how the gradient behaves if it starts or ends inside the bounds of the shape containing the gradient */
  export let spreadMethod: 'pad' | 'reflect' | 'repeat' = 'pad';

  export let transform: string | null | undefined = undefined;

  /** Define the coordinate system for attributes (i.e. gradientUnits) */
  export let units: 'objectBoundingBox' | 'userSpaceOnUse' = 'objectBoundingBox';

  const { width, height, padding } = chartContext();

  const renderContext = getRenderContext();
  const canvasContext = getCanvasContext();

  let canvasGradient: CanvasGradient;

  function render(ctx: CanvasRenderingContext2D) {
    // TODO: Set correct values: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createRadialGradient.  See also: LinearGradient
    // TODO: Memoize `createRadialGradient()` (see LinearGradient)
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 0);

    // Use `getComputedStyles()` to convert each stop (if using CSS variables and/or classes) to color values
    stops.forEach((stop, i) => {
      if (Array.isArray(stop)) {
        const { fill } = getComputedStyles(ctx.canvas, {
          styles: { fill: stop[1] },
          classes: $$props.class,
        });
        gradient.addColorStop(parsePercent(stop[0]), fill);
      } else {
        const { fill } = getComputedStyles(ctx.canvas, {
          styles: { fill: stop },
          classes: $$props.class,
        });
        gradient.addColorStop(i / (stops.length - 1), fill);
      }
    });

    canvasGradient = gradient;
  }

  let canvasUnregister: ReturnType<typeof canvasContext.register>;
  $: if (renderContext === 'canvas') {
    canvasUnregister = canvasContext.register({ name: 'Gradient', render });
  }

  $: if (renderContext === 'canvas') {
    // Redraw when props changes (TODO: styles, class, etc)
    stops && cx && cy && fx && fy && $width && $height;
    canvasContext.invalidate();
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
    <radialGradient
      {id}
      {cx}
      {cy}
      {fx}
      {fy}
      {r}
      {spreadMethod}
      gradientTransform={transform}
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
    </radialGradient>
  </defs>

  <slot {id} gradient="url(#{id})" />
{/if}
