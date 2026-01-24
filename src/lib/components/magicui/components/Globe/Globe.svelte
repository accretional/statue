<!--
This is a Svelte component from Magic UI:

Demo Site: [animation-svelte.vercel.app](https://animation-svelte.vercel.app/)
GitHub Repository: [SikandarJODD/svelte-animations](https://github.com/SikandarJODD/svelte-animations?tab=readme-ov-file#simple-components)

All components in this directory are sourced from the svelte-animations project by SikandarJODD. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import createGlobe from 'cobe';
	import { spring } from 'svelte/motion';

	let x = spring(0, {
		stiffness: 0.04,
		damping: 0.4,
		precision: 0.005
	});

	// Optional color overrides - if not provided, will use CSS theme variables
	export let baseColorOverride: string | undefined = undefined;
	export let markerColorOverride: string | undefined = undefined;
	export let glowColorOverride: string | undefined = undefined;

	let pointerInteracting: any = null;
	let pointerInteractionMovement = 0;
	let canvas: HTMLCanvasElement;

	let phi = 0;
	let width = 0;
  $effect(() => {
    console.log(width, "X");
  });
	let onResize = () => {
		width = canvas.offsetWidth;
	};

	let onRender = (state: any) => {
		if (!pointerInteracting) {
			phi += 0.005;
		}
		state.phi = phi + $x;
		state.width = width * 2;
		state.height = width * 2;
	};

	// Convert hex color to RGB array (0-1 range) for cobe
	function hexToRgbArray(hex: string): [number, number, number] {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? [
				parseInt(result[1], 16) / 255,
				parseInt(result[2], 16) / 255,
				parseInt(result[3], 16) / 255
			]
			: [0, 0, 0];
	}

	// Get CSS variable color and convert to RGB array
	function getCssColorAsRgb(variableName: string, fallback: string = '#000000'): [number, number, number] {
		if (typeof document === 'undefined') return hexToRgbArray(fallback);

		const value = getComputedStyle(document.documentElement)
			.getPropertyValue(variableName)
			.trim();

		return hexToRgbArray(value || fallback);
	}

	onMount(() => {
		// Adds the resize event listener when the component is mounted
		window.addEventListener('resize', onResize);
		onResize();

		// Get colors from CSS theme variables or use overrides
		const baseColor = baseColorOverride
			? hexToRgbArray(baseColorOverride)
			: getCssColorAsRgb('--color-card', '#2d0a0a');
		const markerColor = markerColorOverride
			? hexToRgbArray(markerColorOverride)
			: getCssColorAsRgb('--color-primary', '#ef4444');
		const glowColor = glowColorOverride
			? hexToRgbArray(glowColorOverride)
			: getCssColorAsRgb('--color-accent', '#dc2626');

		// Initializes the globe with specific options
		const globe = createGlobe(canvas, {
			devicePixelRatio: 2,
			width: width,
			height: width,
			phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 0.4, // 1.2
      mapSamples: 16000,
      mapBrightness: 1.2, // 6
      baseColor: baseColor,
      markerColor: markerColor,
      glowColor: glowColor,
			markers: [
				{ location: [14.5995, 120.9842], size: 0.03 },
				{ location: [19.076, 72.8777], size: 0.03 },
				{ location: [23.8103, 90.4125], size: 0.05 },
				{ location: [30.0444, 31.2357], size: 0.07 },
				{ location: [39.9042, 116.4074], size: 0.08 },
				{ location: [-23.5505, -46.6333], size: 0.05 },
				{ location: [19.4326, -99.1332], size: 0.04 },
				{ location: [40.7128, -74.006], size: 0.1 },
				{ location: [34.6937, 135.5022], size: 0.05 },
				{ location: [41.0082, 28.9784], size: 0.06 },
			],
			onRender: onRender
		});

		// Removes the resize event listener when the component is unmounted to prevent memory leaks
		return () => {
			window.removeEventListener('resize', onResize);
		};
	});
</script>

<main
  class="absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]"
>
  <canvas
    class="h-full w-full [contain:layout_paint_size]"
    bind:this={canvas}
    on:pointerdown={(e) => {
      pointerInteracting = e.clientX - pointerInteractionMovement;
      canvas.style.cursor = "grabbing";
    }}
    on:pointerup={() => {
      pointerInteracting = null;
      canvas.style.cursor = "grab";
    }}
    on:pointerout={() => {
      pointerInteracting = null;
      canvas.style.cursor = "grab";
    }}
    on:mousemove={(e) => {
      if (pointerInteracting !== null) {
        console.log("working");
        const delta = e.clientX - pointerInteracting;
        pointerInteractionMovement = delta;
        x.set(delta / 200);
      }
    }}
  />
</main>