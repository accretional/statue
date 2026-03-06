<!--
This is a Svelte component from LayerChart:

Demo Site: [layerchart.com](https://www.layerchart.com/)
GitHub Repository: [techniq/layerchart](https://github.com/techniq/layerchart)

All components in this directory are sourced from the LayerChart project. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
  import { onDestroy, tick } from 'svelte';
  import { spring as springFn, tweened as tweenedFn } from 'svelte/motion';
  import type { spring as springStore, tweened as tweenedStore } from 'svelte/motion';
  import { writable } from 'svelte/store';
  import { cls } from '@layerstack/tailwind';
  import { objectId } from '@layerstack/utils/object';
  import { merge, memoize } from 'lodash-es';

  import { getRenderContext } from './Chart.svelte';
  import { getCanvasContext } from './layout/Canvas.svelte';

  // Inlined from $lib/utils/string.js
  const MEASUREMENT_ELEMENT_ID = '__text_measurement_id';

  function _getStringWidth(str: string, style?: CSSStyleDeclaration) {
    try {
      // Calculate length of each word to be used to determine number of words per line
      let textEl = document.getElementById(
        MEASUREMENT_ELEMENT_ID
      ) as unknown as SVGTextElement | null;
      if (!textEl) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.width = '0';
        svg.style.height = '0';
        svg.style.position = 'absolute';
        svg.style.top = '-100%';
        svg.style.left = '-100%';
        textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textEl.setAttribute('id', MEASUREMENT_ELEMENT_ID);
        svg.appendChild(textEl);
        document.body.appendChild(svg);
      }

      Object.assign(textEl.style, style);
      textEl.textContent = str;
      return textEl.getComputedTextLength();
    } catch (e) {
      return null;
    }
  }

  const getStringWidth = memoize(
    _getStringWidth,
    (str, style) => `${str}_${JSON.stringify(style)}`
  );

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

  // Inlined from ../utils/canvas.js
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

  function renderText(
    ctx: CanvasRenderingContext2D,
    text: string | number | null | undefined,
    coords: { x: number; y: number },
    styleOptions: ComputedStylesOptions = {}
  ) {
    if (text) {
      renderCanvas(
        ctx,
        {
          fill: (ctx) => ctx.fillText(text.toString(), coords.x, coords.y),
          stroke: (ctx) => ctx.strokeText(text.toString(), coords.x, coords.y),
        },
        styleOptions
      );
    }
  }

  /*
    TODO:
      - [ ] Handle styled text (use <slot /> to measure?)
			- [ ] Simplify by using `alignment-baseline` / `dominant-baseline`, rework multiline or drop support, etc
			  - https://svelte.dev/repl/f12d3003313a43ba8a0be53e5786f1c7?version=3.44.3
				- https://observablehq.com/@neocartocnrs/cheat-sheet-on-texts-in-svg

    Reference:
    - https://bl.ocks.org/mbostock/7555321
    - https://github.com/airbnb/visx/blob/master/packages/visx-text/src/Text.tsx
      - https://airbnb.io/visx/text
      - https://github.com/airbnb/visx/blob/master/packages/visx-demo/src/pages/text.tsx
  */

  /** text value */
  export let value: string | number = 0;

  /** Maximum width to occupy (approximate as words are not split) */
  export let width: number | undefined = undefined;

  /** x position of the text */
  export let x: string | number = 0;
  export let initialX = x;

  /** y position of the text */
  export let y: string | number = 0;
  export let initialY = y;

  /** dx offset of the text */
  export let dx: string | number = 0;

  /** dy offset of the text */
  export let dy: string | number = 0;

  /** Desired "line height" of the text, implemented as y offsets */
  export let lineHeight = '1em';

  /** Cap height of the text */
  export let capHeight = '0.71em'; // Magic number from d3

  /** Whether to scale the fontSize to accommodate the specified width  */
  export let scaleToFit: boolean = false;

  /** Horizontal text anchor */
  export let textAnchor: 'start' | 'middle' | 'end' | 'inherit' = 'start';

  /** Vertical text anchor */
  export let verticalAnchor: 'start' | 'middle' | 'end' | 'inherit' = 'end'; // default SVG behavior

  /** Rotational angle of the text */
  export let rotate: number | undefined = undefined;

  export let fill: string | undefined = undefined;
  export let fillOpacity: number | undefined = undefined;
  export let stroke: string | undefined = undefined;
  export let strokeWidth: number | undefined = undefined;

  let className: string | undefined = undefined;
  export { className as class };

  let wordsByLines: { words: string[]; width?: number }[] = [];
  let wordsWithWidth: { word: string; width: number }[] = [];
  let spaceWidth: number = 0;

  let style: CSSStyleDeclaration | undefined = undefined; // TODO: read from DOM?

  $: words = value != null ? value.toString().split(/(?:(?!\u00A0+)\s+)/) : [];

  $: wordsWithWidth = words.map((word) => ({
    word,
    width: getStringWidth(word, style) || 0,
  }));

  $: spaceWidth = getStringWidth('\u00A0', style) || 0;

  $: wordsByLines = wordsWithWidth.reduce((result: typeof wordsByLines, item) => {
    const currentLine = result[result.length - 1];

    if (
      currentLine &&
      (width == null || scaleToFit || (currentLine.width || 0) + item.width + spaceWidth < width)
    ) {
      // Word can be added to an existing line
      currentLine.words.push(item.word);
      currentLine.width = currentLine.width || 0;
      currentLine.width += item.width + spaceWidth;
    } else {
      // Add first word to line or word is too long to scaleToFit on existing line
      const newLine = { words: [item.word], width: item.width };
      result.push(newLine);
    }

    return result;
  }, []);
  $: lines = wordsByLines.length;

  /**
   * Convert css value to pixel value (ex. 0.71em => 11.36)
   */
  function getPixelValue(cssValue: number | string) {
    // TODO: Properly measure pixel values using DOM (handle inherited font size, zoom, etc)

    if (typeof cssValue === 'number') {
      return cssValue;
    }

    // @ts-expect-error
    const [match, value, units] = cssValue.match(/([\d.]+)(\D+)/);
    const number = Number(value);
    switch (units) {
      case 'px':
        return number;
      case 'em':
      case 'rem':
        return number * 16;
      default:
        return 0;
    }
  }

  let startDy = 0;
  $: if (verticalAnchor === 'start') {
    startDy = getPixelValue(capHeight);
  } else if (verticalAnchor === 'middle') {
    startDy = ((lines - 1) / 2) * -getPixelValue(lineHeight) + getPixelValue(capHeight) / 2;
  } else {
    startDy = (lines - 1) * -getPixelValue(lineHeight);
  }

  let scaleTransform = '';
  $: if (
    scaleToFit &&
    lines > 0 &&
    typeof x == 'number' &&
    typeof y == 'number' &&
    typeof width == 'number'
  ) {
    const lineWidth = wordsByLines[0].width || 1;
    const sx = width / lineWidth;
    const sy = sx;
    const originX = x - sx * x;
    const originY = y - sy * y;
    scaleTransform = `matrix(${sx}, 0, 0, ${sy}, ${originX}, ${originY})`;
  } else {
    scaleTransform = '';
  }
  $: rotateTransform = rotate ? `rotate(${rotate}, ${x}, ${y})` : '';

  $: transform = `${scaleTransform} ${rotateTransform}`;

  function isValidXOrY(xOrY: string | number | undefined) {
    return (
      // number that is not NaN or Infinity
      (typeof xOrY === 'number' && Number.isFinite(xOrY)) ||
      // for percentage
      typeof xOrY === 'string'
    );
  }

  export let spring: boolean | Parameters<typeof springStore>[1] = undefined;
  export let tweened: boolean | Parameters<typeof tweenedStore>[1] = undefined;

  let tweened_x = motionStore(initialX, { spring, tweened });
  let tweened_y = motionStore(initialY, { spring, tweened });

  $: tick().then(() => {
    tweened_x.set(x);
    tweened_y.set(y);
  });

  const renderContext = getRenderContext();
  const canvasContext = getCanvasContext();

  function render(
    ctx: CanvasRenderingContext2D,
    styleOverrides: ComputedStylesOptions | undefined
  ) {
    wordsByLines.forEach((line, index) => {
      renderText(
        ctx,
        line.words.join(' '),
        {
          x: getPixelValue($tweened_x) + getPixelValue(dx),
          y:
            getPixelValue($tweened_y) +
            getPixelValue(dy) +
            (index === 0 ? startDy : getPixelValue(lineHeight)),
        },
        styleOverrides
          ? merge({ styles: { strokeWidth } }, styleOverrides)
          : {
              styles: { fill, fillOpacity, stroke, strokeWidth, paintOrder: 'stroke', textAnchor },
              classes: cls(fill === undefined && 'fill-surface-content', className),
            }
      );
    });
  }

  // TODO: Use objectId to work around Svelte 4 reactivity issue (even when memoizing gradients)
  $: fillKey = fill && typeof fill === 'object' ? objectId(fill) : fill;
  $: strokeKey = stroke && typeof stroke === 'object' ? objectId(stroke) : stroke;

  $: if (renderContext === 'canvas') {
    // Redraw when props change
    value && $tweened_x && $tweened_y && fillKey && strokeKey && strokeWidth && className;
    canvasContext.invalidate();
  }

  let canvasUnregister: ReturnType<typeof canvasContext.register>;
  $: if (renderContext === 'canvas') {
    canvasUnregister = canvasContext.register({ name: 'Text', render });
  }

  onDestroy(() => {
    if (renderContext === 'canvas') {
      canvasUnregister();
    }
  });
</script>

{#if renderContext === 'svg'}
  <!-- `overflow: visible` allow contents to be shown outside element -->
  <!-- `paint-order: stroke` supports stroke outlining text  -->
  <svg x={dx} y={dy} class="overflow-visible [paint-order:stroke]">
    {#if isValidXOrY(x) && isValidXOrY(y)}
      <text
        x={$tweened_x}
        y={$tweened_y}
        {transform}
        text-anchor={textAnchor}
        {...$$restProps}
        {fill}
        fill-opacity={fillOpacity}
        {stroke}
        stroke-width={strokeWidth}
        class={cls(fill === undefined && 'fill-surface-content', className)}
      >
        {#each wordsByLines as line, index}
          <tspan x={$tweened_x} dy={index === 0 ? startDy : lineHeight}>
            {line.words.join(' ')}
          </tspan>
        {/each}
      </text>
    {/if}
  </svg>
{/if}
