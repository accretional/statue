<!--
This is a Svelte component from Neodrag:

Demo Site: [neodrag.dev](https://www.neodrag.dev/)
GitHub Repository: [PuruVJ/neodrag](https://github.com/puruvj/neodrag)

All components in this directory are sourced from the Neodrag project by PuruVJ. Please refer to the original repository for documentation, examples, and additional components.
-->

<script lang="ts">
	import { draggable } from '@neodrag/svelte';
	import type { DragBounds } from '@neodrag/svelte';

	export let body = 'Drag me!';
	export let axis: 'both' | 'x' | 'y' | 'none' = 'both';
	export let bounds: DragBounds | undefined = undefined;
	export let gpuAcceleration = true;
	export let disabled = false;
	export let grid: [number, number] | undefined = undefined;
</script>

<div id="drag-target" use:draggable={{ axis, bounds, gpuAcceleration, disabled, grid }}>{body}</div>
