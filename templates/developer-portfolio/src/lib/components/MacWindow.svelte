<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	// Icons removed as we use CSS circles for traffic lights

	export let title = 'Window';
	export let src = '';
	export let active = false;
	export let zIndex = 1;
	export let position = { x: 100, y: 100 };
	export let width = 800;
	export let height = 600;

	const dispatch = createEventDispatcher();

	let isDragging = false;
	let dragOffset = { x: 0, y: 0 };
	let windowElement: HTMLElement;

	function handleMouseDown(event: MouseEvent) {
		// Only start drag if clicking on the header
		if ((event.target as HTMLElement).closest('.window-header')) {
			isDragging = true;
			// Calculate offset from the top-left corner of the window
			const rect = windowElement.getBoundingClientRect();
			dragOffset = {
				x: event.clientX - rect.left,
				y: event.clientY - rect.top
			};
			dispatch('focus');
		} else {
			// If clicking elsewhere in the window, just focus
			dispatch('focus');
		}
	}

	function handleMouseMove(event: MouseEvent) {
		if (isDragging) {
			position = {
				x: event.clientX - dragOffset.x,
				y: event.clientY - dragOffset.y
			};
		}
	}

	function handleMouseUp() {
		isDragging = false;
	}
</script>

<svelte:window on:mousemove={handleMouseMove} on:mouseup={handleMouseUp} />

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="mac-window {active ? 'active' : ''}"
	style="top: {position.y}px; left: {position.x}px; z-index: {zIndex}; width: {width}px; height: {height}px;"
	bind:this={windowElement}
	on:mousedown={handleMouseDown}
>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="window-header" on:dblclick={() => dispatch('maximize')}>
		<div class="traffic-lights">
			<button class="light close" on:click={() => dispatch('close')} aria-label="Close"></button>
			<button class="light minimize" on:click={() => dispatch('minimize')} aria-label="Minimize"></button>
			<button class="light maximize" on:click={() => dispatch('maximize')} aria-label="Maximize"></button>
		</div>
		<div class="window-title">{title}</div>
	</div>
	<div class="window-content">
		{#if src}
			<iframe {src} {title} frameborder="0"></iframe>
		{:else}
			<div class="empty-state">No content</div>
		{/if}
	</div>
</div>

<style>
	.mac-window {
		position: absolute;
		background: #fff;
		border-radius: 10px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		min-width: 300px;
		min-height: 200px;
		border: 1px solid rgba(0, 0, 0, 0.1);
        resize: both; /* Allow simple CSS resizing */
	}

    /* Dark mode support logic can be added here if needed, sticking to light/neutral for Mac OS look */
    :global(.dark) .mac-window {
        background: #1e1e1e;
        border-color: #333;
    }

	.window-header {
		height: 38px;
		background: #f3f3f3;
		border-bottom: 1px solid #d1d1d1;
		display: flex;
		align-items: center;
		padding: 0 16px;
		user-select: none;
        cursor: default;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
	}

    :global(.dark) .window-header {
        background: #2d2d2d;
        border-bottom-color: #000;
        color: #fff;
    }

	.traffic-lights {
		display: flex;
		gap: 8px;
		margin-right: 16px;
	}

	.light {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: none;
		padding: 0;
        cursor: pointer;
	}

	.light.close { background: #ff5f56; border: 1px solid #e0443e; }
	.light.minimize { background: #ffbd2e; border: 1px solid #dea123; }
	.light.maximize { background: #27c93f; border: 1px solid #1aab29; }

    /* Hover states for lights (icons could be added) */
    .light:hover { opacity: 0.8; }

	.window-title {
		flex: 1;
		text-align: center;
		font-size: 13px;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
		color: #333;
        margin-right: 52px; /* Balance the traffic lights */
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
	}
    :global(.dark) .window-title { color: #ccc; }

	.window-content {
		flex: 1;
		background: #fff;
		position: relative;
	}

	iframe {
		width: 100%;
		height: 100%;
		display: block;
	}

	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: #888;
	}
</style>
